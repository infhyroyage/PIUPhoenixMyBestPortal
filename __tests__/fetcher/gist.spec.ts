import { describe, it, beforeEach, expect, vi, Mock } from "vitest";
import { createScores, upsertGist } from "../../fetcher/gist";
import { GistJson, MyBest, Score, Step } from "../../services/types";
import { getGistInfo } from "../../services/gist";

describe("createScores", () => {
  it("Should create scores if steps and myBests are matched with songName and stepType", () => {
    const steps: Step[] = [
      {
        songName: "songName1",
        stepType: "S20",
        thumbnailImgSrc: "thumbnailImgSrc1",
      },
      {
        songName: "songName2",
        stepType: "D20",
        thumbnailImgSrc: "thumbnailImgSrc2",
      },
      {
        songName: "songName3",
        stepType: "SP20",
        thumbnailImgSrc: "thumbnailImgSrc3",
      },
      {
        songName: "songName4",
        stepType: "DP20",
        thumbnailImgSrc: "thumbnailImgSrc4",
      },
    ];
    const myBests: MyBest[] = [
      {
        songName: "songName1",
        stepType: "S20",
        score: "score1",
        gradeImgSrc: "gradeImgSrc1",
        plateImgSrc: "plateImgSrc1",
      },
      {
        songName: "dummy",
        stepType: "D20",
        score: "score2",
        gradeImgSrc: "gradeImgSrc2",
        plateImgSrc: "plateImgSrc2",
      },
      {
        songName: "songName3",
        stepType: "dummy",
        score: "score3",
        gradeImgSrc: "gradeImgSrc3",
        plateImgSrc: "plateImgSrc3",
      },
    ];
    const result: Score[] = createScores(steps, myBests);

    expect(result).toStrictEqual([
      {
        songName: "songName1",
        stepType: "S20",
        thumbnailImgSrc: "thumbnailImgSrc1",
        score: "score1",
        gradeImgSrc: "gradeImgSrc1",
        plateImgSrc: "plateImgSrc1",
      },
      {
        songName: "songName2",
        stepType: "D20",
        thumbnailImgSrc: "thumbnailImgSrc2",
      },
      {
        songName: "songName3",
        stepType: "SP20",
        thumbnailImgSrc: "thumbnailImgSrc3",
      },
      {
        songName: "songName4",
        stepType: "DP20",
        thumbnailImgSrc: "thumbnailImgSrc4",
      },
    ]);
  });
});

describe("upsertGist", () => {
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

  const mockFetch = vi.spyOn(global, "fetch");
  vi.mock("../../services/gist");

  beforeEach(() => {
    vi.resetAllMocks();
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({})));
  });

  it("Should create PIUPhoenixMyBestPortal gist if not found", async () => {
    (getGistInfo as Mock).mockResolvedValueOnce(undefined);

    await upsertGist(mockGistJson, "GIST_PAT");

    expect(mockFetch).toHaveBeenCalledWith("https://api.github.com/gists", {
      body: JSON.stringify({
        description: "PIUPhoenixMyBestPortal",
        files: {
          "PIUPhoenixMyBestPortal.json": {
            content: JSON.stringify(mockGistJson),
          },
        },
        public: true,
      }),
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer GIST_PAT",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      method: "POST",
    });
  });

  it("Should update existing PIUPhoenixMyBestPortal gist if found", async () => {
    (getGistInfo as Mock).mockResolvedValueOnce({
      id: "foundGistInfoId",
      files: {},
    });

    await upsertGist(mockGistJson, "GIST_PAT");

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.github.com/gists/foundGistInfoId`,
      {
        body: JSON.stringify({
          description: "PIUPhoenixMyBestPortal",
          files: {
            "PIUPhoenixMyBestPortal.json": {
              content: JSON.stringify(mockGistJson),
              filename: "PIUPhoenixMyBestPortal.json",
            },
          },
        }),
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: "Bearer GIST_PAT",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        method: "PATCH",
      },
    );
  });
});
