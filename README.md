# Matchday Masters V1.6 — Cloud safety preview

## Install
1. In Supabase SQL Editor run `supabase-v1.6-upgrade.sql` once. Do not rerun the original setup SQL.
2. Back up your club using Settings > Export Backup in V1.5.
3. Upload the website files (`index.html`, `app.js`, `cloud.js`, `style.css`, `sw.js`, `manifest.webmanifest`, `icon.svg`) to the **root** of the existing GitHub Pages repository. The SQL file is not needed on GitHub.
4. Confirm V1.6.0 is shown and sign in online. Allow the app to fully load before testing offline.

## What this update actually delivers
- Local-first saves per signed-in account, with a cloud status indicator.
- Automatic retries after reconnection and when returning to the tab.
- Cloud revision checking: a stale device cannot silently overwrite newer club data. A conflict blocks cloud saving until manually resolved. Export a backup first.
- Prevents signing out while changes are unsynchronised.
- Existing V1.4-style match UI is retained.

## Important limitations
- This release **still stores the club as a single JSON snapshot** in `clubs.settings.app_state`; it does NOT yet populate individual player/match/event tables.
- Offline sign-in is not supported. Offline match recording is preliminary and depends on the application and its external Supabase library being cached by the browser. Test airplane mode before trusting it.
- Multiple devices editing the same club concurrently are **not merged**. Revision checks detect conflicts rather than combining edits. If a conflict occurs, export a backup before refreshing.
- Browser storage can be cleared or evicted. Export backups regularly and wait for CLOUD SYNCED.
- RLS cross-account security has not been independently tested; use fictional player details until verified.
- JavaScript syntax checked; full end-to-end mobile and cloud testing is outstanding.
