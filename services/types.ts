export type FilteringSelecterElement = {
  label: string;
  value: string;
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
   * Query Parameters "lv"
   */
  lv: Lv;

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
 * Fetched My Best Score from "My Best Score"
 */
export type MyBest = {
  /**
   * Query Parameters "lv"
   */
  lv: Lv;

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
 * Unit Item of each json file in Gist
 */
export type Score = Step & MyBest;
