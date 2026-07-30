# Certifications Data Spec

## Overview

Replace the mock data behind the Certifications screen
(`src/lib/certifications-data.ts`) with real queries against `Certification`,
joined to its linked `Skill`s. Keep the screen identical — cards, expiry badges
(none/active/expiring-soon/expired), skill chips. Data-source swap only.

Independent of specs 02/03 (no cross-entity join beyond skills), but sequenced
after Skill Bank per the folder's dependency order.

Do not touch Add/Edit/Delete — `CertificationsView.tsx`'s mutations stay local
`useState` until the mutation wave.

## Requirements

- Create `src/lib/db/certifications.ts` exporting:
  - `getCertificationExpiryStatus(expiryDate, now?)` — **pure function, no DB
    access, move verbatim** from `src/lib/certifications-data.ts` unchanged (same
    60-day `EXPIRING_SOON_WINDOW_DAYS` threshold). This function is also reused by
    `scripts/test-db.ts`'s verification checks — do not fork it into two copies;
    keep a single source of truth (either re-export from the new file and update
    `test-db.ts`'s import, or leave it in a shared non-DB location if that's
    cleaner — decide during implementation, just don't duplicate the logic).
  - `getCertificationsData(): Promise<CertificationsData>`, same shape as today
    (`certifications: CertificationView[]`, `allSkills: SkillOptionView[]`):
    - `certifications` — `prisma.certification.findMany({ where: { userId }, include: { linkedSkills: true } })`.
      Map `linkedSkillIds`/`linkedSkillNames` from the included relation directly.
      `issueDate`/`expiryDate` — convert Prisma `Date`/`Date?` to `string`/
      `string | null` via `.toISOString()`. Compute `expiryStatus` by calling
      `getCertificationExpiryStatus(expiryDate)` on the converted value.
    - `allSkills` — same system-wide `Skill` query as prior specs.
- Import `getCurrentUserId` from `src/lib/db/current-user.ts`.
- Update `src/app/certifications/page.tsx` to `await getCertificationsData()` from
  the new file.

## Non-Goals

- No changes to `CertificationEntryPanel`, `DeleteCertificationDialog` — still
  local state, addressed in the mutation wave.

## References

- `src/lib/certifications-data.ts` — the mock-backed file being replaced.
- `scripts/test-db.ts` — already imports `getCertificationExpiryStatus` from this
  file for its own verification checks (per `context/current-feature.md`'s
  2026-07-30 Seed Data history entry) — check its import path doesn't break.
- `context/features/seed-spec.md` — confirms 4 seeded `Certification` rows for the
  demo user covering all 4 expiry states: `cert-aws-saa` (active/expiring-soon),
  `cert-terraform-associate` (active, far future), `cert-cka-expired` (past
  expiry), `cert-psm` (no expiry date, no linked skills).

## Verification

- `/certifications` shows the same 4 real cards `npm run db:test` reports, with all
  4 expiry badge states present and correct, and `cert-psm` showing no linked
  skills.
- Loading/Error/Empty states still render correctly (temporarily forced, then
  reverted).
- `npm run lint` / `npm run build` pass.
