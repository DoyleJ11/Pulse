import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Status } from "../types/sharedTypes";

interface Player {
  id: string;
  name: string;
  role: string;
}

interface RoomState {
  hostId: string;
  code: string;
  status: Status;
  players: Player[];
  setCode: (code: string) => void;
  setPlayers: (players: Player[]) => void;
  setHostId: (host: string) => void;
  setStatus: (status: Status) => void;
}

const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      hostId: "",
      code: "",
      status: "lobby",
      players: [],
      setPlayers: (players: Player[]) => set({ players: players }),
      setCode: (code: string) => set({ code: code }),
      setHostId: (host: string) => set({ hostId: host }),
      setStatus: (newStatus: Status) => set({ status: newStatus }),
    }),
    {
      name: "room-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        code: state.code,
        players: state.players,
      }),
    },
  ),
);

export { useRoomStore, type Player };
