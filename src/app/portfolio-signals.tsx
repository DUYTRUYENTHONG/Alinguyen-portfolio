"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { signalConsentDays, signalConsentKey, signalProjectForLink, validSignalConsent } from "./portfolio-signal-policy";

const signalEndpoint = process.env.NEXT_PUBLIC_GUIDE_API_URL?.replace(/\/guide$/, "/interaction");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const SignalContext = createContext({ enabled: false, blocked: false, available: false, setEnabled: (_enabled: boolean) => {} });
const privacyBlocked = () => (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true || navigator.doNotTrack === "1";
function storedConsent() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(signalConsentKey) ?? "null");
    if (validSignalConsent(value)) return value;
    localStorage.removeItem(signalConsentKey);
  } catch { /* No storage means no collection. */ }
  return null;
}

export function PortfolioSignalsProvider({ children }: { children: ReactNode }) {
  const [enabled, setState] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [available, setAvailable] = useState(false);
  const pending = useRef(new Set<AbortController>());
  useEffect(() => {
    const sync = () => {
      const denied = privacyBlocked();
      setBlocked(denied);
      setAvailable(Boolean(signalEndpoint));
      const consent = storedConsent();
      setState(!denied && Boolean(consent));
      if (denied || !consent) {
        for (const controller of pending.current) controller.abort();
        pending.current.clear();
      }
    };
    sync();
    const record = (event: MouseEvent) => {
      if (!event.isTrusted || (event.type === "auxclick" && event.button !== 1) || !signalEndpoint || privacyBlocked()) return;
      const consent = storedConsent();
      if (!consent) { sync(); return; }
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor) return;
      const projectId = signalProjectForLink((anchor as HTMLAnchorElement).href, location.origin, basePath);
      if (!projectId || pending.current.size >= 3) return;
      const controller = new AbortController();
      pending.current.add(controller);
      const timer = window.setTimeout(() => controller.abort(), 2500);
      void fetch(signalEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "omit", referrerPolicy: "no-referrer", keepalive: true,
        signal: controller.signal, body: JSON.stringify({ consent: true, projectId, browserId: consent.browserId }) })
        .catch(() => { /* Best effort: never delay navigation or retry an interaction. */ })
        .finally(() => { window.clearTimeout(timer); pending.current.delete(controller); });
    };
    document.addEventListener("click", record, true);
    document.addEventListener("auxclick", record, true);
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      document.removeEventListener("click", record, true);
      document.removeEventListener("auxclick", record, true);
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);
  const setEnabled = (next: boolean) => {
    try {
      if (next && !privacyBlocked() && signalEndpoint) {
        localStorage.setItem(signalConsentKey, JSON.stringify({browserId: crypto.randomUUID(), expiresAt: Date.now() + signalConsentDays * 86400000}));
        setState(true);
      } else {
        localStorage.removeItem(signalConsentKey);
        setState(false);
        for (const controller of pending.current) controller.abort();
        pending.current.clear();
      }
    } catch { setState(false); }
  };
  return <SignalContext.Provider value={{ enabled, blocked, available, setEnabled }}>{children}</SignalContext.Provider>;
}

export function PortfolioSignalConsent() {
  const { enabled, blocked, available, setEnabled } = useContext(SignalContext);
  return <details className="guide-assistant-memory"><summary>Help improve project recommendations</summary>
    <p>Optional: share project-link interactions to help order relevant recommendations. Answers still come from reviewed evidence.</p>
    <label><input type="checkbox" checked={enabled} disabled={blocked || !available} onChange={event => setEnabled(event.target.checked)} /> Share project-link counts for 30 days</label>
    <p>We count each project once per browser per day. A random device ID is sent and stored only as a daily hash for up to two days; aggregate counts expire after 30 days. No chat text, role or visited URL is included. Recent aggregate counts may break recommendation ties for all visitors.</p>
    <p>Uncheck to stop future collection and remove the local ID. Previously aggregated counts cannot be individually removed.</p>
    {blocked && <p role="status">Your browser privacy preference disables this option.</p>}
    {!available && <p>Interaction collection is unavailable in this preview.</p>}
  </details>;
}
