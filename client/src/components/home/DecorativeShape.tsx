import { homePalette } from "./homePalette";

type ShapeType = "circle" | "diamond" | "star";

export function FloatingShape({
  className,
  color,
  type,
}: {
  className: string;
  color: string;
  type: ShapeType;
}) {
  return (
    <DecorativeShape
      className={`home-float absolute pointer-events-none ${className}`}
      color={color}
      type={type}
    />
  );
}

export function DecorativeShape({
  className,
  color,
  type,
}: {
  className: string;
  color: string;
  type: ShapeType;
}) {
  if (type === "circle") {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          fill={color}
          r="47"
          stroke={homePalette.ink}
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (type === "diamond") {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          fill={color}
          height="54"
          stroke={homePalette.ink}
          strokeWidth="2"
          transform="rotate(45 50 50)"
          width="54"
          x="23"
          y="23"
        />
      </svg>
    );
  }

  const points = Array.from({ length: 16 })
    .map((_, index) => {
      const radius = index % 2 === 0 ? 48 : 22;
      const angle = (index / 16) * Math.PI * 2 - Math.PI / 2;
      return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
    })
    .join(" ");

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        fill={color}
        points={points}
        stroke={homePalette.ink}
        strokeWidth="2"
      />
    </svg>
  );
}
