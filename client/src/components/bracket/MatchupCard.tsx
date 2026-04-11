import { Play } from 'lucide-react';
import { type BracketSlot } from "./BracketView"

interface SongCardProps {
    song: BracketSlot | null,
    state: "empty" | "active" | "decided-winner" | "decided-loser" | "normal",
    onPick?: () => void;
    onPlay?: () => void;
    seedColor?: string;
    size?: "base" | "quarter" | "semi" | "final";
}

export function MatchupCard({ song, state, onPick, onPlay, size="base" }: SongCardProps) {

    const sizeClasses = {
        base: 'w-[364px]',
        quarter: 'w-[400px]',
        semi: 'w-[437px]',
        final: 'w-[473px]'
    }

    const seedColors = ["#2DD4BF", "#FF7B6B", "#C4B5FD", "#FFD952", "#6EE7B7", "#2DD4BF", "#FF7B6B", "#C4B5FD"];

    // Render TBD if null
    if (state === "empty" || !song) {
        return (
            <div className={`${sizeClasses[size]} h-25 border-[3px] border-dashed border-black/30 rounded-2xl flex items-center justify-center bg-transparent`}>
                <div className="text-black/40 font-black text-lg">TBD</div>
            </div>
        );
    }

    const isActive = state === "active";
    const isDecided = state === "decided-winner" || state === "decided-loser";
    const isLoser = state === "decided-loser";
    const opacity = isDecided ? 'opacity-60' : ''

    const getPlayerColor = () => {
        if (song.role === "player_a") {
            return isActive ? '#FF7B6B' : '#FF9282';
        } else {
            return isActive ? '#2DD4BF' : '#52DCC8';
        }
    }

    const getPickButtonBg = () => {
        return song.role === 'player_a' ? '#FF6B58' : '#14B8A6';
    };

    return (
        <div className={`${sizeClasses[size]} ${opacity} transition-all duration-300`}>
            <div 
                className={`relative border-[3px] border-black rounded-2xl p-4 ${
                    isActive ? 'shadow-heavy' : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]'
                }`}
                style={{ backgroundColor: getPlayerColor() }}
            >
                {/* Loser X badge */}
                {isLoser && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-[3px] border-black z-10">
                    <span className="text-white font-black">✕</span>
                </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                    {/* Album play btn overlay */}
                    <div className="relative shrink-0">
                        <img 
                            src={song.albumArt}
                            alt={song.title}
                            className="w-16 h-16 rounded-lg object-cover border-[3px] border-black"
                        />
                        {isActive && onPlay && (
                            <button
                                onClick={onPlay}
                                className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center hover:bg-black/50 transition-colors group"
                                aria-label="Play preview"
                            >
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="w-4 h-4 text-black fill-black ml-0.5" strokeWidth={0} />
                                </div>
                            </button>
                        )}
                    </div>
                    
                    {/* Song info */}
                    <div className='flex-1 min-w-0'>
                        <div className="font-black text-black truncate text-base leading-tight">{song.title}</div>
                        <div className="font-bold text-black/70 truncate text-sm">{song.artist}</div>
                        <div className="text-[10px] font-black text-black/50 uppercase mt-0.5">
                            {song.role === "player_a" ? "PLAYER A" : "PLAYER B"}
                        </div>
                    </div>

                    {/* Seed badge */}
                    <div className='shrink-0'>
                        <div className="w-9 h-9 rounded-full border-[3px] border-black flex items-center justify-center font-black text-black text-sm"
                             style={{ backgroundColor: seedColors[(song.seed - 1) % seedColors.length] }}
                        >
                            {song.seed}
                        </div>
                    </div>
                </div>

                {/* Pick button for active state */}
                {isActive && onPick && (
                    <button
                        onClick={onPick}
                        className="w-full py-3 rounded-full border-[3px] border-black font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all text-white uppercase"
                        style={{ backgroundColor: getPickButtonBg() }}
                    >
                        PICK THIS SONG
                    </button>
                )}
            </div>
        </div>
    );
}