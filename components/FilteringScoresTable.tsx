"use client";

import { useMemo, useState } from "react";
import ScoresTable from "./ScoresTable";
import { Lv, RankOption, Score, StepOption } from "@/services/types";
import FilteringSelecter from "./FilteringSelecter";

export default function FilterScoresTable({
  scores,
  lv,
}: {
  scores: Score[];
  lv?: Lv;
}) {
  const [stepOption] = useState<StepOption>("-");
  const [rankOption] = useState<RankOption>("-");

  const stepSelectorElements = useMemo(
    () =>
      !lv
        ? [
            { label: "Single", value: "S" },
            { label: "Double", value: "D" },
            { label: "Single Performance", value: "SP" },
            { label: "Double Performance", value: "DP" },
            { label: "CO-OPx2", value: "CO-OPx2" },
            { label: "CO-OPx3", value: "CO-OPx3" },
            { label: "CO-OPx4", value: "CO-OPx4" },
            { label: "CO-OPx5", value: "CO-OPx5" },
          ]
        : lv === "coop"
          ? [
              { label: "CO-OPx2", value: "CO-OPx2" },
              { label: "CO-OPx3", value: "CO-OPx3" },
              { label: "CO-OPx4", value: "CO-OPx4" },
              { label: "CO-OPx5", value: "CO-OPx5" },
            ]
          : [
              { label: "Single", value: "S" },
              { label: "Double", value: "D" },
              { label: "Single Performance", value: "SP" },
              { label: "Double Performance", value: "DP" },
            ],
    [lv],
  );

  const filteredScores = useMemo(() => {
    return scores.filter((score: Score) => {
      if (stepOption !== "-" && !score.stepType.startsWith(stepOption)) {
        return false;
      }
      if (rankOption !== "-" && score.gradeImgSrc !== rankOption) {
        return false;
      }
      return true;
    });
  }, [scores, stepOption, rankOption]);

  return (
    <div className="mt-3 space-y-6">
      <div className="mx-auto flex max-w-sm justify-center space-x-12 md:space-x-24">
        <FilteringSelecter buttonLabel="STEP" elements={stepSelectorElements} />
        <FilteringSelecter
          buttonLabel="RANK"
          elements={[
            {
              value: "https://www.piugame.com/l_img/grade/sss_p.png",
              label: "SSS+",
            },
            {
              value: "https://www.piugame.com/l_img/grade/sss.png",
              label: "SSS",
            },
            {
              value: "https://www.piugame.com/l_img/grade/ss_p.png",
              label: "SS+",
            },
            {
              value: "https://www.piugame.com/l_img/grade/ss.png",
              label: "SS",
            },
            {
              value: "https://www.piugame.com/l_img/grade/s_p.png",
              label: "S+",
            },
            { value: "https://www.piugame.com/l_img/grade/s.png", label: "S" },
            {
              value: "https://www.piugame.com/l_img/grade/aaa_p.png",
              label: "AAA+",
            },
            {
              value: "https://www.piugame.com/l_img/grade/aaa.png",
              label: "AAA",
            },
            {
              value: "https://www.piugame.com/l_img/grade/aa_p.png",
              label: "AA+",
            },
            {
              value: "https://www.piugame.com/l_img/grade/aa.png",
              label: "AA",
            },
            {
              value: "https://www.piugame.com/l_img/grade/a_p.png",
              label: "A+",
            },
            { value: "https://www.piugame.com/l_img/grade/a.png", label: "A" },
            { value: "https://www.piugame.com/l_img/grade/b.png", label: "B" },
            { value: "https://www.piugame.com/l_img/grade/c.png", label: "C" },
            { value: "https://www.piugame.com/l_img/grade/d.png", label: "D" },
            { value: "https://www.piugame.com/l_img/grade/f.png", label: "F" },
          ]}
        />
      </div>
      <ScoresTable scores={filteredScores} />
    </div>
  );
}
