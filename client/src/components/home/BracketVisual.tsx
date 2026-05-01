import { homePalette } from "./homePalette";

export function BracketVisual({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 300 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M74 28H100V53H124" stroke={homePalette.ink} strokeWidth="1.5" />
      <path d="M74 78H100V53H124" stroke={homePalette.ink} strokeWidth="1.5" />
      <path d="M74 128H100V153H124" stroke={homePalette.ink} strokeWidth="1.5" />
      <path d="M74 178H100V153H124" stroke={homePalette.ink} strokeWidth="1.5" />
      <path d="M194 53H220V103H244" stroke={homePalette.ink} strokeWidth="1.5" />
      <path d="M194 153H220V103H244" stroke={homePalette.ink} strokeWidth="1.5" />
      <circle r="4" fill={homePalette.ink}>
        <animateMotion
          dur="4s"
          path="M74 28H100V53H124H194H220V103H244"
          repeatCount="indefinite"
        />
      </circle>
      {[
        { label: "A1", y: 10, color: homePalette.coral },
        { label: "B1", y: 60, color: homePalette.teal },
        { label: "A2", y: 110, color: homePalette.coral },
        { label: "B2", y: 160, color: homePalette.teal },
      ].map((item) => (
        <g key={item.label}>
          <rect
            fill={item.color}
            height="36"
            rx="8"
            stroke={homePalette.ink}
            strokeWidth="1.5"
            width="70"
            x="4"
            y={item.y}
          />
          <text
            fill={homePalette.ink}
            fontFamily="Inter, sans-serif"
            fontSize="13"
            fontWeight="800"
            textAnchor="middle"
            x="39"
            y={item.y + 23}
          >
            {item.label}
          </text>
        </g>
      ))}
      <BracketNode
        label="SF1"
        x={124}
        y={35}
        width={70}
        color={homePalette.golden}
      />
      <BracketNode
        label="SF2"
        x={124}
        y={135}
        width={70}
        color={homePalette.golden}
      />
      <BracketNode
        label="WINNER"
        x={244}
        y={82}
        width={52}
        color={homePalette.lavender}
        fontSize={9}
      />
    </svg>
  );
}

function BracketNode({
  color,
  fontSize = 13,
  label,
  width,
  x,
  y,
}: {
  color: string;
  fontSize?: number;
  label: string;
  width: number;
  x: number;
  y: number;
}) {
  return (
    <g>
      <rect
        fill={color}
        height="36"
        rx="8"
        stroke={homePalette.ink}
        strokeWidth="1.5"
        width={width}
        x={x}
        y={y}
      />
      <text
        fill={homePalette.ink}
        fontFamily="Inter, sans-serif"
        fontSize={fontSize}
        fontWeight="800"
        textAnchor="middle"
        x={x + width / 2}
        y={y + 23}
      >
        {label}
      </text>
    </g>
  );
}
