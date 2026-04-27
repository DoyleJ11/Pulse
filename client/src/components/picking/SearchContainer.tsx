import { searchSong } from "../../services/api";
import { useDebounce } from "../../hooks/useDebounce";
import { type DeezerSong } from "../../services/api";
import { type SongSelection } from "../../types/sharedTypes";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { SearchResult } from "./SearchResult";
import { useToastStore } from "../../stores/toastStore";

interface SearchContainerProps {
  onAddSong: (song: SongSelection) => void;
  isLockedIn: boolean;
}

export function SearchContainer({
  onAddSong,
  isLockedIn,
}: SearchContainerProps) {
  const [results, setResults] = useState<DeezerSong[]>([]);
  const [query, setQuery] = useState("");
  const addError = useToastStore((state) => state.addError);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) return;

    let cancelled = false;
    (async () => {
      try {
        const searchResults: DeezerSong[] = await searchSong(debouncedQuery);
        if (!cancelled) setResults(searchResults);
      } catch (error) {
        if (!cancelled) {
          setResults([]);
          addError(error, "Could not search songs. Please try again.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, addError]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (!value) {
      setResults([]);
    }
  };

  const selectSong = (result: DeezerSong): void => {
    const song: SongSelection = {
      deezerId: result.id.toString(),
      deezerRank: result.rank,
      title: result.title,
      artist: result.artist.name,
      albumArt: result.album.cover_medium,
      duration: result.duration,
      preview: result.preview,
    };

    onAddSong(song);
  };

  return (
    <div
      className={`h-full flex flex-col rounded-3xl bg-section-coral p-6 border-text-primary border-4 ${isLockedIn ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Search input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search for a song..."
          disabled={isLockedIn}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="w-full px-5 py-4 pl-14 rounded-pill bg-bg-card text-text-primary
                     placeholder:text-text-muted font-bold border-border-heavy
                     focus:outline-none focus:ring-4 focus:ring-black/20"
          style={{ borderWidth: "var(--border-weight-heavy)" }}
        />
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-text-primary"
          strokeWidth={3}
        />
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {results.map((result) => (
          <SearchResult
            key={result.id}
            song={result}
            onAdd={() => selectSong(result)}
            isLockedIn={isLockedIn}
          />
        ))}
      </div>
    </div>
  );
}
