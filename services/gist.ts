import { Octokit } from "octokit";
import { GistInfo, Lv } from "./types";
import { OctokitResponse } from "@octokit/types";

/**
 * List PIUPhoenixMyBestPortal Gists
 * @param {string} githubToken Github Access Token
 * @param {Lv} [lv] Query Parameter "lv"
 * @returns {GistInfo[]} PIUPhoenixMyBestPortal Gists
 * @see https://docs.github.com/ja/rest/gists/gists?apiVersion=2022-111-28#list-gists-for-the-authenticated-user
 */
export async function listGistInfo(
  githubToken: string,
  lv?: Lv,
): Promise<GistInfo[]> {
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
  return res.data.filter((gist: GistInfo) => {
    if (lv) {
      const jsonFileName: string = `${lv}.json`;
      return (
        gist.description === "PIUPhoenixMyBestPortal" &&
        gist.files[jsonFileName] &&
        gist.files[jsonFileName].filename === jsonFileName
      );
    } else {
      return gist.description === "PIUPhoenixMyBestPortal";
    }
  });
}
