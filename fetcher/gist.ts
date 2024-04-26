import { Octokit } from "octokit";
import { GistInfo, Lv, MyBest, Score, Step } from "../services/types";
import { OctokitResponse } from "@octokit/types";

/**
 * List PIUPhoenixMyBestPortal Gists
 * @param {string} githubToken Github Access Token
 * @returns {GistInfo[]} PIUPhoenixMyBestPortal Gists
 * @see https://docs.github.com/ja/rest/gists/gists?apiVersion=2022-11-28#list-gists-for-the-authenticated-user
 */
export async function listGistInfo(githubToken: string): Promise<GistInfo[]> {
  const octokit = new Octokit({
    auth: githubToken,
  });

  // List All Gists
  // TODO: Pagination
  // https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28
  const res: OctokitResponse<GistInfo[]> = await octokit.request("GET /gists", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
    per_page: 100,
    graphql_query: `query {
    viewer {
      gists(first: 100) {
        nodes {
          id
          files {
            filename
            raw_url
          }
        }
      }
    }
    }`,
  });

  // Filter PIUPhoenixMyBestPortal Gists
  return res.data.filter(
    (gist: GistInfo) => gist.description === "PIUPhoenixMyBestPortal",
  );
}

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
 * @param {string} githubToken GutHub Access Token
 */
export async function upsertGist(
  scores: Score[],
  lv: Lv,
  gistInfoList: GistInfo[],
  githubToken: string,
): Promise<void> {
  // Check if PIUPhoenixMyBestPortal Gist is already created
  const jsonFileName: string = `${lv}.json`;
  const foundGist: GistInfo | undefined = gistInfoList.find(
    (gistInfo: GistInfo) =>
      gistInfo.files[jsonFileName] &&
      gistInfo.files[jsonFileName].filename === jsonFileName,
  );

  const octokit = new Octokit({
    auth: githubToken,
  });
  if (foundGist) {
    // Update PIUPhoenixMyBestPortal Gist
    await octokit.request("PATCH /gists/{gist_id}", {
      description: "PIUPhoenixMyBestPortal",
      files: {
        [jsonFileName]: {
          content: JSON.stringify(scores),
        },
      },
      gist_id: foundGist.id,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } else {
    // Create PIUPhoenixMyBestPortal Gist
    await octokit.request("POST /gists", {
      description: "PIUPhoenixMyBestPortal",
      files: {
        [jsonFileName]: {
          content: JSON.stringify(scores),
        },
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      public: true,
    });
  }
}
