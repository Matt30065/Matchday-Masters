# Matchday Masters V1.7.1 — Cloud Status Fix

This maintenance release fixes the status indicator being reset to CONNECTING whenever the app redraws a page. The last known status is now restored after every render. Successful cloud saves show the time of the last sync.

No Supabase SQL changes are required. The database and saving mechanism are unchanged.

## Install
1. Export a backup from Settings before updating.
2. Upload the application files from this ZIP into the root of your existing GitHub Pages repository, replacing the older files.
3. Wait for deployment and check for V1.7.1 at the top of the page. If necessary, fully close/reopen the installed app or reload the website.

## Test
1. Add a fictional player and navigate back home without refreshing. The status should progress from SAVING to CLOUD SYNCED with a time.
2. Refresh the app on another device to confirm the player is present.
3. Turn airplane mode on and off to check offline/connection messaging.

This is a focused status-display fix, not a full offline or simultaneous-editing reliability certification. Use fictional player data until account isolation has been security-tested.
