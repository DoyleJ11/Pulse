import { Check, Plus } from "lucide-react";
import { BracketVisual } from "./BracketVisual";
import { homePalette } from "./homePalette";
import { SongRow } from "./SongRow";
import { Vinyl } from "./Vinyl";

export function PickSongsDemo() {
  return (
    <div className="flex w-full flex-col gap-2">
      <SongRow
        action={<Plus size={24} strokeWidth={4} />}
        artist="The Weeknd"
        hue={homePalette.coral}
        time="3:20"
        title="Blinding Lights"
      />
      <SongRow
        action={<Check size={24} strokeWidth={4} />}
        artist="Olivia Rodrigo"
        hue={homePalette.teal}
        time="2:58"
        title="good 4 u"
      />
      <SongRow
        action={<Plus size={24} strokeWidth={4} />}
        artist="Dua Lipa"
        hue={homePalette.golden}
        time="3:23"
        title="Levitating"
      />
    </div>
  );
}

export function BracketDemo() {
  return <BracketVisual className="w-full max-w-[300px]" />;
}

export function JudgeDemo() {
  return (
    <div className="grid h-full w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2.5">
      <JudgeSong
        color={homePalette.coral}
        labelColor={homePalette.teal}
        seed="A"
        title="Heat Waves"
      />
      <span className="rounded-full bg-black px-3 py-1.5 text-[22px] font-black italic text-white">
        VS
      </span>
      <JudgeSong
        color={homePalette.lavender}
        labelColor={homePalette.golden}
        seed="B"
        title="Anti-Hero"
      />
    </div>
  );
}

function JudgeSong({
  color,
  labelColor,
  seed,
  title,
}: {
  color: string;
  labelColor: string;
  seed: string;
  title: string;
}) {
  return (
    <div
      className="flex h-full min-h-0 min-w-0 flex-col items-center justify-center rounded-xl border-2 border-black p-3 text-center"
      style={{ backgroundColor: color }}
    >
      <Vinyl color={labelColor} size={60} />
      <p className="mt-2 max-w-full text-[13px] font-black leading-tight">
        {title}
      </p>
      <p className="mt-2 text-[11px] font-black text-text-secondary">
        {seed} &middot; SEED {seed === "A" ? 2 : 5}
      </p>
    </div>
  );
}
