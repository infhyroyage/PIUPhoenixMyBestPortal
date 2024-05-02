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

  it("Should return valid Lv.20 scores", async () => {
    const mockGistInfoList: GistInfo[] = [
      {
        id: "valid",
        files: { "20.json": { filename: "20.json", raw_url: "raw_url" } },
        description: "PIUPhoenixMyBestPortal",
      },
      {
        id: "invalid1",
        files: {},
        description: "PIUPhoenixMyBestPortal",
      },
      {
        id: "invalid2",
        files: { "invalid2.json": { filename: "invalid2.json" } },
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
    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify(mockGistInfoList)))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockScores)));

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
    expect(mockFetch).toHaveBeenNthCalledWith(2, "raw_url");
  });

  it("Should return valid mixed level scores", async () => {
    const mockGistInfoList: GistInfo[] = [
      {
        id: "coop",
        files: {
          "coop.json": { filename: "coop.json", raw_url: "raw_url_coop" },
        },
        description: "PIUPhoenixMyBestPortal",
      },
      {
        id: "invalid",
        files: {},
        description: "PIUPhoenixMyBestPortal",
      },
      {
        id: "20",
        files: {
          "20.json": { filename: "20.json", raw_url: "raw_url_20" },
        },
        description: "PIUPhoenixMyBestPortal",
      },
    ];
    const mockScores1st: Score[] = [
      {
        lv: "20",
        songName: "songName_20",
        stepType: "stepType_20",
        thumbnailImgSrc: "thumbnailImgSrc_20",
      },
    ];
    const mockScores2nd: Score[] = [
      {
        lv: "coop",
        songName: "songName_coop",
        stepType: "stepType_coop",
        thumbnailImgSrc: "thumbnailImgSrc_coop",
      },
    ];
    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify(mockGistInfoList)))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockScores1st)))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockScores2nd)));

    const result = await getScores();
    expect(result).toEqual([
      {
        lv: "20",
        songName: "songName_20",
        stepType: "stepType_20",
        thumbnailImgSrc: "thumbnailImgSrc_20",
      },
      {
        lv: "coop",
        songName: "songName_coop",
        stepType: "stepType_coop",
        thumbnailImgSrc: "thumbnailImgSrc_coop",
      },
    ]);
    expect(mockFetch).toHaveBeenCalledTimes(3);
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
    expect(mockFetch).toHaveBeenNthCalledWith(2, "raw_url_20");
    expect(mockFetch).toHaveBeenNthCalledWith(3, "raw_url_coop");
  });
});
