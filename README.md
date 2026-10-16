# Matchday Masters V2.0.0 — Final Release Package

This package is based on the tested V2.0 RC2 application. It retains the approved matchday interface, player cards, Moments Engine, cloud saving, conflict detection, Reload From Cloud, backup import/export, and the read-only data diagnostics in Settings.

## Deploy to GitHub Pages

1. In the current app, go to Settings and **Export Backup**. Keep the JSON file somewhere safe.
2. Extract this ZIP. Upload the application files at the **root** of the existing `Matchday-Masters` GitHub repository (not the ZIP or an enclosing folder).
3. Commit changes, wait for the GitHub Pages deployment to finish, then open `https://matt30065.github.io/Matchday-Masters/`.
4. Verify the badge shows **V2.0.0**. You may need to close/reopen the installed app after its cache refreshes.
5. Verify Cloud Synced, squad, a previous match report, player statistics, and a moment. Keep the backup.

**No additional Supabase SQL or configuration changes are required.** Do not delete existing Supabase tables or records.

## Security test housekeeping

Delete temporary `security-check.html`, `security-write-check.html`, and `security-final-check.html` from your GitHub repository if present. These are not part of this release ZIP.

## Notes and limitations

- This is a release package, not a formal security certification. The account-isolation checks reported during testing passed, but no independent penetration test has been performed.
- Continue using one device to record/edit each match. Cloud conflict detection prevents silent overwrite; it does not merge edits automatically. Export a backup before choosing Reload From Cloud.
- Offline reopening and sync worked in the user's tests, but may vary by browser/device; an external Supabase JavaScript library is loaded from a CDN and can affect uncached offline startup.
- Keep periodic JSON backups. Browser local storage can be lost if browser/site data is cleared.
- The structured tables are maintained as a transactional projection of the primary state; this release does **not** send each match event as a separate cloud API request.
- For children's information, obtain appropriate club/parent permissions, limit access, and do not publish identifiable player data without permission.
- `Settings > Data Diagnostics` provides read-only checks; it is not a substitute for end-to-end testing.
