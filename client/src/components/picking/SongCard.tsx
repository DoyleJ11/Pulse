import { type SongSelection } from "../../types/sharedTypes";
import { X } from "lucide-react";

interface SongCardProps extends SongSelection {
  seed: number;
  seedColor: string;
  onRemove: () => void;
  isLockedIn: boolean;
}

export function SongCard({
  deezerId,
  title,
  artist,
  albumArt,
  seed,
  seedColor,
  onRemove,
  preview,
  isLockedIn,
}: SongCardProps) {

  return (
    <main
      className="bg-bg-card border-border-heavy rounded-card flex items-center gap-3 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
      style={{
        borderWidth: "var(--border-weight-heavy)",
        padding: "var(--space-md)",
      }}
    >
      {/* Album Art */}
      <img
        src={albumArt}
        alt="Album cover"
        className="w-16 h-16 rounded-thumb object-cover border-border-heavy"
        style={{ borderWidth: "var(--border-weight-heavy)" }}
      />

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <p className="font-black text-text-primary truncate">{title}</p>
        <p className="font-medium text-text-secondary truncate">{artist}</p>
      </div>

      {/* Seed badge */}
      <div
        className="w-10 h-10 rounded-pill border-border-heavy flex items-center justify-center font-black text-text-primary"
        style={{
          backgroundColor: seedColor,
          borderWidth: "var(--border-weight-heavy)",
        }}
      >
        {seed}
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        disabled={isLockedIn}
        className={`w-8 h-8 flex items-center justify-center ${isLockedIn ? 'cursor-not-allowed' : 'hover:scale-110 transition-transform active:scale-95 cursor-pointer'}`}
        aria-label="Remove song"
      >
        <X className="w-6 h-6 text-text-primary" strokeWidth={3} />
      </button>
    </main>
  );
}
