import { GistInfo, GistJson, Lv, Score } from "./types";

/**
 * Get PIUPhoenixMyBestPortal Gist Information
 * @param {string} gistPat GutHub Personal Access Token to Read and Write Gists
 * @returns {GistInfo | undefined} PIUPhoenixMyBestPortal Gist, undefined if not found
 * @see https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#list-gists-for-the-authenticated-user
 */
export async function getGistInfo(
  gistPat: string,
): Promise<GistInfo | undefined> {
  // List All Gist Information
  const gistInfoList: GistInfo[] = [];
  let url: string = "https://api.github.com/gists";
  let isRemained: boolean = true;
  while (isRemained) {
    // Get Partial Gist Information
    const res: Response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${gistPat}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    const data: GistInfo[] = await res.json();
    gistInfoList.push(...data);

    // Extract Next Gist Information Getting URL for Pagination
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

  // Filter only PIUPhoenixMyBestPortal Gist Information
  const filename: string = "PIUPhoenixMyBestPortal.json";
  return gistInfoList.find(
    (gistInfo: GistInfo) =>
      gistInfo.files[filename] &&
      gistInfo.files[filename].filename === filename &&
      gistInfo.description === "PIUPhoenixMyBestPortal",
  );
}

/**
 * Get My Best Scores from PIUPhoenixMyBestPortal Gists
 * @param {Lv} [lv] Query Parameter "lv"
 * @returns {Score[]} My Best Scores
 */
export async function getScores(lv?: Lv): Promise<Score[]> {
  // Validation Check
  if (!process.env.GIST_PAT) {
    console.log("GIST_PAT is not set.");
    return [];
  }

  // Get PIUPhoenixMyBestPortal Gist Information
  const gistInfo: GistInfo | undefined = await getGistInfo(
    process.env.GIST_PAT,
  );
  if (!gistInfo) return [];

  // Get PIUPhoenixMyBestPortal Gist
  const fileKeys: string[] = Object.keys(gistInfo.files);
  if (fileKeys.length !== 1) return [];
  const rawUrl: string | undefined = gistInfo.files[fileKeys[0]]?.raw_url;
  if (!rawUrl) return [];
  const res: Response = await fetch(rawUrl);
  const gistJson: GistJson = await res.json();

  // Filter by "lv"
  return lv
    ? gistJson[lv]
    : Object.keys(gistJson).reduce(
        (acc: Score[], lv: string) => [...acc, ...gistJson[lv as Lv]],
        [] as Score[],
      );
}
