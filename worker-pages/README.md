# Worker pages (live copies)

These are the exact files the ygh-backyard worker serves, copied here so the design can be edited against the real thing.
They start from the files in the repo root (index.html, ar.html, design.html) and have the worker wiring added on top:
the signup upload, the in-app-browser hand-off, the customer data (`/design/<token>`), the live 3D plan, the phone "live PDF"
view, the in-page AR overlay, the page copy changes.

| file | serves | started from |
|---|---|---|
| landing.html | https://ygh-backyard.raitislm.workers.dev/start | /index.html |
| ar.html | /ar | /ar.html |
| design.html | /r/<token> (customer page) | /design.html |
| design-v2.html | /r2/<token> (alternative phone styling) | design.html + v2 patch |
| result.html | /r0/<token> (first customer page, kept for comparison) | own |
| review.html | team verify page | own |
| ../builder/index.html | team builder | own |

Image, model and sky paths are relative (`img/...`, `nordwood-*.glb`), the worker rewrites them to the GitHub Pages URLs
when serving, so these files also open straight from the repo on Pages.

How edits flow: the root files (index.html, ar.html, design.html) stay Kaspars' source. Raitis re-applies the worker wiring
on top of them with a patch chain, so design changes made in the root files reach the live pages on the next sync.
Changes made directly in this folder are a reference only; tell Raitis which parts to carry over.
