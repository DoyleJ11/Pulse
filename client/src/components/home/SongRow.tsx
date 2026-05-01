import { type ReactNode } from "react";
import { AlbumArt } from "./AlbumArt";

export function SongRow({
  action,
  artist,
  hue,
  time,
  title,
}: {
  action: ReactNode;
  artist: string;
  hue: string;
  time: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-black bg-white px-3 py-2.5">
      <AlbumArt color={hue} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black leading-tight">{title}</p>
        <p className="truncate text-xs font-medium leading-tight text-text-secondary">
          {artist}
        </p>
      </div>
      <span className="font-mono text-xs font-black text-text-secondary">
        {time}
      </span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-section-teal [&>svg]:h-4 [&>svg]:w-4">
        {action}
      </span>
    </div>
  );
}
