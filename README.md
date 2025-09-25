# Facebook Reels Blocker (except /reels)

This Chrome extension hides Facebook Reels across most of facebook.com while allowing you to visit and watch content on the dedicated `facebook.com/reels` page.

## Install (Chrome / Edge)

1. Open the browser and go to `chrome://extensions/` (or Edge: `edge://extensions/`).
2. Enable "Developer mode" in the top right.
3. Click "Load unpacked" and select the `fb` folder.
4. Visit Facebook, refresh the page.

## How it works

- A content script runs on `*.facebook.com/*` and removes/hides UI surfaces that look like Reels.
- It does nothing when the URL matches `facebook.com/reels`, so you can watch Reels there.
- It uses a MutationObserver to keep blocking Reels as the page dynamically updates.

## Notes

- Facebook frequently changes their DOM. If something slips through, open an issue with a screenshot/URL.
- This extension doesn't request any special permissions.

## Development

- Files:
  - `manifest.json`: MV3 config
  - `src/content.js`: logic to detect and hide Reels surfaces
  - `src/content.css`: fallback CSS rules


