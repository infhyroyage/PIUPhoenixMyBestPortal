/**
 * Input Elements in FilteringSelecter
 */
export type FilteringSelecterElement = {
  /**
   * Label of Input Element
   */
  label: string;

  /**
   * Value of Input Element
   */
  value: string;
};

/**
 * Extracted Gist Information by [GET] /gist
 * @see https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#list-gists-for-the-authenticated-user
 */
export type GistInfo = {
  id: string;
  files: {
    [key: string]: {
      filename?: string;
      raw_url?: string;
    };
  };
  description?: string | null;
};

/**
 * Query Parameters "lv" of "Over Lv.20 Ranking" and "My Best Score"
 */
export type Lv =
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27over"
  | "coop";

/**
 * Fetched Step from "Over Lv.20 Ranking"
 */
export type Step = {
  /**
   * Song Name
   */
  songName: string;

  /**
   * Step Type
   * ex) "S20", "D21", "SP22", "DP23" or "CO-OPx2"
   */
  stepType: string;

  /**
   * Thumbnail Image URL of Song
   */
  thumbnailImgSrc: string;
};

/**
 * Fetched My Best from "My Best Score"
 */
export type MyBest = {
  /**
   * Song Name
   */
  songName: string;

  /**
   * Step Type
   * ex) "S20", "D21", "SP22", "DP23" or "CO-OPx2"
   */
  stepType: string;

  /**
   * My Best Score, undefined if not Played
   */
  score?: string;

  /**
   * Grade Image URL, undefined if not Played
   */
  gradeImgSrc?: string;

  /**
   * Plate Image URL, undefined if not Played
   */
  plateImgSrc?: string;
};

/**
 * My Best Score Unit
 */
export type Score = Step & MyBest;

/**
 * JSON Format of PIUPhoenixMyBestPortal Gist
 */
export type GistJson = {
  /**
   * My Best Scores of Each Query Parameter "lv"
   */
  [lv in Lv]: Score[];
};
