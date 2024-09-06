"use client";

import { FilteringSelecterElement } from "@/services/types";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function FilteringSelecter({
  buttonLabel,
  elements,
  selectedValues,
  setSelectedValues,
}: {
  buttonLabel: string;
  elements: FilteringSelecterElement[];
  selectedValues: string[];
  setSelectedValues: Dispatch<SetStateAction<string[]>>;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);

  const handleSelectElement = useCallback(
    (element: FilteringSelecterElement) => {
      if (selectedValues.includes(element.value)) {
        setSelectedValues((prev) =>
          prev.filter((value) => value !== element.value)
        );
      } else {
        setSelectedValues((prev) => [...prev, element.value]);
      }
    },
    [selectedValues, setSelectedValues]
  );

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
        className={
          selectedValues.length > 0
            ? "inline-flex items-center rounded-lg bg-purple-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            : "inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        }
        type="button"
        onClick={() => setOpen(!open)}
      >
        {buttonLabel}
        <svg
          className="ms-2.5 size-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-10 w-auto rounded-lg bg-white shadow dark:bg-gray-700">
          <div className="flex justify-around px-3 py-2">
            <button
              type="button"
              className="me-2 inline-flex items-center rounded-full bg-green-700 p-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={() =>
                setSelectedValues(
                  elements.map(
                    (element: FilteringSelecterElement) => element.value
                  )
                )
              }
            >
              <svg
                className="size-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 11.917 9.724 16.5 19 7.5"
                />
              </svg>
            </button>
            <button
              type="button"
              className="me-2 inline-flex items-center rounded-full bg-red-700 p-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              onClick={() => setSelectedValues([])}
            >
              <svg
                className="size-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </button>
          </div>
          <ul className="max-h-64 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200">
            {elements.map((element: FilteringSelecterElement, idx: number) => (
              <li key={idx}>
                <div
                  className="flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSelectElement(element)}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(element.value)}
                    value={element.value}
                    className={
                      selectedValues.length > 0
                        ? "size-4 rounded border-gray-300 bg-gray-100 text-purple-600 focus:ring-2 focus:ring-purple-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-purple-600 dark:focus:ring-offset-gray-700"
                        : "size-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                    }
                    onChange={() => handleSelectElement(element)}
                  />
                  <label className="ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300">
                    {element.label}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
