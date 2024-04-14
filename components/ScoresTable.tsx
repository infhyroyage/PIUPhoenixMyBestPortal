import Image from "next/image";
import { Score } from "@/services/types";

export default function ScoresTable({ scores }: { scores: Score[] }) {
  return (
    <div className="relative overflow-x-auto rounded-lg shadow-md">
      <table className="text-left text-xs text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th
              scope="col"
              className="max-w-32 py-2 pl-1 pr-1 md:max-w-96 md:pl-4 md:pr-2"
            >
              Song
            </th>
            <th scope="col" className="py-2 pr-1 md:pr-4" />
            <th scope="col" className="py-2 pr-1 md:pr-4">
              Lv.
            </th>
            <th scope="col" className="py-2 pr-1 md:pr-4">
              Score
            </th>
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
                className="max-w-32 overflow-hidden text-ellipsis py-2 pl-1 pr-1 font-medium text-gray-900 md:max-w-96 md:pl-4 md:pr-2 dark:text-white"
              >
                {score.songName}
              </th>
              <td className="py-2 pr-1 md:pr-4">
                <Image
                  src={score.thumbnailImgSrc}
                  alt={score.songName}
                  width={(48 * 700) / 393}
                  height={48}
                />
              </td>
              <td className="py-2 pr-1 md:pr-4">{score.stepType}</td>
              <td className="py-2 pr-1 md:pr-4">
                <div>
                  <div className="h-4 text-center">{score.score || ""}</div>
                  <div className="mt-2 flex">
                    <div className="relative h-6 w-auto min-w-[calc(24px*289/130)]">
                      {score.gradeImgSrc && (
                        <Image
                          src={score.gradeImgSrc}
                          alt={score.songName}
                          layout="fill"
                          objectFit="contain"
                        />
                      )}
                    </div>
                    <div className="relative h-6 w-auto min-w-[calc(24px*291/66)]">
                      {score.plateImgSrc && (
                        <Image
                          src={score.plateImgSrc}
                          alt={score.songName}
                          layout="fill"
                          objectFit="contain"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
