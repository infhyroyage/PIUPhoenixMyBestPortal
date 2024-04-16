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

export type RankOption =
  | "-"
  | "https://www.piugame.com/l_img/grade/sss_p.png"
  | "https://www.piugame.com/l_img/grade/sss.png"
  | "https://www.piugame.com/l_img/grade/ss_p.png"
  | "https://www.piugame.com/l_img/grade/ss.png"
  | "https://www.piugame.com/l_img/grade/sp.png"
  | "https://www.piugame.com/l_img/grade/s.png"
  | "https://www.piugame.com/l_img/grade/aaa_p.png"
  | "https://www.piugame.com/l_img/grade/aaa.png"
  | "https://www.piugame.com/l_img/grade/aa_p.png"
  | "https://www.piugame.com/l_img/grade/aa.png"
  | "https://www.piugame.com/l_img/grade/a_p.png"
  | "https://www.piugame.com/l_img/grade/a.png"
  | "https://www.piugame.com/l_img/grade/b.png"
  | "https://www.piugame.com/l_img/grade/c.png"
  | "https://www.piugame.com/l_img/grade/d.png"
  | "https://www.piugame.com/l_img/grade/f.png";

export type Score = {
  songName: string;
  stepType: string;
  thumbnailImgSrc: string;
  score?: string;
  gradeImgSrc?: string;
  plateImgSrc?: string;
};

export type StepOption =
  | "-"
  | "S"
  | "D"
  | "SP"
  | "DP"
  | "CO-OPx2"
  | "CO-OPx3"
  | "CO-OPx4"
  | "CO-OPx5";
