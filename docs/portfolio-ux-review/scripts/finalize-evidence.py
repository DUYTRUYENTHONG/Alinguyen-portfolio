"""Summarize already captured evidence; no browser or production mutations."""
import hashlib, json, statistics
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parents[1]
E = HERE / 'evidence'

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
bad = E / 'invalid-captures'
bad.mkdir(exist_ok=True)
for name in ['cvs-1280.png','chat-short-landscape.png']:
    path = HERE / 'screenshots' / name
    if path.exists(): path.replace(bad / name)

manifest=[]
for path in sorted((HERE/'screenshots').glob('*.png')):
    with Image.open(path) as image:
        manifest.append({'file':path.relative_to(HERE).as_posix(),'bytes':path.stat().st_size,'width':image.width,'height':image.height,'sha256':sha(path),'status':'captured; reviewed in contact sheet or individually'})
for path in bad.glob('*.png'):
    with Image.open(path) as image:
        manifest.append({'file':path.relative_to(HERE).as_posix(),'bytes':path.stat().st_size,'width':image.width,'height':image.height,'sha256':sha(path),'status':'INVALID COMPOSITOR CAPTURE: excluded from visual findings'})
(E/'capture-manifest.json').write_text(json.dumps(manifest,indent=2))

files=json.loads((E/'cv-files.json').read_text(encoding='utf-8'))
public=json.loads((E/'public-browser-downloads.json').read_text())
local=json.loads((E/'native-browser-downloads.json').read_text())
checks=[]
for source,rows in [('public',public),('local',local)]:
    for row in rows:
        path=Path(row['path']);expected=next(f for f in files if f['filename']==row['name'])
        checks.append({'source':source,'file':row['name'],'savedPath':str(path),'bytes':path.stat().st_size,'sha256':sha(path),'matchesPublicFile':sha(path)==expected['sha256']})
(E/'saved-download-hashes.json').write_text(json.dumps(checks,indent=2))

lines=['# CV and link checks','', 'All four destinations were checked by public GET and by actual native browser activation. Local and public browser downloads completed. All eight saved files match the corresponding public/repository SHA-256. The CV files were read, not rewritten. Initial locator/native activation timeouts were superseded after bringing controls fully into view; they are not broken-link findings.','', '| Category/action | Final public URL | HTTP / MIME / signature | Size | Identity / browser outcome |','|---|---|---|---|---|']
names=['Applied AI engineering / Download PDF','Business and product / Business & Product PDF','Business and product / Business Development PDF','AI and prompt engineering / Download DOCX']
for label,f in zip(names,files):
    identity=f.get('title','Word package with word/document.xml; readable text identifies the AI/prompt CV')
    signature='%PDF-1.4' if f['filename'].endswith('.pdf') else 'PK ZIP + word/document.xml'
    lines.append(f"| {label} | [{f['filename']}]({f['finalUrl']}) | {f['status']} / `{f['mime']}` / `{signature}` | {f['bytes']:,} bytes | {identity}; saved by browser |")
lines += ['', 'PDF responses have no Content-Disposition header; the same-origin `download` links saved files in this Chromium session. A direct PDF URL may intentionally open inline in a different browser; that is not a failed download. Safari file handling is not assessed. Downloads may acquire numeric suffixes to avoid overwriting existing files.', '', 'Raw results: `evidence/cv-files.json`, `evidence/public-browser-downloads.json`, `evidence/native-browser-downloads.json`, `evidence/saved-download-hashes.json`. File title/text identity was inspected with pypdf or Word XML; PDF typography/page-layout QA was outside this portfolio audit.', '', '## Case studies and contact', '', 'Production build generated `/work/growth-commerce-os/`, `/work/stos/`, `/work/cho-kenh/`, `/work/vibecode-kit/`, and `/work/kkbox-baseline/`. KKBox directory → case → portfolio → Back/Forward was exercised. Other case paths are build/source verified, not all individually interaction tested in this audit.', '', 'KKBox evidence link points to `https://github.com/DUYTRUYENTHONG/kkbox-customer-churn-prediction/blob/main/docs/RESULTS.md`. Labels and internal routes agree. Every external service URL was not opened; external availability is Not assessed, not presumed healthy or broken.', '', 'Contact anchors use `mailto:nquangd1510@gmail.com`, plus `Engineering opportunity` and `AI and commerce workflow` subject variants. Copy-email succeeded; no mail client or send flow was activated.']
if (E/'case-link-checks.json').exists():
    lines += ['', 'Follow-up public route checks: all five returned HTTP 200 and their expected h1 identities; see `evidence/case-link-checks.json`. These HTTP identity checks do not replace the KKBox UI journey or constitute full interaction coverage of every case.']
(HERE/'CV_LINKS.md').write_text('\n'.join(lines),encoding='utf-8')

runs=json.loads((E/'performance-runs.json').read_text())
lines=['# Production-export performance baseline','', 'Local static production export, Windows host, in-app Chromium, 1280×900 CSS viewport. Browser cache disabled; unique audit query per navigation; requested CPU slowdown 4×, download 200,000 B/s (~1.6 Mbit/s), upload 93,750 B/s, latency 150ms. Assets served from loopback, HTTP/1.1, no CDN or TLS. Observed TTFB was much smaller than the requested latency, so complete network-latency fidelity is not established. This is a repeatable lab scenario description, not a field performance claim.', '', 'Three cold navigations per scenario. Navigation Timing, buffered paint/LCP/long-task entries and layout-shift records observed through load + 3 seconds. One direct-CV navigation tool wait timed out but the document reached complete; its browser timing was still read. Background host load was not controlled, and variability is retained rather than discarded. API writes were blocked; these are not API response-time measurements.', '', '| Metric | Homepage median (range) | Direct #cvs median (range) |','|---|---|---|']
for field,label,scale,unit in [('lcp','Observed LCP',1000,'s'),('domContentLoaded','DOMContentLoaded end',1000,'s'),('load','Load event end',1000,'s'),('cls','Raw non-input layout-shift sum',1,''),('longTaskMs','Long-task duration sum',1000,'s'),('transferBytes','Resource transfer (not document)',1000000,'MB')]:
    cells=[]
    for scenario in ['home','cvs']:
        values=[r[field]/scale for r in runs if r['scenario']==scenario]
        cells.append(f'{statistics.median(values):.3f}{unit} ({min(values):.3f}–{max(values):.3f}{unit})')
    lines.append(f'| {label} | '+ ' | '.join(cells)+' |')
lines += ['', 'FCP equals the observed LCP values in these samples. The `cls` field in the raw JSON is a **sum** of eligible layout-shift values, not the standardized maximum-session-window CLS calculation. Do not compare it directly to a CLS pass/fail threshold. Long-task duration is not Lighthouse TBT. No Lighthouse score, real-user INP, field percentile, or root-cause performance trace is claimed.', '', 'Direct entry shows greater variability and movement in this environment. Deferred content and finite anchor correction are hypotheses to investigate with shift-source profiling. Final CV top was approximately 0–112px under throttling; the separate unthrottled six-width settled trace reached ~112px throughout.', '', 'Raw six runs: `evidence/performance-runs.json`. Do not reuse these numbers as a benchmark for the subsequent artwork patch; that patch needs its own measurements.']
(HERE/'PERFORMANCE.md').write_text('\n'.join(lines),encoding='utf-8')
print(json.dumps({'screenshots':len(manifest),'downloadHashesMatch':all(c['matchesPublicFile'] for c in checks),'performanceRuns':len(runs)}))
