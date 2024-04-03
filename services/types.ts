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

export type StepType =
  | "SINGLE"
  | "DOUBLE"
  | "S. PERFO."
  | "D. PERFO."
  | "CO-OP";

export type Score = {
  songName: string;
  stepType: StepType;
  thumbnailImgSrc: string;
  score?: string;
  gradeImgSrc?: string;
  plateImgSrc?: string;
};

export type LvPageProps = {
  params: { lv: Lv };
};
