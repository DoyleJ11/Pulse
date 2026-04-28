import { SearchContainer } from "./SearchContainer";
import { SongContainer } from "./SongContainer";
import { useSongStore } from "../../stores/songStore";
import { useRoomStore } from "../../stores/roomStore";
import { useTokenStore } from "../../stores/tokenStore";
import { submitPicks } from "../../services/api";
import { useToastStore } from "../../stores/toastStore";
import { useEffect, useState, useRef } from "react";
import { WaitingOverlay } from "./WaitingOverlay";
import { socket } from "../../utils/socket";

export function PlayerSongSelect() {
  const selectedSongs = useSongStore((state) => state.selectedSongs);
  const removeSong = useSongStore((state) => state.removeSong);
  const addSong = useSongStore((state) => state.addSong);
  const setLockIn = useSongStore((state) => state.setLockIn);
  const isLockedIn = useSongStore((state) => state.isLockedIn);
  const roomCode = useRoomStore((state) => state.code);
  const token = useTokenStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);
  const pickRef = useRef({
    songCount: selectedSongs.length,
    isLockedIn: isLockedIn,
  });

  useEffect(() => {
    pickRef.current = {
      songCount: selectedSongs.length,
      isLockedIn: isLockedIn,
    };

    socket.emit("pickUpdate", {
      songCount: selectedSongs.length,
      lockedIn: isLockedIn,
    });
  }, [selectedSongs.length, isLockedIn]);

  useEffect(() => {
    socket.on("roomState", () => {
      socket.emit("pickUpdate", {
        songCount: pickRef.current.songCount,
        lockedIn: pickRef.current.isLockedIn,
      });
    });

    return () => {
      socket.off("roomState");
    };
  }, []);

  const onLockIn = async () => {
    setIsLoading(true);
    try {
      await submitPicks(selectedSongs, roomCode, token);
      setLockIn(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      useToastStore
        .getState()
        .addError(err, "Error locking in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-cream p-8">
      {isLockedIn && <WaitingOverlay />}
      <div className="max-w-[1000px] mx-auto">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-7xl font-black text-text-primary tracking-tighter uppercase">
              PULSE
            </h1>
            <p className="text-xl font-bold text-text-secondary">
              Room:{" "}
              <span className="text-text-primary font-black">
                {roomCode || "------"}
              </span>
            </p>
          </div>

          {/* Song counter pill */}
          <div
            className="bg-section-teal border-border-heavy rounded-pill px-6 py-3"
            style={{ borderWidth: "var(--border-weight-heavy)" }}
          >
            <span className="text-2xl font-black text-text-primary tracking-tight">
              {selectedSongs.length}/8 SONGS
            </span>
          </div>
        </div>

        {/* Two-panel layout */}
        <div
          className="grid grid-cols-2 gap-6"
          style={{ height: "calc(100vh - 200px)" }}
        >
          <SearchContainer onAddSong={addSong} isLockedIn={isLockedIn} />
          <SongContainer
            selectedSongs={selectedSongs}
            onRemoveSong={removeSong}
            onLockIn={onLockIn}
            isLoading={isLoading}
            isLockedIn={isLockedIn}
          />
        </div>
      </div>
    </div>
  );
}
