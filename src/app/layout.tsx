import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond, Noto_Sans_Khmer } from "next/font/google";
import { basePath } from "@/lib";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const khmer = Noto_Sans_Khmer({ subsets: ["khmer"], weight: "400", variable: "--font-khmer", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sometheasiekswx.github.io";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Proof Pizza Bar & Cafe | Neapolitan Pizza in Kep, Cambodia",
  description: "A little Naples. A little Kep. Neapolitan pizza, cocktails and coffee near Kep Main Beach, Cambodia. Open daily, 11am–9pm.",
  alternates: { canonical: `${basePath}/` },
  openGraph: { title: "Proof — Pizza by the sea", description: "Neapolitan soul. Cambodian coast. Pizza, bar & café in Kep.", type: "website", url: `${basePath}/`, images: [{ url: `${basePath}/images/pizza.jpg`, width: 1800, height: 1200, alt: "Illustrative Neapolitan pizza photography" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: `${basePath}/icon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable} ${khmer.variable}`}><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
