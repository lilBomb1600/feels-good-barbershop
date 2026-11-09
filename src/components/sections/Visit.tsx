"use client";

import { useRef } from "react";
import { Accessibility, Baby, CircleParking, CreditCard, DoorOpen, Phone, Wifi } from "lucide-react";
import { CheckerSeam } from "@/components/ui/CheckerSeam";
import { Cta, NewTab } from "@/components/ui/Cta";
import { Halftone } from "@/components/ui/Halftone";
import { Heading } from "@/components/ui/Heading";
import { DoorSign } from "@/components/ui/OpenStatus";
import { StarMark } from "@/components/ui/StarMark";
import { amenities, dayNames, schedule, studio } from "@/data/business";
import { formatTime } from "@/lib/hours";
import { usePacificDay } from "@/lib/client-stores";
import { T } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const icons = {
  walkins: DoorOpen,
  parking: CircleParking,
  wheelchair: Accessibility,
  kids: Baby,
  cards: CreditCard,
  wifi: Wifi,
} as const;

/*
 * The map is the shop floor: city blocks laid out as checker tiles, the streets are the grout,
 * the shop's own tile is rose with the star on it. Abstract on purpose: no invented street names or landmarks.
 */
const COLS = [0, 62, 118, 196, 252, 330];
const ROWS = [0, 70, 128, 206, 262];
const CW = [52, 46, 68, 46, 68, 70];
const RH = [60, 48, 68, 46, 58];
const SHOP = { c: 3, r: 2 };

function FloorMap() {
  const ref = useRef<HTMLDivElement>(null);
  // the same lamp as the hero: a pool of light follows the mouse across the tiles
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const tiles = [];
  for (let r = 0; r < ROWS.length; r++) {
    for (let c = 0; c < COLS.length; c++) {
      const shop = r === SHOP.r && c === SHOP.c;
      const light = (r + c) % 2 === 0;
      tiles.push(
        <rect
          key={`${r}-${c}`}
          x={COLS[c] + 10}
          y={ROWS[r] + 10}
          width={CW[c]}
          height={RH[r]}
          rx={3}
          fill={shop ? "#c8202f" : light ? "#f4ecdc" : "#0f0b0a"}
          fillOpacity={shop ? 1 : light ? 0.78 : 1}
          stroke={light || shop ? "none" : "rgb(244 236 220 / 0.14)"}
        />,
      );
    }
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className="group relative overflow-hidden rounded-[20px] border border-paper/12 bg-[#2a211d] [--mx:62%] [--my:56%]"
    >
      <svg viewBox="0 0 420 340" className="block h-auto w-full" aria-hidden>
        {tiles}
        {/* the one road that doesn't follow the grid */}
        <path d="M-10 318 C 110 262, 170 300, 236 236 S 360 120, 432 92" stroke="#2a211d" strokeWidth="13" fill="none" />
        <path
          d="M-10 318 C 110 262, 170 300, 236 236 S 360 120, 432 92"
          stroke="#f4ecdc"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeDasharray="6 7"
          fill="none"
        />
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(38%_44%_at_var(--mx)_var(--my),rgb(255_226_196/0.22),transparent_70%),radial-gradient(130%_90%_at_50%_120%,rgb(15_11_10/0.65),transparent_60%)]"
      />
      {/* the star pin, on the shop's tile */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full"
        style={{
          left: `${((COLS[SHOP.c] + 10 + CW[SHOP.c] / 2) / 420) * 100}%`,
          top: `${((ROWS[SHOP.r] + 10 + RH[SHOP.r] / 2) / 340) * 100}%`,
        }}
      >
        <span
          aria-hidden
          className="absolute bottom-0 left-1/2 size-14 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-rose-lit/70 motion-safe:animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite]"
        />
        <div className="flex flex-col items-center">
          <div className="grid size-14 place-items-center rounded-full bg-paper text-rose shadow-[0_14px_22px_-8px_rgb(0_0_0/0.8)] ring-4 ring-rose">
            <StarMark className="h-5 w-auto" />
          </div>
          <span className="h-5 w-[3px] rounded-full bg-paper" />
        </div>
      </div>
      <p className="absolute bottom-3 left-3 rounded-full bg-ink/90 px-3.5 py-1.5 text-sm text-paper">
        <span className="font-semibold">Feel Goods</span>
        <span className="text-mute"> · {studio.street}</span>
      </p>
    </div>
  );
}

