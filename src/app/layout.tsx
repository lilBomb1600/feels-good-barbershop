import type { Metadata, Viewport } from "next";
import { Archivo, Big_Shoulders, Mr_Dafoe } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CapeLoader } from "@/components/loader/CapeLoader";
import { PreviewMark } from "@/components/ui/PreviewMark";
import { Providers } from "@/lib/i18n";

const big = Big_Shoulders({ subsets: ["latin"], axes: ["opsz"], variable: "--font-big", display: "swap" });
const dafoe = Mr_Dafoe({ subsets: ["latin"], weight: "400", variable: "--font-dafoe", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });

export const metadata: Metadata = {
  title: "Feel Goods Barbershop | Pittsburg, CA",
  description:
    "Family barbershop in Pittsburg, CA since 2021. Fades, tapers, shaved designs and hot towel shaves with Johnny. 4.6 stars from 125 reviews on Booksy.",
};

export const viewport: Viewport = {
  themeColor: "#0f0b0a",
};

// Runs before first paint: picks the saved language and decides whether the cape loader plays.
const boot = `(function(){try{var d=document.documentElement;if(localStorage.getItem('fg-lang')==='es'){d.dataset.lang='es';d.lang='es';}
if(sessionStorage.getItem('fg-cape')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.cape='off';}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-lang="en"
      suppressHydrationWarning
      className={`${big.variable} ${dafoe.variable} ${archivo.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <noscript>
          <style>{`.cape-loader{display:none!important}`}</style>
        </noscript>
        <link
          rel="preload"
          as="image"
          href="/images/textures/cape-1280.webp"
          imageSrcSet="/images/textures/cape-1280.webp 1x, /images/textures/cape-1920.webp 2x"
        />
      </head>
      <body className="min-h-svh">
        <Providers>
          <CapeLoader />
          <Nav />
          <main className="overflow-x-clip">{children}</main>
          <Footer />
        </Providers>
        <PreviewMark />
      </body>
    </html>
  );
}
