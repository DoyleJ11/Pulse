import { z } from "zod";

const DeezerTrackSchema = z.object({
  id: z.number(),
  title: z.string(),
  title_short: z.string(),
  isrc: z.string(),
  duration: z.number(),
  preview: z.string(),
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

async function trackSearch(query: string) {
  try {
    const response = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=5`,
    );

    if (!response.ok) {
      throw new Error(`Error searching Deezer tracks`);
    }

    const data = DeezerSearchResultSchema.parse(await response.json());
    return data.data;
  } catch (error) {
    console.error("Failed to fetch from Deezer API:", error);
    return [];
  }
}

export { trackSearch };
