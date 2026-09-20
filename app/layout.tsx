import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEWSAI — Editorial Intelligence",
  description: "A premium newswire experience that surfaces verified reporting in a clean magazine layout.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
