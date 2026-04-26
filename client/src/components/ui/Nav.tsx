import { type ReactNode } from "react";

export function Nav({ rightSlot }: { rightSlot?: ReactNode }) {
  return (
    <div className="flex justify-between items-center relative z-10 px-10 py-6">
      <div className="text-2xl font-black tracking-tighter flex items-end cursor-pointer gap-2.5">
        {/* Waveform animation */}
        <span>wave</span>
        <span className="uppercase">PULSE</span>
      </div>
      {rightSlot ? rightSlot : ""}
    </div>
  );
}
