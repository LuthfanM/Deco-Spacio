import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deco Spacio",
  description: "A Next.js and Tailwind CSS starter for Deco Spacio.",
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
