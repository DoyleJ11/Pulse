import { homePalette } from "./homePalette";

export function AlbumArt({ color }: { color: string }) {
  const patternId = color.includes("coral")
    ? "home-stripe-coral"
    : color.includes("teal")
      ? "home-stripe-teal"
      : "home-stripe-golden";

  return (
    <svg
      className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 border-black"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          height="8"
          id={patternId}
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
          width="8"
        >
          <line
            stroke={homePalette.ink}
            strokeOpacity="0.28"
            strokeWidth="2"
            x1="0"
            x2="0"
            y1="0"
            y2="8"
          />
        </pattern>
      </defs>
      <rect fill={color} height="64" width="64" />
      <rect fill={`url(#${patternId})`} height="64" width="64" />
      <circle cx="32" cy="32" fill={homePalette.ink} r="6" />
      <circle cx="32" cy="32" fill={color} r="2" />
    </svg>
  );
}
