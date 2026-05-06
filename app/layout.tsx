import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import "./globals.css";
import { site } from "@/lib/data";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { Cursor } from "@/components/layout/Cursor";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { KeyboardShortcuts } from "@/components/layout/KeyboardShortcuts";
import { JsonLd } from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — AI for Good`,
    template: `%s | ${site.name} — AI for Good`,
  },
  description: site.description,
  applicationName: `${site.name} — AI for Good`,
  keywords: [
    "AI for Good",
    "Impact through Innovation",
    site.name,
    "AI portfolio",
    "Indian student AI",
    "edge ML",
    "civic tech",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: `${site.name} — AI for Good`,
    title: `${site.name} — AI for Good`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — AI for Good`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  description: site.mission,
  url: site.url,
  jobTitle: "Student & AI builder",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressLocality: site.location.split(",")[0].trim(),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-black text-white antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={personJsonLd} />
        <SmoothScroll />
        <Nav />
        <Cursor />
        <CommandMenu />
        <KeyboardShortcuts />
        <main id="main">{children}</main>
        <Toaster position="bottom-right" duration={2500} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
