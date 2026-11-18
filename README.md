# HOME//OS

An ad-free, retro-futuristic home screen for Samsung TVs (Tizen), installed with TizenBrew Installer.

- Your apps and HDMI inputs in a carousel: the middle one is in focus, ◀ ▶ move it, OK opens it.
- The focused app's name fills the top of the screen in its own color.
- Working people's and socialist history from around the world, matched to today's date, with an archival photo from Wikipedia and a daily quote.
- Live weather from Open-Meteo (no account needed).
- A screensaver of public-domain paintings from the Art Institute of Chicago, after 10 minutes on the home screen.
- No accounts, no keys, no tracking. It talks only to Open-Meteo, Wikipedia and the Art Institute of Chicago.

## Install

1. **On the TV**: Apps → type `1 2 3 4 5` on the remote → turn on Developer mode, enter your computer's IP in Host PC IP, restart the TV.
2. **On your computer**: open TizenBrew Installer and connect to the TV.
3. **Install from GitHub**: type `stevwya77/home-os-tv`. On 2023 and newer TVs it asks you to sign in to your Samsung account once, to sign the app for your TV.
4. **Make it open first**: Settings → General → Start Screen Options → Autorun Last App on, and move HOME//OS to the first spot in the Home bar.

To remove it: Apps → HOME//OS → Delete. Nothing else on the TV is changed.

## On the TV

- ▲ goes to Settings: which HDMI port each console is on, and when the screensaver starts.
- Any key ends the screensaver.

## Make it yours

- Apps: `ITEMS` in `web/app.js`.
- History and quotes: `web/history.js`, one line each.
- Weather location: `PLACE` in `web/app.js`.

Build the package with `python3 build.py` (→ `home-os-tv.wgt`). Preview it by opening `web/index.html` in a browser (`?saver` shows the screensaver).
