import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { searchSong } from "../../services/api";
import { useDebounce } from "../../hooks/useDebounce";
import { type DeezerSong } from "../../services/api";
import { type SongSelection } from "../../types/sharedTypes";
import { useEffect, useState } from "react";
import { useSongStore } from "../../stores/songStore";
import {
  faMagnifyingGlass,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

function SongSearch() {
  const addSong = useSongStore((state) => state.addSong)
  const [results, setResults] = useState<DeezerSong[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      (async () => {
        console.log("Fetching results for:", debouncedQuery);
        const searchResults: DeezerSong[] = await searchSong(debouncedQuery);
        setResults(searchResults);
      })();
    }
  }, [debouncedQuery]);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const selectSong = (result: DeezerSong) => {
    // Transform deezer song -> Song format
    const song: SongSelection = {
      deezerId: result.id,
      title: result.title,
      artist: result.artist.name,
      albumArt: result.album.cover_medium,
      preview: result.preview,
    }

    addSong(song)
  }

  return (
    <div className="w-full max-w-xl">
      {/* ── Search container ── */}
      <div className="bg-surface-raised border border-border-subtle rounded-2xl shadow-lg shadow-black/25 overflow-hidden">
        {/* ── Input row ── */}
        <div className="flex items-center gap-3 px-5 py-3.5">
          {/* Search icon — visual label, tells users this is a search field */}
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-text-muted text-sm shrink-0"
          />

          {/* Input has no border/bg — the outer container IS the visual "input frame" */}
          <input
            type="text"
            placeholder="Search for a song..."
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-sm outline-none"
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Action buttons — sit inside the search bar visually */}
          {/* <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:text-accent hover:bg-accent-soft transition-colors cursor-pointer"
              aria-label="Add song"
            >
              <FontAwesomeIcon icon={faPlus} className="text-sm" />
            </button>
          </div> */}
        </div>

        {/* ── Results list ── */}
        <div className="border-t border-border-subtle" />

        <ul className="py-1.5">
          {/* Example result rows with real Deezer cover art — replace with .map() when wiring data */}
          {results &&
            results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-surface-hover transition-colors text-left cursor-pointer group"
                  onClick={() => {selectSong(result) }}
                >
                  {/* Album art with play overlay */}
                  <div className="relative w-10 h-10 rounded-md bg-surface-overlay shrink-0 overflow-hidden group/art">
                    <img
                      src={result.album.cover_medium}
                      alt="Album cover"
                      className="w-full h-full object-cover"
                    />
                    {/* Play overlay — hidden by default, appears on hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // preview logic goes here
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/art:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Preview song"
                    >
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="text-white text-xs"
                      />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {result.title}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {result.artist.name}
                    </p>
                  </div>

                  <span className="text-xs text-text-muted shrink-0 tabular-nums">
                    {formatDuration(result.duration)}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export { SongSearch };
