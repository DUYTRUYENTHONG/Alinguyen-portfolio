# Recruiter retrieval development replay v1

Frozen before the first run on 2026-11-13. Original archive/questions/E5 pin absent; NEW authored data, not a reconstruction. Eight bilingual intent families plus two unrelated controls, all development-only. Independent recruiter/academic/product evaluation pending, reserved for one final untuned run.

Objective: top-1, top-3, MRR@3 by language. Guardrails: all 18 public records and URLs unchanged; production ranker unchanged. Budget: one E5 baseline, one candidate adding only existing reviewed textVi. RRF k=60 fixed as a diagnostic. Stop after comparison; no threshold tuning or promotion. Unrelated questions scored separately. Never infer relevance labels from scores.

E5: intfloat/multilingual-e5-small pinned to resolved HF commit before loading, query: / passage: prefixes, masked mean pooling, L2 normalization, max_length512, CPU float32 exact cosine, no remote Python code.
