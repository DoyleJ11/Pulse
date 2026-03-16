import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Player {
  id: string;
  name: string;
  role: string;
}

interface RoomState {
  code: string;
  status: string;
  players: Player[];
  setCode: (code: string) => void;
  setPlayers: (players: Player[]) => void;
}

const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      code: "",
      status: "",
      players: [],
      setPlayers: (players: Player[]) => set({ players: players }),
      setCode: (code: string) => set({ code: code }),
    }),
    {
      name: "room-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        code: state.code,
      }),
    },
  ),
);

export { useRoomStore, type Player };
