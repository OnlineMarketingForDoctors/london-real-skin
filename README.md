# London Real Skin — website

New site for **London Real Skin**, a dermatology-led skin and aesthetic clinic at
233 High Holborn, London WC1V 7DN. Trading name of The London Skin and Hair Clinic Ltd.

**Status:** homepage, About Us, Treatments, Conditions, Devices and Pricing built, for review.
The remaining pages (Blog, Contact) are not built yet.

```
index.html                 the homepage
about.html                 About Us
treatments.html            Treatments directory
conditions.html            Conditions we treat
devices.html               Devices
pricing.html               full price list
404.html                   branded not-found page
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

Full-screen page hero (breadcrumb, the Holborn waiting room) · Our story · Our mission /
Our vision · Process makes perfect (four numbered steps) · Why choose us (seven reasons on a
full-bleed background) · Our team (seven cards, shared with the homepage) · What our clients say
(the same seven Google reviews) · Skincare banner · Closing CTA · Footer.

Copy is carried over from the client's existing About Us page: the story, the four-step process
and the seven reasons are the clinic's own words, lightly tightened. The dated *Covid Secure*
point was dropped. The official team roles on that page also corrected the homepage, where
Dr Meriem Martins had a placeholder role.

All pages share one stylesheet and one script; page-specific behaviour (hero slideshow,
promotions widget, drawer, treatment category nav) is guarded so the same bundle runs anywhere.

## Page heroes

Every page below the homepage opens with the same hero: `.phero`, full viewport height, the
masthead sitting over it, breadcrumb and copy bottom-left, two buttons. Only the background
image and the copy change. New pages should reuse it as-is rather than introducing a variant.

## Treatments sections

Page hero · sticky category nav · five category sections, each with an image, a short position
statement and the full treatment list · Not sure where to start · Closing CTA · Footer.

The five categories and their thirty-seven treatments come from the client's existing site
menu. Layout weight and ground tone alternate together, so no two categories read the same, and
*For men* inverts to the dark ground.

Every treatment links to `treatments/<slug>.html`. **Those pages do not exist yet**, which is
what `404.html` is for: Vercel serves it for any unknown path, and it says the page is still
being written rather than showing a bare error.

Two category lists are almost certainly incomplete. The client's menu screenshots for *For men*
and *Medical treatments* were cut off, so those sections currently carry one and two treatments
respectively. Send the full lists and they drop straight in.

## Conditions sections

Page hero · Concern first, machine second · the twelve concerns as a staggered card grid ·
When it is not cosmetic · a cross-link to Treatments · Closing CTA · Footer.

The twelve concerns are the same list as the homepage dermatoscope, and the cards reuse the same
twelve macro plates, so nothing new had to be generated for them. Every card carries the
treatments we use for that concern, each one linking into `treatments/<slug>.html`; the concern
itself links to `conditions/<slug>.html`. Neither set of detail pages exists yet, so both land on
`404.html` for now.

Cards stretch to the tallest in their row, so every row starts and ends on one line. The
"what we use" block is pushed to the bottom of the card, so the chips and the read-more link
align across a row even when the descriptions run to different lengths.

## Devices sections

Page hero · A device is not a treatment plan · six platforms as spec sheets · Also in the
clinic · cross-links to Conditions and Treatments · Closing CTA · Footer.

Each platform gets a data sheet: technology, what it works on, downtime, typical course and
price, then the treatments it delivers and the concerns it addresses, cross-linked into
`treatments/` and `conditions.html`. Rows alternate left and right.

The section is dark, and the artwork is the client's own transparent device PNGs, trimmed to
the ink box and centred on a 1100px square canvas (`assets/img/devices/cutout-*.png`). The
lit ground is drawn in CSS rather than baked into the file, so there is no white plate behind
the hardware.

**Device pricing needs confirming.** The figures came over from the first homepage build and
have no client source behind them. So does the balance of what each platform is used for.

## Pricing sections

Page hero · sticky section nav · How pricing works · eight price sections, 188 lines · small
print · cross-links to Conditions and Treatments · Closing CTA · Footer.

Prices come from `LRS_Service_Price_Review_2026_1.xlsx`, the **New** sheet, **column E, "Price
LRS"**. That column was chosen over column F, "FINAL PRICE", on evidence: the workbook lists
microneedling twice, once under *Skin Treatments* and again under *Skin Pen*, and the two blocks
agree exactly in column E (340 / 370 / 575) while column F contradicts itself (275 / 320 / 580).
Column E is the coherent list; column F is a proposed revision that was not applied throughout.
**Confirm before launch** — around thirty lines differ between the two.

Cost price, profit margin and the competitor benchmarks for six named clinics are in the same
workbook. **None of that is on the page**, and none of it should ever be.

Two compliance points shaped the copy:

- **Botox is not named anywhere.** UK law prohibits advertising prescription-only medicines to
  the public, so the client's own wording, *anti-wrinkle injections*, is used throughout. Fillers
  and skin boosters are devices rather than POMs, so brand names are fine.
- **Nothing on the page promises a result**, and the small print states that suitability is
  clinical and that the quotation given at consultation is the price.

The lists use CSS multi-column so a 188-line price list reads as a page rather than a scroll,
with `break-inside: avoid` keeping each group whole.

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

Twenty-four generated images (12 macro condition plates, 4 journal thumbnails, one treatment
card, the About Us *Why choose LRS* background, the 5 Treatments category images and the
Conditions hero) are still hot-linked from a CDN because this build environment cannot download
them. The manifest has a two-command fix.

## Before this goes live

1. **Localise the 24 hot-linked images** — `docs/ASSET-MANIFEST.md`.
2. **Replace the four journal cards** with real posts from `/news/`.
3. Supply before/after pairs for the Microneedling, HydraFacial, BBL Hero and Sciton Moxi tabs.
4. Wire the CTAs to Pabau booking and the enquiry form.
