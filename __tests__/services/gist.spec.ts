import { beforeEach, describe, expect, it, vi } from "vitest";
import { getGistInfo, getScores } from "../../services/gist";
import { GistInfo, GistJson } from "../../services/types";

vi.mock("dotenv");
const mockFetch = vi.spyOn(global, "fetch");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getGistInfo", () => {
  it("Should not get gist information", async () => {
    const mockGistInfoList: GistInfo[] = [
      {
        id: "invalidDescription",
        files: {
          "PIUPhoenixMyBestPortal.json": {
            filename: "PIUPhoenixMyBestPortal.json",
          },
        },
        description: "invalidDescription",
      },
      {
        id: "invalidFiles",
        files: {
          "invalidFiles.json": { filename: "PIUPhoenixMyBestPortal.json" },
        },
        description: "PIUPhoenixMyBestPortal",
      },
      {
        id: "invalidFilename",
        files: {
          "PIUPhoenixMyBestPortal.json": { filename: "invalidFilename.json" },
        },
        description: "PIUPhoenixMyBestPortal",
      },
    ];
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockGistInfoList)),
    );

    const result = await getGistInfo("GIST_PAT");
    expect(result).toEqual(undefined);
    expect(mockFetch).toHaveBeenCalledTimes(1);
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
  });

  it("Should get a gist information with multiple pages", async () => {
    const mockGistInfoList1st: GistInfo[] = [
      {
        id: "1-1",
        files: {
          "dummy.json": {
            filename: "dummy.json",
          },
        },
        description: "dummy",
      },
      {
        id: "1-2",
        files: {
          "dummy.json": {
            filename: "dummy.json",
          },
        },
        description: "PIUPhoenixMyBestPortal",
      },
    ];
    const mockGistInfoList2nd: GistInfo[] = [
      {
        id: "2-1",
        files: {
          "PIUPhoenixMyBestPortal.json": {
            filename: "PIUPhoenixMyBestPortal.json",
          },
        },
        description: "dummy",
      },
      {
        id: "2-2",
        files: {
          "PIUPhoenixMyBestPortal.json": {
            filename: "PIUPhoenixMyBestPortal.json",
          },
        },
        description: "PIUPhoenixMyBestPortal",
      },
    ];
    mockFetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify(mockGistInfoList1st), {
          headers: {
            Link: '<https://api.github.com/gists?page=2>; rel="next"',
          },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(mockGistInfoList2nd), {
          headers: {
            Link: "invalidLinkHeader",
          },
        }),
      );

    const result = await getGistInfo("GIST_PAT");
    expect(result).toStrictEqual({
      id: "2-2",
      files: {
        "PIUPhoenixMyBestPortal.json": {
          filename: "PIUPhoenixMyBestPortal.json",
        },
      },
      description: "PIUPhoenixMyBestPortal",
    });
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
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "https://api.github.com/gists?page=2",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: "Bearer GIST_PAT",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
  });
});

