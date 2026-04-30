import { homePalette } from "./homePalette";

export function Vinyl({ color, size = 88 }: { color: string; size?: number }) {
  return (
    <svg
      className="home-vinyl"
      height={size}
      viewBox="0 0 100 100"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" fill={homePalette.ink} r="49" />
      {[44, 38, 32, 26].map((radius) => (
        <circle
          key={radius}
          cx="50"
          cy="50"
          fill="none"
          r={radius}
          stroke="#1A1A1A"
          strokeWidth="1"
        />
      ))}
      <circle
        cx="50"
        cy="50"
        fill={color}
        r="17"
        stroke={homePalette.ink}
        strokeWidth="2"
      />
      <circle cx="50" cy="50" fill={homePalette.ink} r="3" />
    </svg>
  );
}
