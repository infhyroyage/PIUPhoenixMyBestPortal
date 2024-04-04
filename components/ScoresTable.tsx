import Image from "next/image";
import { Score } from "@/services/types";

export default function ScoresTable({ scores }: { scores: Score[] }) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Song
            </th>
            <th scope="col" className="px-6 py-3">
              Lv.
            </th>
            <th scope="col" className="px-6 py-3" />
            <th scope="col" className="px-6 py-3">
              Score
            </th>
            <th scope="col" className="px-6 py-3" />
            <th scope="col" className="px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {scores.map((score: Score) => (
            <tr
              key={`${score.songName}-${score.stepType}`}
              className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                {score.songName}
              </th>
              <td className="px-6 py-4">{score.stepType}</td>
              <td className="px-6 py-4">
                <Image
                  src={score.thumbnailImgSrc}
                  alt={score.songName}
                  width={100}
                  height={56}
                />
              </td>
              <td className="px-6 py-4">{score.score || ""}</td>
              <td className="px-6 py-4">
                {score.gradeImgSrc && (
                  <Image
                    src={score.gradeImgSrc}
                    alt={score.songName}
                    width={80}
                    height={50}
                  />
                )}
              </td>
              <td className="px-6 py-4">
                {score.plateImgSrc && (
                  <Image
                    src={score.plateImgSrc}
                    alt={score.songName}
                    width={145.5}
                    height={33}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
