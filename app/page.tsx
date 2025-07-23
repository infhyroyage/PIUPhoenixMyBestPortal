import { Suspense } from "react";
import { getScores } from "@/services/gist";
import { Lv, Score } from "@/services/types";
import ClientPage from "./ClientPage";

// 全レベルのデータを事前取得
async function getAllScores() {
  const levels: Lv[] = ["20", "21", "22", "23", "24", "25", "26", "27over", "coop"];
  
  const scoresData: Record<string, Score[]> = {};
  
  // 全スコアを取得（lvパラメーターなし）
  scoresData.all = await getScores();
  
  // 各レベル別のスコアを取得
  for (const lv of levels) {
    scoresData[lv] = await getScores(lv);
  }
  
  return scoresData;
}

export default async function Page() {
  const allScoresData = await getAllScores();

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[200px]"><div className="text-lg">Loading...</div></div>}>
      <ClientPage allScoresData={allScoresData} />
    </Suspense>
  );
}
