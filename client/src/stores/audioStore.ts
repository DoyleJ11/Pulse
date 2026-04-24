import { create } from "zustand";

interface AudioStore {
  audioEl: HTMLAudioElement | null;
  currentUrl: string | null;
  currentSongId: string | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
  play: (songId: string, url: string) => void;
  pause: () => void;
  toggle: (songId: string, url: string) => void;
  stop: () => void;
  _attachListeners: (el: HTMLAudioElement) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  audioEl: null,
  currentUrl: null,
  currentSongId: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  isLoading: false,
  error: null,

  play: (songId, url) => {
    let el = get().audioEl;

    if (!el) {
      el = new Audio();
      get()._attachListeners(el);
      set({ audioEl: el });
    }

    const isSameSong = get().currentSongId === songId;

    if (!isSameSong) {
      el.pause();
      el.src = url;
      el.currentTime = 0;
      set({
        currentSongId: songId,
        currentUrl: url,
        progress: 0,
        duration: 0,
        isLoading: true,
        error: null,
      });
    }

    el.play().catch((err) => {
      set({
        error: err?.message ?? "Playback failed",
        isPlaying: false,
        isLoading: false,
      });
    });
  },

  pause: () => {
    const el = get().audioEl;
    if (!el) return;
    el.pause();
  },

  toggle: (songId, url) => {
    const { isPlaying, currentSongId, play, pause } = get();
    if (isPlaying && currentSongId === songId) {
      pause();
    } else {
      play(songId, url);
    }
  },

  stop: () => {
    const el = get().audioEl;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    set({
      currentSongId: null,
      currentUrl: null,
      progress: 0,
      isPlaying: false,
      isLoading: false,
      error: null,
    });
  },

  _attachListeners: (el) => {
    el.addEventListener("play", () => {
      set({ isPlaying: true, isLoading: false });
    });

    el.addEventListener("pause", () => {
      set({ isPlaying: false });
    });

    el.addEventListener("ended", () => {
      set({ isPlaying: false, progress: 0 });
    });

    el.addEventListener("loadedmetadata", () => {
      set({ duration: el.duration });
    });

    el.addEventListener("timeupdate", () => {
      const d = el.duration;
      set({ progress: d > 0 ? el.currentTime / d : 0 });
    });

    el.addEventListener("canplay", () => {
      set({ isLoading: false });
    });

    el.addEventListener("waiting", () => {
      set({ isLoading: true });
    });

    el.addEventListener("error", () => {
      set({
        error: "Failed to load preview",
        isPlaying: false,
        isLoading: false,
      });
    });
  },
}));
