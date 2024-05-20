"use client";

import { useMemo, useState } from "react";
import {
  createFilteredScores,
  createStepSelectorElements,
} from "@/services/filtering";
import { FilteringSelecterElement, Lv, Score } from "@/services/types";
import ScoresTable from "./ScoresTable";
import FilteringSelecter from "./FilteringSelecter";

export default function FilterScoresTable({
  scores,
  lv,
}: {
  scores: Score[];
  lv?: Lv;
}) {
  const [selectedStepValues, setSelectedStepValues] = useState<string[]>([]);
  const [selectedRankValues, setSelectedRankValues] = useState<string[]>([]);

  const stepSelectorElements = useMemo<FilteringSelecterElement[]>(
    () => createStepSelectorElements(lv),
    [lv],
  );
  const filteredScores: Score[] = useMemo(
    () => createFilteredScores(scores, selectedStepValues, selectedRankValues),
    [scores, selectedStepValues, selectedRankValues],
  );

  return (
    <div className="mt-3 space-y-6">
      <div className="mx-auto flex max-w-sm justify-center space-x-12 md:space-x-24">
        <FilteringSelecter
          buttonLabel="STEP"
          elements={stepSelectorElements}
          selectedValues={selectedStepValues}
          setSelectedValues={setSelectedStepValues}
        />
        <FilteringSelecter
          buttonLabel="RANK"
          elements={[
            { value: "", label: "Not Cleared" },
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
          selectedValues={selectedRankValues}
          setSelectedValues={setSelectedRankValues}
        />
      </div>
      <ScoresTable scores={filteredScores} />
    </div>
  );
}
