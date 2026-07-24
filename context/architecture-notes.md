# DevPrep — Architecture Notes

> Reasoning behind the **storage, versioning, and rendering** decisions referenced in [`project-overview.md`](./project-overview.md).
> This file is **decisions + rationale only** — schema fields live in the overview's [Data Model](./project-overview.md#-data-model) section.

---

## 🟡 Staleness (Skill Bank vs CV)

**Not stored anywhere.** CV edits stay local to that CV (per the CV Editing feature decision) rather than syncing back to the Skill Bank.

Staleness is **computed at view time, on demand** — by diffing a CV's saved field values against the live Skill Bank when a user opens that CV. It is *not* precomputed or cached, since a stored "stale" flag would itself need invalidation logic and could go stale.

---

## 📊 Comparison Engine: Relational, Not JSON

`SkillBankEntry`, `Experience`, `Certification`, `JobPost`, and `JobPostRequirement` stay as **normalized relational tables** (indexed by `userId`) — not JSON blobs.

- The deterministic gap comparison (set-diff / weighted scoring) runs as a **real SQL join** between `SkillBankEntry` and `JobPostRequirement` on `skillId`.
- `Comparison.gaps` is a **cached JSON result** of that computation — generated once per comparison run, recomputed only when the user re-runs it. It is **not** a live source of truth.

---

## 📄 CV Storage: Snapshot, Not Live Join

CV content is stored as a **point-in-time JSON snapshot** (`CVVersion.content`), not assembled live from the Skill Bank on every read.

**Why:**
- **Local-only edits** — a CV needs its own copy of the data to diverge from the Skill Bank.
- **Staleness needs two independent values** to diff (frozen snapshot vs. live source) — impossible if the CV were just a live view.
- **Historical accuracy** — if a Skill Bank entry is edited or deleted later, a CV already sent to an employer shouldn't silently change.

---

## 💾 Autosave vs. Versioning

Two separate concerns, **deliberately not merged**:

| Concern | Target | Mutable? | Versioned? | Touches R2? |
| --- | --- | --- | --- | --- |
| **Autosave** | `CV.draftContent` (in place) | ✅ Yes | ❌ No | ❌ Never |
| **Manual Save** | new immutable `CVVersion` row | ❌ No | ✅ Yes | Only on export |

- **Autosave** exists only to prevent data loss.
- **Manual Save** is the *only* action that creates an immutable `CVVersion`. Before creating one, the save endpoint compares a hash of the incoming content (`CVVersion.contentHash`) against the latest saved version's hash — **if unchanged, no-op, no new version.** This keeps version history meaningful (deliberate checkpoints, not a wall of near-identical autosave states) and independently reduces Postgres write volume regardless of autosave frequency.
- **Client-side dirty-checking** (only fire a save request if local state actually changed) is the first line of defense; the **server-side hash check** is the backstop for edge cases like multiple open tabs.

**Tiered autosave cadence** (Pro: continuous · Free: every 5 min · manual Save always available) gates **write/compute frequency** by tier. This does **not** directly gate R2 cost — see below.

---

## 🖨️ PDF/DOC Rendering & R2 Storage

**No share-via-link feature.** Users share CVs by **downloading** a PDF/DOC, not via a hosted link — which removes the need for public-facing stored URLs.

Rendering is **lazy and cached per `CVVersion`**, not per `CV`:
1. The first time a user exports/downloads a given version, it gets rendered and uploaded to R2.
2. The URL is stored in `CVVersion.renderedFileUrl`.
3. Every later download of that same version serves the cached file.

This works because **`CVVersion` rows are immutable** once created — there's never a staleness problem between the cached file and its source content.

**Consequences:**
- **R2 cost is decoupled from save/autosave frequency** — R2 is touched only on actual export, not on every version created. The volume lever from autosave cadence + the diff-check above is really about **Postgres write volume**, not R2 storage cost — keep those two costs mentally separate when reasoning about tiering.
- If `CVTemplate` rendering code changes later (e.g. a layout fix), **previously exported versions keep their original cached rendering** — matching what was actually sent to an employer at the time, rather than silently reflowing.
- Most `CVVersion` rows a user creates while iterating are **never exported**, so most never touch R2 at all.

---

## 🛡️ Rate Limiting

The **manual Save** endpoint reuses DevStash's existing rate-limit utility pattern (same mechanism as its 20 req/hour AI feature cap), applied **per-user**.

This is framed as **spam/abuse protection, not DDOS mitigation** — a single user hammering one button is not a distributed attack. That layer is handled at the **network edge** (Cloudflare, already in front of R2/hosting).

---

## 🧱 Tech Stack

Reused directly from **DevStash**: Next.js 16 / React 19, Prisma 7 + Neon Postgres, NextAuth v5, Cloudflare R2, Stripe, Tailwind + shadcn/ui.

**No new infrastructure** is introduced by any decision above — R2 usage is **additive** (rendered CV files) on the same bucket/service already in the stack.
