"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Accessibility, Baby, CircleParking, CreditCard, DoorOpen, Phone, Wifi } from "lucide-react";
import { CheckerSeam } from "@/components/ui/CheckerSeam";
import { Cta } from "@/components/ui/Cta";
import { Halftone } from "@/components/ui/Halftone";
import { OpenStatus } from "@/components/ui/OpenStatus";
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

/** A stylized map: abstract streets (no invented landmarks), the shop's block in checker tiles, a star pin. */
function StylizedMap() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(26);
  const rz = useMotionValue(-9);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const srz = useSpring(rz, { stiffness: 120, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    rx.set(26 - ny * 10);
    rz.set(-9 + nx * 8);
  };
  const onLeave = () => {
    rx.set(26);
    rz.set(-9);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative aspect-[1/0.9] w-full [perspective:1300px]"
    >
      <motion.div
        style={{ rotateX: srx, rotateZ: srz }}
        className="absolute inset-[7%_4%_10%] rounded-[26px] border border-paper/12 bg-ink-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] [transform-style:preserve-3d]"
      >
        <svg viewBox="0 0 400 360" className="absolute inset-0 h-full w-full overflow-hidden rounded-[26px]" aria-hidden>
          <defs>
            <pattern id="map-checker" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
              <rect width="12" height="12" fill="#f4ecdc" opacity="0.16" />
              <rect width="6" height="6" fill="#f4ecdc" opacity="0.5" />
              <rect x="6" y="6" width="6" height="6" fill="#f4ecdc" opacity="0.5" />
            </pattern>
            <clipPath id="map-clip">
              <rect width="400" height="360" rx="26" />
            </clipPath>
          </defs>
          <g clipPath="url(#map-clip)">
            <g transform="rotate(-18 200 180)" stroke="#f4ecdc" fill="none" strokeLinecap="round">
              {[-40, 30, 100, 170, 240, 310, 380, 450].map((x) => (
                <line key={`v${x}`} x1={x} y1={-80} x2={x} y2={440} strokeOpacity={0.1} strokeWidth={5} />
              ))}
              {[-20, 50, 120, 190, 260, 330, 400].map((y) => (
                <line key={`h${y}`} x1={-80} y1={y} x2={480} y2={y} strokeOpacity={0.1} strokeWidth={5} />
              ))}
              {/* the shop's block, tiled like the shop floor */}
              <rect x={175} y={196} width={60} height={58} rx={4} fill="url(#map-checker)" stroke="none" />
              <line x1={-80} y1={190} x2={480} y2={190} strokeOpacity={0.32} strokeWidth={11} />
            </g>
            <path
              d="M-20 300 C 90 250, 150 330, 250 280 S 380 210, 430 240"
              stroke="#f4ecdc"
              strokeOpacity={0.22}
              strokeWidth={14}
              fill="none"
            />
            <path
              d="M-20 300 C 90 250, 150 330, 250 280 S 380 210, 430 240"
              stroke="#0f0b0a"
              strokeOpacity={0.9}
              strokeWidth={1.5}
              strokeDasharray="7 7"
              fill="none"
            />
          </g>
        </svg>

        {/* pin, standing up off the tilted map */}
        <div
          className="absolute top-[57%] left-[52%] [transform-style:preserve-3d]"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rose-lit/60 motion-safe:animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite]"
          />
          <div className="origin-bottom" style={{ transform: "translateY(-50%) rotateX(-62deg) rotateZ(0deg)" }}>
            <div className="flex flex-col items-center">
              <div className="grid size-16 place-items-center rounded-full bg-rose text-paper shadow-[0_14px_24px_-8px_rgb(0_0_0/0.7)] ring-4 ring-ink-2">
                <StarMark className="h-6 w-auto" />
              </div>
              <span className="h-7 w-[3px] rounded-full bg-gradient-to-b from-rose to-rose/0" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-paper/15 bg-ink/85 px-4 py-2 text-center text-sm whitespace-nowrap text-paper backdrop-blur-sm">
        <span className="font-semibold">Feel Goods</span>
        <span className="text-mute"> · {studio.street}</span>
      </div>
    </div>
  );
}

