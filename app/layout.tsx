import type { Metadata } from "next";
import localFont from "next/font/local";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

import "./globals.css";
import "./typography.css";

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "400 800",
  variable: "--font-manrope",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.locale} data-scroll-behavior="smooth" className={cn("h-full antialiased", inter.variable, manrope.variable)}>
      <body className="flex min-h-full flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
