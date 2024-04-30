import { beforeEach, describe, expect, it, vi } from "vitest";
import { getScores } from "../../services/gist";
import { GistInfo, Score } from "../../services/types";

vi.mock("dotenv");
const mockFetch = vi.spyOn(global, "fetch");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getScores", () => {
  beforeEach(() => {
    process.env.GIST_PAT = "GIST_PAT";
  });

  it("Should return empty array if GIST_PAT is not set", async () => {
    delete process.env.GIST_PAT;

    const result = await getScores("20");
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("Should return Lv.20 scores", async () => {
    const mockGistInfoList: GistInfo[] = [
      {
        id: "valid",
        files: { "20.json": { filename: "20.json", raw_url: "mock_raw_url" } },
        description: "PIUPhoenixMyBestPortal",
      },
      {
        id: "invalid",
        files: { "20.json": { filename: "20.json" } },
        description: "PIUPhoenixMyBestPortal",
      },
    ];
    const mockScores: Score[] = [
      {
        lv: "20",
        songName: "songName",
        stepType: "stepType",
        thumbnailImgSrc: "thumbnailImgSrc",
      },
    ];
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockGistInfoList)),
    );
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockScores)));

    const result = await getScores("20");
    expect(result).toEqual([
      {
        lv: "20",
        songName: "songName",
        stepType: "stepType",
        thumbnailImgSrc: "thumbnailImgSrc",
      },
    ]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "https://api.github.com/gists",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: "Bearer GIST_PAT",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    expect(mockFetch).toHaveBeenNthCalledWith(2, "mock_raw_url");
  });
});
