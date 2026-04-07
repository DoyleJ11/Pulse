import { Lock } from "lucide-react";
import { SongCard } from "./SongCard";
import { EmptySlot } from "./EmptySlot";
import type { SongSelection } from "../../types/sharedTypes";

interface SongContainerProps {
  selectedSongs: SongSelection[];
  onRemoveSong: (song: SongSelection) => void;
  onLockIn: () => void;
  isLoading: boolean;
  isLockedIn: boolean;
}

export function SongContainer({
  selectedSongs,
  onRemoveSong,
  onLockIn,
  isLoading,
  isLockedIn,
}: SongContainerProps) {
  const maxSongs = 8;
  const emptySlots = maxSongs - selectedSongs.length;
  const isComplete = selectedSongs.length === maxSongs;

  const seedColors = ["#2DD4BF", "#FF7B6B", "#C4B5FD", "#FFD952", "#6EE7B7"];

  return (
    <div className={`h-full flex flex-col rounded-3xl bg-section-golden p-6 ${isLockedIn ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="mb-4">
        <h2
          className="text-5xl font-black uppercase tracking-tight"
          style={{ fontStretch: "condensed" }}
        >
          YOUR PICKS
        </h2>
        <div className="text-3xl font-black text-text-secondary">
          {selectedSongs.length}/{maxSongs}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-6">
        {selectedSongs.map((song, index) => (
          <SongCard
            key={song.deezerId}
            deezerId={song.deezerId}
            title={song.title}
            artist={song.artist}
            albumArt={song.albumArt}
            preview={song.preview}
            seed={index + 1}
            seedColor={seedColors[index % seedColors.length]}
            onRemove={() => onRemoveSong(song)}
            isLockedIn={isLockedIn}
          />
        ))}

        {Array.from({ length: emptySlots }).map((_, index) => (
          <EmptySlot key={`empty-${index}`} />
        ))}
      </div>

      <button
        className={`w-full py-5 rounded-pill font-black border-border-heavy text-2xl transition-all duration-200
            ${
              isComplete
                ? "bg-section-teal text-black hover:shadow-heavy active:shadow-active active:translate-x-1 active:translate-y-1 cursor-pointer"
                : "bg-bg-card text-text-muted cursor-not-allowed"
            }`}
        style={{
          borderWidth: "var(--border-weight-heavy)",
        }}
        disabled={!isComplete || isLockedIn}
        onClick={onLockIn}
      >
        {isLoading ? (
            "LOADING..."
        ) : isLockedIn ? (
          <span className="flex items-center justify-center gap-2">
            <Lock className="w-6 h-6" strokeWidth={3} />
            LOCKED IN
          </span>
        ) : isComplete ? (
          <span className="flex items-center justify-center gap-2">
            <Lock className="w-6 h-6" strokeWidth={3} />
            LOCK IN
          </span>
        ) : (
          `LOCK IN (${selectedSongs.length}/${maxSongs})`
        )}
      </button>
    </div>
  );
}
