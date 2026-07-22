# STILLROOM

**A concept landing page for a fictional digital-keepsake studio.**

> STILLROOM is not a real business. The brand, service, pricing, example commissions and
> all copy are invented for a design exercise. No form data is transmitted anywhere — the
> contact form is a client-side demonstration with a designed completed state.

The premise: a small studio that preserves **one meaningful memory** — a photograph, a
voice note, a letter — as a beautifully designed digital object you can keep and pass on.

## The idea

The page has to make an intangible service *believable through participation* rather than
explanation. So the centrepiece is **The Reveal**: inside one fixed square editorial frame,
a memory crossfades through the studio's three stages — raw fragment → the red room →
the finished keepsake. You choose which memory to follow; the last frame is the object
you'd actually receive.

## Signature motion (one authored moment)

Built to a deliberately restrained motion budget — **static-first, exactly one authored
motion moment**:

> Inside one fixed square frame with the crop and layout locked, the current stage
> dissolves to the next (outgoing `opacity 1→0`, incoming `0→1`) over **640ms ·
> `cubic-bezier(.22,1,.36,1)`** with **no** scale or position change, so it reads as
> editorial refinement rather than a slideshow.

Triggered by scroll-into-view (auto-plays once), and driven by the stepper, the memory
tabs, step-jumping and **← / → arrow keys**. `prefers-reduced-motion` swaps stages
instantly with no fade, blur or transform.

## Design system

"Indie Utility" — warm off-white paper, carbon-black cards, a single deep-red identity
accent, one sturdy grotesk (Space Grotesk) across enormous headings and tiny metadata,
loose 12-column grid, square media, 8–12px radii, miniature status marks and narrow black
utility rails that recur like desktop controls.

**All imagery is hand-built CSS/SVG** — the duotone identity portrait, the keepsake
objects, the material texture crops and the avatars. The four project mockups contain
**real HTML interface work** inside consistent browser framing rather than generated
pictures of UI. No stock photography, no image dependencies.

## Running it

Static site — no build step, no dependencies.

```bash
npx http-server . -p 8140 -c-1
```

Then open <http://localhost:8140>.

## Structure

```
index.html        semantic markup + all final copy
css/styles.css    design tokens, components, responsive, reduced-motion
js/app.js         crossfade controller, live rails, reveals, form completion
```

## Verified

- Signature crossfade across its full range (3 memories × 3 stages) via pointer, keyboard and touch
- WCAG AA contrast throughout (red on paper 4.90, faint on carbon 4.63, white on red 5.76)
- No horizontal overflow at 375 / 768 / 1440; square media holds its aspect ratio at every width
- Visible focus states, skip link, ARIA tablist, native `<details>` FAQ, polite live region
- `prefers-reduced-motion` honoured; no console errors; no JS libraries
