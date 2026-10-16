# Matchday Masters V1.7 — Statistics and Seasons

GitHub Pages: upload the application files to the repository root, replacing V1.6. Do not upload upgrade.py or previous SQL files.

## Changes
- Season statistics: goals for/against, goal difference, win percentage, best winning and unbeaten runs.
- Season selector for viewing previous season statistics.
- Player season breakdown: appearances, starts, goals, assists, hat-tricks, scored and missed penalties (calculated from finished matches).
- Create a new season from Settings, or select an existing season. Previous seasons and career totals remain available.
- Offline status on loading locally saved changes.
- V1.7.0 version badge and cache bump.

## Important scope and limitations
This release **does not migrate** the existing snapshot storage into normalized Supabase tables. Your working V1.6 cloud snapshot and revision checks are deliberately preserved to avoid data loss. A normalized schema migration needs a separate verified SQL migration and integration test. No new SQL is required for this update.

Back up from Settings before uploading. Cloud data is not safe for real junior player details until row-level access has been tested with separate accounts. Do not use simultaneous match editing from two devices. Offline behavior still needs testing for app termination, cache loss and conflicts.

## Suggested checks
1. Export a backup in V1.6.
2. Upload V1.7 app files and verify V1.7.0 badge.
3. Open Season Statistics and verify results for a completed test match.
4. Settings: create a new season; verify new season stats start at zero, old season stats remain viewable.
5. Log out/in after CLOUD SYNCED and check season selection persists.
