import { type CSSProperties } from "react";

interface WaveformProps {
  /** Number of vertical bars. Default 9. */
  barCount?: number;
  /** Resting (smallest) bar height in px. Default 3. */
  minHeight?: number;
  /** Tallest the center bars will grow to in px. Edges grow less per a parabolic envelope. Default 22. */
  maxHeight?: number;
  /** Width of each bar in px. Default 2. */
  barWidth?: number;
  /** Horizontal gap between bars in px. Default 2. */
  gap?: number;
  /** Base animation duration in seconds. Each bar's actual duration is this × a stagger multiplier. Default 0.7. */
  baseDuration?: number;
  /** Bar color. Default `currentColor` so it inherits from the parent's text color. */
  color?: string;
  /** Fraction of full growth (0–1) the outermost bars get. 0 = dead edges, 1 = uniform. Default 0.25. */
  edgeGrowth?: number;
  /** Optional className passed to the outer container. */
  className?: string;
}

// Deterministic but irregular-looking offsets so adjacent bars never sync.
// Lengths are coprime-ish so the cycle through them feels random across bar counts.
const STAGGER_DURATIONS = [1.0, 0.7, 1.2, 0.85, 1.1, 0.95, 1.3, 0.8, 1.05];
const STAGGER_DELAYS = [0, 0.3, 0.1, 0.5, 0.2, 0.4, 0.15, 0.35, 0.25];

export function Waveform({
  barCount = 7,
  minHeight = 3,
  maxHeight = 22,
  barWidth = 2,
  gap = 2,
  baseDuration = 0.6,
  color = "currentColor",
  edgeGrowth = 0.25,
  className = "",
}: WaveformProps) {
  const center = (barCount - 1) / 2;

  return (
    <div
      className={`inline-flex items-end ${className}`}
      style={{ gap, height: maxHeight }}
      aria-hidden="true"
    >
      {Array.from({ length: barCount }).map((_, i) => {
        // Parabolic envelope, lifted by `edgeGrowth` so even the outermost bars
        // animate visibly. Center → 1.0 (full budget); edges → edgeGrowth.
        const distFromCenter = center === 0 ? 0 : Math.abs(i - center) / center;
        const envelope =
          edgeGrowth + (1 - edgeGrowth) * (1 - distFromCenter ** 2);
        const barMax = minHeight + (maxHeight - minHeight) * envelope;

        const duration =
          baseDuration * STAGGER_DURATIONS[i % STAGGER_DURATIONS.length];
        const delay = STAGGER_DELAYS[i % STAGGER_DELAYS.length];

        const style: CSSProperties = {
          width: barWidth,
          height: minHeight,
          backgroundColor: color,
          animation: `wave-bar ${duration}s ease-in-out ${delay}s infinite alternate`,
          // Per-bar bounds consumed by the wave-bar keyframe in index.css.
          ["--bar-min" as string]: `${minHeight}px`,
          ["--bar-max" as string]: `${barMax}px`,
        };
        return <div key={i} style={style} />;
      })}
    </div>
  );
}
