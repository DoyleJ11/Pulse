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
  play: (songId: string, url: string) => {
    let el: HTMLAudioElement | null = get().audioEl;
    const currentSongId = get().currentSongId;

    if (!el) {
      el = new Audio(url);
      set((state) => ({
        audioEl: el,
        currentUrl: url,
        currentSongId: songId,
      }));
    }

    if (songId === currentSongId) {
      el.play();
    }

    if (songId != currentSongId) {
      el.pause();
      el.src = url;
      el.currentTime = 0;
    }
  },
  pause: () => {
    const player: HTMLAudioElement | null = get().audioEl;
    if (!player) {
      return;
    }
    player.pause();
  },
  toggle: (songId: string, url: string) => {},
  stop: () => {},
  _attachListeners: (el: HTMLAudioElement) => {},
}));
