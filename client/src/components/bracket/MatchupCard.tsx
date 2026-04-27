import { Play, Pause, Loader2 } from "lucide-react";
import { type BracketSlot } from "./BracketView";
import { PermissionGuard } from "../util/PermissionGuard";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { CARD_H } from "./bracketLayout";
import { formatDuration } from "../../utils/formatDuration";

interface SongCardProps {
  song: BracketSlot | null;
  state: "empty" | "active" | "decided-winner" | "decided-loser" | "normal";
  onPick?: (matchupIndex: number, winnerSongId: string) => void;
  size?: "base" | "quarter" | "semi" | "final";
  parentIndex: number;
}

export function MatchupCard({
  song,
  state,
  onPick,
  size = "base",
  parentIndex,
}: SongCardProps) {
  const sizeClasses = {
    base: "w-[400px]",
    quarter: "w-[400px]",
    semi: "w-[437px]",
    final: "w-[473px]",
  };

  const { toggle, isPlayingSong, isLoading } = useAudioPlayer();
  const isThisPlaying = song ? isPlayingSong(song.songId) : false;
  const isThisLoading = isLoading && isThisPlaying;

  // Render TBD if null
  if (state === "empty" || !song) {
    return (
      <div
        className={`${sizeClasses[size]} border-[3px] border-dashed border-black/30 rounded-2xl flex items-center justify-center bg-transparent`}
        style={{ height: CARD_H }}
      >
        <div className="text-black/40 font-black text-lg">TBD</div>
      </div>
    );
  }

  const isActive = state === "active";
  const isLoser = state === "decided-loser";
  const isWinner = state === "decided-winner";

  const getPlayerColor = () => {
    if (song.role === "player_a") {
      return isActive ? "#FF7B6B" : "#FF9282";
    } else {
      return isActive ? "#2DD4BF" : "#52DCC8";
    }
  };

  return (
    <div
      className={`${sizeClasses[size]} ${isLoser ? "opacity-60" : ""} relative transition-all duration-300`}
      style={{ height: CARD_H }}
    >
      {/* Loser X badge — lives on the outer wrapper so it escapes the inner card's overflow-hidden */}
      {isLoser && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-[3px] border-black z-20">
          <span className="text-white font-black">✕</span>
        </div>
      )}

      <div
        className={`relative h-full overflow-hidden bg-white border-[3px] border-black rounded-2xl ${
          isActive
            ? "shadow-[3px_3px_0px_0px_#0A0A0A]"
            : "shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
        }`}
        style={{ backgroundColor: isWinner ? getPlayerColor() : "#fff" }}
      >
        <div className="flex h-full">
          {/* A/B player strip */}
          <div
            className="w-[36px] shrink-0 border-r-[3px] border-black flex items-center justify-center"
            style={{
              backgroundColor: song.role === "player_a" ? "#FF7B6B" : "#2DD4BF",
            }}
          >
            <span className="text-black text-base font-black">
              {song.role === "player_a" ? "A" : "B"}
            </span>
          </div>

          {/* Card content */}
          <div className="flex-1 flex items-center gap-3 p-4 min-w-0">
            {/* Album play btn overlay */}
            <div className="relative shrink-0">
              <img
                src={song.albumArt}
                alt={song.title}
                className="w-16 h-16 rounded-lg object-cover border-[3px] border-black"
              />

              <button
                className={`absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center hover:bg-black/50 transition-colors group cursor-pointer`}
                disabled={!song.previewUrl}
                onClick={() =>
                  song.previewUrl && toggle(song.songId, song.previewUrl)
                }
                aria-label={isThisPlaying ? "Pause preview" : "Play preview"}
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
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

            {/* Song info */}
            <div className="flex-1 min-w-0">
              <div className="font-black text-black truncate text-base leading-tight">
                {song.title}
              </div>
              <div className="font-bold text-black/50 truncate text-[12px]">
                {song.artist}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[12px] font-black text-black/50 tabular-nums font-mono">
                  {formatDuration(song.duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pick button — absolutely positioned below the card so it doesn't affect card height */}
      {isActive && onPick && (
        <PermissionGuard allowedRoles={["judge"]}>
          <button
            onClick={() => onPick(parentIndex, song.songId)}
            aria-label={`Pick ${song.title}`}
            className={`group absolute rounded-2xl mx-auto left-0 right-0 top-full mt-2 z-10 flex justify-between items-center gap-2.5 bg-[#FFD952] text-black border-2 border-black px-3 py-2 uppercase cursor-pointer shadow-[4px_4px_0_#0A0A0A] transition-[transform,box-shadow,background-color] duration-[120ms] ease-in-out hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#0A0A0A] ${
              song.role === "player_a"
                ? "hover:bg-[#FF7B6B]"
                : "hover:bg-[#2DD4BF]"
            }`}
          >
            <span className="text-xs font-black tracking-[0.18em] text-left">
              PICK THIS SONG
            </span>
            <span className="text-[10px] font-bold tracking-[0.12em] text-black/60 max-w-[140px] truncate text-right group-hover:text-black">
              {song.title}
            </span>
          </button>
        </PermissionGuard>
      )}
    </div>
  );
}
