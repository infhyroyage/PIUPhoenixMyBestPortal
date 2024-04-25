import { Lv, MyBest, Score, Step } from "../services/types";

/**
 * Create Items of json file in Gist
 * @param {Step[]} steps Fetched All Steps
 * @param {MyBest[]} myBests Fetched All My Best Scores
 * @returns {Score[]} All Items of json file in Gist
 */
export function createScores(steps: Step[], myBests: MyBest[]): Score[] {
  return steps.map((step: Step) => {
    const foundMyBest: MyBest | undefined = myBests.find(
      (myBest: MyBest) =>
        myBest.lv === step.lv &&
        myBest.songName === step.songName &&
        myBest.stepType === step.stepType,
    );
    return {
      ...step,
      ...(foundMyBest && {
        score: foundMyBest.score,
        gradeImgSrc: foundMyBest.gradeImgSrc,
        plateImgSrc: foundMyBest.plateImgSrc,
      }),
    };
  });
}

/**
 * Update json file in Gist
 * @param {Score[]} scores All Items of json file in Gist
 * @param {Lv} lv Query Parameter "lv"
 * @param {string} githubRepositoryOwner Github Repository Owner's Name
 * @param {string} githubToken GutHub Access Token
 */
export async function upsertScores(
  scores: Score[],
  lv: Lv,
  githubRepositoryOwner: string,
  githubToken: string,
): Promise<void> {
  // TODO
  console.log({ scores, lv, githubRepositoryOwner, githubToken });
}
