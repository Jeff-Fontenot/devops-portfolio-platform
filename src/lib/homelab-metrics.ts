import type { HomelabMetrics, HomelabMetricsResponse, HomelabStatus } from "@/types/homelab";

const QUERY_URL = process.env.GRAFANA_METRICS_QUERY_URL;
const USER = process.env.GRAFANA_METRICS_USER;
const TOKEN = process.env.GRAFANA_METRICS_READ_TOKEN;

const isConfigured = !!(QUERY_URL && USER && TOKEN);

const FETCH_TIMEOUT_MS = 8_000;
const REVALIDATE_SECONDS = 45;

const WARNING_THRESHOLD = 70;
const CRITICAL_THRESHOLD = 90;

// Hardcoded allowlist — the only metric names this route will ever surface,
// regardless of what Grafana Cloud returns. Maps each sanitized `portfolio:*`
// series to its field on the public response.
const ALLOWED_METRICS = {
  "portfolio:host_cpu_usage_percent": "cpuPercent",
  "portfolio:host_memory_usage_percent": "memoryPercent",
  "portfolio:host_disk_usage_percent": "diskPercent",
  "portfolio:running_containers": "runningContainers",
  "portfolio:healthy_scrape_targets": "healthyTargets",
  "portfolio:configured_scrape_targets": "configuredTargets",
  "portfolio:scrape_health_percent": "scrapeHealthPercent",
  "portfolio:k8s_nodes_total": "k8sNodesTotal",
  "portfolio:k8s_nodes_ready": "k8sNodesReady",
  "portfolio:k8s_workload_pods_running": "k8sWorkloadPodsRunning",
  "portfolio:k8s_managed_namespaces": "k8sManagedNamespaces",
  "portfolio:k8s_scrape_healthy": "k8sScrapeHealthy",
} as const satisfies Record<string, keyof HomelabMetrics>;

const METRIC_NAMES = Object.keys(ALLOWED_METRICS);

type PrometheusVectorResult = {
  status: string;
  data?: {
    resultType?: string;
    result?: Array<{
      metric?: { __name__?: string };
      value?: [number, string];
    }>;
  };
};

function usageStatus(percent: number | null): HomelabStatus {
  if (percent === null) return "healthy";
  if (percent >= CRITICAL_THRESHOLD) return "critical";
  if (percent >= WARNING_THRESHOLD) return "warning";
  return "healthy";
}

function scrapeStatus(percent: number | null): HomelabStatus {
  if (percent === null) return "healthy";
  if (percent >= 100) return "healthy";
  if (percent >= 50) return "warning";
  return "critical";
}

// null (no data at all) does not drag down overall status, same as the other
// usage/scrape checks above — only a confirmed-unhealthy 0 does.
function k8sScrapeStatus(healthy: number | null): HomelabStatus {
  if (healthy === null) return "healthy";
  return healthy >= 1 ? "healthy" : "warning";
}

const SEVERITY: Record<HomelabStatus, number> = {
  healthy: 0,
  warning: 1,
  critical: 2,
  stale: 3,
  unavailable: 4,
};

function worstOf(statuses: HomelabStatus[]): HomelabStatus {
  return statuses.reduce((worst, s) => (SEVERITY[s] > SEVERITY[worst] ? s : worst), "healthy" as HomelabStatus);
}

function unavailable(): HomelabMetricsResponse {
  return { status: "unavailable", updatedAt: null, metrics: null };
}

export async function getHomelabMetrics(): Promise<HomelabMetricsResponse> {
  if (!isConfigured) return unavailable();

  const query = `{__name__=~"^(${METRIC_NAMES.join("|")})$"}`;
  const url = `${QUERY_URL}/api/v1/query?query=${encodeURIComponent(query)}`;
  const auth = Buffer.from(`${USER}:${TOKEN}`).toString("base64");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let payload: PrometheusVectorResult;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.error(`homelab-metrics: Grafana query failed with status ${res.status}`);
      return unavailable();
    }

    payload = await res.json();
  } catch (err) {
    console.error("homelab-metrics: failed to reach Grafana Cloud", err);
    return unavailable();
  } finally {
    clearTimeout(timeout);
  }

  if (payload.status !== "success" || !Array.isArray(payload.data?.result)) {
    console.error("homelab-metrics: unexpected response shape from Grafana");
    return unavailable();
  }

  const metrics: HomelabMetrics = {
    cpuPercent: null,
    memoryPercent: null,
    diskPercent: null,
    runningContainers: null,
    healthyTargets: null,
    configuredTargets: null,
    scrapeHealthPercent: null,
    k8sNodesTotal: null,
    k8sNodesReady: null,
    k8sWorkloadPodsRunning: null,
    k8sManagedNamespaces: null,
    k8sScrapeHealthy: null,
  };

  for (const series of payload.data.result) {
    const name = series.metric?.__name__;
    if (!name || !(name in ALLOWED_METRICS)) continue; // ignore anything not on the allowlist

    const rawValue = series.value?.[1];
    if (rawValue === undefined) continue;

    const value = Number.parseFloat(rawValue);
    if (Number.isNaN(value)) continue;

    const field = ALLOWED_METRICS[name as keyof typeof ALLOWED_METRICS];
    metrics[field] = value;
  }

  const status = worstOf([
    usageStatus(metrics.cpuPercent),
    usageStatus(metrics.memoryPercent),
    usageStatus(metrics.diskPercent),
    scrapeStatus(metrics.scrapeHealthPercent),
    k8sScrapeStatus(metrics.k8sScrapeHealthy),
  ]);

  return { status, updatedAt: new Date().toISOString(), metrics };
}
