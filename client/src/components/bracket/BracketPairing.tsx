import { type BracketSlot } from "./BracketView"
import { Matchup } from "./Matchup"
import { useRef, useLayoutEffect, useState } from "react"

interface BracketPairingProps {
    parentIndex: number,
    round: number,
    bracket: (BracketSlot | null)[],
    currentMatchup: number | null,
    onPick: (matchupIndex: number, winnerSongId: string) => void,
    onPlay: () => void,
}

export function BracketPairing({parentIndex, round, bracket, currentMatchup, onPick, onPlay}: BracketPairingProps) {
    const topRef = useRef<HTMLDivElement>(null);
    const botRef = useRef<HTMLDivElement>(null);
    const [topH, setTopH] = useState(0);
    const [botH, setBotH] = useState(0);
    const GAP = 80; // gap-20

    useLayoutEffect(() => {
        if (topRef.current) setTopH(topRef.current.offsetHeight);
        if (botRef.current) setBotH(botRef.current.offsetHeight);
    }, []);

    const size = {1: "base", 2: "quarter", 3: "semi", 4: "final"} as const

    if (round === 1) {
        return (
            <Matchup bracketSlots={[bracket[2 * parentIndex + 1], bracket[2 * parentIndex + 2]]} winnerSlot={bracket[parentIndex]} parentIndex={parentIndex} currentMatchup={currentMatchup} onPick={onPick} onPlay={onPlay} size={size[round]} showOutgoingLine={true}/>
        )
    }

    if (round > 1) {
        const topInset = topH / 2;
        const bottomInset = botH / 2;
        // Split at the row center so the horizontal branch aligns with the parent Matchup
        const topFlex = GAP / 2 + botH / 2;
        const bottomFlex = topH / 2 + GAP / 2;

        return (
            <div className="flex flex-row items-center">
                {/* Children column */}
                <div className="flex flex-col gap-20">
                    <div ref={topRef}>
                        <BracketPairing round={round - 1} bracket={bracket} parentIndex={2 * parentIndex + 1} currentMatchup={currentMatchup} onPick={onPick} onPlay={onPlay}/>
                    </div>
                    <div ref={botRef}>
                        <BracketPairing round={round - 1} bracket={bracket} parentIndex={2 * parentIndex + 2} currentMatchup={currentMatchup} onPick={onPick} onPlay={onPlay}/>
                    </div>
                </div>

                {/* Connector: vertical bar + horizontal branch */}
                <div className="self-stretch flex flex-col w-10"
                    style={{ paddingTop: topInset, paddingBottom: bottomInset }}>
                    <div style={{ flex: topFlex }}
                        className="border-l-[3px] border-b-[3px] border-black" />
                    <div style={{ flex: bottomFlex }}
                        className="border-l-[3px] border-t-[3px] border-black" />
                </div>

                <Matchup bracketSlots={[bracket[2 * parentIndex + 1], bracket[2 * parentIndex + 2]]} winnerSlot={bracket[parentIndex]} parentIndex={parentIndex} currentMatchup={currentMatchup} onPick={onPick} onPlay={onPlay} size={size[round as keyof typeof size]} showIncomingLine={true} showOutgoingLine={round < 4}/>
            </div>
        )
    }

}