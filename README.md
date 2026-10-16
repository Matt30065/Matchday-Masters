# Matchday Masters V1.9.3 — Match Recovery Test Build

Upload the web app files at ZIP root to the existing GitHub Pages repository. No new SQL is required. Do not upload `README.md` unless desired.

## What changed
- Home screen highlights an unfinished match, its score, phase, and live clock, with the existing RESUME LIVE MATCH action.
- Local cloud snapshot is explicitly persisted on pagehide and when the app is backgrounded.
- A failed cloud load no longer describes a cached local copy as definitely offline or cloud-synced.
- Version and service worker cache bumped to V1.9.3.

## Important limitations
- This is still a full-state cloud snapshot save, not independent event uploads.
- The clock uses wall-clock time while running. If a browser is closed during play, elapsed time continues. If play stops while the app is closed, adjust the clock manually on return.
- Only one device should edit a match at a time. Cloud revisions help detect conflicts, but cannot guarantee recovery from every interrupted upload or concurrent edit.
- Offline reopening depends on the app and authentication assets already being cached. The Supabase authentication library is CDN-hosted and may prevent a cold offline launch.
- Browser storage can be cleared by the user or device; export backups regularly.

## Suggested tests (fictional data only)
1. Create a match and kick off; close the tab, reopen online and verify score, phase and clock.
2. Pause at half time, close/reopen, confirm clock does not advance until second-half kick-off.
3. Open app online, turn on airplane mode, record a goal, close and reopen while still offline. Check whether the cached app loads and goal remains. If offline reopening fails, **do not clear site data**; reconnect and recover the locally saved event.
4. Reconnect and wait for CLOUD SYNCED, then verify on another device.
5. Try two-device editing only with throwaway test data; export backups first.

This build has passed JavaScript syntax checks, not full browser-based or live database end-to-end tests.
