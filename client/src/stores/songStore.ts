import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type SongSelection } from "../types/sharedTypes";


interface SongStore {
    selectedSongs: SongSelection[],
    addSong: (song: SongSelection) => void;
    removeSong: (song: SongSelection) => void;
    clearSongs: () => void; 
}

const useSongStore = create<SongStore>()(
    persist(
        (set) => ({
            selectedSongs: [],
            addSong: (song: SongSelection) => set((state) => ({ selectedSongs: [...state.selectedSongs, song]})),
            removeSong: (songToRemove: SongSelection) => set((state) => ({ selectedSongs: state.selectedSongs.filter((song) => song.deezerId !== songToRemove.deezerId)})),
            clearSongs: () => set({ selectedSongs: []})
        }),
        {
            name: "song-storage",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                selectedSongs: state.selectedSongs,
            })
        },
    ),
);

export { useSongStore }