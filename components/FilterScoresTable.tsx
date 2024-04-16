"use client";

import { useMemo, useState } from "react";
import ScoresTable from "./ScoresTable";
import { Lv, RankOption, Score, StepOption } from "@/services/types";

export default function FilterScoresTable({
  scores,
  lv,
}: {
  scores: Score[];
  lv?: Lv;
}) {
  const [stepOption, setStepOption] = useState<StepOption>("-");
  const [rankOption, setRankOption] = useState<RankOption>("-");

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
      <div className="mx-auto flex max-w-sm justify-center space-x-6 md:space-x-12">
        <div className="flex flex-col">
          <label className="mb-2 text-xs font-medium text-gray-900 dark:text-white">
            STEP
          </label>
          <select
            className="rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            defaultValue="-"
            value={stepOption}
            onChange={(e) => setStepOption(e.target.value as StepOption)}
          >
            <option value="-">-</option>
            {(!lv || lv !== "coop") && (
              <>
                <option value="S">Single</option>
                <option value="D">Double</option>
                <option value="SP">Single Performance</option>
                <option value="DP">Double Performance</option>
              </>
            )}
            {(!lv || lv === "coop") && (
              <>
                <option value="CO-OPx2">CO-OPx2</option>
                <option value="CO-OPx3">CO-OPx3</option>
                <option value="CO-OPx4">CO-OPx4</option>
                <option value="CO-OPx5">CO-OPx5</option>
              </>
            )}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-xs font-medium text-gray-900 dark:text-white">
            RANK
          </label>
          <select
            className="rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            defaultValue="-"
            value={rankOption}
            onChange={(e) => setRankOption(e.target.value as RankOption)}
          >
            <option value="-">-</option>
            <option value="https://www.piugame.com/l_img/grade/sss_p.png">
              SSS+
            </option>
            <option value="https://www.piugame.com/l_img/grade/sss.png">
              SSS
            </option>
            <option value="https://www.piugame.com/l_img/grade/ss_p.png">
              SS+
            </option>
            <option value="https://www.piugame.com/l_img/grade/ss.png">
              SS
            </option>
            <option value="https://www.piugame.com/l_img/grade/s_p.png">
              S+
            </option>
            <option value="https://www.piugame.com/l_img/grade/s.png">S</option>
            <option value="https://www.piugame.com/l_img/grade/aaa_p.png">
              AAA+
            </option>
            <option value="https://www.piugame.com/l_img/grade/aaa.png">
              AAA
            </option>
            <option value="https://www.piugame.com/l_img/grade/aa_p.png">
              AA+
            </option>
            <option value="https://www.piugame.com/l_img/grade/aa.png">
              AA
            </option>
            <option value="https://www.piugame.com/l_img/grade/a_p.png">
              A+
            </option>
            <option value="https://www.piugame.com/l_img/grade/a.png">A</option>
            <option value="https://www.piugame.com/l_img/grade/b.png">B</option>
            <option value="https://www.piugame.com/l_img/grade/c.png">C</option>
            <option value="https://www.piugame.com/l_img/grade/d.png">D</option>
            <option value="https://www.piugame.com/l_img/grade/f.png">F</option>
          </select>
        </div>
      </div>
      <ScoresTable scores={filteredScores} />
    </div>
  );
}
