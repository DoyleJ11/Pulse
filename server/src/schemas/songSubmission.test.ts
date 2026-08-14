import { describe, expect, it } from "vitest";
import { SubmissionSchema } from "./songSubmission.js";

function validSubmission() {
  return Array.from({ length: 8 }, (_, index) => ({
    deezerId: String(index + 1),
    deezerRank: 1000 + index,
    title: `Song ${index + 1}`,
    artist: `Artist ${index + 1}`,
    albumArt: `https://e-cdns-images.dzcdn.net/images/cover/${index + 1}.jpg`,
    duration: 180 + index,
    preview: `https://cdns-preview-${index}.dzcdn.net/stream/${index + 1}.mp3`,
  }));
}

describe("SubmissionSchema", () => {
  it("accepts eight unique songs with Deezer-hosted assets", () => {
    expect(SubmissionSchema.safeParse(validSubmission()).success).toBe(true);
  });

  it.each([
    ["albumArt", "a non-URL", "not-a-url"],
    ["albumArt", "plain HTTP", "http://e-cdns-images.dzcdn.net/cover.jpg"],
    ["preview", "an external host", "https://example.com/preview.mp3"],
    ["preview", "a lookalike host", "https://dzcdn.net.example.com/preview.mp3"],
  ])("rejects %s using %s", (field, _label, url) => {
    const songs = validSubmission();
    songs[0] = { ...songs[0]!, [field]: url };

    expect(SubmissionSchema.safeParse(songs).success).toBe(false);
  });

  it.each(["title", "artist"])("rejects an oversized %s", (field) => {
    const songs = validSubmission();
    songs[0] = { ...songs[0]!, [field]: "x".repeat(201) };

    expect(SubmissionSchema.safeParse(songs).success).toBe(false);
  });

  it("rejects a non-numeric Deezer ID", () => {
    const songs = validSubmission();
    songs[0]!.deezerId = "forged-id";

    expect(SubmissionSchema.safeParse(songs).success).toBe(false);
  });

  it.each([
    ["fractional rank", "deezerRank", 1.5],
    ["negative rank", "deezerRank", -1],
    ["fractional duration", "duration", 180.5],
    ["negative duration", "duration", -1],
  ])("rejects a %s", (_label, field, value) => {
    const songs = validSubmission();
    songs[0] = { ...songs[0]!, [field]: value };

    expect(SubmissionSchema.safeParse(songs).success).toBe(false);
  });

  it("rejects duplicate Deezer IDs", () => {
    const songs = validSubmission();
    songs[7]!.deezerId = songs[0]!.deezerId;
    const result = SubmissionSchema.safeParse(songs);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: [7, "deezerId"],
          message: "Each submitted song must be unique.",
        }),
      );
    }
  });
});
