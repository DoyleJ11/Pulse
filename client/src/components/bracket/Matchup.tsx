import { type BracketSlot } from "./BracketView"
import { MatchupCard } from "./MatchupCard"

interface MatchupProps {
    bracketSlots: (BracketSlot | null)[],
    winnerSlot: BracketSlot | null
    parentIndex: number,
    currentMatchup: number,
    onPick: () => void;
    onPlay: () => void;
    size: "base" | "quarter" | "semi" | "final";
}

export function Matchup({ bracketSlots, winnerSlot, parentIndex, currentMatchup, onPick, onPlay, size = "base" }: MatchupProps) {
    let stateA: "active" | "normal" | "empty" | "decided-winner" | "decided-loser" = "normal";
    let stateB: "active" | "normal" | "empty" | "decided-winner" | "decided-loser" = "normal";


    if (parentIndex === currentMatchup) {
        stateA = "active"
        stateB = "active"
    }

    if (parentIndex < currentMatchup && bracketSlots[0] && bracketSlots[1] && winnerSlot) {
        stateA = winnerSlot.songId === bracketSlots[0].songId ? "decided-winner" : "decided-loser"
        stateB = winnerSlot.songId === bracketSlots[1].songId ? "decided-winner" : "decided-loser"
    }

    if (parentIndex > currentMatchup) {
        stateA = "normal"
        stateB = "normal"
    }

    if (!bracketSlots[0]) {
        stateA = "empty"
    }

    if (!bracketSlots[1]) {
        stateB = "empty"
    }

    return (
        <div className="flex flex-col items-start gap-2 w-max">
            <MatchupCard song={bracketSlots[0]} state={stateA} size={size} onPick={onPick} onPlay={onPlay}/>
            <div className="w-8 h-8 bg-black rounded-full flex self-center justify-center items-center border-[3px] border-black">
                <span className="text-white font-black text-xs">VS</span>
            </div>
            <MatchupCard song={bracketSlots[1]} state={stateB} size={size} onPick={onPick} onPlay={onPlay}/>
        </div>
    )

}