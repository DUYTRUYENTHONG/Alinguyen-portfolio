"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useGuideDialog } from "./use-guide-dialog";
import { conversationScrollTop } from "./guide-conversation-scroll";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const endpoint = process.env.NEXT_PUBLIC_GUIDE_API_URL;
const memoryKey = "ali-guide-preferences-v1";
const memoryDays = 90;
const interestOptions = ["AI", "commerce", "data", "admissions"] as const;
const allowedHosts = new Set(["duytruyenthong.github.io", "github.com", "growth-commerce-os.vercel.app", "stosvn.vercel.app"]);
const starterQuestions: Record<string, string[]> = {
  Recruiter: ["Which AI projects can I inspect?", "How was KKBox evaluated?", "What should a recruiter read?"],
  Founder: ["Which products are live?", "What does STOS do?", "How does Ali approach a sales funnel?"],
  Engineer: ["Which source code can I inspect?", "What does Vibecode Product Kit include?", "How was KKBox evaluated?"],
  "Product designer": ["What does STOS do?", "How does Ali approach a sales funnel?", "Which products are live?"],
  Marketer: ["How does Ali approach a sales funnel?", "Which commerce products are live?", "What does STOS do?"],
  Growth: ["How does Ali approach a sales funnel?", "Which commerce products are live?", "What does STOS do?"],
  Data: ["How was KKBox evaluated?", "What are the KKBox limits?", "Which AI projects can I inspect?"],
  Investor: ["Which products are live?", "Are STOS business outcomes measured?", "What is planned for STOS?"],
  Student: ["What should an admissions reviewer read?", "How was KKBox evaluated?", "What are Ali's research interests?"],
  "Fellow builder": ["Which source code can I inspect?", "What does Vibecode Product Kit include?", "How was KKBox evaluated?"],
  "Just curious": ["Which AI projects can I inspect?", "Which products are live?", "What does Ali build?"],
};

type Turn = { role: "user" | "assistant"; text: string; citations?: { sourceId: string; label: string; url: string }[] };
type AnswerMotion = "nod" | "curious" | "point" | "none";
type PanelMotion = AnswerMotion | "greet" | "attentive" | "thinking" | "reassure";
type GuideReply = { answer: string; citations: Turn["citations"]; suggestions: string[]; motion?: AnswerMotion };
const answerMotions = new Set<AnswerMotion>(["nod", "curious", "point", "none"]);

function safeLink(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && allowedHosts.has(parsed.hostname);
  } catch { return false; }
}

