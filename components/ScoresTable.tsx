import Image from "next/image";
import { Score } from "@/services/types";

export default function ScoresTable({ scores }: { scores: Score[] }) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-xs text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-2 pl-4 pr-2">
              Song
            </th>
            <th scope="col" className="py-2 pr-4" />
            <th scope="col" className="py-2 pr-4">
              Lv.
            </th>
            <th scope="col" className="py-2 pr-2">
              Score
            </th>
            <th scope="col" className="py-2" />
            <th scope="col" className="py-2 pr-4" />
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
                className="whitespace-nowrap py-2 pl-4 pr-2 font-medium text-gray-900 dark:text-white"
              >
                {score.songName}
              </th>
              <td className="py-2 pr-4">
                <Image
                  src={score.thumbnailImgSrc}
                  alt={score.songName}
                  width={75}
                  height={42}
                />
              </td>
              <td className="py-2 pr-4">{score.stepType}</td>
              <td className="py-2 pr-2">{score.score || ""}</td>
              <td className="py-2">
                {score.gradeImgSrc && (
                  <Image
                    src={score.gradeImgSrc}
                    alt={score.songName}
                    width={60}
                    height={39}
                  />
                )}
              </td>
              <td className="py-2 pr-4">
                {score.plateImgSrc && (
                  <Image
                    src={score.plateImgSrc}
                    alt={score.songName}
                    width={146}
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
