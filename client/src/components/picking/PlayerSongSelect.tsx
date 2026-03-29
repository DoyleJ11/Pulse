import { SongSearch } from "./SongSearch"
import { SongContainer } from "./SongContainer"
import { useSongStore } from "../../stores/songStore";

export function PlayerSongSelect() {
    const selectedSongs = useSongStore((state) => state.selectedSongs)
    return (
        <>
        <header className="flex justify-center my-6">
            <SongSearch />
        </header>
        <main className="flex">
            <div id="left-column">
                {/* Have 4 song containers in each column. Need to find a way to pass the last clicked button's info from SongSearch to the SongContainer. */}
                {selectedSongs.map((song) => (
                    <SongContainer deezerId={song.deezerId} title={song.title} artist={song.artist} albumArt={song.albumArt} preview={song.preview} />
                ))}
            </div>
            <div id="right-column">

            </div>
        </main>
        </>
    )
}