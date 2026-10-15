# Matchday Masters — Version 1

A mobile-first football matchday tracker, ready for GitHub Pages. No build tools, accounts or database required.

## Publish with GitHub Pages

1. Create a **public** GitHub repository named `matchday-masters`.
2. Upload **the contents of this folder** to the repository root (not the ZIP itself).
3. Open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
4. Wait for GitHub Pages to publish. Your URL will usually be `https://YOUR-USERNAME.github.io/matchday-masters/`.
5. Open it on your phone. Use the browser's **Add to Home Screen** option if desired.

## First use

The app starts completely blank. Select **Create Your Club**, enter club settings, add players and create a match. Player cards, statistics, milestone previews and memories are generated automatically.

## Data warning

**All data is stored in localStorage on the current browser/device.** It does not sync between devices, and clearing site data can erase it. After each match, use **Settings → Export Backup** to save a JSON file somewhere safe. **Import Backup** restores a backup, replacing current local data. Do not rely on this prototype as the only permanent record.

The app caches its core files for offline use after a successful first load. Browser storage and offline behaviour vary by device. Test offline use before relying on it at a match.

## Notes and current limitations

- This is a functional first version, not yet connected to Supabase.
- Match timer uses real elapsed time and survives closing/reopening the page, but if you leave it running during half-time you must pause it.
- Stats and moments are based on completed matches only.
- A substitute appearance is counted when a substitution event brings a player on.
- Adding a player during a live match registers them in the squad; use substitution to record them entering the pitch.
- Signature is a decorative script rendering of the player's name, not a real signature. Browser card styling uses Google Fonts when online, with offline fallbacks. SVG export uses system font fallbacks and may render slightly differently on other devices.
- All uploaded assets are absent by design; no player photos or signature uploads.
- This prototype is intended for a single trusted operator on one device. Cloud sync, access controls, and sharing permissions will need to be designed before enabling multi-user use, particularly with children's data.
- The built-in reset button deletes local records; export a backup first.

## Project files

- `index.html` — app entry point
- `style.css` — visual design
- `app.js` — application, data and milestone logic
- `sw.js` — offline cache
- `manifest.webmanifest` — installable app configuration
- `icon.svg` — app icon
