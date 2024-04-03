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
        <div className="flex flex-col items-center">
          <h1 className="mb-8 mt-4 text-3xl font-bold">
            Pump It Up Phoenix My Best List
          </h1>
          {children}
        </div>
      </body>
    </html>
  );
}
