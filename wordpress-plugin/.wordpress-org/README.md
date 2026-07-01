# WordPress.org directory assets

These files are **not** shipped in the plugin ZIP. They are uploaded to the
WordPress.org SVN `/assets` folder and shown on the plugin's directory page.
The `10up/action-wordpress-plugin-deploy` action (see
`.github/workflows/wp-deploy.yml`) syncs this folder automatically on release.

| File | Purpose |
|---|---|
| `icon.svg` | Vector plugin icon (preferred by wp.org) — brand gradient + white mark |
| `icon-256x256.png` / `icon-128x128.png` | Raster icon fallbacks |
| `banner-772x250.png` / `banner-1544x500.png` | Directory header banner (icon overlays on the right) |
| `screenshot-1.png` … | Directory screenshots (captions live in `botiko/readme.txt` → `== Screenshots ==`). **To add.** |

## Regenerating icon + banner

PNGs are generated from the brand SVGs in `apps/web/public/` (mark + wordmark)
composited over the brand gradient (`#6366F1 → #4338CA`). If the brand assets
change, regenerate them (requires `svglib`, `rlPyCairo`/`pycairo`, `Pillow`) and
keep `icon.svg` in sync by hand.

See `../PUBLISHING.md` for the full submission and release process.
