import { type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Waveform } from "./Waveform";

export function Nav({ rightSlot }: { rightSlot?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center relative z-10 px-10 py-6">
      <button
        onClick={() => navigate("/")}
        className="text-[28px] font-black tracking-tighter flex items-end cursor-pointer gap-2.5 bg-transparent border-0 p-0 leading-none"
        aria-label="Pulse — return home"
      >
        <Waveform barCount={4} barWidth={3} gap={4} maxHeight={24} />
        <span className="uppercase">PULSE</span>
      </button>
      {rightSlot ? rightSlot : ""}
    </div>
  );
}
