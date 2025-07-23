import FilterScoresTable from "@/components/FilteringScoresTable";
import { getScores } from "@/services/gist";
import { Lv, Score } from "@/services/types";

export default async function Page({ 
  searchParams 
}: { 
  searchParams: { lv?: Lv } 
}) {
  const lv = searchParams.lv;
  const scores: Score[] = await getScores(lv);

  return <FilterScoresTable scores={scores} lv={lv} />;
}
