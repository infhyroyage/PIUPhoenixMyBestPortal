import { Suspense } from "react";
import { getScores } from "@/services/gist";
import { Lv, Score } from "@/services/types";
import ClientPage from "./ClientPage";

// Pre-fetch data for all levels
async function getAllScores() {
  const levels: Lv[] = ["20", "21", "22", "23", "24", "25", "26", "27over", "coop"];
  
  const scoresData: Record<string, Score[]> = {};
  
  // Get all scores (without lv parameter)
  scoresData.all = await getScores();
  
  // Get scores for each level
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
