import { describe, it, beforeEach, expect, vi } from "vitest";
import { createGistContent, upsertGist } from "../../fetcher/gist";
import { MyBest, Score, Step } from "../../services/types";

describe("createGistContent", () => {
  it("Should create scores if steps and myBests are matched with lv, songName and stepType", () => {
    const steps: Step[] = [
      {
        lv: "20",
        songName: "songName1",
        stepType: "S20",
        thumbnailImgSrc: "thumbnailImgSrc1",
      },
      {
        lv: "21",
        songName: "songName2",
        stepType: "D21",
        thumbnailImgSrc: "thumbnailImgSrc2",
      },
      {
        lv: "22",
        songName: "songName3",
        stepType: "SP22",
        thumbnailImgSrc: "thumbnailImgSrc3",
      },
      {
        lv: "23",
        songName: "songName4",
        stepType: "DP23",
        thumbnailImgSrc: "thumbnailImgSrc4",
      },
      {
        lv: "coop",
        songName: "songName5",
        stepType: "COOPx2",
        thumbnailImgSrc: "thumbnailImgSrc5",
      },
    ];
    const myBests: MyBest[] = [
      {
        lv: "20",
        songName: "songName1",
        stepType: "S20",
        score: "score1",
        gradeImgSrc: "gradeImgSrc1",
        plateImgSrc: "plateImgSrc1",
      },
      {
        lv: "coop",
        songName: "songName2",
        stepType: "D21",
        score: "score2",
        gradeImgSrc: "gradeImgSrc2",
        plateImgSrc: "plateImgSrc2",
      },
      {
        lv: "22",
        songName: "dummySongName3",
        stepType: "SP22",
        score: "score3",
        gradeImgSrc: "gradeImgSrc3",
        plateImgSrc: "plateImgSrc3",
      },
      {
        lv: "23",
        songName: "songName4",
        stepType: "COOPx2",
        score: "score4",
        gradeImgSrc: "gradeImgSrc4",
        plateImgSrc: "plateImgSrc4",
      },
    ];
    const result: Score[] = createGistContent(steps, myBests);

    expect(result).toStrictEqual([
      {
        lv: "20",
        songName: "songName1",
        stepType: "S20",
        thumbnailImgSrc: "thumbnailImgSrc1",
        score: "score1",
        gradeImgSrc: "gradeImgSrc1",
        plateImgSrc: "plateImgSrc1",
      },
      {
        lv: "21",
        songName: "songName2",
        stepType: "D21",
        thumbnailImgSrc: "thumbnailImgSrc2",
      },
      {
        lv: "22",
        songName: "songName3",
        stepType: "SP22",
        thumbnailImgSrc: "thumbnailImgSrc3",
      },
      {
        lv: "23",
        songName: "songName4",
        stepType: "DP23",
        thumbnailImgSrc: "thumbnailImgSrc4",
      },
      {
        lv: "coop",
        songName: "songName5",
        stepType: "COOPx2",
        thumbnailImgSrc: "thumbnailImgSrc5",
      },
    ]);
  });
});

describe("upsertGist", () => {
  const mockFetch = vi.spyOn(global, "fetch");

  beforeEach(() => {
    vi.resetAllMocks();
    mockFetch.mockResolvedValue(new Response(JSON.stringify({})));
  });

  it("Should create PIUPhoenixMyBestPortal gist if not found", async () => {
    await upsertGist([], "20", [], "gistPat");

    expect(mockFetch).toHaveBeenCalledWith("https://api.github.com/gists", {
      body: JSON.stringify({
        description: "PIUPhoenixMyBestPortal",
        files: {
          "20.json": {
            content: "[]",
          },
        },
        public: true,
      }),
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer gistPat",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      method: "POST",
    });
  });

  it("Should update existing PIUPhoenixMyBestPortal gist if found", async () => {
    await upsertGist(
      [],
      "20",
      [
        {
          id: "foundGistId",
          files: {
            "20.json": {
              filename: "20.json",
            },
          },
        },
      ],
      "gistPat",
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.github.com/gists/foundGistId`,
      {
        body: JSON.stringify({
          description: "PIUPhoenixMyBestPortal",
          files: {
            "20.json": {
              content: "[]",
              filename: "20.json",
            },
          },
        }),
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: "Bearer gistPat",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        method: "PATCH",
      },
    );
  });
});