describe("getScores", () => {
  const mockGistJson: GistJson = {
    20: [
      {
        songName: "songName_20",
        stepType: "stepType_20",
        thumbnailImgSrc: "thumbnailImgSrc_20",
      },
    ],
    21: [
      {
        songName: "songName_21",
        stepType: "stepType_21",
        thumbnailImgSrc: "thumbnailImgSrc_21",
      },
    ],
    22: [
      {
        songName: "songName_22",
        stepType: "stepType_22",
        thumbnailImgSrc: "thumbnailImgSrc_22",
      },
    ],
    23: [
      {
        songName: "songName_23",
        stepType: "stepType_23",
        thumbnailImgSrc: "thumbnailImgSrc_23",
      },
    ],
    24: [
      {
        songName: "songName_24",
        stepType: "stepType_24",
        thumbnailImgSrc: "thumbnailImgSrc_24",
      },
    ],
    25: [
      {
        songName: "songName_25",
        stepType: "stepType_25",
        thumbnailImgSrc: "thumbnailImgSrc_25",
      },
    ],
    26: [
      {
        songName: "songName_26",
        stepType: "stepType_26",
        thumbnailImgSrc: "thumbnailImgSrc_26",
      },
    ],
    "27over": [
      {
        songName: "songName_27over",
        stepType: "stepType_27over",
        thumbnailImgSrc: "thumbnailImgSrc_27over",
      },
    ],
    coop: [
      {
        songName: "songName_coop",
        stepType: "stepType_coop",
        thumbnailImgSrc: "thumbnailImgSrc_coop",
      },
    ],
  };

  beforeEach(() => {
    process.env.GIST_PAT = "GIST_PAT";
  });

  it("Should get empty array if GIST_PAT is not set", async () => {
    delete process.env.GIST_PAT;

    const result = await getScores("20");
    expect(result).toStrictEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("Should get empty array without gist information", async () => {
    const mockGistInfoList: GistInfo[] = [
      {
        id: "invalid",
        files: {},
        description: "PIUPhoenixMyBestPortal",
      },
    ];
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockGistInfoList)),
    );

    const result = await getScores("20");
    expect(result).toStrictEqual([]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
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
  });

  it('Should get empty array with gist information where "files" is invalid', async () => {
    const mockGistInfoList: GistInfo[] = [
      {
        id: "invalid",
        files: {
          "PIUPhoenixMyBestPortal.json": {
            filename: "PIUPhoenixMyBestPortal.json",
          },
          "invalid.json": {
            filename: "invalid.json",
          },
        },
        description: "PIUPhoenixMyBestPortal",
      },
    ];
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockGistInfoList)),
    );

    const result = await getScores("20");
    expect(result).toStrictEqual([]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
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
  });

  it('Should get empty array with gist information where "raw_url" is invalid', async () => {
    const mockGistInfoList: GistInfo[] = [
      {
        id: "invalid",
        files: {
          "PIUPhoenixMyBestPortal.json": {
            filename: "PIUPhoenixMyBestPortal.json",
          },
        },
        description: "PIUPhoenixMyBestPortal",
      },
    ];
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockGistInfoList)),
    );

    const result = await getScores("20");
    expect(result).toStrictEqual([]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
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
  });

  it("Should get my best scores with filtered level", async () => {
    const mockGistInfoList: GistInfo[] = [
      {
        id: "valid",
        files: {
          "PIUPhoenixMyBestPortal.json": {
            filename: "PIUPhoenixMyBestPortal.json",
            raw_url: "raw_url_valid",
          },
        },
        description: "PIUPhoenixMyBestPortal",
      },
    ];
    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify(mockGistInfoList)))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockGistJson)));

    const result = await getScores("20");
    expect(result).toStrictEqual([
      {
        songName: "songName_20",
        stepType: "stepType_20",
        thumbnailImgSrc: "thumbnailImgSrc_20",
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
    expect(mockFetch).toHaveBeenNthCalledWith(2, "raw_url_valid");
  });

  it("Should get my best scores with mixed levels", async () => {
    const mockGistInfoList: GistInfo[] = [
      {
        id: "valid",
        files: {
          "PIUPhoenixMyBestPortal.json": {
            filename: "PIUPhoenixMyBestPortal.json",
            raw_url: "raw_url_valid",
          },
        },
        description: "PIUPhoenixMyBestPortal",
      },
    ];
    mockFetch
      .mockResolvedValueOnce(new Response(JSON.stringify(mockGistInfoList)))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockGistJson)));

    const result = await getScores();
    expect(result).toStrictEqual([
      {
        songName: "songName_20",
        stepType: "stepType_20",
        thumbnailImgSrc: "thumbnailImgSrc_20",
      },
      {
        songName: "songName_21",
        stepType: "stepType_21",
        thumbnailImgSrc: "thumbnailImgSrc_21",
      },
      {
        songName: "songName_22",
        stepType: "stepType_22",
        thumbnailImgSrc: "thumbnailImgSrc_22",
      },
      {
        songName: "songName_23",
        stepType: "stepType_23",
        thumbnailImgSrc: "thumbnailImgSrc_23",
      },
      {
        songName: "songName_24",
        stepType: "stepType_24",
        thumbnailImgSrc: "thumbnailImgSrc_24",
      },
      {
        songName: "songName_25",
        stepType: "stepType_25",
        thumbnailImgSrc: "thumbnailImgSrc_25",
      },
      {
        songName: "songName_26",
        stepType: "stepType_26",
        thumbnailImgSrc: "thumbnailImgSrc_26",
      },
      {
        songName: "songName_27over",
        stepType: "stepType_27over",
        thumbnailImgSrc: "thumbnailImgSrc_27over",
      },
      {
        songName: "songName_coop",
        stepType: "stepType_coop",
        thumbnailImgSrc: "thumbnailImgSrc_coop",
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
    expect(mockFetch).toHaveBeenNthCalledWith(2, "raw_url_valid");
  });
});
