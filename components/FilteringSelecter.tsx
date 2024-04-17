"use client";

import { useEffect, useRef, useState } from "react";

export default function FilteringSelecter({
  buttonLabel,
  elements,
}: {
  buttonLabel: string;
  elements: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col" ref={divRef}>
      <button
        className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setOpen(!open)}
      >
        {buttonLabel}
        <svg
          className="ms-2.5 h-2.5 w-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-10 w-auto rounded-lg bg-white shadow dark:bg-gray-700">
          <ul className="max-h-64 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200">
            {elements.map(
              (
                { value, label }: { value: string; label: string },
                idx: number,
              ) => (
                <li key={idx}>
                  <div className="flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      type="checkbox"
                      value={value}
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                    />
                    <label className="ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300">
                      {label}
                    </label>
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
