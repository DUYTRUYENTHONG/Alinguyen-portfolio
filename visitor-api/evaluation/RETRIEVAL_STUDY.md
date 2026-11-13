# Bilingual retrieval: new development replay, 13 November 2026

Decision: keep production keyword ranker unchanged. No independent promotion evidence.

Original Portfolio-DeepSeek-Release-Verification.zip, question set, E5 pin and rankings were unavailable. Eight new authored bilingual intent pairs and two unrelated controls were frozen in recruiter-questions.json before the run. These are development data, never an independent holdout. Family variants remain in the same split.

## Observed results

| Language / method | Top-1 | Top-3 | MRR@3 |
|---|---:|---:|---:|
| English keyword |8/8|8/8|1.000|
| English E5 |7/8|7/8|0.875|
| English E5 enriched |7/8|7/8|0.875|
| English RRF |7/8|8/8|0.938|
| Vietnamese keyword |4/8|4/8|0.500|
| Vietnamese E5 |5/8|7/8|0.729|
| Vietnamese E5 enriched |3/8|5/8|0.479|
| Vietnamese RRF |5/8|7/8|0.729|

Enrichment changed only passage text: appended existing reviewed textVi on five of the 18 records. Leakage VI: expected kkbox-results rank14 →2. Published failures VI: guide-evaluation rank1 →5 (outside top3, still in the full ranking). Other VI regressions: warehouse2 →5, privacy3 →8, career1 →3. No cherry-picked second candidate or threshold tuning.

This reproduces the qualitative win/regression, NOT the original aggregate figures (4/8 →5/8 top3, 3/8 →2/8 top1) or threshold report (2 unrelated plus11/16 answerable declined). Questions/pin are new, so numerical differences cannot be attributed to one change relative to the missing run. Current corpus fingerprint uses canonical selected id/title/text/textVi/url JSON, unlike the old full-record fingerprint.

## Boundaries

Production keyword returns at most six records; reported missing rank means not returned, not an invented full-corpus rank. E5 exact cosine ranks all18; RRF uses those actual returned lists and k60. Neither vector diagnostic has an abstention threshold: both unrelated queries receive18 records. Keyword abstains on weather but returns one record for the recipe. A ranked list is not an answer or confidence. Model-selection refusal remains a separate gate.

Independent recruiter/academic/product labels are absent. Do not claim generalization, factual accuracy, conversion uplift, business impact or threshold optimization.

## Reproduce

1. python -m venv SHORT_PATH (Windows long paths broke the first attempted venv; no measurements from it)
2. SHORT_PATH/Scripts/python -m pip install -r visitor-api/evaluation/retrieval-requirements.txt
3. node visitor-api/scripts/recruiter-retrieval.mjs --prepare
4. SHORT_PATH/Scripts/python visitor-api/scripts/embed-recruiter-study.py
5. node visitor-api/scripts/recruiter-retrieval.mjs

Model pinned in e5-model.json: intfloat/multilingual-e5-small @614241f622f53c4eeff9890bdc4f31cfecc418b3. Official model-card prefixes query: / passage:, attention-mask average pooling, L2 normalization, max512; CPU float32, exhaustive cosine. https://huggingface.co/intfloat/multilingual-e5-small

All per-question rankings, source URLs, corpus/question/ranker fingerprints and model identity: public/recruiter-retrieval.json. Public corpus only; no provider calls. Browser consumes precomputed JSON, no weights/downloads/inference.
