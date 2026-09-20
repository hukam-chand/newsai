import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://uhnews.vercel.app"),
  title: {
    default: "UHNEWS | Live Breaking News & Analysis",
    template: "%s | UHNEWS",
  },
  description:
    "UHNEWS delivers trusted global and local news coverage, expert analysis, and daily headlines in a clean editorial format.",
  applicationName: "UHNEWS",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UHNEWS",
  },
  alternates: {
    canonical: "/",
  },
  keywords: [
    "UHNEWS",
    "news",
    "breaking news",
    "headlines",
    "world news",
    "live updates",
  ],
  openGraph: {
    title: "UHNEWS | Live Breaking News & Analysis",
    description:
      "UHNEWS delivers trusted global and local news coverage, expert analysis, and daily headlines in a clean editorial format.",
    siteName: "UHNEWS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UHNEWS | Live Breaking News & Analysis",
    description:
      "UHNEWS delivers trusted global and local news coverage, expert analysis, and daily headlines in a clean editorial format.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f1ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
