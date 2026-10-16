# Matchday Masters V2.0.0 Release Candidate 2

Built from the supplied V1.9.3.1 application. This is a release candidate, **not a security-certified production release**.

## Changes
- Added Settings > Release Checks: read-only consistency checks for player/match/event IDs, invalid event times, missing season assignments, broken player references, and self-assists.
- Prevented double-commit of the same goal in the two-selection goal recorder if the final selection is tapped rapidly.
- Clarified that Reset All Data also syncs deletion to the cloud.
- Fixed a cloud save edge case where an early return without a club could leave an unhelpful Saving indicator.
- Version and service-worker cache bumped to 2.0.0-rc2.

## Installation
1. Export a backup from the current app.
2. Upload index.html, app.js, cloud.js, style.css, sw.js, icon.svg, and manifest.webmanifest to the **root** of your existing GitHub repository.
3. Wait for GitHub Pages to deploy; verify V2.0.0-rc2 in the header.
4. No Supabase SQL changes are required.

## Required release tests (fictional data only)
1. Settings > Release Checks: run and investigate every warning. Existing legacy data may legitimately show missing season IDs.
2. Record a goal and rapidly double tap the final assist selection; verify only one goal/event is recorded.
3. Record goals, assists, penalty misses, substitutions and pitch changes. Verify final match report, player appearances and Moments.
4. Create a new season and confirm historical career totals remain correct.
5. Close/reopen offline mid-match and during half-time; verify timer, score and queued events; reconnect and confirm on second device.
6. Test a cloud conflict using two devices (with backup first); ensure no silent overwrite.
7. Verify RLS for the **new** mdm_primary_state and structured tables, including cross-account SELECT/INSERT/UPDATE/DELETE. Prior tests of the original clubs table are not sufficient.
8. Confirm a backup can restore on a **test account**, not your real club.

## Known limitations
- Saving still sends a complete club snapshot to an RPC, which also maintains structured records. Individual event uploads and concurrent editing are not implemented.
- Offline cold-start depends on cached assets and existing authentication state.
- Browser local storage can be cleared by the device. Export regular backups.
- Security isolation of the new primary-state RPC and tables has not been independently verified in this environment.
- No automated end-to-end browser test against the live Supabase instance was performed.

## RC2: Resolve a cloud conflict
When CLOUD CONFLICT appears, open Settings > Cloud Health. Export a local JSON backup first (Settings > Data & Backups), then select **RELOAD FROM CLOUD**. Two confirmations warn that unsynced local edits will be discarded. The action only reads Supabase; it does not upload stale data. It validates the remote snapshot and writes it locally before marking the device synced. If loading fails, local data and the conflict state are retained.

For the current test: the cloud version should retain Player A #10; the offline phone edit to Player B #20 will be discarded (unless you kept the exported JSON backup). Do not import the stale backup into the live account.

No SQL changes required. Security checks on the structured tables are still pending.
