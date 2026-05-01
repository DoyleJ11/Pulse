import { Check, Loader2, Pause, Play, Plus } from "lucide-react";
import { type DeezerSong } from "../../services/api";
import { formatDuration } from "../../utils/formatDuration";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useSongStore } from "../../stores/songStore";

interface SearchResultProps {
  song: DeezerSong;
  onAdd: () => void;
  isLockedIn: boolean;
}

export function SearchResult({ song, onAdd, isLockedIn }: SearchResultProps) {
  const selectedSongs = useSongStore((state) => state.selectedSongs);
  const { toggle, isPlayingSong, isLoading, currentSongId } = useAudioPlayer();

  const songId = song.id.toString();
  const isSelected = selectedSongs.some((selected) => selected.deezerId === songId);
  const isThisSong = currentSongId === songId;
  const isThisPlaying = isPlayingSong(songId);
  const isThisLoading = isLoading && isThisSong;

  return (
    <div className="flex items-center gap-3 py-3 group">
      <div className="relative group/album shrink-0">
        <img
          src={song.album.cover_medium}
          alt={`${song.title} album cover`}
          className="w-16 h-16 rounded-thumb object-cover border-border-heavy"
          style={{ borderWidth: "var(--border-weight-heavy)" }}
        />

        <button
          type="button"
          disabled={!song.preview}
          onClick={() => song.preview && toggle(songId, song.preview)}
          aria-label={isThisPlaying ? "Pause preview" : "Play preview"}
          className={`absolute inset-0 bg-black/30 rounded-thumb flex items-center justify-center transition-opacity hover:bg-black/50 cursor-pointer ${
            isThisPlaying || isThisLoading
              ? "opacity-100"
              : "opacity-0 group-hover/album:opacity-100"
          }`}
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-transform group-hover/album:scale-110">
            {isThisLoading ? (
              <Loader2 className="w-4 h-4 text-black animate-spin" />
            ) : isThisPlaying ? (
              <Pause
                className="w-4 h-4 text-black fill-black"
                strokeWidth={0}
              />
            ) : (
              <Play
                className="w-4 h-4 text-black fill-black ml-0.5"
                strokeWidth={0}
              />
            )}
          </div>
        </button>
      </div>

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
        disabled={isLockedIn || isSelected}
        onClick={onAdd}
        className={`w-10 h-10 rounded-pill border-border-heavy flex items-center justify-center transition-transform ${
          isSelected
            ? "bg-section-mint cursor-default"
            : "bg-section-teal hover:scale-110 active:scale-95 cursor-pointer"
        }`}
        style={{ borderWidth: "var(--border-weight-heavy)" }}
        aria-label={isSelected ? `${song.title} added` : `Add ${song.title}`}
      >
        {isSelected ? (
          <Check className="w-5 h-5 text-text-primary" strokeWidth={3} />
        ) : (
          <Plus className="w-5 h-5 text-text-primary" strokeWidth={3} />
        )}
      </button>
    </div>
  );
}
