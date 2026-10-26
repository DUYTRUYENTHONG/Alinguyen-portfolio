import type { Metadata } from "next";
import localFont from "next/font/local";
import { identity } from "@/data/portfolio";
import { PortfolioExperienceProvider } from "./experience";
import { PortfolioSignalsProvider } from "./portfolio-signals";
import "@fontsource-variable/archivo";
import "@fontsource-variable/inter";
import "./styles.css";
import "./guide-assistant.css";
import "./guide-motion.css";

// Preload the existing Latin faces with metric-adjusted fallbacks. Fontsource
// remains available for the existing Vietnamese and extended character subsets.
const inter = localFont({ src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
const archivo = localFont({ src: "../../node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2", variable: "--font-archivo", weight: "100 900", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(new URL(siteUrl).origin),
  title: `${identity.name} | ${identity.title}`,
  description: identity.proposition,
  applicationName: `${identity.name} Portfolio`,
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/duytruyenthong-logo.png`, apple: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/duytruyenthong-logo.png` },
  openGraph: {
    title: `${identity.name} | ${identity.title}`,
    description: identity.proposition,
    type: "website",
    siteName: identity.brand,
  },
  robots: { index: Boolean(process.env.NEXT_PUBLIC_SITE_URL), follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`}>
      <body><PortfolioSignalsProvider><PortfolioExperienceProvider>{children}</PortfolioExperienceProvider></PortfolioSignalsProvider></body>
    </html>
  );
}
