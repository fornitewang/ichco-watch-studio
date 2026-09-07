# ICH.co — The Anatomy of Time

2026-09-07 · Current standalone concept study: `codex/index.html`.

## User-reported corrections

1. Parts intersected while opening because differently tilted planes shared one preserve-3d space. Each major part now has a stable 2D stacking wrapper; only its own interior uses perspective and depth. The movement's base separation shares one interval; hand/gear rotation supplies the later stagger.
2. Equal center spacing left the mechanism and case overlapping (26px at 390×844). Layout now projects each part's visible bounds, including lugs and thickness, then allocates unequal center positions with explicit empty gaps inside the header/control safe area.
3. Foreground copy fades first. The complete scene then focuses from blur(14px) to clear. Filter is explicitly set to none before parts rotate, preserving local 3D. A direct scene filter replaces backdrop-filter because the tested Windows WebKit did not actually blur the composited watch with backdrop-filter.
4. Decorative circles and frame disappear before annotations. Leaders sit under their own text and terminate outside part contours. The right-hand leader uses a negative margin to keep its far end aligned to the right text edge, including when longer than its label.
5. The mechanism now has six internal planes: base, wheel sides, wheel faces, bridge sidewalls, bridge faces, and recessed hardware/jewels. Local depths are -26/-14/-5/+1/+10/+17 in the shared 600×600 artwork coordinates. The entire mechanism rotates together, preserving axle alignment.

## Verified results

Independent alpha-mask capture measured each visible part separately, not its transparent SVG container:

| Viewport | Minimum gap between adjacent visible parts |
|---|---:|
| 320×568 | 14px |
| 390×844 | 21px |
| 430×932 | 23px |
| 1440×1000 | 25px |
| 844×390 | 11px |

All annotation lines and endpoint circles stay inside the viewport. The right endpoint's clearance outside the dial is 8.33–16.70px across these sizes. Mid-animation rendering no longer cuts the case/lugs through the dial. Reverse scrolling restores all initial positions and blur.

Chrome functional checks: 12 PASS, 0 script errors. Includes buttons, emulated iPhone touch drag, orientation refresh, reduced-motion changes, no-JS/CDN-failure static fallback, and replacement with all five PNG assets. The PNG route conservatively projects the entire contained image and its internal rotation; it does not assume a circular crop.

Windows Playwright WebKit: 390×844 and 844×390, direct visual checks of initial blur, the clear interval before movement, all six mechanism planes, right leaders, and reverse return. No script errors or horizontal overflow. These are desktop engine/emulation tests, not a claim of actual iPhone hardware testing.

- [Visible-part gap measurements](fixes-0907/exploded-alpha-gaps.json)
- [Annotation and reverse-state measurements](fixes-0907/annotations-and-reversal.json)
- [Functional checks](fixes-0907/codex-functional.json)
- [WebKit checks](fixes-0907/codex-webkit.json)
- [Santos mobile fix](SANTOS_MOBILE_REVIEW.md)

## Deliverable and scope

One HTML file includes all markup, CSS, inline SVG artwork and application JavaScript. GSAP 3.13.0 / ScrollTrigger use the requested jsDelivr CDN. Google Fonts supplies Cinzel, Cormorant Garamond and Noto Serif TC with local serif fallbacks. The story is 300svh with a 100svh sticky stage and scrub:1.5. No build step, external image assets or WebGL renderer are required.

The Roman celestial watch and its internal construction are original concept illustrations. Initial copy and footer identify them as a design study, not an official available ICH.co configuration or factory movement drawing. This page invents no product availability, compatibility, specifications or price. Catalog links retain the real product choices.

Chinese comments explain image replacement: replace all SVG surfaces inside each `.rotor` with one `.surface.part-face` PNG, preserve the `.layer/.part/.rotor` wrappers, and use five images with the same canvas and aligned centers.

Reference: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
