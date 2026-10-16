# Matchday Masters V1.9.0 — Cloud safety checks

This is a **conservative security and reliability checkpoint** built from V1.8.2.1. The approved matchday UI, Moments, and cloud snapshot storage are unchanged.

## What's included
- A **Cloud Health** panel in Settings, showing last confirmed upload, pending local changes, conflict status, and a **read-only** server revision check.
- A **Retry Sync** button and a best-effort browser warning when closing a page with pending edits.
- Version and cache update to V1.9.0.
- `supabase-v1.9-security-audit.sql`: read-only SQL to inspect RLS policies, anonymous permissions, and snapshot RPC access.

## Installation
1. In V1.8.2, export a backup and wait for CLOUD SYNCED.
2. Upload the app files (index.html, app.js, cloud.js, style.css, sw.js, manifest.webmanifest, icon.svg) to the GitHub repository root. **Do not upload the SQL audit to GitHub.**
3. Check the V1.9.0 badge. In Settings, use CHECK CLOUD to compare revisions.
4. Run `supabase-v1.9-security-audit.sql` in Supabase SQL Editor. This only reads metadata; it does not modify tables.
5. Check that all seven tables show `rls_enabled = true`, all `anon_* = false`, and `anon_can_save_snapshot = false`. Review policy text and run a separate two-account access test before storing children's real details.

## Known limits
- This release **does not** migrate snapshot JSON into normalized tables. That migration requires a separately staged, reversible process with verification of existing data and is still outstanding.
- A matching cloud revision does not mean another browser has refreshed its display. Do not record the same match on two devices at once.
- Browser close warnings may be suppressed; always wait for CLOUD SYNCED and export backups.
- Offline caching of the Supabase JavaScript CDN remains a limitation for cold-start offline use. Do not rely on this app as the sole match record yet.
- RLS metadata inspection is **not** proof of tenant isolation. Test with two separate accounts before real child data.
