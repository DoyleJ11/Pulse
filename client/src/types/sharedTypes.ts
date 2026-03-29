
export type Role = "player_a" | "player_b" | "judge" | "spectator"| null;

export type Status = "lobby" | "picking" | "battling" | "complete"

export type SongSelection = {
    deezerId: number;
    title: string;
    artist: string;
    albumArt: string;
    preview: string;
}

export type Song = {
    id: string;
    title: string;
    artist: string;
    deezerId: string;
    albumArt: string;
    previewUrl: string | null;
    seed: number | null;
    provider: string;
    playerId: string;
}