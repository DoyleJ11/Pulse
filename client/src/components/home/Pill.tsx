import { type ReactNode } from "react";

export function Pill({
  children,
  className = "",
  color,
}: {
  children: ReactNode;
  className?: string;
  color: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 border-2 border-black rounded-full px-4 py-1.5 text-[13px] font-black uppercase tracking-wider ${className}`}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}
