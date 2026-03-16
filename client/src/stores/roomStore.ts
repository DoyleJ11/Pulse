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
  setRoom: (code: string, status?: string, players?: Player[]) => void;
  setCode: (code: string) => void;
  addPlayers: (player: Player) => void;
  setPlayers: (players: Player[]) => void;
}

const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      code: "",
      status: "",
      players: [],
      setRoom: (code: string, status?: string, players?: Player[]) =>
        set({ code: code, status: status, players: players }),
      addPlayers: (player: Player) =>
        set((prev) => ({ players: [...prev.players, player] })),
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

export { useRoomStore };
