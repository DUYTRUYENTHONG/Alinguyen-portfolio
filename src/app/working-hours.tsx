"use client";

import { useEffect, useRef, useState } from "react";

const SAIGON_ZONE = "Asia/Ho_Chi_Minh";
const SAIGON_UTC_OFFSET_HOURS = 7;
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 18;
const WORK_LABEL = `${String(WORK_START_HOUR).padStart(2, "0")}:00–${String(WORK_END_HOUR).padStart(2, "0")}:00`;
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

type WindowSegment = { start: number; end: number };

function clock(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone,
  }).format(date);
}

function saigonDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SAIGON_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day") };
}

function intersect(first: WindowSegment, second: WindowSegment): WindowSegment | null {
  const start = Math.max(first.start, second.start);
  const end = Math.min(first.end, second.end);
  return end > start ? { start, end } : null;
}

function sharedHours(now: Date) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const localDay = { start: new Date(year, month, day).getTime(), end: new Date(year, month, day + 1).getTime() };
  const localOffice = { start: new Date(year, month, day, WORK_START_HOUR).getTime(), end: new Date(year, month, day, WORK_END_HOUR).getTime() };
  const saigonDay = saigonDateParts(now);
  const saigonStart = Date.UTC(saigonDay.year, saigonDay.month - 1, saigonDay.day, WORK_START_HOUR - SAIGON_UTC_OFFSET_HOURS);
  const saigonWindows = Array.from({ length: 5 }, (_, index) => ({
    start: saigonStart + (index - 2) * DAY_MS,
    end: saigonStart + (index - 2) * DAY_MS + (WORK_END_HOUR - WORK_START_HOUR) * HOUR_MS,
  }));
  const saigonOnLocalDay = saigonWindows.map((window) => intersect(window, localDay)).filter((segment): segment is WindowSegment => segment !== null);
  const overlap = saigonWindows.map((window) => intersect(window, localOffice)).filter((segment): segment is WindowSegment => segment !== null);
  const percent = (timestamp: number) => (timestamp - localDay.start) / (localDay.end - localDay.start) * 100;
  const bars = (segments: WindowSegment[]) => segments.map((segment) => ({
    left: percent(segment.start), width: percent(segment.end) - percent(segment.start),
  }));
  return { saigonBars: bars(saigonOnLocalDay), localBars: bars([localOffice]), overlap, nowPercent: percent(now.getTime()) };
}

export function WorkingHours({ variant }: { variant: "header" | "contact" | "menu" }) {
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = `working-hours-${variant}-panel`;

  useEffect(() => {
    const refresh = () => setNow(new Date());
    refresh();
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const localZone = open ? Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time" : "Local time";
  const time = open && now ? sharedHours(now) : null;
  const isSameZone = open && now ? clock(now) === clock(now, SAIGON_ZONE) : false;
  const overlapText = time?.overlap.length
    ? `Shared ${WORK_LABEL} window: ${time.overlap.map((segment) => `${clock(new Date(segment.start))}–${clock(new Date(segment.end))}`).join(", ")} your time (${time.overlap.map((segment) => `${clock(new Date(segment.start), SAIGON_ZONE)}–${clock(new Date(segment.end), SAIGON_ZONE)}`).join(", ")} Saigon).`
    : `No shared ${WORK_LABEL} window today. You can still email anytime.`;

  return <div ref={root} className={`working-hours working-hours-${variant}`}>
    <button ref={trigger} className="working-hours-trigger" type="button" disabled={!now} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
      <span>{variant === "header" ? `IT'S ${now ? clock(now, SAIGON_ZONE) : "--:--"} IN SAIGON` : `Working hours · Saigon ${now ? clock(now, SAIGON_ZONE) : "--:--"}`}</span>
      <span aria-hidden="true">{open ? "−" : "↗"}</span>
    </button>
    {open && now && time && <section className="working-hours-panel" id={panelId} aria-label="Working hours across time zones">
      <div className="working-hours-times">
        <div><span>SAIGON</span><time dateTime={now.toISOString()}>{clock(now, SAIGON_ZONE)}</time></div>
        <div><span>YOU · {localZone.replaceAll("_", " ").toUpperCase()}</span><time dateTime={now.toISOString()}>{clock(now)}</time></div>
      </div>
      <p className="working-hours-relation">{isSameZone ? "Same time as Saigon" : `Your time zone: ${localZone.replaceAll("_", " ")}`}</p>
      <div className="working-hours-timeline" aria-hidden="true">
        <div className="working-hours-track"><span>Saigon</span><div className="working-hours-rail">{time.saigonBars.map((bar, index) => <i key={index} style={{ left: `${bar.left}%`, width: `${bar.width}%` }} />)}</div></div>
        <div className="working-hours-track"><span>You</span><div className="working-hours-rail">{time.localBars.map((bar, index) => <i key={index} style={{ left: `${bar.left}%`, width: `${bar.width}%` }} />)}<b style={{ left: `${time.nowPercent}%` }} /></div></div>
        <div className="working-hours-axis"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
      </div>
      <p className="working-hours-overlap">{overlapText}</p>
      <p className="working-hours-note">Typical planning hours: {WORK_LABEL} in each time zone.</p>
    </section>}
  </div>;
}
