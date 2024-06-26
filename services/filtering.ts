import { FilteringSelecterElement, Lv, Score } from "./types";

/**
 * Create Input Elements in FilteringSelecter
 * @param {Lv} [lv] Query Parameter "lv"
 * @returns {FilteringSelecterElement[]} Input Elements
 */
export function createStepSelectorElements(
  lv?: Lv,
): FilteringSelecterElement[] {
  return !lv
    ? [
        { label: "Single", value: "S" },
        { label: "Double", value: "D" },
        { label: "Single Performance", value: "SP" },
        { label: "Double Performance", value: "DP" },
        { label: "CO-OPx2", value: "CO-OPx2" },
        { label: "CO-OPx3", value: "CO-OPx3" },
        { label: "CO-OPx4", value: "CO-OPx4" },
        { label: "CO-OPx5", value: "CO-OPx5" },
      ]
    : lv === "coop"
      ? [
          { label: "CO-OPx2", value: "CO-OPx2" },
          { label: "CO-OPx3", value: "CO-OPx3" },
          { label: "CO-OPx4", value: "CO-OPx4" },
          { label: "CO-OPx5", value: "CO-OPx5" },
        ]
      : [
          { label: "Single", value: "S" },
          { label: "Double", value: "D" },
          { label: "Single Performance", value: "SP" },
          { label: "Double Performance", value: "DP" },
        ];
}

/**
 * Filter Original My Best Scores Gotton from PIUPhoenixMyBestPortal Gists
 * @param {Score[]} scores Original My Best Scores
 * @param {string[]} selectedStepValues Selected Step Values in FilteringSelecter
 * @param {string[]} selectedRankValues Selected Rank Values in FilteringSelecter
 * @returns {Score[]} Filtered My Best Scores
 */
export function createFilteredScores(
  scores: Score[],
  selectedStepValues: string[],
  selectedRankValues: string[],
): Score[] {
  return scores.filter((score: Score) => {
    // Exclude Scores with Step Type
    if (
      selectedStepValues.length > 0 &&
      !selectedStepValues.find((value: string) =>
        score.stepType.startsWith(value),
      )
    ) {
      return false;
    }

    // Exclude Scores with Rank
    if (
      selectedRankValues.length > 0 &&
      !selectedRankValues.includes(score.gradeImgSrc ?? "")
    ) {
      return false;
    }

    return true;
  });
}
