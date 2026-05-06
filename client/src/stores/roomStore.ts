import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Mode, type Status } from "../types/sharedTypes";

interface Player {
  id: string;
  name: string;
  role: string;
  connected: boolean;
  lastSeenAt: string;
}

interface RoomState {
  hostId: string;
  code: string;
  status: Status;
  mode: Mode;
  themeWord: string | null;
  players: Player[];
  setCode: (code: string) => void;
  setPlayers: (players: Player[]) => void;
  setHostId: (host: string) => void;
  setStatus: (status: Status) => void;
  setMode: (newMode: Mode) => void;
  setThemeWord: (newTheme: string | null) => void;
  clearRoom: () => void;
}

const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      hostId: "",
      code: "",
      status: "lobby",
      mode: "favorites",
      themeWord: null,
      players: [],
      setPlayers: (players: Player[]) => set({ players: players }),
      setCode: (code: string) => set({ code: code }),
      setHostId: (host: string) => set({ hostId: host }),
      setStatus: (newStatus: Status) => set({ status: newStatus }),
      setMode: (newMode: Mode) => set({ mode: newMode }),
      setThemeWord: (newTheme: string | null) => set({ themeWord: newTheme }),
      clearRoom: () =>
        set({
          hostId: "",
          code: "",
          status: "lobby",
          players: [],
          mode: "favorites",
          themeWord: null,
        }),
    }),
    {
      name: "room-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        code: state.code,
        players: state.players,
        mode: state.mode,
        themeWord: state.themeWord,
      }),
    },
  ),
);

export { useRoomStore, type Player };
