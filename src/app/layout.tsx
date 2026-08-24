import type { Metadata } from "next";
import { Anton, Caveat, Work_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { studio } from "@/data/business";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-script" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

export const metadata: Metadata = {
  title: `${studio.name} | Pittsburg, CA`,
  description: studio.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${caveat.variable} ${workSans.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col bg-ink text-cream">
        <div className="grain-overlay pointer-events-none fixed inset-0 z-40 opacity-[0.05]" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
