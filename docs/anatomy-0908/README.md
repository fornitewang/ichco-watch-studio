# Anatomy and material orbit — 2026-09-08

This update addresses translucent statues over columns, expands the concept watch into two scroll chapters, and adds a draggable strap-material orbit to both public entry points.

## Behavior

- Statues are opaque, darkened with lighting filters, and seated in separate shadowed pediment niches. Foreground paper cuts, statues and the temple move at different rates.
- The first chapter lasts 430 svh. Title → focus → clearly assembled hold → coordinated diagonal separation → annotation reading. Scrub: 1.5. All seven outer groups begin at the same assembly origin. The existing Roman dial, hands, brass/steel gradients and layered movement illustration remain the visual basis.
- Seven main groups: crystal, bezel, hands, dial, wheel train/bridges, crown/stem, case. The second 300-svh chapter begins with a complete movement and separates rotor, barrel and balance/hairspring from the remaining wheel train and bridges. These are ten major conceptual groups, not a full engineering bill of materials.
- The original embedded balance drawing is removed when installing the separable balance. A detached balance does not leave a duplicate functioning balance on the base.
- Label leaders terminate outside the projected part outline. Mobile movement positions are calculated separately, leaving room for plain-language labels.
- Three generated material studies follow the user's straight, side-by-side strap references: silver mesh, olive rubber, black embossed leather.
- The material orbit uses X/Z motion and slight yaw. Automatic movement is approximately one revolution per minute. Fine-pointer hover pauses; primary pointer capture allows horizontal dragging in either direction; touch release resumes. Vertical touch gestures scroll the page. Controls and keyboard provide alternatives. Offscreen/hidden tabs suspend animation; reduced motion initially pauses it.
- Shared scripts: assets/codex-motion.js and assets/strap-orbit.js. Shared additions: assets/temple.css. Root and /codex/ have matching content and corrected relative links.

## Content boundaries and research

Product data, catalog behavior, companion artwork and the original Three.js studio are unchanged. The original studio entrance/72 hero frames are preserved in its unchanged file. No real-product geometry QC or iPhone physical-device testing is claimed.

Myth/component pairings are original metaphors, identified as such in the page's source note. They are not ancient stories about wristwatches and do not assert that Athena used sapphire. Greek sappheiros may have referred to lapis lazuli; the page distinguishes this from modern sapphire crystal.

- GIA, Sapphire History and Lore: https://www.gia.edu/sapphire-history-lore
- Homeric Hymns, 18, 20, 21, 24, 28, 29, 31, 32: https://www.theoi.com/Text/HomericHymns3.html (Evelyn-White translation)
- Hesiod, Theogony, 560 onward (Prometheus and fire): https://www.theoi.com/Text/HesiodTheogony.html
- Homer, Odyssey 10, 1–26 (Aeolus, keeper of winds): https://www.theoi.com/Text/HomerOdyssey10.html
- Federation of the Swiss Watch Industry, mechanical-watch subassemblies: https://www.fhs.swiss/eng/mechanical-quartz.html

## Assets

The three assets were produced with the built-in image generator after visual inspection of the user's Desktop/watch references. Local-file reference loading was unavailable in the generator's sandbox, so the final generation used written visual descriptions of the inspected references. No reference images were uploaded by an alternate route. Actual generation prompts are in asset-prompts.json.

- assets/strap-study-mesh.webp — 1024 × 1536, alpha, 214,606 bytes.
- assets/strap-study-rubber.webp — 1024 × 1536, alpha, 88,830 bytes.
- assets/strap-study-leather.webp — 1024 × 1536, alpha, 193,628 bytes.

Only format compression was applied after generation. Original generated PNGs are preserved outside the repository. Existing temple background and statue files were reused without raster editing.

## Verification

The browser report records Chrome at 1440×1000, 390×844, 320×568, 844×390, 768×1024 and 3840×2160; Windows WebKit at 390×844 and 844×390; reduced-motion and blocked-CDN fallbacks.

Checks include assembled hold and reverse scrolling, rendered alpha-mask separation and viewport bounds, leader endpoints, mobile detail-label avoidance, horizontal overflow, actual CDP touch gestures, pointer dragging, pause/resume, keyboard navigation, and protected Git blob checks. Screenshots were visually inspected and drove corrections to mobile component positioning, crown leader clearance, narrow labels and landscape footer spacing.

Local reproducible scripts and full-resolution screenshots are under the anatomy-0908 work folder. Browser report in this directory is from the final validated source. Deployment verification is recorded after publishing.

