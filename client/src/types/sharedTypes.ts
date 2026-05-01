export type Role = "player_a" | "player_b" | "judge" | "spectator" | null;

export type Status = "lobby" | "picking" | "battling" | "complete";

export type SongSelection = {
  deezerId: string;
  deezerRank: number;
  title: string;
  artist: string;
  albumArt: string;
  duration: number;
  preview: string;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  deezerId: string;
  deezerRank: number;
  albumArt: string;
  previewUrl: string | null;
  duration: number;
  seed: number | null;
  provider: string;
  playerId: string;
};
