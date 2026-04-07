import { useEffect, useState } from "react"
import { socket } from "../../utils/socket"
import { PlayerStatusCard } from "./PlayerStatusCard"

interface Player {
    songCount: number,
    userId: string,
    role: "player_a" | "player_b",
    name: string,
    lockedIn: boolean,
}

interface JudgeViewProps {
    code: string,
    theme: string | null,
}

export function JudgeSelectView({code, theme}: JudgeViewProps) {
    const placeholderPlayer: Player = {
        songCount: 0,
        userId: "",
        role: "player_a",
        name: "Waiting...",
        lockedIn: false,
    }

    const [playerA, setPlayerA] = useState<Player>(placeholderPlayer);
    const [playerB, setPlayerB] = useState<Player>(placeholderPlayer);

    useEffect(() => {
        socket.on("pickUpdate", ({songCount, userId, name, role, lockedIn}) => {
            try {
                if (role == "player_a") {
                    setPlayerA({songCount: songCount, userId: userId, name: name, role: role, lockedIn: lockedIn})
                } else if (role == "player_b") {
                    setPlayerB({songCount: songCount, userId: userId, name: name, role: role, lockedIn: lockedIn})
                }
            } catch (error) {
                console.error("Failed to update player info on pickUpdate")
            }
        })

        return () => {
            socket.off("pickUpdate")
        }
    }, [])

    return (
        <div className="min-h-screen flex justify-center items-center p-8">
            <div className="w-full max-w-[550px]">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-7xl font-black text-black tracking-tighter mb-4 uppercase" style={{ fontStretch: 'condensed' }}>
                        PULSE
                    </h1>
                    <div className="flex flex-col items-center gap-3">
                        <div className="text-lg font-bold text-black/60">
                            Room: <span className="text-black font-black text-xl">{code}</span>
                        </div>
                        
                        {theme && (
                            <div className="bg-[#C4B5FD] border-[3px] border-black rounded-full px-6 py-2">
                                <div className="text-base font-black text-black">
                                Theme: <span className="uppercase">{theme}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6 mb-10">
                    <PlayerStatusCard 
                        name={playerA.name} 
                        role={playerA.role} 
                        songCount={playerA.songCount} 
                        isLockedIn={playerA.lockedIn} 
                        bgColor="bg-section-coral" 
                        barColor="bg-section-coral-deep" 
                    />
            
                    <PlayerStatusCard 
                        name={playerB.name} 
                        role={playerB.role} 
                        songCount={playerB.songCount} 
                        isLockedIn={playerB.lockedIn} 
                        bgColor="bg-section-teal" 
                        barColor="bg-section-teal-deep" 
                    />
                </div>

                {/* Status message */}
                <div className="text-center">
                    {playerA?.lockedIn && playerB?.lockedIn ? (
                        <div className="space-y-3">
                            <div className="text-2xl font-black text-black animate-pulse">
                                🎵 Starting the bracket...
                            </div>
                            <div className="flex justify-center gap-1">
                                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="text-lg font-bold text-black/60">
                                The bracket begins when both players lock in
                            </div>
                            <div className="flex justify-center items-center gap-2 text-black/40">
                                <div className="text-2xl animate-pulse">♪</div>
                                <div className="text-sm font-bold">Waiting for players...</div>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}