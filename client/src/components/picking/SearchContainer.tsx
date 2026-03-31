import { searchSong } from "../../services/api";
import { useDebounce } from "../../hooks/useDebounce";
import { type DeezerSong } from "../../services/api";
import { type SongSelection } from "../../types/sharedTypes";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { SearchResult } from "./SearchResult";

interface SearchContainerProps {
  onAddSong: (song: SongSelection) => void;
}

export function SearchContainer({ onAddSong }: SearchContainerProps) {
  const [results, setResults] = useState<DeezerSong[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      (async () => {
        const searchResults: DeezerSong[] = await searchSong(debouncedQuery);
        setResults(searchResults);
      })();
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const selectSong = (result: DeezerSong): void => {
    const song: SongSelection = {
      deezerId: result.id,
      title: result.title,
      artist: result.artist.name,
      albumArt: result.album.cover_medium,
      preview: result.preview,
    };

    onAddSong(song);
  };

  return (
    <div className="h-full flex flex-col rounded-card bg-section-coral p-6">
      {/* Search input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
          />
        ))}
      </div>
    </div>
  );
}
