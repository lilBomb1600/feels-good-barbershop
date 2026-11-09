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
    "Family barbershop in Pittsburg, CA since 2021. Fades, tapers, shaved designs and hot towel shaves with Johnny. 4.6 stars from 134 reviews on Booksy.",
};

export const viewport: Viewport = {
  themeColor: "#0f0b0a",
};

/*
 * Runs before first paint: picks the saved language and decides whether the cape loader plays.
 * It also runs the loader's clock and its Skip button, so the cape lifts on time (1.5 s after first
 * paint) and Skip works even while the page's JavaScript is still downloading on a slow phone.
 */
const boot = `(function(){try{var d=document.documentElement;
if(localStorage.getItem('fg-lang')==='es'){d.dataset.lang='es';d.lang='es';}
if(sessionStorage.getItem('fg-cape')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.cape='off';return;}
sessionStorage.setItem('fg-cape','1');d.dataset.cape='on';var up=0;
function lift(){if(up)return;up=1;d.dataset.cape='lift';setTimeout(function(){d.dataset.cape='off';},1050);}
document.addEventListener('click',function(e){var t=e.target;if(t&&t.closest&&t.closest('[data-cape-skip]'))lift();},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape')lift();},true);
requestAnimationFrame(function(){requestAnimationFrame(function(){setTimeout(lift,1500);});});
setTimeout(lift,4500);}catch(e){}})();`;

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
        {/* the cape, at the size the stylesheet will ask for (see .cape-fabric) */}
        <link
          rel="preload"
          as="image"
          href="/images/textures/cape-640.webp"
          imageSrcSet="/images/textures/cape-640.webp 1x, /images/textures/cape-1280.webp 2x"
          media="(max-width: 640px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/textures/cape-1280.webp"
          imageSrcSet="/images/textures/cape-1280.webp 1x, /images/textures/cape-1920.webp 2x"
          media="(min-width: 641px)"
          fetchPriority="high"
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
