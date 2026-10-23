# Production-export performance baseline

Local static production export, Windows host, in-app Chromium, 1280×900 CSS viewport. Browser cache disabled; unique audit query per navigation; requested CPU slowdown 4×, download 200,000 B/s (~1.6 Mbit/s), upload 93,750 B/s, latency 150ms. Assets served from loopback, HTTP/1.1, no CDN or TLS. Observed TTFB was much smaller than the requested latency, so complete network-latency fidelity is not established. This is a repeatable lab scenario description, not a field performance claim.

Three cold navigations per scenario. Navigation Timing, buffered paint/LCP/long-task entries and layout-shift records observed through load + 3 seconds. One direct-CV navigation tool wait timed out but the document reached complete; its browser timing was still read. Background host load was not controlled, and variability is retained rather than discarded. API writes were blocked; these are not API response-time measurements.

| Metric | Homepage median (range) | Direct #cvs median (range) |
|---|---|---|
| Observed LCP | 2.424s (2.412–2.588s) | 3.132s (2.684–11.388s) |
| DOMContentLoaded end | 2.509s (2.502–2.797s) | 3.601s (2.936–11.920s) |
| Load event end | 7.350s (7.333–7.351s) | 11.140s (10.561–16.674s) |
| Raw non-input layout-shift sum | 0.033 (0.033–0.033) | 0.211 (0.100–0.441) |
| Long-task duration sum | 0.378s (0.147–0.491s) | 2.360s (1.141–2.860s) |
| Resource transfer (not document) | 1.299MB (1.299–1.299MB) | 1.922MB (1.915–1.969MB) |

FCP equals the observed LCP values in these samples. The `cls` field in the raw JSON is a **sum** of eligible layout-shift values, not the standardized maximum-session-window CLS calculation. Do not compare it directly to a CLS pass/fail threshold. Long-task duration is not Lighthouse TBT. No Lighthouse score, real-user INP, field percentile, or root-cause performance trace is claimed.

Direct entry shows greater variability and movement in this environment. Deferred content and finite anchor correction are hypotheses to investigate with shift-source profiling. Final CV top was approximately 0–112px under throttling; the separate unthrottled six-width settled trace reached ~112px throughout.

Raw six runs: `evidence/performance-runs.json`. Do not reuse these numbers as a benchmark for the subsequent artwork patch; that patch needs its own measurements.