import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type SongSelection } from "../types/sharedTypes";


interface SongStore {
    selectedSongs: SongSelection[],
    isLockedIn: boolean,
    setLockIn: (isLockedIn: boolean) => void;
    addSong: (song: SongSelection) => void;
    removeSong: (song: SongSelection) => void;
    clearSongs: () => void; 
}


const useSongStore = create<SongStore>()(
    persist(
        (set, get) => ({
            selectedSongs: [],
            isLockedIn: false,
            setLockIn: (lockedIn: boolean) => set(() => ({ isLockedIn: lockedIn })),
            addSong: (song: SongSelection) => {
                const songs: SongSelection[] = get().selectedSongs;
                if (songs.length >= 8) {
                    return
                } else if (songs.some(selectedSong => selectedSong.deezerId === song.deezerId)) {
                    return
                }

                set((state) => ({ selectedSongs:[...state.selectedSongs, song]}))
            },
            removeSong: (songToRemove: SongSelection) => set((state) => ({ selectedSongs: state.selectedSongs.filter((song) => song.deezerId !== songToRemove.deezerId)})),
            // Full reset — wipe selectedSongs AND isLockedIn together so a fresh
            // game can't inherit a stale "locked in" flag from a prior session.
            clearSongs: () => set({ selectedSongs: [], isLockedIn: false })
        }),
        {
            name: "song-storage",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                selectedSongs: state.selectedSongs,
                isLockedIn: state.isLockedIn,
            })
        },
    ),
);

export { useSongStore }