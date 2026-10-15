# Matchday Masters V1.5 — cloud preview

Upload the files in this ZIP (not the ZIP itself) to the **root** of your GitHub Pages repository, replacing the old files. The badge should show V1.5.0. Refresh the browser after deployment.

Supabase connection details are included in `cloud.js` (project URL and publishable key only). Never add a database password, service-role key or secret key to this public repository.

## How it works

- Email/password registration and sign-in via Supabase Auth. Confirm your email first.
- New accounts begin with blank club onboarding.
- The app persists the **entire club state as a JSON snapshot in `public.clubs.settings.app_state`**, protected by the existing club-owner RLS policy. This is an initial cloud integration, **not yet** the full normalized player/match/event table integration.
- Changes are saved to Supabase asynchronously. Wait for the cloud status to show `SAVED` before closing or switching devices. Keep using Export Backup.
- Club data is tied to the signed-in Supabase account. The previous V1.4 local test data is not migrated.
- Player cards, match recording, stats and moments remain the V1.4 interface.

## Important limitations

- **Do not use for real matches yet.** Offline login and reliable offline-to-cloud synchronization, simultaneous edits from two devices, and end-to-end browser testing are not complete. In particular, two devices editing the same club can overwrite each other's changes (last snapshot wins).
- Supabase JavaScript client is loaded from a CDN, so first load/login requires internet.
- Existing SQL tables `players`, `matches`, `match_events` etc. are provisioned but not populated by this preview; all app data is currently stored in the club's private JSON snapshot.
- The app is currently owner-only, not a multi-coach sharing system.
- If you encounter a save error, export a JSON backup before changing pages or signing out.

## Verify security before using children's real details

Supabase SQL Editor: confirm RLS is enabled for `public.clubs`, and the `mdm_clubs_*` policies restrict access to `owner_id = auth.uid()`. Test with two separate accounts and verify neither account can see the other's club. The publishable key is public; RLS is the security boundary.
