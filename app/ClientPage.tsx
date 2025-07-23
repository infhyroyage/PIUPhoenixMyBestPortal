"use client";

import { useSearchParams } from "next/navigation";
import FilterScoresTable from "@/components/FilteringScoresTable";
import { Lv, Score } from "@/services/types";

interface ClientPageProps {
  allScoresData: Record<string, Score[]>;
}

export default function ClientPage({ allScoresData }: ClientPageProps) {
  const searchParams = useSearchParams();
  const lv = searchParams.get("lv") as Lv | null;
  
  // Select appropriate data based on query parameters
  const scores = lv ? allScoresData[lv] || [] : allScoresData.all || [];

  return <FilterScoresTable scores={scores} lv={lv || undefined} />;
}