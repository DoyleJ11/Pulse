import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Crown } from "lucide-react";
import { fetchBracket } from "../../services/api";
import { useRoomStore } from "../../stores/roomStore";
import { useAuthStore } from "../../stores/authStore";
import { useTokenStore } from "../../stores/tokenStore";
import { socket } from "../../utils/socket";
import { type BracketSlot } from "../bracket/BracketView";
import { formatDuration } from "../../utils/formatDuration";

export function PostGame() {
  const navigate = useNavigate();
  const lobbyCode = useRoomStore((state) => state.code);
  const players = useRoomStore((state) => state.players);
  const clearRoom = useRoomStore((state) => state.clearRoom);
  const clearSession = useAuthStore((state) => state.clearSession);
  const clearToken = useTokenStore((state) => state.clearToken);

  const [bracketSlots, setBracketSlots] = useState<(BracketSlot | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!lobbyCode) {
        setIsLoading(false);
        return;
      }
      try {
        const result = await fetchBracket(lobbyCode);
        if (cancelled) return;
        setBracketSlots(result.state as (BracketSlot | null)[]);
      } catch (err) {
        console.error("Failed to fetch bracket for post-game", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lobbyCode]);

  const champion = bracketSlots[0] ?? null;
  const decidedCount = bracketSlots
    .slice(0, 15)
    .filter((s) => s !== null).length;
  const winningPlayer = champion
    ? players.find((p) => p.role === champion.role)
    : null;

  const handleBackToHome = () => {
    socket.disconnect();
    clearSession();
    clearRoom();
    clearToken();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono uppercase tracking-widest text-sm text-text-primary/60">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 p-10">
      {champion ? (
        <ChampionHero champion={champion} winnerName={winningPlayer?.name} />
      ) : (
        <EarlyEndCard decidedCount={decidedCount} />
      )}
      <div className="flex items-center gap-4">
        {lobbyCode && (
          <button
            onClick={() => navigate(`/lobby/${lobbyCode}/bracket`)}
            className="bg-bg-card text-black border-2 border-black px-6 py-3 uppercase font-black tracking-widest cursor-pointer rounded-2xl shadow-[4px_4px_0_#0A0A0A] transition-[transform,box-shadow,background-color] duration-[120ms] ease-in-out hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#0A0A0A]"
          >
            Back to Bracket
          </button>
        )}
        <button
          onClick={handleBackToHome}
          className="bg-[#FFD952] text-black border-2 border-black px-6 py-3 uppercase font-black tracking-widest cursor-pointer rounded-2xl shadow-[4px_4px_0_#0A0A0A] transition-[transform,box-shadow,background-color] duration-[120ms] ease-in-out hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#0A0A0A]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function ChampionHero({
  champion,
  winnerName,
}: {
  champion: BracketSlot;
  winnerName: string | undefined;
}) {
  const playerColor = champion.role === "player_a" ? "#FF7B6B" : "#2DD4BF";
  const playerLabel = champion.role === "player_a" ? "PLAYER A" : "PLAYER B";

  return (
    <div
      className="relative w-full max-w-[640px] bg-[#FFD952] border-[3px] border-black rounded-3xl p-10 shadow-[10px_10px_0px_0px_#0A0A0A] flex flex-col items-center text-center gap-6"
    >
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-black rounded-full border-[3px] border-black flex items-center justify-center">
        <Crown
          className="w-7 h-7 text-[#FFD952] fill-[#FFD952]"
          strokeWidth={0}
        />
      </div>

      <div
        className="text-2xl font-black text-black/70 uppercase tracking-[0.32em]"
        style={{ fontStretch: "condensed" }}
      >
        Champion
      </div>

      <img
        src={champion.albumArt}
        alt={champion.title}
        className="w-40 h-40 rounded-2xl object-cover border-[3px] border-black shadow-[4px_4px_0_#0A0A0A]"
      />

      <div className="flex flex-col gap-1">
        <h1
          className="text-5xl font-black text-black uppercase tracking-tight leading-none"
          style={{ fontStretch: "condensed" }}
        >
          {champion.title}
        </h1>
        <p className="text-xl font-bold text-black/60">{champion.artist}</p>
        <p className="text-xs font-mono font-bold text-black/40 tabular-nums tracking-widest mt-1">
          {formatDuration(champion.duration)}
        </p>
      </div>

      <div
        className="inline-flex items-center gap-3 border-2 border-black rounded-full pl-1.5 pr-5 py-1 shadow-[3px_3px_0_#0A0A0A]"
        style={{ backgroundColor: playerColor }}
      >
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black text-white font-black text-base">
          {champion.role === "player_a" ? "A" : "B"}
        </span>
        <span className="font-black text-lg text-black uppercase tracking-tight">
          {winnerName ? `${winnerName} wins` : `${playerLabel} wins`}
        </span>
      </div>
    </div>
  );
}

function EarlyEndCard({ decidedCount }: { decidedCount: number }) {
  return (
    <div className="w-full max-w-[520px] bg-bg-card border-[3px] border-black rounded-3xl p-10 shadow-[8px_8px_0px_0px_#0A0A0A] flex flex-col items-center text-center gap-5">
      <div
        className="text-xs font-mono font-bold text-text-primary/50 uppercase tracking-[0.32em]"
      >
        No champion crowned
      </div>
      <h1
        className="text-5xl font-black text-text-primary uppercase tracking-tight leading-none"
        style={{ fontStretch: "condensed" }}
      >
        Game Ended Early
      </h1>
      <div className="flex items-baseline gap-2">
        <span
          className="text-7xl font-black text-text-primary tabular-nums leading-none"
          style={{ fontStretch: "condensed" }}
        >
          {decidedCount}
        </span>
        <span className="text-2xl font-mono font-bold text-text-primary/50 uppercase tracking-widest">
          / 15 matchups
        </span>
      </div>
      <p className="text-sm font-bold text-text-primary/60">
        The bracket didn't finish, but you can always start a new one.
      </p>
    </div>
  );
}
