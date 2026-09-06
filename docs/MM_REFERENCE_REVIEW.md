# MM NH38 reference update — 2026-09-07

This update targets the **black NH38 open-heart configuration**. It does not combine its dial with the blue NH35 date variant.

## Official evidence

- [Product page](https://www.ichco.com.tw/products/ichco-customize-seikomod-marinamilitare)
- [Black NH38 front](https://cdn.store-assets.com/s/1030319/i/91622854.jpeg)
- [Black NH38 oblique](https://cdn.store-assets.com/s/1030319/i/91622853.jpeg)
- [Blue date variant](https://cdn.store-assets.com/s/1030319/i/94623993.jpeg)

The photos establish that the open-heart model exists, and that the 12-hour bezel has black raised numerals. Earlier handover statements saying that no open-heart variant exists, or that these numerals must be white, are incorrect.

Approximate front-photo measurements (perspective and reflections limit accuracy):

| Feature | Photo estimate | Implementation / rendered evidence |
|---|---|---|
| Aperture radius / dial radius | 0.32–0.34 | Alpha-mask measurement: 0.318 |
| Aperture left offset / dial radius | approximately 0.47 | Alpha-mask measurement: 0.471 |
| Case width / bezel diameter | approximately 1.0–1.04 | 2.04-unit cushion around a 2.0-unit bezel |
| Crown bridge outward projection / bezel diameter | approximately 0.17 | Half-ellipse with 0.35-unit outward radius |
| Bridge vertical span / bezel diameter | approximately 0.60 | 1.16-unit span |
| Lug tip span / bezel diameter | approximately 1.185 | 2.40-unit tip span |

These are reference-derived estimates, not manufacturing dimensions.

## Changes

- Selecting MM starts with the black open-heart outfit. A dedicated button restores it without resetting the selected lighting.
- The official product link sits beside that button.
- MM exposes its verified black 12-hour bezel, instead of charging for color options that were not rendered.
- The case is narrower and uses a bowed cushion silhouette. MM has separate lug and strap attachment dimensions.
- The bridge is a half-ellipse with a brushed top; the crown sits in its opening.
- Hour markers are narrower, hands use straight luminous blades, and the seconds hand has a luminous dot and red tip.
- The 12-hour triangle points toward the dial. Numerals are black against a matte charcoal surface.
- The aperture is larger. Its movement includes a balance, hairspring and fixed bridge/screw details.
- The black dial uses a deterministic dark dimple pattern. Black leather uses a corrected linear color and an embossed normal texture.
- The NH70 skeleton choice does not add a duplicate open-heart balance.
- The specification copy uses customer-facing labels and clearly identifies estimated pricing.

## Validation

- All three inline JavaScript blocks compile.
- Existing geometry suite passes for SUB, MM, PRO, DAY and ROY. Santos passes its supported UI check; that suite skips its separate dial geometry.
- 26 functional/browser checks pass: all six series, actual option clicks, preset restore, summary labels, six strap choices, seven dial choices, skeleton behavior, and phone widths 320/390/430.
- No page runtime errors in those checks.
- Repeated rebuilds end at 16 / 16 / 16 textures.
- Six view captures, front detail crops, a reference comparison and band/dial contact sheets were inspected locally.
- Embedded base64 assets and CRLF line endings are preserved.

## Visual review limits

This is a first geometry and usability improvement, not a photoreal replica certification.

| Area | Review |
|---|---|
| Reference model, open-heart location, narrow marker arrangement, hand type and 12-hour index orientation | Matches the selected configuration at the feature level |
| Case, lug and crown-bridge proportions | Improved against the front-photo estimates; no engineering drawing is available |
| Dial texture and black strap | Procedural approximation; exact real surface grain is not reproduced |
| Open-heart mechanism | Simplified illustrative geometry, not an exact NH38 movement layout |
| Branding and reflected studio highlights | Existing approximation still needs further refinement |
| Other five models | Regression checked; not newly certified against every official variant |

Publishing was explicitly authorized by the user for this completed update.

