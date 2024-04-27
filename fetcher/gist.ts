import { GistInfo, Lv, MyBest, Score, Step } from "../services/types";

/**
 * Create Gist Content
 * @param {Step[]} steps Fetched All Steps
 * @param {MyBest[]} myBests Fetched All My Best Scores
 * @returns {Score[]} Gist Content
 */
export function createGistContent(steps: Step[], myBests: MyBest[]): Score[] {
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
 * Upsert PIUPhoenixMyBestPortal Gist
 * @param {Score[]} scores Gist Content
 * @param {Lv} lv Query Parameter "lv"
 * @param {GistInfo[]} gistInfoList PIUPhoenixMyBestPortal Gists
 * @param {string} gistPat GutHub Personal Access Token to Read and Write Gists
 * @returns {Promise<void>}
 */
export async function upsertGist(
  scores: Score[],
  lv: Lv,
  gistInfoList: GistInfo[],
  gistPat: string,
): Promise<void> {
  // Check if PIUPhoenixMyBestPortal Gist is already created
  const filename: string = `${lv}.json`;
  const foundGist: GistInfo | undefined = gistInfoList.find(
    (gistInfo: GistInfo) =>
      gistInfo.files[filename] &&
      gistInfo.files[filename].filename === filename,
  );

  if (foundGist) {
    // Update PIUPhoenixMyBestPortal Gist
    await fetch(`https://api.github.com/gists/${foundGist.id}`, {
      body: JSON.stringify({
        description: "PIUPhoenixMyBestPortal",
        files: {
          [filename]: {
            content: JSON.stringify(scores),
            filename,
          },
        },
      }),
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${gistPat}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      method: "PATCH",
    });
  } else {
    // Create PIUPhoenixMyBestPortal Gist
    await fetch("https://api.github.com/gists", {
      body: JSON.stringify({
        description: "PIUPhoenixMyBestPortal",
        files: {
          [filename]: {
            content: JSON.stringify(scores),
          },
        },
        public: true,
      }),
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${gistPat}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      method: "POST",
    });
  }
}
