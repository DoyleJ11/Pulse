import { create } from "zustand";

interface RoomState {
  code: string;
  status: string;
  players: string[];
  setRoom: (newCode: string, newStatus?: string, newPlayers?: string[]) => void;
  setCode: (newCode: string) => void;
  setPlayers: (newPlayers: string[]) => void;
}

const useRoomStore = create<RoomState>((set) => ({
  code: "",
  status: "",
  players: [],
  setRoom: (newCode: string, newStatus?: string, newPlayers?: string[]) =>
    set({ code: newCode, status: newStatus, players: newPlayers }),
  setPlayers: (newPlayers: string[]) => set({ players: newPlayers }),
  setCode: (newCode: string) => set({ code: newCode }),
}));

export { useRoomStore };
