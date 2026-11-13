# Frozen local action experiment v1

Before model training:16 train /8 dev /8 authored held-out test examples;16 distinct families split8/4/4 BEFORE English/Vietnamese variants. No visitor transcripts or private data. Test labels are only opened after checkpoint selection. These are author-held-out labels, not independent review.

Objective: acceptable first action, language counts, appropriate no-action, wrong-project/repeated CTA/critical planned-feature links. A rules baseline is required. Qwen3-0.6B pinned in action-model.json, Apache2.0, chat template thinking disabled. CPU float32, seed42, LoRA rank4 alpha8 dropout.05 q_proj/v_proj, AdamW2e-4, assistant-target-only loss,32 updates max and300 training seconds. Dev loss at16/32; choose lower dev loss. A partial run or fewer than32 updates is pipeline verification only. No retries/hyperparameter search on held-out data.

Compare rules, untuned base and selected adapter on identical input/action sets. Model-generated URLs never used. Save paired predictions/checkpoints/losses/checksums. Only propose an offline table after successful training; review required before runtime adoption. Rules remain chosen absent a guardrail-clean meaningful improvement and independently reviewed states. No custom adapter hosting on Groq assumed.

## Post-run protocol review and corrected runnable v2

Recorded v1 completed18/32 updates at302.14 seconds (stop checked at step boundaries). CV direct/reader paraphrase shared an intent across train and dev under different family names: a confirmed split defect. Preserve exact v1 files in docs/evidence/action-data-v1-*.json with matching recorded hashes. No promotion or generalization claim from that run.

Runnable v2 moves both CV paraphrases into the original training family. Counts18train/6dev/8test;8/3/4families. No new training run or retuning on observed test results has been performed. Future model promotion needs a fresh independently reviewed final set and a newly declared budget.
