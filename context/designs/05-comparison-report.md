# Comparison Report

Frame: `Screen — Comparison Report`

## Goal
The payoff screen — turns the deterministic gap analysis into something the user can act on immediately, either by closing a skill gap or generating a tailored CV.

## End-to-end user flow
1. Land here after "Run comparison" from a Job Post, or by clicking a comparison card from the Dashboard/Comparisons list.
2. See the fit score ring, colored by threshold (e.g. below 50 red, 50–74 amber, 75+ green) — consistent with the gap-severity palette used elsewhere.
3. Scroll the Skill Gap Analysis list; "Met" skills are collapsed/de-prioritized by default (expand to see them) since they're the lowest-priority information here.
4. Click a "Missing" or "Below required" row → jump to that skill's entry in the Skill Bank (pre-filled if it doesn't exist yet, opened for edit if it does).
5. Click a Rule-based Advice card → deep-link to the relevant action — a skill-gap tip goes to the Skill Bank add-entry flow, a phrasing/bullet tip goes to the CV Editor.
6. Click "Re-run comparison" → recalculates against the *current* Skill Bank state and creates a **new** Comparison record (never overwrites the old one) — see a small trend indicator if this job post has been compared before ("+12% since last run").
7. Click a primary "Generate CV for this role" action → goes to the CV Template Picker to start a CV tailored to this job post.

## States & edge cases
- First-ever comparison for this job post: no trend indicator, just the score
- A gap list long enough to scroll: "Met" section needs an explicit expand control, not just get cut off (as it currently is in the mock)

## Pencil Prompt

> On the `Screen — Comparison Report` frame, finish these end-to-end: (1) define and apply explicit fit-score ring color thresholds (e.g. below 50 red, 50-74 amber, 75+ green) matching the gap-severity palette; (2) make each gap row in Skill Gap Analysis clickable (add a hover state) since it links out to the Skill Bank; (3) group the gap list into "Needs attention" (Missing/Below required, expanded by default) and "Met" (collapsed by default with an expand/show-all control) so the met skills don't just get cut off at the bottom; (4) make each Rule-based Advice card clickable with a hover state; (5) add a small trend indicator near the fit score for re-runs of the same job post (e.g. "+12% since last run", with an up/down arrow) — and confirm the first-ever-run variant simply omits it; (6) add a primary "Generate CV for this role" button near the top of the report, distinct from "Re-run comparison". Keep the score ring, severity colors, and card styling consistent with the existing frame.
