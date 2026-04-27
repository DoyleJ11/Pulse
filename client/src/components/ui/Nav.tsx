import { type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Waveform } from "./Waveform";

export function Nav({ rightSlot }: { rightSlot?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center relative z-10 px-10 py-6">
      <button
        onClick={() => navigate("/")}
        className="text-2xl font-black tracking-tighter flex items-baseline cursor-pointer gap-1 bg-transparent border-0 p-0"
        aria-label="Pulse — return home"
      >
        <Waveform />
        <span className="uppercase">PULSE</span>
      </button>
      {rightSlot ? rightSlot : ""}
    </div>
  );
}
