# Complete live-project answers — 2026-10-31

The previous broad availability question used relevance-ranked top-four
retrieval and unconstrained generation. That allowed the guide to say only
Growth Commerce OS was live even though the portfolio also lists STOS and
Chợ Kênh.

Broad inventory requests now return the full reviewed live-project records
directly, after the existing validation, origin and rate-limit checks. Each
numbered item has its own approved citation. English and Vietnamese are
supported, including short inventory follow-ups. Planned features, public
repositories and local ML evaluations are not counted as live product websites.
Specific-project and unrelated questions retain the existing retrieval flow.

`liveProject` metadata lives alongside the existing approved evidence. A
cross-source regression test requires its IDs and URLs to match every project
marked Live in `src/data/portfolio.ts`, preventing silent inventory drift.

## Verified evidence

All three destinations returned HTTP 200 with matching titles on 2026-10-31:

- https://growth-commerce-os.vercel.app/en — DUYTRUYENTHONG | Growth Operations SaaS Platform
- https://stosvn.vercel.app/stos — STOS | Sales Traffic Operating System
- https://growth-commerce-os.vercel.app/cho-kenh — Chợ Kênh | Mua bán kênh TikTok đã audit

This verifies public website availability, not customer adoption or every
internal product feature. The answer retains these limits explicitly.

## QA

- API suite: 30 passing tests, including five roles, English/Vietnamese queries,
  exact inventory coverage, follow-up correction, provider independence,
  specific-question routing, and origin/rate enforcement.
- Frontend guide suite: 39 passing tests, including inventory parity.
- Lint and production static build passed. No frontend source, CSS, navigation,
  actor behavior or page layout changed.
- Production smoke passed: existing KKBox evidence response and complete
  English/Vietnamese inventories with all three exact citation URLs.
- Backend deployed to the existing `ali-portfolio-visitor-api.vercel.app` alias.
  Final backend deployment ID: `dpl_F5XqLVwPiT7UD8BH6teC13ffQQJB`.

This is a targeted inventory-completeness fix, not a general factual-accuracy
benchmark for all generated answers.
