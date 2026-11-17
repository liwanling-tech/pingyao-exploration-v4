# 云游见筑｜我的平遥探索之旅

An educational prototype for a six-stop exploration of Pingyao Ancient City.

## Visit

https://liwanling-tech.github.io/pingyao-exploration-v4/

This repository contains only the public static website files. It mirrors the published Sites version 9, source commit `e397689b3ffd1e106c41d8fb9ebca82fe1a38f31`, exported on 2026-11-17. The original Sites website is unchanged.

## Hosting and updates

GitHub Pages publishes from the root of the `main` branch. `.nojekyll` disables Jekyll processing. No dependency installation or build step is required. Hash routes such as `#/route`, `#/stop/rishengchang`, and `#/journey` work under the repository subpath.

To update this mirror, replace the public website files with a new static export while retaining `.nojekyll`, this README and `.gitignore`, then commit and push to `main`. Editing or publishing the original Sites project does **not** automatically update this repository.

As long as this Pages URL remains the same, a QR code encoding it does not need to change after updates. The older QR code encoding the Sites URL continues to open the original Sites website, not this GitHub mirror.

## Privacy and capability boundaries

- Route progress, nickname, discoveries and postcard settings remain in browser local storage, with no cross-device account sync. A different domain has separate local records.
- The avatar Q&A is a local preset demo, not a live avatar service.
- Building viewers and local model uploads run in the browser. Uploaded personal files are not sent to a server.
- Artwork is teaching illustration, not measured historical reconstruction. Model and image attribution is retained alongside the site assets and on [Illustration Credits](./art-credits.html).
- Publishing here does not guarantee availability on every network, including Mainland China or WeChat. Test on the actual student devices and networks.

## Attribution

Keep the individual asset license and attribution notices. This export does not place all artwork or third-party assets under a new blanket license. See the in-site credits, `art-credits.html`, and notices under `assets/` and `vendor/`.
