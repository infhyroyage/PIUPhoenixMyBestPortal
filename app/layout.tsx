import type { Metadata } from "next";

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
      <body>
        <div className="flex min-h-screen flex-col items-center bg-white dark:bg-gray-800">
          <NavBar />
          <div className="my-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
