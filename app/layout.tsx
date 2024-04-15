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
      <body className="bg-white dark:bg-gray-800">
        <div className="flex min-h-screen flex-col items-center">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
