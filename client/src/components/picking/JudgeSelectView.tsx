import { useEffect, useState } from "react"
import { socket } from "../../utils/socket"

interface Player {
    songCount: number,
    userId: string,
    role: "player_a" | "player_b",
    name: string,
    lockedIn: boolean,
}

export function JudgeSelectView() {

    const [playerA, setPlayerA] = useState<Player | null>(null);
    const [playerB, setPlayerB] = useState<Player | null>(null);

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
        <div className="h-full flex flex-col justify-center items-center gap-6">
            {playerA && (
                <div className="flex flex-col h-full min-w-[400px] gap-2 bg-section-coral border-border-heavy p-6 rounded-2xl" style={{borderWidth: "var(--border-weight-heavy)"}}>
                    <div>
                        <p className="text-text-muted uppercase font-semibold">{playerA.role}</p>
                        <h1 className="font-black text-3xl">{playerA.name}</h1> 
                    </div>
                    <p className="font-black text-4xl">{playerA.songCount}/8 songs</p>
                </div>
            )}
            {playerB && (
                <div className="flex flex-col h-full min-w-[400px] gap-2 bg-section-teal border-border-heavy p-6 rounded-2xl" style={{borderWidth: "var(--border-weight-heavy)"}}>
                    <div>
                        <p className="text-text-muted uppercase font-semibold">{playerB.role}</p>
                        <h1 className="font-black text-3xl">{playerB.name}</h1>
                    </div>
                    <p className="font-black text-4xl">{playerB.songCount}/8 songs</p>
                </div>
            )}
        </div>
    )
}