import { useEffect, useState } from "react"
import { fetchBracket } from "../../services/api"
import { useRoomStore } from "../../stores/roomStore"
import { BracketRound } from "./BracketRound"
import { getMatchups } from "../../utils/bracketUtils"

interface Bracket {
    id: string;
    roomId: string;
    currentMatchup: number;
}

export interface BracketSlot {
    songId: string,
    deezerId: string,
    title: string,
    artist: string,
    albumArt: string,
    previewUrl: string | null,
    submittedBy: string,
    role: "player_a" | "player_b",
    seed: number,
}

export function BracketView() {
    const lobbyCode = useRoomStore((state) => state.code);
    const [bracket, setBracket] = useState<Bracket>({id: "", roomId: "", currentMatchup: 0});
    const [bracketSlots, setBracketSlots] = useState<(BracketSlot | null)[]>([]);
    const startingPairs = getMatchups(1)
    const quarterPairs = getMatchups(2)
    const semiPairs = getMatchups(3)
    const finalPairs = getMatchups(4)

    useEffect(() => {
        getBracket()
    }, [])

    const getBracket = async () => {
        const resultBracket = await fetchBracket(lobbyCode);
        setBracket(resultBracket);
        const bracketState = resultBracket.state as (BracketSlot | null)[];
        setBracketSlots(bracketState);
    }

    const onPick = () => {
        console.log("Picked!");
    }

    const onPlay = () => {
        console.log("Played!")
    }

    return (
        <div>
            <div className="overflow-auto">
                <div className="flex flex-row gap-12 items-stretch">
                    <BracketRound round={1} bracket={bracketSlots} currentMatchup={bracket.currentMatchup} bracketPairs={startingPairs} onPick={onPick} onPlay={onPlay}/>
                    <BracketRound round={2} bracket={bracketSlots} currentMatchup={bracket.currentMatchup} bracketPairs={quarterPairs} onPick={onPick} onPlay={onPlay}/>
                    <BracketRound round={3} bracket={bracketSlots} currentMatchup={bracket.currentMatchup} bracketPairs={semiPairs} onPick={onPick} onPlay={onPlay}/>
                    <BracketRound round={4} bracket={bracketSlots} currentMatchup={bracket.currentMatchup} bracketPairs={finalPairs} onPick={onPick} onPlay={onPlay}/>
                    {bracketSlots[0] ? (
                        <div className="w-[420px] bg-[#FFD952] border-[3px] border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] self-center">
                            <div className="text-4xl font-black text-black uppercase tracking-tight mb-4" style={{ fontStretch: 'condensed' }}>
                                CHAMPION
                            </div>

                            <div className="flex items-center gap-6">
                                <img 
                                    src={bracketSlots[0].albumArt} 
                                    alt={bracketSlots[0].title}
                                    className="w-24 h-24 rounded-2xl object-cover border-[3px] border-black"
                                />
                                <div className="flex-1">
                                    <div className="text-2xl font-black text-black mb-1">{bracketSlots[0].title}</div>
                                    <div className="text-lg font-bold text-black/70 mb-2">{bracketSlots[0].artist}</div>
                                    <div className="inline-block bg-black text-[#FFD952] px-4 py-1 rounded-full border-[3px] border-black">
                                        <span className="font-black text-sm">{bracketSlots[0].role === "player_a" ? "PLAYER A" : "PLAYER B"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-[420px] h-[200px] bg-[#FFD952] border-[3px] border-dashed border-black rounded-3xl flex flex-col items-center justify-center self-center">
                            <div className="text-black/40 font-black text-lg">AWAITING CHAMPION</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}