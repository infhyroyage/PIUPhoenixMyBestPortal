import Image from "next/image";

export default async function Page() {
  return (
    <>
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
            <tr className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                1950
              </th>
              <td className="px-6 py-4">SINGLE</td>
              <td className="px-6 py-4">
                <Image
                  src="https://www.piugame.com/data/song_img/fba81856a34b5447cd12dc4aaf87d37a.png?v=20240307132056"
                  alt="1950"
                  width={100}
                  height={56}
                />
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
            </tr>
            <tr className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Bluish Rose
              </th>
              <td className="px-6 py-4">SINGLE</td>
              <td className="px-6 py-4">
                <Image
                  src="https://www.piugame.com/data/song_img/03b6b88c054909e454b57dd7b7dfb831.png?v=20240307132056"
                  alt="1950"
                  width={100}
                  height={56}
                />
              </td>
              <td className="px-6 py-4">990,925</td>
              <td className="px-6 py-4">
                <Image
                  src="https://www.piugame.com/l_img/grade/sss.png"
                  alt="sss"
                  width={80}
                  height={50}
                />
              </td>
              <td className="px-6 py-4">
                <Image
                  src="https://www.piugame.com/l_img/plate/mg.png"
                  alt="mg"
                  width={97}
                  height={22}
                />
              </td>
            </tr>
            <tr className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                After a thousand years
              </th>
              <td className="px-6 py-4">DOUBLE</td>
              <td className="px-6 py-4">
                <Image
                  src="https://www.piugame.com/data/song_img/79dd036b5c0341224e24dbf9bbfa96b0.png?v=20240307132056"
                  alt="1950"
                  width={100}
                  height={56}
                />
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
            </tr>
            <tr className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                After LIKE
              </th>
              <td className="px-6 py-4">DOUBLE</td>
              <td className="px-6 py-4">
                <Image
                  src="https://www.piugame.com/data/song_img/ed7e43efd28eba896f90b94ff1ebc06f.png?v=20240307132056"
                  alt="1950"
                  width={100}
                  height={56}
                />
              </td>
              <td className="px-6 py-4">995,786</td>
              <td className="px-6 py-4">
                <Image
                  src="https://www.piugame.com/l_img/grade/sss_p.png"
                  alt="sss_p"
                  width={80}
                  height={50}
                />
              </td>
              <td className="px-6 py-4">
                <Image
                  src="https://www.piugame.com/l_img/plate/mg.png"
                  alt="mg"
                  width={97}
                  height={22}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
