import { Lock, Music } from 'lucide-react';

interface PlayerStatusCardProps {
    name: string,
    role: "player_a" | "player_b",
    songCount: number,
    isLockedIn: boolean,
    bgColor: string,
    barColor: string,
}

export function PlayerStatusCard({
    name,
    role,
    songCount,
    isLockedIn,
    bgColor,
    barColor
}: PlayerStatusCardProps) {
    const progress = (songCount / 8) * 100;
    const roleMap = {player_a: "Player 1", player_b: "Player 2"}

    return (
        <div className={`flex flex-col h-full min-w-[550px] gap-4 ${bgColor} border-border-heavy p-6 rounded-2xl ${isLockedIn ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : ''} transition-all duration-300`} style={{borderWidth: "var(--border-weight-heavy)"}}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-text-muted uppercase font-semibold text-sm">{roleMap[role]}</p>
                    <h1 className="font-black text-4xl">{name}</h1> 
                </div>

                {isLockedIn && (
                    <div className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 border-[3px] border-black">
                        <Lock className="w-5 h-5" strokeWidth={3} />
                        <span className="font-black text-sm">READY</span>
                    </div>
                )}
            </div>
            {isLockedIn ? (
                <div className="text-2xl font-black text-black flex items-center gap-3 mb-4">
                    <Lock className="w-7 h-7" strokeWidth={3} />
                    LOCKED IN
                </div>
            ) : (
                <p className="font-black text-5xl">{songCount}/8 songs</p>
            )}
            <div className={`w-full ${bgColor} rounded-full h-6 border-border-heavy`} style={{borderWidth: "var(--border-weight-heavy)"}}>
                <div className={`${barColor} h-[18px] rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${progress}%` }}
                >
                </div>
            </div>

            {!isLockedIn && (
                <div className="text-sm font-bold text-black/60 flex items-center gap-2">
                    <Music className="w-4 h-4 animate-pulse" strokeWidth={3} />
                    Picking songs...
                </div>
            )}
        </div>
    )

}