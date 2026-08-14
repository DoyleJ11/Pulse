import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackSearch } from "./musicService.js";

const fetchMock = vi.fn();

function deezerResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

function validSearchResponse() {
  return {
    data: [
      {
        id: 1,
        title: "Test Song",
        title_short: "Test Song",
        duration: 180,
        preview: "https://cdns-preview.dzcdn.net/preview.mp3",
        rank: 100,
        artist: {
          id: 2,
          name: "Test Artist",
          picture_medium: "https://example.com/artist-medium.jpg",
          picture_big: "https://example.com/artist-big.jpg",
          picture_xl: "https://example.com/artist-xl.jpg",
        },
        album: {
          id: 3,
          title: "Test Album",
          cover_medium: "https://example.com/cover-medium.jpg",
          cover_big: "https://example.com/cover-big.jpg",
          cover_xl: "https://example.com/cover-xl.jpg",
        },
      },
    ],
    total: 1,
  };
}

describe("trackSearch", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("encodes the Deezer query and attaches a five-second timeout", async () => {
    const timeoutSignal = new AbortController().signal;
    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(timeoutSignal);
    fetchMock.mockResolvedValueOnce(deezerResponse(validSearchResponse()));

    const tracks = await trackSearch("Beyoncé & Jay-Z");

    expect(timeoutSpy).toHaveBeenCalledWith(5_000);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.deezer.com/search?q=Beyonc%C3%A9%20%26%20Jay-Z&limit=5",
      { signal: timeoutSignal },
    );
    expect(tracks).toEqual(validSearchResponse().data);
  });

  it("converts a Deezer HTTP failure into a safe 502 error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce(deezerResponse({}, 503));

    await expect(trackSearch("test")).rejects.toMatchObject({
      status: 502,
      message: "Song search is temporarily unavailable. Please try again.",
    });
  });

  it("converts a network failure into a safe 502 error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));

    await expect(trackSearch("test")).rejects.toMatchObject({ status: 502 });
  });

  it("converts a timeout into a safe 502 error", async () => {
    const timeoutSignal = new AbortController().signal;
    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(timeoutSignal);
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(
      new DOMException("The operation timed out", "TimeoutError"),
    );

    await expect(trackSearch("test")).rejects.toMatchObject({ status: 502 });
    expect(timeoutSpy).toHaveBeenCalledWith(5_000);
  });

  it("converts an invalid Deezer payload into a safe 502 error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce(
      deezerResponse({ data: [{ id: "not-a-number" }], total: 1 }),
    );

    await expect(trackSearch("test")).rejects.toMatchObject({ status: 502 });
  });
});
