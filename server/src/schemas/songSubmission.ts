import { z } from "zod";

const DeezerAssetUrlSchema = z
  .url("Must be a valid URL")
  .max(512, "URL cannot exceed 512 characters")
  .refine((value) => {
    try {
      const url = new URL(value);
      const hostname = url.hostname.toLowerCase();

      return (
        url.protocol === "https:" &&
        (hostname === "dzcdn.net" || hostname.endsWith(".dzcdn.net"))
      );
    } catch {
      return false;
    }
  }, "URL must use Deezer's HTTPS CDN");

const SongSchema = z.object({
  deezerId: z
    .string()
    .regex(/^\d+$/, "Deezer ID must be numeric")
    .max(32, "Deezer ID cannot exceed 32 characters"),
  deezerRank: z.number().int().nonnegative(),
  title: z.string().trim().min(1).max(200),
  artist: z.string().trim().min(1).max(200),
  albumArt: DeezerAssetUrlSchema,
  duration: z.number().int().nonnegative(),
  preview: DeezerAssetUrlSchema,
});

const SubmissionSchema = z
  .array(SongSchema)
  .length(8, { message: "Must submit exactly 8 songs." })
  .superRefine((songs, context) => {
    const seenDeezerIds = new Set<string>();

    songs.forEach((song, index) => {
      if (seenDeezerIds.has(song.deezerId)) {
        context.addIssue({
          code: "custom",
          path: [index, "deezerId"],
          message: "Each submitted song must be unique.",
        });
      }

      seenDeezerIds.add(song.deezerId);
    });
  });

type Song = z.infer<typeof SongSchema>;

export { DeezerAssetUrlSchema, SongSchema, SubmissionSchema, type Song };
