import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PathQuest",
  description: "Algo Pathfinder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
