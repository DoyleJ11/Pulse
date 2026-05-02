import { Loader2, Pause, Play } from "lucide-react";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

interface PreviewAlbumArtProps {
  songId: string;
  previewUrl: string | null;
  albumArt: string;
  title: string;
  className: string;
  imageClassName?: string;
  showOverlayByDefault?: boolean;
}

export function PreviewAlbumArt({
  songId,
  previewUrl,
  albumArt,
  title,
  className,
  imageClassName = "",
  showOverlayByDefault = false,
}: PreviewAlbumArtProps) {
  const { toggle, isPlayingSong, isLoading, currentSongId } = useAudioPlayer();
  const isThisPlaying = isPlayingSong(songId);
  const isThisLoading = isLoading && currentSongId === songId;

  return (
    <div className={`group relative shrink-0 overflow-hidden ${className}`}>
      <img
        src={albumArt}
        alt={title}
        className={`h-full w-full object-cover ${imageClassName}`}
      />

      <button
        className={`absolute inset-0 flex items-center justify-center bg-black/35 transition-opacity disabled:cursor-not-allowed disabled:opacity-0 ${
          showOverlayByDefault
            ? "opacity-100 hover:bg-black/50"
            : "opacity-0 hover:opacity-100 group-hover:opacity-100"
        }`}
        disabled={!previewUrl}
        onClick={() => previewUrl && toggle(songId, previewUrl)}
        aria-label={isThisPlaying ? "Pause preview" : "Play preview"}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110">
          {isThisLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-black" />
          ) : isThisPlaying ? (
            <Pause
              className="h-4 w-4 fill-black text-black"
              strokeWidth={0}
            />
          ) : (
            <Play
              className="ml-0.5 h-4 w-4 fill-black text-black"
              strokeWidth={0}
            />
          )}
        </span>
      </button>
    </div>
  );
}
