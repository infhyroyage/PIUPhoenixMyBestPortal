import type { Metadata } from "next";
import { Suspense } from "react";

import "./globals.css";
import NavBar from "../components/NavBar";

export const metadata: Metadata = {
  title: "Phoenix My Best List",
  description: "Pump It Up Phoenix My Best List (Over Lv.20)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-800">
        <div className="flex min-h-screen flex-col items-center">
          <Suspense fallback={
            <nav className="w-full border-gray-200 bg-white dark:bg-gray-900">
              <div className="mx-auto flex max-w-(--breakpoint-xl) items-center justify-between p-4">
                <span className="self-center truncate whitespace-nowrap text-2xl font-semibold dark:text-white">
                  Phoenix My Best List
                </span>
              </div>
            </nav>
          }>
            <NavBar />
          </Suspense>
          {children}
        </div>
      </body>
    </html>
  );
}
