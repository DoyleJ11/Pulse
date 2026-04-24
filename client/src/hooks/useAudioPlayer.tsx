import { useAudioStore } from "../stores/audioStore";

export function useAudioPlayer() {
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const currentSongId = useAudioStore((s) => s.currentSongId);
  const progress = useAudioStore((s) => s.progress);
  const duration = useAudioStore((s) => s.duration);
  const isLoading = useAudioStore((s) => s.isLoading);
  const error = useAudioStore((s) => s.error);
  const play = useAudioStore((s) => s.play);
  const pause = useAudioStore((s) => s.pause);
  const toggle = useAudioStore((s) => s.toggle);
  const stop = useAudioStore((s) => s.stop);

  const isPlayingSong = (id: string) => isPlaying && currentSongId === id;

  return {
    isPlaying,
    currentSongId,
    progress,
    duration,
    isLoading,
    error,
    play,
    pause,
    toggle,
    stop,
    isPlayingSong,
  };
}
