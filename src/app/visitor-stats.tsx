"use client";

import { useEffect, useState } from "react";

const endpoint = process.env.NEXT_PUBLIC_VISITOR_API_URL;
let fallbackId: string | null = null;

type Stats = {
  total: number;
  ordinal: number;
  roleCount: number;
  countries: { code: string; count: number }[];
};

function isStats(value: unknown): value is Stats {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<Stats>;
  return Number.isSafeInteger(data.total) && Number.isSafeInteger(data.ordinal) && Number.isSafeInteger(data.roleCount) && Array.isArray(data.countries) && data.countries.every((item) => /^[A-Z]{2}$/.test(item.code) && Number.isSafeInteger(item.count));
}

export function VisitorStats({ role }: { role: string | null }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!endpoint) return;
    const controller = new AbortController();
    let disposed = false;
    setStats(null);
    setError(false);
    const timeout = window.setTimeout(() => { setError(true); controller.abort(); }, 8000);
    let visitorId: string;
    try {
      const saved = window.localStorage.getItem("alitech-visitor-id");
      visitorId = saved && /^[0-9a-f-]{36}$/i.test(saved) ? saved : crypto.randomUUID();
      window.localStorage.setItem("alitech-visitor-id", visitorId);
    } catch {
      fallbackId ??= crypto.randomUUID();
      visitorId = fallbackId;
    }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, role }),
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) throw new Error("Visitor counter unavailable");
      const data: unknown = await response.json();
      if (!isStats(data)) throw new Error("Visitor counter response invalid");
      if (disposed || controller.signal.aborted) return;
      setStats(data);
      setError(false);
    }).catch((cause: unknown) => {
      if (disposed || (cause instanceof Error && cause.name === "AbortError")) return;
      setError(true);
    }).finally(() => window.clearTimeout(timeout));
    return () => { disposed = true; window.clearTimeout(timeout); controller.abort(); };
  }, [role]);

  if (!endpoint || error) return <p className="visitor-stats-offline">Live visitor counts are unavailable right now. The portfolio remains available.</p>;
  if (!stats) return <p className="visitor-stats-offline" role="status">Loading visitor counts…</p>;

  const shownCountries = stats.countries.slice(0, 12);
  return <div className="visitor-stats" aria-live="polite">
    <div className="visitor-stat"><strong>{stats.total.toLocaleString()}</strong><span>VISITORS SO FAR</span></div>
    <div className="visitor-stat"><strong>#{stats.ordinal.toLocaleString()}</strong><span>YOUR VISITOR NUMBER</span></div>
    {role && <div className="visitor-stat"><strong>{stats.roleCount.toLocaleString()}</strong><span>{role.toUpperCase()} VISITORS</span></div>}
    <div className="visitor-countries"><span>VISITORS FROM {stats.countries.length} {stats.countries.length === 1 ? "COUNTRY" : "COUNTRIES"}</span><div>{shownCountries.map(({ code, count }) => <abbr key={code} title={`${code}: ${count} ${count === 1 ? "visitor" : "visitors"}`}>{code}</abbr>)}</div></div>
    <p>Counts are per browser. The portfolio counter stores a salted browser ID hash, chosen role, and country code; it does not write IP addresses to its database.</p>
  </div>;
}
