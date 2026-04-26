import { Plus } from "lucide-react";
import { type DeezerSong } from "../../services/api";
import { formatDuration } from "../../utils/formatDuration";

interface SearchResultProps {
  song: DeezerSong;
  onAdd: () => void;
  isLockedIn: boolean;
}

export function SearchResult({ song, onAdd, isLockedIn }: SearchResultProps) {
  return (
    <div className="flex items-center gap-3 py-3 group">
      <img
        src={song.album.cover_medium}
        alt={`${song.title} album cover`}
        className="w-16 h-16 rounded-thumb object-cover border-border-heavy"
        style={{ borderWidth: "var(--border-weight-heavy)" }}
      />

      <div className="flex-1 min-w-0">
        <p className="font-black text-text-primary truncate">{song.title}</p>
        <p className="font-medium text-text-secondary truncate">
          {song.artist.name}
        </p>
      </div>

      <span className="text-sm text-text-muted font-bold mr-2 tabular-nums">
        {formatDuration(song.duration)}
      </span>

      <button
        type="button"
        disabled={isLockedIn}
        onClick={onAdd}
        className="w-10 h-10 rounded-pill bg-section-teal border-border-heavy flex items-center justify-center hover:scale-110 transition-transform active:scale-95 cursor-pointer"
        style={{ borderWidth: "var(--border-weight-heavy)" }}
        aria-label={`Add ${song.title}`}
      >
        <Plus className="w-5 h-5 text-text-primary" strokeWidth={3} />
      </button>
    </div>
  );
}