/** The shop door: the Open / Closed card on its string, the hours lettered on the glass, stickers below. */
function Door({ className }: { className?: string }) {
  const today = usePacificDay();
  // Monday first, the way the shop's week runs
  const order = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className={cn("door-frame rounded-t-[18px] rounded-b-[8px] p-3 shadow-[0_40px_70px_-30px_rgb(0_0_0/0.9)] sm:p-4", className)}>
      <div className="door-glass relative flex flex-col items-center rounded-t-[10px] rounded-b-[4px] px-5 pt-3 pb-8 sm:px-9">
        <DoorSign />

        <h3 className="mt-7 font-script text-[2.6rem] leading-none text-paper">
          <T en="Hours" es="Horario" />
        </h3>
        <table className="mt-4 w-full max-w-[22rem] text-[0.98rem] tabular">
          <caption className="sr-only">
            <T en="Opening hours, Pacific time" es="Horario de atención, hora del Pacífico" />
          </caption>
          <tbody>
            {order.map((d) => (
              <tr key={d} className={cn(today === d ? "text-paper" : "text-mute")}>
                <th scope="row" className="py-1.5 pr-4 text-left align-top font-display text-[1.15rem] font-bold tracking-[0.04em] uppercase">
                  <span className="inline-flex items-center gap-2">
                    <T en={dayNames.en[d]} es={dayNames.es[d]} />
                    {today === d ? (
                      <span className="rounded-full bg-rose px-2 py-0.5 font-sans text-[0.7rem] font-bold tracking-normal text-paper normal-case">
                        <T en="Today" es="Hoy" />
                      </span>
                    ) : null}
                  </span>
                </th>
                <td className={cn("py-1.5 text-right align-top", today === d && "font-semibold")}>
                  {schedule[d].length ? (
                    schedule[d].map(([a, b]) => (
                      <span key={a} className="block whitespace-nowrap">
                        {formatTime(a)} – {formatTime(b)}
                      </span>
                    ))
                  ) : (
                    <T en="Closed" es="Cerrado" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 w-full max-w-[22rem] text-sm text-mute">
          <T en="Holiday closures are posted on Booksy." es="Los días festivos cerrados se publican en Booksy." />{" "}
          <a
            href={studio.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-paper underline decoration-paper/40 hover:decoration-paper"
          >
            <T en="Check Booksy" es="Ver Booksy" />
            <NewTab />
          </a>
        </p>

        {/* the push bar */}
        <div aria-hidden className="my-8 h-3 w-[86%] rounded-full bg-[linear-gradient(180deg,#f4f1ea,#8f8a84_45%,#5d5853)] shadow-[0_6px_12px_-4px_rgb(0_0_0/0.8)]" />

        {/* amenity stickers on the glass */}
        <ul className="flex flex-wrap justify-center gap-2.5">
          {amenities.map((a) => {
            const Icon = icons[a.id];
            return (
              <li
                key={a.id}
                className="inline-flex items-center gap-2 rounded-full bg-paper py-1.5 pr-3.5 pl-1.5 text-[0.88rem] font-semibold text-ink shadow-[0_6px_14px_-8px_rgb(0_0_0/0.8)]"
              >
                <span className="grid size-7 place-items-center rounded-full bg-rose text-paper">
                  <Icon aria-hidden className="size-3.5" />
                </span>
                <T en={a.en} es={a.es} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function Visit() {
  return (
    <section id="visit" className="relative z-10" aria-labelledby="visit-title">
      <div className="grain relative overflow-hidden bg-ink text-paper">
        <Halftone
          src="/images/textures/halftone-shop-src.webp"
          color="#f4ecdc"
          alpha={0.13}
          spacing={10}
          invert
          className="inset-0 h-full w-full [mask-image:linear-gradient(180deg,transparent,black_18%,black_65%,transparent)]"
        />
        <CheckerSeam from="var(--color-paper)" to="transparent" />
        <div className="relative mx-auto max-w-[1440px] px-5 pt-6 pb-24 sm:px-8 lg:px-12 lg:pt-8 lg:pb-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-14">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <Heading
                id="visit-title"
                en={{ main: "Come see us", accent: "in Pittsburg" }}
                es={{ main: "Visítanos", accent: "en Pittsburg" }}
              />
              <address className="mt-8 not-italic">
                <p className="font-display text-5xl leading-none font-extrabold uppercase sm:text-6xl">{studio.street}</p>
                <p className="mt-2 text-lg text-mute">{studio.cityLine}</p>
              </address>
              <div className="mt-7 flex flex-wrap gap-3">
                <Cta href={studio.mapsUrl}>
                  <T en="Get directions" es="Cómo llegar" />
                </Cta>
                <Cta href={studio.phoneHref} variant="ghost" arrow={false} external={false}>
                  <Phone aria-hidden className="size-4" />
                  <span className="tabular">{studio.phone}</span>
                </Cta>
              </div>
              <div className="mt-10">
                <FloorMap />
              </div>
            </div>

            <Door className="mx-auto w-full max-w-[30rem] lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:mt-4 lg:self-start" />
          </div>
        </div>
      </div>
    </section>
  );
}
