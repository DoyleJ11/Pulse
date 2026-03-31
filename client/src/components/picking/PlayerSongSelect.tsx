import { SearchContainer } from "./SearchContainer";
import { SongContainer } from "./SongContainer";
import { useSongStore } from "../../stores/songStore";
import { useRoomStore } from "../../stores/roomStore";

export function PlayerSongSelect() {
  const selectedSongs = useSongStore((state) => state.selectedSongs);
  const removeSong = useSongStore((state) => state.removeSong);
  const addSong = useSongStore((state) => state.addSong);
  const roomCode = useRoomStore((state) => state.code);

  const onLockIn = () => {
    // Will wire to submitPicks API call in a future phase
  };

  return (
    <div className="min-h-screen bg-bg-cream p-8">
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
          <SearchContainer onAddSong={addSong} />
          <SongContainer
            selectedSongs={selectedSongs}
            onRemoveSong={removeSong}
            onLockIn={onLockIn}
          />
        </div>
      </div>
    </div>
  );
}
