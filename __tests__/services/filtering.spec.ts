import { describe, it, expect } from "vitest";
import {
  createStepSelectorElements,
  createFilteredScores,
} from "../../services/filtering";
import { Score } from "../../services/types";

describe("createStepSelectorElements", () => {
  it("Should return all elements", () => {
    const result = createStepSelectorElements();
    expect(result).toStrictEqual([
      { label: "Single", value: "S" },
      { label: "Double", value: "D" },
      { label: "Single Performance", value: "SP" },
      { label: "Double Performance", value: "DP" },
      { label: "CO-OPx2", value: "CO-OPx2" },
      { label: "CO-OPx3", value: "CO-OPx3" },
      { label: "CO-OPx4", value: "CO-OPx4" },
      { label: "CO-OPx5", value: "CO-OPx5" },
    ]);
  });

  it("Should return 'coop' level elements", () => {
    const result = createStepSelectorElements("coop");
    expect(result).toStrictEqual([
      { label: "CO-OPx2", value: "CO-OPx2" },
      { label: "CO-OPx3", value: "CO-OPx3" },
      { label: "CO-OPx4", value: "CO-OPx4" },
      { label: "CO-OPx5", value: "CO-OPx5" },
    ]);
  });

  it("Should return '27over' level elements", () => {
    const result = createStepSelectorElements("27over");
    expect(result).toStrictEqual([
      { label: "Single", value: "S" },
      { label: "Double", value: "D" },
      { label: "Single Performance", value: "SP" },
      { label: "Double Performance", value: "DP" },
    ]);
  });
});

describe("createFilteredScores", () => {
  const mockScores: Score[] = [
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
      stepType: "D21",
      thumbnailImgSrc: "thumbnailImgSrc2",
      score: "score2",
      gradeImgSrc: "gradeImgSrc2",
      plateImgSrc: "plateImgSrc2",
    },
    {
      songName: "songName3",
      stepType: "D28",
      thumbnailImgSrc: "thumbnailImgSrc3",
    },
    {
      songName: "songName4",
      stepType: "CO-OPx2",
      thumbnailImgSrc: "thumbnailImgSrc4",
      score: "score4",
      gradeImgSrc: "gradeImgSrc4",
      plateImgSrc: "plateImgSrc4",
    },
  ];

  it("Should return all scores", () => {
    const result = createFilteredScores(mockScores, [], []);
    expect(result).toStrictEqual(mockScores);
  });

  it("Should return scores filtered by step type", () => {
    const result = createFilteredScores(mockScores, ["S"], []);
    expect(result).toStrictEqual([
      {
        songName: "songName1",
        stepType: "S20",
        thumbnailImgSrc: "thumbnailImgSrc1",
        score: "score1",
        gradeImgSrc: "gradeImgSrc1",
        plateImgSrc: "plateImgSrc1",
      },
    ]);
  });

  it("Should return scores filtered by grade image source", () => {
    const result = createFilteredScores(mockScores, [], ["", "gradeImgSrc1"]);
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
        songName: "songName3",
        stepType: "D28",
        thumbnailImgSrc: "thumbnailImgSrc3",
      },
    ]);
  });
});
