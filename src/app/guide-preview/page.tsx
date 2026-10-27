import type { Metadata } from "next";
import { GuidePreview } from "./preview";
export const metadata: Metadata = { title: "Ali avatar · animation preview", robots: { index: false, follow: false } };
export default function Page() { return <GuidePreview />; }
