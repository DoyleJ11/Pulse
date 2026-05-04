import { type ReactNode } from "react";

export function HomeButton({
  children,
  onClick,
  size = "medium",
  variant = "light",
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  size?: "medium" | "large";
  variant?: "light" | "dark";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-black font-black uppercase tracking-wide transition-[translate,box-shadow] duration-[120ms] ease-[ease] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 ${
        variant === "dark" ? "bg-black text-white" : "bg-white text-black"
      } ${
        size === "large"
          ? "px-8 py-[18px] text-lg [box-shadow:6px_6px_0_#0A0A0A] hover:[box-shadow:8px_8px_0_#0A0A0A] active:[box-shadow:2px_2px_0_#0A0A0A]"
          : "px-[22px] py-3 text-sm [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:4px_4px_0_#0A0A0A] active:[box-shadow:1px_1px_0_#0A0A0A]"
      } ${
        disabled
          ? "opacity-50 bg-ink/40 cursor-not-allowed"
          : "opacity-100 cursor-pointer"
      } ${className}`}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}
