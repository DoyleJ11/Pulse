import { type BracketSlot } from "./BracketView";
import { MatchupCard } from "./MatchupCard";
import { CARD_H, CARD_GAP, MATCHUP_H } from "./bracketLayout";

interface MatchupProps {
  bracketSlots: (BracketSlot | null)[];
  winnerSlot: BracketSlot | null;
  parentIndex: number;
  currentMatchup: number | null;
  onPick: (matchupIndex: number, winnerSongId: string) => void;
}

export function Matchup({
  bracketSlots,
  winnerSlot,
  parentIndex,
  currentMatchup,
  onPick,
}: MatchupProps) {
  let stateA:
    | "active"
    | "normal"
    | "empty"
    | "decided-winner"
    | "decided-loser" = "normal";
  let stateB:
    | "active"
    | "normal"
    | "empty"
    | "decided-winner"
    | "decided-loser" = "normal";

  if (!bracketSlots[0] || !bracketSlots[1]) {
    if (!bracketSlots[0]) stateA = "empty";
    if (!bracketSlots[1]) stateB = "empty";
  } else if (winnerSlot) {
    stateA =
      winnerSlot.songId === bracketSlots[0].songId
        ? "decided-winner"
        : "decided-loser";
    stateB =
      winnerSlot.songId === bracketSlots[1].songId
        ? "decided-winner"
        : "decided-loser";
  } else if (parentIndex === currentMatchup) {
    stateA = stateB = "active";
  } else {
    stateA = stateB = "normal";
  }

  const isActive = parentIndex === currentMatchup && stateA === "active";

  return (
    <div className="relative w-full" style={{ height: MATCHUP_H }}>
      {/* Card A — top */}
      <div
        className="absolute left-0 right-0"
        style={{ top: 0, height: CARD_H }}
      >
        <MatchupCard
          song={bracketSlots[0]}
          state={stateA}
          onPick={onPick}
          parentIndex={parentIndex}
        />
      </div>

      {/* VS pill — only when not active (active matchup uses gap area for the pick button) */}
      {!isActive && (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-black rounded-full flex justify-center items-center border-[3px] border-black"
          style={{ top: CARD_H + (CARD_GAP - 32) / 2 }}
        >
          <span className="text-white font-black text-sm">VS</span>
        </div>
      )}

      {/* Card B — bottom */}
      <div
        className="absolute left-0 right-0"
        style={{ top: CARD_H + CARD_GAP, height: CARD_H }}
      >
        <MatchupCard
          song={bracketSlots[1]}
          state={stateB}
          onPick={onPick}
          parentIndex={parentIndex}
        />
      </div>
    </div>
  );
}
