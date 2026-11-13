# Retrieval study reproduction boundary

The requested 18-question approved replay set (eight English/Vietnamese intent pairs plus two unrelated questions), RETRIEVAL_STUDY.md, original rankings, pinned E5 revision and hillclimb-plan.md were not supplied in this checkout. The public knowledge records and historical authored guide cases are present, but are not a substitute for the missing replay labels.

Do not reconstruct the intended rankings or claim the reported 4/8 to 5/8 top-three change was reproduced. Preserve that statement as an unverified handoff claim until its questions, labels and fingerprints are available. Likewise the reported first-place regression (3/8 to 2/8) and threshold failures (11/16 answerable declined) require replay, not a restatement as measured evidence.

Required import: approved question IDs/text/language, grouped intent IDs, expected source IDs, exact corpus snapshot, incumbent ranks, pinned multilingual E5 model revision and preprocessing, and the original study/plan. Keep original hashes. Run keyword, exact-cosine E5 and RRF on identical records. Exclude the two unsupported requests from answerable denominators. Report per-language top-1/top-3/MRR@3 and per-question ranks, including rank-four misses.

Production ranking remains unchanged. Vietnamese passage enrichment and abstention thresholds stay offline pending reproduction and independent holdout review.
