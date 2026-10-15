# Performance comparison — 15 October 2026

## Test conditions

Lighthouse 13.5.0 ran in headless Chrome 154 on this Windows workstation, three times per version and device preset. The mobile preset used Lighthouse's simulated throttling; desktop used `--preset=desktop`. Baseline was the released source at `http://127.0.0.1:3006/Alinguyen-portfolio/`; candidate was the local static export at port 3007. Both used `http-server -c-1` without production CDN compression/cache behavior, the same `/Alinguyen-portfolio` base path, and **no visitor API endpoint** in the lab build. This avoids counting synthetic test traffic and makes the frontend comparison consistent. Medians are calculated independently for each metric from three runs. [Run-level data and source file names](lighthouse-summary.json) are retained; raw Lighthouse JSON is in ignored local `work/audit/`.

| Metric, median | Mobile before | Mobile after | Change | Desktop before | Desktop after | Change |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Performance | 55 | 70 | +15 | 95 | 96 | +1 |
| FCP | 2.738 s | 2.412 s | −0.326 s | 0.593 s | 0.551 s | −0.042 s |
| LCP | 8.276 s | 6.891 s | −1.385 s | 1.455 s | 1.358 s | −0.097 s |
| TBT | 505 ms | 138 ms | −367 ms | 44 ms | 24 ms | −20 ms |
| CLS | 0.0178 | 0.0178 | unchanged | 0.0036 | 0.0036 | unchanged |
| JavaScript transfer | 634,404 B | 498,584 B | −135,820 B | 634,404 B | 498,584 B | −135,820 B |
| Total transfer | 1,321,036 B | 1,143,502 B | −177,534 B | 1,321,036 B | 1,143,502 B | −177,534 B |
| Image transfer | 377,014 B | 377,014 B | unchanged | 377,014 B | 377,014 B | unchanged |
| Font transfer | 140,939 B | 97,419 B | −43,520 B | 140,939 B | 97,419 B | −43,520 B |
| Reported long tasks | 11 | 5 | −6 | 3 | 2 | −1 |
| Style/layout main-thread work | 4,216 ms | 1,345 ms | −2,871 ms | 930 ms | 417 ms | −513 ms |

The mobile candidate score ranged from 65 to 72, versus 53 to 58 at baseline. Its three LCP runs were 3.40, 6.89, and 6.95 s; Total Blocking Time ranged from 87 to 1,031 ms. Desktop candidate scores ranged from 95 to 96, versus three 95s. This is a lab comparison with meaningful run-to-run variance, not field Core Web Vitals. No 75th-percentile real-user LCP, CLS, or INP was available. TBT is a diagnostic proxy for responsiveness; it is **not** an INP measurement.

## Interpretation and remaining bottleneck

Removing the Motion role-tile dependency and deferring layout of deep homepage sections reduced JavaScript transfer and main-thread layout work. Eleven product preview files occupy about 337 KB on disk, versus 11.15 MB for their original screenshots, while original full-size links remain available. Lighthouse's **initial-view image transfer did not change** because those product previews are below the fold and lazy-loaded; the preview benefit applies when users reach project media. The hero portrait remains the mobile LCP element. It already uses responsive WebP, eager high-priority loading, dimensions, and synchronous decoding, so another image conversion alone is unlikely to close the remaining multi-second gap.

The candidate still has a **6.89 s mobile lab LCP median**, above the 2.5 s good-experience target. No low-end physical device or field dataset was measured. The next performance investigation should profile portrait paint timing, hydration, fonts, and scroll/guide work on a representative low-end device without removing working functionality solely to improve a score. The local uncompressed server and simulated network differ from GitHub Pages CDN delivery, so a later public measurement is also required. Automated Accessibility and SEO scored 100 in these runs, but those scores do not establish full WCAG compliance or social-crawler behavior.

## Release candidate recheck

After the guide scroll fix and removal of its initial 900 ms polling loop, three more mobile runs on the same local static export produced a **7.33 s median LCP**, performance score **67**, FCP **2.46 s**, TBT **194 ms**, and CLS **0.0178**. Accessibility and SEO each scored **100** in all three runs. [Run-level results](release-lighthouse-summary.json) show substantial lab variance, including a 50-point performance run with 972 ms TBT. This change did not resolve mobile LCP; the public baseline previously measured 8.28 s in the paired local setup. Treat the remaining mobile delay as an explicit release risk and measure field Core Web Vitals after publication.
