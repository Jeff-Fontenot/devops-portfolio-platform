export type HomelabStatus = "healthy" | "warning" | "critical" | "stale" | "unavailable";

export type HomelabMetrics = {
  cpuPercent: number | null;
  memoryPercent: number | null;
  diskPercent: number | null;
  runningContainers: number | null;
  healthyTargets: number | null;
  configuredTargets: number | null;
  scrapeHealthPercent: number | null;
  k8sNodesTotal: number | null;
  k8sNodesReady: number | null;
  k8sWorkloadPodsRunning: number | null;
  k8sManagedNamespaces: number | null;
  // Raw 0/1 from portfolio:k8s_scrape_healthy; null means the cluster pipeline
  // reported nothing at all (distinct from a confirmed-unhealthy 0).
  k8sScrapeHealthy: number | null;
};

export type HomelabMetricsResponse = {
  status: HomelabStatus;
  updatedAt: string | null;
  metrics: HomelabMetrics | null;
};
