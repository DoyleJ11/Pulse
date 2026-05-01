import { Clock3 } from "lucide-react";
import { BracketVisual } from "./BracketVisual";
import { homePalette } from "./homePalette";
import { Pill } from "./Pill";
import { Vinyl } from "./Vinyl";

export function LiveBracketCard() {
  return (
    <div className="p-6 rotate-2 rounded-4xl border-2 border-black bg-white p-7 shadow-[10px_10px_0_#0A0A0A]">
      <div className="mb-4 flex items-center justify-between gap-5">
        <Pill color={homePalette.coral}>Live bracket</Pill>
        <span className="font-mono text-[11px] font-black uppercase tracking-wide text-text-secondary">
          RM: DISCO7
        </span>
      </div>
      <BracketVisual className="aspect-[300/220] w-full" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-black bg-bg-cream px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Vinyl color={homePalette.coral} size={32} />
          <span className="text-sm font-black">
            Now judging: R2 &middot; M1
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-black text-text-secondary/70">
          <Clock3 aria-hidden="true" size={14} strokeWidth={3} />
          00:12
        </span>
      </div>
    </div>
  );
}
