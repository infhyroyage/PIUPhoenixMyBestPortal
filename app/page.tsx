import ScoresTable from "@/components/ScoresTable";
import { getScores } from "@/services/cosmos";

export default async function Page() {
  const scores = await getScores();

  return <ScoresTable scores={scores} />;
}
