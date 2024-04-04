import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Pump It Up Phoenix My Best List",
  description: "Pump It Up Phoenix My Best List (Over Lv.20)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center bg-white dark:bg-gray-800">
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Pump It Up Phoenix My Best List
          </h1>
          <div className="my-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
