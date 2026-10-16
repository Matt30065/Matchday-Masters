# Matchday Masters V1.8.0 — Moments Engine

This version builds on the working V1.7.1 cloud-connected application.

## What's new
- Premium collectible moment tiles with player name, shirt number and decorative script signature.
- Achievements derived from completed match records: first goal, career/season goal totals, assists, hat-tricks, appearances, starting streaks and scoring streaks.
- Upcoming milestones for goals, assists, appearances and consecutive starts.
- Club records for top scorer, most appearances, most assists and biggest victory.
- Tapping an achieved moment opens the original match report.
- Achieved moments are recalculated from match history after a match is deleted, rather than stored as permanent stale entries.

## Deployment
1. Export a backup in Settings.
2. Extract the ZIP and upload the app files to the root of the existing GitHub Pages repository, replacing existing files.
3. Confirm the version badge shows V1.8.0. No new Supabase SQL is needed.

## Limitations
- This is a development build; full browser and security testing are outstanding.
- Moments are computed from completed matches only. If you imported aggregate player totals without match events, the engine cannot reconstruct historical achievements.
- Matches with identical dates are ordered by ID. For accurate same-day milestone ordering, enter matches in chronological order and avoid ambiguous date-only ordering.
- Club records are derived from current completed matches; historical edits and deletions change records automatically.
- The cloud schema is unchanged; normalized database migration and security verification remain future work.
