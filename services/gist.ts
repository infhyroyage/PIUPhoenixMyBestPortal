import { GistInfo, Lv } from "./types";

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
  // List All Gists
  // TODO: Pagination
  // https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28
  const res: Response = await fetch(
    "https://api.github.com/gists?per_page=100",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  // Filter PIUPhoenixMyBestPortal Gists
  return ((await res.json()) as GistInfo[]).filter((gist: GistInfo) => {
    if (gist.description !== "PIUPhoenixMyBestPortal") return false;
    if (lv) {
      const filename: string = `${lv}.json`;
      return gist.files[filename]?.filename === filename;
    } else {
      return true;
    }
  });
}
