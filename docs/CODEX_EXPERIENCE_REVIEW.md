# ICH.co — The Anatomy of Time

2026-09-07 · Standalone concept study at `codex/index.html`.

## Deliverable

One HTML file includes all markup, CSS, inline SVG artwork, and application JavaScript.
GSAP 3.13.0 and ScrollTrigger use the requested jsDelivr CDN. Google Fonts supplies Cinzel, Cormorant Garamond and Noto Serif TC with local serif fallbacks. No build step, PNG files, 3D model, or WebGL runtime is required.

The design combines dark marble, aged brass, astrolabe rings, a golden-ratio construction grid, a Roman numeral celestial dial, and three manuscript annotations. Five aligned layers begin assembled; glass, hands, dial, gears, and case separate with differentiated timing. Hands rotate 35° and gears −42° inside their own part planes. ScrollTrigger uses scrub:1.5 and a 300svh section with a 100svh sticky stage.

## Scope and source fidelity

This is an original concept illustration, not an official ICH.co product or factory movement drawing. The initial scene and footer identify that distinction. No product availability, specifications, compatible options, or price is invented for this design. Real offerings remain linked to the existing catalog. The original homepage, catalog data and Three.js studio are unchanged by this addition.

## Verified

- Chrome: 1440×1000, 1366×768, 768×1024, 1024×768, 390×844, 320×568 and 844×390.
- 92 checks passed with zero JavaScript errors: 12 Roman markers, 60 minute marks / 12 longer marks, 6 illustrated gears, 5 aligned layers, initial/midpoint/end progress, bounded horizontal layout, visible end annotations, reversible button control, responsive offsets, and centered geometry rotations.
- Emulated iPhone touch drag, resize to landscape, and live reduced-motion switching passed.
- No-JavaScript, blocked GSAP CDN, and reduced-motion initial load preserve a complete static face and remove the extra scroll distance.
- Separately replaced all five vector layers in memory with the existing real PNG assets to verify the documented replacement path. All images loaded, no missing-SVG-node errors occurred, and rotation/end progress remained correct.
- Screenshots reviewed at assembly and full explosion; fixed small-phone title overlap, tablet copy overlap, astrolabe pivot drift, and inconsistent toggle decisions during scrub lag.
- iOS Safari hardware was not available for testing. The perspective/preserve-3d ancestors avoid opacity, filtering and overflow:hidden.

## Reuse

Copy `codex/index.html` as `index.html` and open it with an internet connection. Chinese comments identify each image replacement point and the motion controls. All five replacement PNGs must share the same canvas and alignment. Animation works when SVG nodes are absent.

Reference: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
