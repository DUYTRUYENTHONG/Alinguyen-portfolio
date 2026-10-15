import type { Metadata } from "next";
import { identity } from "@/data/portfolio";
import { PortfolioExperienceProvider } from "./experience";
import "@fontsource-variable/archivo";
import "@fontsource-variable/inter";
import "./styles.css";

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
    <html lang="en">
      <body><PortfolioExperienceProvider>{children}</PortfolioExperienceProvider></body>
    </html>
  );
}
