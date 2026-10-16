# Matchday Masters V1.9.1 — Structured Mirror (safe first step)

## Install in this order
1. Export a backup from V1.9 (Settings > Export Backup). Keep the V1.9 ZIP as a rollback.
2. In Supabase SQL Editor, run `supabase-v1.9.1-structured-mirror.sql` **once**. It creates five private, structured mirror tables and a guarded RPC. It does **not** modify or remove the original snapshot or seven existing tables.
3. Upload `index.html`, `app.js`, `cloud.js`, `style.css`, `sw.js`, `manifest.webmanifest`, and `icon.svg` to your existing GitHub Pages repository root. **Do not upload the SQL file or patch.py.**
4. Wait for V1.9.1 badge. Sign in online. Go to Settings > Cloud Health > REFRESH STRUCTURED MIRROR.
5. Confirm mirror counts for players, matches, events. Add a fictional player, wait for CLOUD SYNCED, refresh mirror, and confirm counts increase. Test from the second device.

## Scope and safeguards
This is **phase one**, not a cutover: the existing `clubs.settings.app_state` snapshot remains the authoritative read/write source. The structured mirror contains separate season, player, match and event rows (with original source IDs and raw event/match payloads) and a revision/count ledger. The mirror is read-only to browser clients; the authenticated RPC rebuilds it transactionally from the cloud snapshot after ownership verification. Mirror failure **does not mean the primary cloud save failed**; inspect Cloud Health. This avoids changing the previously tested offline sync logic.

The pre-existing `seasons`, `players`, `matches`, `match_players`, `match_events`, and `moments` tables are **not yet used** as the app's source of truth. Migration to those canonical tables and recovery/concurrency testing remain outstanding. Do not use real children's data until release testing is complete.

## Rollback
If the mirror fails or you see unexpected behaviour, re-upload the previous V1.9 application files. No data migration is required because the source snapshot was not modified. Keep the new mirror tables for diagnosis; no destructive SQL is needed.
