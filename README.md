# London Real Skin — website

New site for **London Real Skin**, a dermatology-led skin and aesthetic clinic at
233 High Holborn, London WC1V 7DN. Trading name of The London Skin and Hair Clinic Ltd.

**Status:** homepage and About Us built, for review. The remaining pages (Treatments,
Conditions, Devices, Blog, Pricing, Contact) are not built yet.

```
index.html                 the homepage
about.html                 About Us
assets/css/main.css        design system + all section styles
assets/js/main.js          interactions (vanilla, no dependencies)
docs/COPY.md               full copy deck
docs/IMAGE-PROMPTS.md      the AI image prompt sheet
docs/ASSET-MANIFEST.md     what every image is, and what must replace it  ← read this
.claude/skills/            project Claude Code skills
```

## Run it

Any static server:

```bash
npx http-server -p 8099 -s .
# → http://127.0.0.1:8099
```

## Design direction — "The Examination"

The organising idea is the **dermatoscope**. This clinic's whole argument is that it looks at
skin properly before treating it, so the page is built around magnification.

- **Colour** — the brand palette, unchanged: `#2A4664` navy, `#1DB0BA` teal, `#E7EEF5` off-white,
  plus a deeper `#16293C` for full-bleed dark sections.
- **Type** — *Bodoni Moda* for display (the language of luxury editorial, used large and
  sparingly), *Hanken Grotesk* for body and UI (carried over from the client's existing brand),
  *IBM Plex Mono* for index numbers, prices and labels, where it reads as clinical
  record-keeping rather than decoration.
- **Layout** — a 12-column grid that alternates weight left and right. Images bleed past their
  columns; card rows stagger. Nothing is centred by default.
- **Signature** — the **dermatoscope lens** in *Conditions we treat*. Moving through the
  numbered index re-focuses a circular magnified field on a new macro skin plate, with reticle,
  optical vignette and a field counter. It is the one memorable element; everything around it is
  kept quiet.

Treatment groups are lettered A–E rather than numbered, because they are categories, not a
sequence. Conditions *are* numbered, because twelve items function as an index.

## Homepage sections

Header (floating masthead) · Hero (6-slide Ken Burns slideshow, five selling
points, Google rating, three-slide promotions widget) · As featured in · Reviews marquee · About · Before & after
(five treatment tabs, draggable comparison) · Treatments (accordion synced to a sticky image) ·
Why choose us · Team · Shop banner · Conditions (dermatoscope) · Devices slider · Journal ·
Closing CTA · Footer · back-to-top control.

## About Us sections

Page hero (breadcrumb, clinic corridor) · Our story · Our mission / Our vision · Process makes
perfect (four numbered steps) · Why choose us (seven reasons) · Our team (seven cards, shared
with the homepage) · What our clients say (the same seven Google reviews) · Skincare banner ·
Closing CTA · Footer.

Copy is carried over from the client's existing About Us page: the story, the four-step process
and the seven reasons are the clinic's own words, lightly tightened. The dated *Covid Secure*
point was dropped. The official team roles on that page also corrected the homepage, where
Dr Meriem Martins had a placeholder role.

Both pages share one stylesheet and one script; the homepage-only behaviour (hero slideshow,
promotions widget, drawer) is guarded so the same bundle runs on either page.

## Quality floor

- Responsive to 390px; single-column below 900px, drawer navigation below 1180px.
- `prefers-reduced-motion` fully respected — every animation, marquee, slideshow and smooth
  scroll disables.
- Visible keyboard focus throughout; tabs are arrow-key navigable; the drawer closes on Escape.
- Scroll reveals use IntersectionObserver with a geometry fallback, so an element can never be
  left permanently hidden if its intersection rect reports as zero-area.
- Semantic landmarks, ARIA on tabs/accordion/drawer, alt text on content images, decorative
  layers marked `aria-hidden`.
- No JavaScript dependencies. The page is readable with JS disabled.

## Assets

All of the client's real photography is in the repo and in use: 7 hero images, 7 team
portraits, 4 consented before/after pairs, 6 device shots composited onto a shared set, the LRS
logo, favicon, CQC mark and the 233 High Holborn entrance. See `docs/ASSET-MANIFEST.md`.

Nineteen generated images (the 12 dermatoscope condition plates, 4 journal thumbnails, one
treatment card and the two About Us still lifes) are still hot-linked from a CDN because this
build environment cannot download them. The manifest has a two-command fix.

## Before this goes live

1. **Localise the 19 hot-linked images** — `docs/ASSET-MANIFEST.md`.
2. **Replace the four journal cards** with real posts from `/news/`.
3. Supply before/after pairs for the Microneedling, HydraFacial, BBL Hero and Sciton Moxi tabs.
4. Wire the CTAs to Pabau booking and the enquiry form.