export function Visit() {
  const today = usePacificDay();

  // Monday first, the way the shop's week runs
  const order = [1, 2, 3, 4, 5, 6, 0];

  return (
    <section id="visit" className="relative z-10" aria-labelledby="visit-title">
      <CheckerSeam from="var(--color-paper)" to="var(--color-ink)" />
      <div className="grain relative overflow-hidden bg-ink text-paper">
        <Halftone
          src="/images/textures/halftone-shop-src.webp"
          color="#f4ecdc"
          alpha={0.13}
          spacing={10}
          invert
          className="inset-0 h-full w-full [mask-image:linear-gradient(180deg,transparent,black_18%,black_65%,transparent)]"
        />
        <div className="relative mx-auto max-w-[1440px] px-5 pt-12 pb-24 sm:px-8 lg:px-12 lg:pt-16 lg:pb-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <h2
                id="visit-title"
                className="text-[clamp(2.6rem,7vw,5.75rem)] leading-[0.95] font-light tracking-[-0.035em] text-balance"
              >
                <T
                  en={
                    <>
                      Come see us <strong className="font-extrabold">in Pittsburg.</strong>
                    </>
                  }
                  es={
                    <>
                      Visítanos <strong className="font-extrabold">en Pittsburg.</strong>
                    </>
                  }
                />
              </h2>

              <address className="mt-8 not-italic">
                <p className="font-display text-5xl leading-none font-extrabold uppercase sm:text-6xl">
                  {studio.street}
                </p>
                <p className="mt-2 text-lg text-mute">{studio.cityLine}</p>
              </address>
              <OpenStatus className="mt-5 text-base text-paper" />

              <div className="mt-7 flex flex-wrap gap-3">
                <Cta href={studio.mapsUrl}>
                  <T en="Get directions" es="Cómo llegar" />
                </Cta>
                <Cta href={studio.phoneHref} variant="ghost" arrow={false} external={false}>
                  <Phone aria-hidden className="size-4" />
                  <span className="tabular">{studio.phone}</span>
                </Cta>
              </div>

              <h3 className="mt-12 text-xl font-extrabold tracking-[-0.01em]">
                <T en="Hours" es="Horario" />
              </h3>
              <table className="mt-4 w-full max-w-md text-[0.98rem] tabular">
                <caption className="sr-only">
                  <T en="Opening hours, Pacific time" es="Horario de atención, hora del Pacífico" />
                </caption>
                <tbody>
                  {order.map((d) => (
                    <tr
                      key={d}
                      className={cn(
                        "border-b border-paper/10",
                        today === d ? "text-paper" : "text-mute",
                      )}
                    >
                      <th scope="row" className="py-2.5 pr-4 text-left align-top font-medium">
                        <span className="inline-flex items-center gap-2">
                          {today === d ? <span aria-hidden className="size-1.5 rounded-full bg-rose-lit" /> : null}
                          <T en={dayNames.en[d]} es={dayNames.es[d]} />
                          {today === d ? (
                            <span className="text-xs font-semibold text-rose-lit">
                              <T en="Today" es="Hoy" />
                            </span>
                          ) : null}
                        </span>
                      </th>
                      <td className={cn("py-2.5 text-right align-top", today === d && "font-semibold")}>
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
            </div>

            <div className="flex flex-col gap-10 lg:col-span-6 lg:pt-4">
              <StylizedMap />
              <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {amenities.map((a) => {
                  const Icon = icons[a.id];
                  return (
                    <li key={a.id} className="flex items-center gap-3 text-paper/90">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-paper/15 text-rose-lit">
                        <Icon aria-hidden className="size-4" />
                      </span>
                      <T en={a.en} es={a.es} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
