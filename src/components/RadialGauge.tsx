import { useId } from "react";
import type { HomelabStatus } from "@/types/homelab";

// Used for the overall-health dot/label in HomelabTelemetry's header — a
// discrete status, so it keeps semantic colors rather than the gauge gradients.
export const STATUS_COLORS: Record<HomelabStatus, string> = {
  healthy: "#24aff5",
  warning: "#fde047",
  critical: "#e2534f",
  stale: "#8a8a92",
  unavailable: "#8a8a92",
};

const WARNING_THRESHOLD = 70;
const CRITICAL_THRESHOLD = 90;

type Tier = "healthy" | "warning" | "critical";

function tierFor(value: number): Tier {
  if (value >= CRITICAL_THRESHOLD) return "critical";
  if (value >= WARNING_THRESHOLD) return "warning";
  return "healthy";
}

// Gradient stops per tier. "healthy" is a premium ice-blue sweep built around
// the site's existing accent-blue; "warning" reuses the exact stops from the
// .gradient-text brand gradient in globals.css so it never introduces a new
// hue; "critical" is a restrained, deepened version of the site's crimson.
const GRADIENT_STOPS: Record<Tier, { offset: string; color: string }[]> = {
  healthy: [
    { offset: "0%", color: "#0f3a56" },
    { offset: "55%", color: "#24aff5" },
    { offset: "100%", color: "#8fdcff" },
  ],
  warning: [
    { offset: "0%", color: "#ff8c00" },
    { offset: "65%", color: "#ffd700" },
    { offset: "100%", color: "#f76d11" },
  ],
  critical: [
    { offset: "0%", color: "#7f1d1d" },
    { offset: "50%", color: "#e2534f" },
    { offset: "100%", color: "#fca5a5" },
  ],
};

const SIZE = 148;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_FRACTION = 0.75; // 270° sweep, 90° gap at the bottom
const TRACK_LENGTH = CIRCUMFERENCE * ARC_FRACTION;
const START_ROTATE = 135; // degrees, positions the gap at the bottom-center

export default function RadialGauge({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  const rawId = useId().replace(/:/g, "");
  const clamped = value === null ? 0 : Math.min(100, Math.max(0, value));
  const valueLength = (clamped / 100) * TRACK_LENGTH;
  const tier = tierFor(clamped);
  const gradientId = `gauge-${tier}-${rawId}`;
  const glow = tier === "critical" ? "#e2534f" : tier === "warning" ? "#ffd700" : "#24aff5";

  return (
    <div className="flex flex-col items-center gap-2.5">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`${label}: ${value === null ? "unavailable" : `${Math.round(value)}%`}`}
        className="h-[84px] w-[84px] overflow-visible sm:h-[120px] sm:w-[120px] md:h-[148px] md:w-[148px]"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2={SIZE} y2={SIZE} gradientUnits="userSpaceOnUse">
            {GRADIENT_STOPS[tier].map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>

        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${TRACK_LENGTH} ${CIRCUMFERENCE}`}
          transform={`rotate(${START_ROTATE} ${SIZE / 2} ${SIZE / 2})`}
        />

        {value !== null && (
          <>
            {/* Soft glow echo, same arc, blurred and dimmer underneath the crisp ring */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={glow}
              strokeWidth={STROKE + 2}
              strokeLinecap="round"
              strokeDasharray={`${valueLength} ${CIRCUMFERENCE}`}
              transform={`rotate(${START_ROTATE} ${SIZE / 2} ${SIZE / 2})`}
              style={{
                filter: "blur(6px)",
                opacity: 0.22,
                transition: "stroke-dasharray 600ms cubic-bezier(0.16, 1, 0.3, 1), stroke 300ms ease",
              }}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${valueLength} ${CIRCUMFERENCE}`}
              transform={`rotate(${START_ROTATE} ${SIZE / 2} ${SIZE / 2})`}
              style={{ transition: "stroke-dasharray 600ms cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </>
        )}

        <text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-[26px] font-bold"
          style={{ filter: `drop-shadow(0 0 4px ${glow}40)` }}
        >
          {value === null ? "—" : `${Math.round(value)}%`}
        </text>
      </svg>
      <span className="text-sm font-medium text-white/60">{label}</span>
    </div>
  );
}
