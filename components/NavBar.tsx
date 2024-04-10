"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const pathname: string = usePathname();

  return (
    <nav className="w-full border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
        <div className="flex flex-1 items-center justify-between">
          <span className="self-center truncate whitespace-nowrap text-2xl font-semibold dark:text-white">
            Phoenix My Best List
          </span>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-1 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isOpenMenu}
            onClick={() => setIsOpenMenu(!isOpenMenu)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-6 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
            <li>
              <Link
                href="/"
                className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
              >
                All
              </Link>
            </li>
            <li>
              <Link
                href="/20"
                className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/20" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
              >
                20
              </Link>
            </li>
            <li>
              <Link
                href="/21"
                className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/21" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
              >
                21
              </Link>
            </li>
            <li>
              <Link
                href="/22"
                className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/22" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
              >
                22
              </Link>
            </li>
            <li>
              <Link
                href="/23"
                className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/23" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
              >
                23
              </Link>
            </li>
            <li>
              <Link
                href="/24"
                className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/24" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
              >
                24
              </Link>
            </li>
            <li>
              <Link
                href="/25"
                className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/25" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
              >
                25
              </Link>
            </li>
            <li>
              <Link
                href="/26"
                className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/26" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
              >
                26
              </Link>
            </li>
            <li>
              <Link
                href="/27over"
                className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/27over" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
              >
                Over 27
              </Link>
            </li>
            <li>
              <Link
                href="/coop"
                className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/coop" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
              >
                CO-OP
              </Link>
            </li>
          </ul>
        </div>
        {isOpenMenu && (
          <div
            className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 md:hidden"
            id="navbar-default"
            onClick={() => setIsOpenMenu(false)}
          >
            <div
              className="mt-4 flex transform flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <ul>
                <li>
                  <Link
                    href="/"
                    className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
                  >
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    href="/20"
                    className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/20" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
                  >
                    20
                  </Link>
                </li>
                <li>
                  <Link
                    href="/21"
                    className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/21" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
                  >
                    21
                  </Link>
                </li>
                <li>
                  <Link
                    href="/22"
                    className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/22" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
                  >
                    22
                  </Link>
                </li>
                <li>
                  <Link
                    href="/23"
                    className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/23" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
                  >
                    23
                  </Link>
                </li>
                <li>
                  <Link
                    href="/24"
                    className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/24" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
                  >
                    24
                  </Link>
                </li>
                <li>
                  <Link
                    href="/25"
                    className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/25" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
                  >
                    25
                  </Link>
                </li>
                <li>
                  <Link
                    href="/26"
                    className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/26" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
                  >
                    26
                  </Link>
                </li>
                <li>
                  <Link
                    href="/27over"
                    className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/27over" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
                  >
                    Over 27
                  </Link>
                </li>
                <li>
                  <Link
                    href="/coop"
                    className={`block rounded px-3 py-2 md:p-0 dark:text-white ${pathname === "/coop" ? "bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"}`}
                  >
                    CO-OP
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
