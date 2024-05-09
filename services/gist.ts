import { GistInfo, Lv, Score } from "./types";

/**
 * List PIUPhoenixMyBestPortal Gists
 * @param {string} gistPat GutHub Personal Access Token to Read and Write Gists
 * @param {Lv} [lv] Query Parameter "lv"
 * @returns {GistInfo[]} PIUPhoenixMyBestPortal Gists
 * @see https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#list-gists-for-the-authenticated-user
 */
export async function listGistInfo(
  gistPat: string,
  lv?: Lv,
): Promise<GistInfo[]> {
  // List All Gists
  const gistInfoList: GistInfo[] = [];
  let url: string = "https://api.github.com/gists";
  let isRemained: boolean = true;
  while (isRemained) {
    // Get Partial Gists
    const res: Response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${gistPat}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    const data: GistInfo[] = await res.json();
    gistInfoList.push(...data);

    // Extract Next Gists Getting URL for Pagination
    const linkHeader: string | null = res.headers.get("link");
    if (!linkHeader) {
      isRemained = false;
      break;
    }
    const matchedResult: RegExpMatchArray | null = linkHeader.match(
      /(?<=<)([\S]*)(?=>; rel="next")/i,
    );
    if (!matchedResult || matchedResult.length === 0) {
      isRemained = false;
      break;
    }
    url = matchedResult[0];
  }

  // Filter PIUPhoenixMyBestPortal Gists
  return gistInfoList.filter((gist: GistInfo) => {
    if (gist.description !== "PIUPhoenixMyBestPortal") return false;
    if (lv) {
      const filename: string = `${lv}.json`;
      const files = gist.files[filename];
      return files && files.filename === filename;
    } else {
      return true;
    }
  });
}

/**
 * Get Scores from PIUPhoenixMyBestPortal Gists
 * @param {Lv} [lv] Query Parameter "lv"
 * @returns {Score[]} Scores
 */
export async function getScores(lv?: Lv): Promise<Score[]> {
  // Validation Check
  if (!process.env.GIST_PAT) {
    console.log("GIST_PAT is not set.");
    return [];
  }

  // List PIUPhoenixMyBestPortal Gists with Query Parameter "lv"
  let gistInfoList: GistInfo[] = await listGistInfo(process.env.GIST_PAT, lv);
  if (!lv) {
    // Sort Gists by filename
    gistInfoList = gistInfoList.sort((a: GistInfo, b: GistInfo) => {
      const aFiles: string[] = Object.keys(a.files);
      const aFilename: string = aFiles.length
        ? a.files[aFiles[0]].filename || ""
        : "";
      const bFiles: string[] = Object.keys(b.files);
      const bFilename: string = bFiles.length
        ? b.files[bFiles[0]].filename || ""
        : "";
      return aFilename.localeCompare(bFilename);
    });
  }

  // Get Each Gist Content from "raw_url" and Merge
  const scores: Score[] = [];
  for (const gistInfo of gistInfoList) {
    const fileKeys: string[] = Object.keys(gistInfo.files);
    if (fileKeys.length !== 1) continue;
    const rawUrl: string | undefined = gistInfo.files[fileKeys[0]]?.raw_url;
    if (!rawUrl) continue;

    const res: Response = await fetch(rawUrl);
    const scrs: Score[] = await res.json();
    scores.push(...scrs);
  }
  return scores;
}
