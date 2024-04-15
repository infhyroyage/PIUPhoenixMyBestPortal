import FilterScoresTable from "@/components/FilterScoresTable";
import { getScores } from "@/services/cosmos";
import { Lv, Score } from "@/services/types";

export function generateStaticParams(): { lv: Lv }[] {
  return [
    { lv: "20" },
    { lv: "21" },
    { lv: "22" },
    { lv: "23" },
    { lv: "24" },
    { lv: "25" },
    { lv: "26" },
    { lv: "27over" },
    { lv: "coop" },
  ];
}

export default async function Page({ params }: { params: { lv: Lv } }) {
  const scores: Score[] = await getScores(params.lv);

  return <FilterScoresTable scores={scores} />;
}
