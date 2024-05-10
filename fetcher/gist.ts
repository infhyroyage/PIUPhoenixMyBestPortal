import { getGistInfo } from "@/services/gist";
import { GistInfo, GistJson, MyBest, Score, Step } from "@/services/types";

/**
 * Create All My Best Scores unite with Steps and My Bests
 * @param {Step[]} steps Fetched All Steps
 * @param {MyBest[]} myBests Fetched All My Bests
 * @returns {Score[]} All My Best Scores
 */
export function createScores(steps: Step[], myBests: MyBest[]): Score[] {
  return steps.map((step: Step) => {
    const foundMyBest: MyBest | undefined = myBests.find(
      (myBest: MyBest) =>
        myBest.songName === step.songName && myBest.stepType === step.stepType,
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
 * @param {GistJson} gistJson JSON Format of PIUPhoenixMyBestPortal Gist
 * @param {string} gistPat GutHub Personal Access Token to Read and Write Gists
 * @returns {Promise<void>}
 * @see https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#create-a-gist
 * @see https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#update-a-gist
 */
export async function upsertGist(
  gistJson: GistJson,
  gistPat: string,
): Promise<void> {
  const filename: string = "PIUPhoenixMyBestPortal.json";

  // Check if PIUPhoenixMyBestPortal Gist is already upserted
  const foundGistInfo: GistInfo | undefined = await getGistInfo(gistPat);
  if (foundGistInfo) {
    // Update PIUPhoenixMyBestPortal Gist
    await fetch(`https://api.github.com/gists/${foundGistInfo.id}`, {
      body: JSON.stringify({
        description: "PIUPhoenixMyBestPortal",
        files: {
          [filename]: {
            content: JSON.stringify(gistJson),
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
            content: JSON.stringify(gistJson),
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
