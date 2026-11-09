import { dayNames, schedule } from "@/data/business";
import type { Lang } from "@/lib/i18n";

const TZ = "America/Los_Angeles";

/** Day of week (0 = Sunday) and minutes after midnight in Pittsburg, CA. */
export function pacificNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function formatTime(min: number) {
  const h24 = Math.floor(min / 60);
  const m = min % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
}

/** "a la 1:00 PM" vs "a las 7:30 PM" */
const esAt = (min: number) => {
  const h = Math.floor(min / 60) % 12;
  return `${h === 1 ? "a la" : "a las"} ${formatTime(min)}`;
};

/** open: lit or not; word: the sign ("Open" / "Closed"); detail: what happens next; text: both as one line. */
export type OpenStatus = { open: boolean; word: string; detail: string; text: string };

function status(lang: Lang, open: boolean, detail: string, word?: string): OpenStatus {
  const es = lang === "es";
  const w = word ?? (open ? (es ? "Abierto" : "Open") : es ? "Cerrado" : "Closed");
  const lead = open ? (es ? "Abierto ahora" : "Open now") : word ?? (es ? "Cerrado ahora" : "Closed now");
  return { open, word: w, detail, text: `${lead} · ${detail}` };
}

export function openStatus(lang: Lang, date = new Date()): OpenStatus {
  const { day, minutes } = pacificNow(date);
  const today = schedule[day];
  const es = lang === "es";

  for (let i = 0; i < today.length; i++) {
    const [start, end] = today[i];
    if (minutes >= start && minutes < end) {
      const lunch = i < today.length - 1;
      if (lunch) return status(lang, true, es ? `descanso ${esAt(end)}` : `lunch break at ${formatTime(end)}`);
      return status(lang, true, es ? `cierra ${esAt(end)}` : `closes at ${formatTime(end)}`);
    }
  }

  const laterToday = today.find(([start]) => start > minutes);
  if (laterToday) {
    const onBreak = today.some(([, end]) => end <= minutes);
    if (onBreak)
      return status(
        lang,
        false,
        es ? `regresa ${esAt(laterToday[0])}` : `back at ${formatTime(laterToday[0])}`,
        es ? "En descanso" : "On lunch break",
      );
    return status(lang, false, es ? `abre hoy ${esAt(laterToday[0])}` : `opens today at ${formatTime(laterToday[0])}`);
  }

  for (let step = 1; step <= 7; step++) {
    const d = (day + step) % 7;
    if (schedule[d].length) {
      const start = schedule[d][0][0];
      if (step === 1) return status(lang, false, es ? `abre mañana ${esAt(start)}` : `opens tomorrow at ${formatTime(start)}`);
      return status(
        lang,
        false,
        es ? `abre el ${dayNames.es[d].toLowerCase()} ${esAt(start)}` : `opens ${dayNames.en[d]} at ${formatTime(start)}`,
      );
    }
  }
  return status(lang, false, es ? "revisa Booksy" : "check Booksy");
}
