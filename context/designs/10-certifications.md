# Certifications

Frame: none yet — new frame, design from scratch

## Goal
A simple CRUD list for certifications — lower complexity than Experience/Projects, but still needed since no existing screen owns this data.

## End-to-end user flow
1. "Certifications" sits in the same "Career" sidebar group as Experience and Projects.
2. Click "+ Add certification" → a form: name, issuer, issue date, optional expiry date, optional credential URL, optional skill links.
3. Click an existing entry → edit in the same form.
4. Delete → confirmation.
5. See a visual flag on entries that are expired or expiring soon (e.g. within 60 days), based on the expiry date.
6. Empty state: "No certifications yet."

## States & edge cases
- No expiry date set: treated as permanent, no expiry flag ever shows

## Pencil Prompt

> Design a new "Certifications" screen from scratch, consistent with the existing DevPrep dark theme and component patterns. Include: (1) a list of certification cards — name, issuer, issue date, expiry date (or "No expiry"), a small "Expiring soon" or "Expired" badge when relevant (amber/red, matching the existing severity palette), and skill chips if any are linked; (2) an "+ Add certification" button opening a right-hand panel with fields: Name, Issuer, Issue date, Expiry date (optional), Credential URL (optional), and an optional skill multi-select restricted to the taxonomy; (3) an empty state ("No certifications yet" + primary CTA). Add "Certifications" as a sidebar item under the same group as Experience and Projects.
