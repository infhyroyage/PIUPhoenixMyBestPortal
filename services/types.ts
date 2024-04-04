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

export type Score = {
  songName: string;
  stepType: string;
  thumbnailImgSrc: string;
  score?: string;
  gradeImgSrc?: string;
  plateImgSrc?: string;
};
