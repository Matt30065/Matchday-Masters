# Matchday Masters V1.9.2 — Fresh-data structured storage test

This release keeps the approved matchday UI. It loads fresh club data from `mdm_primary_state`, not the old `clubs.settings.app_state`. Old test data is NOT deleted. Your existing login remains valid. **Back up V1.9.1 before installing.**

## Install
1. Run `supabase-v1.9.2-primary-storage.sql` in Supabase SQL Editor (once). The V1.9.1 structured mirror upgrade must already be installed.
2. Upload `index.html`, `app.js`, `cloud.js`, `style.css`, `sw.js`, `manifest.webmanifest`, `icon.svg` to the GitHub Pages repository root. Do not upload the SQL file or this README.
3. Confirm version V1.9.2. Log in and complete fresh club setup. Your existing Supabase account is reused.
4. Add a fictional player, wait for CLOUD SYNCED, then refresh a second device and confirm the new club and player appear.
5. Record a test match with a goal, wait for sync and verify it on the second device. Test offline separately.

## Implementation detail and limitations
- The primary state is a version-checked JSON document in `mdm_primary_state`. Each successful write **atomically rebuilds** individual `mdm_structured_players`, `mdm_structured_seasons`, `mdm_structured_matches` and `mdm_structured_events` records. A compatibility copy is also stored in `clubs.settings.app_state` for the projection function. This is **not yet incremental per-event saving**; each save transmits the full current state. Do not use concurrent recording devices.
- New installs do not import the old test club state. Existing legacy records remain in Supabase for rollback and can be removed later, after verification.
- Browser offline storage is still device-local. Test interrupted uploads and forced closure before recording real matches.
- The structured data tables have owner-scoped RLS read policies and no direct browser write grants. The owner-checked RPC writes the records transactionally.
- If an error appears, **stop and do not reset your database**. Return to V1.9.1 and report the exact error.
