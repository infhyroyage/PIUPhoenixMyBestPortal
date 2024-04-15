import ScoresTable from "@/components/ScoresTable";
import { getScores } from "@/services/cosmos";
import { Score } from "@/services/types";

export default async function Page() {
  const scores: Score[] = await getScores();

  return <ScoresTable scores={scores} />;
}
