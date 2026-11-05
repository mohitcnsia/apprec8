# Firebase costs: what each screen reads (2026-11-05)

Owner rule: be extremely careful with costs; no surprise bills. Free tier (Firestore, per day): **50,000 reads, 20,000 writes**.
Beyond it, reads cost about **$0.06 per 100,000**. The real danger is a bug or a loop, not normal growth.

## Guards in place
| Guard | Where | Status |
|---|---|---|
| Every function capped at 10 running copies (long admin jobs: 2) | `functions/common/config.js` (DR-12) | deploy: G30 |
| Leaderboards worked out at most once per 10 min, top list ≤ 50 rows | `functions/utils/serverCache.js` (DR-13) | deploy: G30 |
| Admin dashboard reads only the chosen quest | `services/adminApi.js` + index (DR-14) | waiting for owner OK |
| Quest content kept on the phone (per content version, max 7 days) | `services/contentCache.js` | live |
| Vocab game, Spelling Bee, Space quest map kept on the phone for 7 days (admin: 2 min) | `services/gameCache.js` | next "publish" |
| Admin web links private (Cloud IAM only) | `adminRuntimeOptions` | live |
| Budget alert (email) | Google Cloud Billing | owner has one |

## Reads per action (after the guards)
| Action | Reads | Notes |
|---|---|---|
| Open the app (Home) | ~30–40 | tiles (`categories`), user doc, quest progress docs |
| Open a tile quest map | 1–2 | quest doc + own progress; nodes from the phone copy |
| Play a tile-quest quiz | 0–1 | questions from the phone copy |
| Finish a quiz | 0 reads, ~3–4 writes | attempt, progress, stats |
| Class leaderboard | ~2 | was ~1 per kid per quest (≈200 for a class of 40) |
| Vocab game | 0 (once a week: ~480) | was ~480 every open |
| Space quest map | 0 (once a week: ~49) | was 49 every open |
| Old (V1) Space quiz | ~25 | still a live read per quiz; cache later if Space gets busy |

Rough estimate: **150–300 reads per active child per day** → the free tier covers about 150–300 children a day;
1,000 children a day ≈ ₹300–500 a month.

## Rules for new code
- No live listener (`onSnapshot`) on a list that can grow; read once and keep a phone copy where content rarely changes.
- Every query that can grow has a `limit`. Server functions never accept an unbounded size from the app.
- A Firestore trigger must never write to the collection that triggers it.
- Before adding a paid service (SMS, AI, maps): say what it costs per 1,000 children.
