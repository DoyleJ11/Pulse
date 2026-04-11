import { type BracketSlot } from "./BracketView"
import { Matchup } from "./Matchup"
import { getParent } from "../../utils/bracketUtils"

interface BracketRoundProps {
    round: 1 | 2 | 3 | 4,
    bracket: (BracketSlot | null)[],
    currentMatchup: number,
    bracketPairs: number[][],
    onPick: () => void,
    onPlay: () => void,
}

export function BracketRound({ round, bracket, currentMatchup, bracketPairs, onPick, onPlay }: BracketRoundProps) {

    const size = {1: "base", 2: "quarter", 3: "semi", 4: "final"} as const
    
    return (
        <div className="flex flex-col justify-between h-full">
            {bracketPairs.map(pair => {
                let parentIndex = getParent(pair[0])
                let winnerSlot = bracket[parentIndex]
                return (
                    <Matchup key={parentIndex} bracketSlots={[bracket[pair[0]], bracket[pair[1]]]} currentMatchup={currentMatchup} winnerSlot={winnerSlot} parentIndex={parentIndex} onPick={onPick} onPlay={onPlay} size={size[round]}/>
                )
            })}
        </div>
    )
}