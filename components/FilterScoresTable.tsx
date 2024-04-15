import ScoresTable from "./ScoresTable";
import { Score } from "@/services/types";

export default function FilterScoresTable({ scores }: { scores: Score[] }) {
  return (
    <div className="mt-3 space-y-6">
      <div className="mx-auto flex max-w-sm flex-row space-x-8">
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Lv.
          </label>
          <select className="rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
            <option selected value="-">
              -
            </option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Single Performance">Single Performance</option>
            <option value="Double Performance">Double Performance</option>
            <option value="CO-OPx2">CO-OPx2</option>
            <option value="CO-OPx3">CO-OPx3</option>
            <option value="CO-OPx4">CO-OPx4</option>
            <option value="CO-OPx5">CO-OPx5</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Rank
          </label>
          <select className="rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
            <option selected value="-">
              -
            </option>
            <option value="SSSP">SSS+</option>
            <option value="SSS">SSS</option>
            <option value="SSP">SS+</option>
            <option value="SS">SS</option>
            <option value="SP">S+</option>
            <option value="S">S</option>
            <option value="AAAP">AAA+</option>
            <option value="AAA">AAA</option>
            <option value="AAP">AA+</option>
            <option value="AA">AA</option>
            <option value="AP">A+</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
        </div>
      </div>
      <ScoresTable scores={scores} />
    </div>
  );
}