export function GuideAssistantPanel({ open, onClose, icon, name, role, section }: {
  open: boolean;
  onClose: () => void;
  icon: string;
  name: string;
  role: string;
  section: string;
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [motion, setMotion] = useState<PanelMotion>("attentive");
  const [remember, setRemember] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const dialogRef = useGuideDialog(open);
  const scrollRef = useRef<HTMLDivElement>(null);
  const motionTimerRef = useRef<number | null>(null);
  const requestPending = useRef(false);
  const followingReply = useRef(true);
  const contextQuestion = section.includes("KKBox") ? "How was KKBox evaluated?"
    : section.includes("STOS") ? "What does STOS do?"
    : section.includes("Growth Commerce") ? "What does Growth Commerce OS do?"
    : section.includes("Chợ Kênh") ? "What does Chợ Kênh do?"
    : section.includes("Vibecode") ? "What does Vibecode Product Kit include?"
    : section === "Download a CV" ? "Which CV should I read?" : null;
  const prompts = Array.from(new Set([...(contextQuestion ? [contextQuestion] : []), ...(starterQuestions[role] ?? starterQuestions.Recruiter)])).slice(0, 3);

  const showMotion = (next: PanelMotion, duration = 0) => {
    if (motionTimerRef.current !== null) window.clearTimeout(motionTimerRef.current);
    setMotion(next);
    motionTimerRef.current = duration ? window.setTimeout(() => {
      setMotion("attentive");
      motionTimerRef.current = null;
    }, duration) : null;
  };

  useEffect(() => {
    if (!open) return;
    setMotion("greet");
    motionTimerRef.current = window.setTimeout(() => {
      setMotion("attentive");
      motionTimerRef.current = null;
    }, 1100);
    return () => {
      if (motionTimerRef.current !== null) window.clearTimeout(motionTimerRef.current);
      motionTimerRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(memoryKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (typeof saved.savedAt !== "number" || Date.now() - saved.savedAt > memoryDays * 86400000 ||
          !Array.isArray(saved.interests) || !saved.interests.every((item: string) => interestOptions.includes(item as typeof interestOptions[number]))) {
        localStorage.removeItem(memoryKey);
        return;
      }
      setInterests(saved.interests);
      setRemember(true);
    } catch { /* Private browsing or blocked storage: continue without memory. */ }
  }, []);

  useEffect(() => {
    const transcript = scrollRef.current;
    if (!open || !transcript) return;
    let frame = 0;
    const follow = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = transcript.querySelector<HTMLElement>("[data-guide-current]")
          ?? (document.activeElement?.id === "guide-question" ? transcript.querySelector<HTMLElement>(".guide-assistant-welcome") : null);
        if (!current) return;
        const viewport = transcript.getBoundingClientRect();
        const target = current.getBoundingClientRect();
        transcript.scrollTo({ top: conversationScrollTop({ scrollTop: transcript.scrollTop,
          scrollHeight: transcript.scrollHeight, viewportTop: viewport.top,
          viewportHeight: transcript.clientHeight, targetTop: target.top, targetHeight: target.height }), behavior: "instant" });
      });
    };
    const readHistory = () => { followingReply.current = false; };
    const keyboardHistory = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) readHistory();
    };
    const observer = new ResizeObserver(() => {
      if (followingReply.current) follow();
    });
    observer.observe(transcript);
    transcript.addEventListener("wheel", readHistory, { passive: true });
    transcript.addEventListener("touchstart", readHistory, { passive: true });
    transcript.addEventListener("keydown", keyboardHistory);
    // A new turn follows the active bubble, rather than the preferences below it.
    followingReply.current = true;
    follow();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      transcript.removeEventListener("wheel", readHistory);
      transcript.removeEventListener("touchstart", readHistory);
      transcript.removeEventListener("keydown", keyboardHistory);
    };
  }, [open, turns, busy, error]);

  const saveInterests = (next: string[], enabled = remember) => {
    setInterests(next);
    try {
      if (enabled) localStorage.setItem(memoryKey, JSON.stringify({ interests: next, savedAt: Date.now() }));
      else localStorage.removeItem(memoryKey);
    } catch { /* The assistant still works without saved preferences. */ }
  };

  const ask = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || requestPending.current) return;
    requestPending.current = true;
    setQuestion("");
    setError("");
    const prior = turns.slice(-4).map(({ role: speaker, text: content }) => ({ role: speaker, text: content }));
    setTurns((current) => [...current, { role: "user", text: trimmed }]);
    setBusy(true);
    showMotion("thinking");
    try {
      if (!endpoint) throw new Error("Guide API is not configured");
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);
      let response: Response;
      try {
        response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmed, context: { page: window.location.pathname, section, role }, recentTurns: prior, interests: remember ? interests : [] }),
          signal: controller.signal });
      } finally { window.clearTimeout(timeout); }
      if (!response.ok) throw new Error("Guide unavailable");
      const reply = await response.json() as GuideReply;
      if (typeof reply.answer !== "string") throw new Error("Invalid guide reply");
      const citations = Array.isArray(reply.citations) ? reply.citations.filter((item) => item && safeLink(item.url)) : [];
      setTurns((current) => [...current, { role: "assistant", text: reply.answer, citations }]);
      setSuggestions(Array.isArray(reply.suggestions) ? reply.suggestions.slice(0, 2) : []);
      showMotion(reply.motion && answerMotions.has(reply.motion) ? reply.motion : "nod", 1600);
    } catch {
      setError("The AI guide is unavailable right now. The portfolio links below still work.");
      setQuestion(trimmed);
      showMotion("reassure", 1500);
    } finally { requestPending.current = false; setBusy(false); }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void ask(question); };
  if (!open) return null;

  return createPortal(<dialog ref={dialogRef} className="guide-assistant-panel" aria-labelledby="guide-assistant-title" aria-describedby="guide-assistant-privacy" onCancel={(event) => {
    event.preventDefault();
    onClose();
  }}>
    <header className="guide-assistant-head">
      <span className="guide-assistant-presence" aria-hidden="true"><img className="guide-assistant-avatar" data-motion={motion} src={`${basePath}/guide-art/${icon}.webp`} alt="" width="56" height="84" /></span>
      <div><span className="guide-assistant-eyebrow">YOUR PORTFOLIO COMPANION</span><strong id="guide-assistant-title">Talk with {name}</strong><span>Ali&apos;s AI guide · public sources</span></div>
      <button type="button" className="guide-assistant-close" onClick={onClose} aria-label="Close guide">×</button>
    </header>
    <div className="guide-assistant-transcript" ref={scrollRef} aria-live="polite" aria-relevant="additions text">
      <small id="guide-assistant-privacy">Questions are sent to an AI provider when you send a message or select a suggested question. Avoid sharing sensitive information. Chat history lasts only in this tab.</small>
      {turns.length === 0 && <div className="guide-assistant-intro">
        <div className="guide-assistant-context"><span>EXPLORING NOW</span><strong>{section}</strong></div>
        <div className="guide-assistant-welcome"><strong>Hi, I&apos;m {name}.</strong><p>I can point you to Ali&apos;s work, explain the evidence, and say what remains unverified. What would you like to explore?</p></div>
        <div className="guide-assistant-suggestions">
          {prompts.map((item) =>
            <button key={item} type="button" disabled={busy} onClick={() => void ask(item)}>{item}<span aria-hidden="true">↗</span></button>)}
        </div>
      </div>}
      {turns.map((turn, index) => <div className={`guide-assistant-turn guide-assistant-turn-${turn.role}`} data-guide-current={index === turns.length - 1 && !busy && !error ? "true" : undefined} key={`${index}-${turn.role}`}>
        <span>{turn.role === "assistant" && <img src={`${basePath}/guide-art/${icon}.webp`} width="20" height="28" alt="" />}{turn.role === "user" ? "You" : name}</span><p>{turn.text}</p>
        {turn.citations?.length ? <div className="guide-assistant-citations">{turn.citations.map((citation) =>
          <a key={citation.sourceId} href={citation.url} target="_blank" rel="noopener noreferrer">{citation.label} ↗</a>)}</div> : null}
      </div>)}
      {busy && <div className="guide-assistant-status" data-guide-current="true" role="status"><span className="guide-thinking-dots" aria-hidden="true"><i /><i /><i /></span><span>{name} is checking public sources…</span></div>}
      {error && <p className="guide-assistant-error" data-guide-current="true" role="status">{error}</p>}
      {error && <p className="guide-assistant-fallback"><a href={`${basePath}/work/`} onClick={onClose}>Work</a> · <a href={`${basePath}/about/`} onClick={onClose}>About</a> · <a href={`${basePath}/#cvs`} onClick={onClose}>CVs</a> · <a href={`${basePath}/#contact`} onClick={onClose}>Contact</a></p>}
      {!busy && suggestions.length > 0 && <div className="guide-assistant-suggestions">{suggestions.map((item) =>
        <button key={item} type="button" onClick={() => void ask(item)}>{item}</button>)}</div>}
      <details className="guide-assistant-memory"><summary>Returning visitor preferences</summary>
        <label><input type="checkbox" checked={remember} onChange={(event) => { setRemember(event.target.checked); saveInterests(interests, event.target.checked); }} /> Remember selected interests on this device for 90 days</label>
        {remember && <div className="guide-assistant-interests">{interestOptions.map((item) =>
          <button type="button" key={item} aria-pressed={interests.includes(item)} onClick={() => saveInterests(interests.includes(item) ? interests.filter((value) => value !== item) : [...interests, item])}>{item}</button>)}</div>}
        {remember && <button className="guide-assistant-forget" type="button" onClick={() => { setRemember(false); saveInterests([], false); }}>Forget my preferences</button>}
      </details>
    </div>
    <div className="guide-assistant-footer">
      <form onSubmit={submit}><label htmlFor="guide-question" className="sr-only">Ask a question</label>
        <input id="guide-question" value={question} onChange={(event) => setQuestion(event.target.value)} onFocus={() => { followingReply.current = true; if (!busy) showMotion("curious", 900); }} maxLength={400} placeholder={`Ask ${name} about the work…`} readOnly={busy} autoComplete="off" enterKeyHint="send" />
        <button type="submit" disabled={busy || !question.trim()} aria-label="Send question">→</button>
      </form>
    </div>
  </dialog>, document.body);
}
