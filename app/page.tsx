import FilterScoresTable from "@/components/FilteringScoresTable";
import { getScores } from "@/services/gist";
import { Score } from "@/services/types";

export default async function Page() {
  const scores: Score[] = await getScores();

  return <FilterScoresTable scores={scores} />;
}
