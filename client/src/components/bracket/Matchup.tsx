import { type BracketSlot } from "./BracketView"
import { MatchupCard } from "./MatchupCard"

interface MatchupProps {
    bracketSlots: (BracketSlot | null)[],
    winnerSlot: BracketSlot | null
    parentIndex: number,
    currentMatchup: number | null,
    onPick: (matchupIndex: number, winnerSongId: string) => void;
    onPlay: () => void;
    size: "base" | "quarter" | "semi" | "final";
    showOutgoingLine?: boolean,
    showIncomingLine?: boolean,
}

export function Matchup({ bracketSlots, winnerSlot, parentIndex, currentMatchup, onPick, onPlay, size = "base", showOutgoingLine, showIncomingLine  }: MatchupProps) {
    let stateA: "active" | "normal" | "empty" | "decided-winner" | "decided-loser" = "normal";
    let stateB: "active" | "normal" | "empty" | "decided-winner" | "decided-loser" = "normal";

    if (!bracketSlots[0] || !bracketSlots[1]) {
        if (!bracketSlots[0]) stateA = "empty"
        if (!bracketSlots[1]) stateB = "empty"
    } else if (winnerSlot) {
        // Parent has a song -> this matchup is resolved
        stateA = winnerSlot.songId === bracketSlots[0].songId ? "decided-winner" : "decided-loser"
        stateB = winnerSlot.songId === bracketSlots[1].songId ? "decided-winner" : "decided-loser"
    } else if (parentIndex === currentMatchup) {
        stateA = stateB = "active"
    } else {
        stateA = stateB = "normal"
    }

    return (
        <div className="flex flex-row items-center">
            {showIncomingLine && (
                <div className="w-10 border-t-[3px] border-black" />
            )}

            <div className="flex flex-col items-start gap-2 w-max">
                <MatchupCard song={bracketSlots[0]} state={stateA} size={size} onPick={onPick} onPlay={onPlay} parentIndex={parentIndex}/>
                <div className="w-8 h-8 bg-black rounded-full flex self-center justify-center items-center border-[3px] border-black">
                    <span className="text-white font-black text-xs">VS</span>
                </div>
                <MatchupCard song={bracketSlots[1]} state={stateB} size={size} onPick={onPick} onPlay={onPlay} parentIndex={parentIndex}/>
            </div>

            {showOutgoingLine && (
                <div className="w-10 border-t-[3px] border-black" />
            )}
        </div>
    )

}