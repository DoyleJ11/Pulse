import { z } from "zod";
import { CustomError } from "../utils/customErrors.js";

const DEEZER_SEARCH_TIMEOUT_MS = 5_000;

const DeezerTrackSchema = z.object({
  id: z.number(),
  title: z.string(),
  title_short: z.string(),
  duration: z.number(),
  preview: z.string(),
  rank: z.number(),
  artist: z.object({
    id: z.number(),
    name: z.string(),
    picture_medium: z.string(),
    picture_big: z.string(),
    picture_xl: z.string(),
  }),
  album: z.object({
    id: z.number(),
    title: z.string(),
    cover_medium: z.string(),
    cover_big: z.string(),
    cover_xl: z.string(),
  }),
});

const DeezerSearchResultSchema = z.object({
  data: DeezerTrackSchema.array(),
  total: z.number(),
  next: z.string().optional(),
});

type DeezerSearchResults = z.infer<typeof DeezerSearchResultSchema>;
type DeezerTrack = z.infer<typeof DeezerTrackSchema>;

async function trackSearch(query: string) {
  try {
    const response = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=5`,
      { signal: AbortSignal.timeout(DEEZER_SEARCH_TIMEOUT_MS) },
    );

    if (!response.ok) {
      throw new Error(`Deezer search returned HTTP ${response.status}`);
    }

    const data: DeezerSearchResults = DeezerSearchResultSchema.parse(
      await response.json(),
    );
    const tracks: DeezerTrack[] = data.data;
    return tracks;
  } catch (error) {
    console.error("Failed to fetch from Deezer API:", error);
    throw new CustomError(
      "Song search is temporarily unavailable. Please try again.",
      502,
    );
  }
}

export { trackSearch, type DeezerTrack };
