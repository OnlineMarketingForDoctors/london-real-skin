# London Real Skin — website

New site for **London Real Skin**, a dermatology-led skin and aesthetic clinic at
233 High Holborn, London WC1V 7DN. Trading name of The London Skin and Hair Clinic Ltd.

**Status:** all nine pages plus sixteen product pages built, for review.

```
index.html                 the homepage
about.html                 About Us
treatments.html            Treatments directory
conditions.html            Conditions we treat
devices.html               Devices
pricing.html               full price list
blog.html                  blog index, 32 articles
contact.html               contact, enquiry form, getting here
shop.html                  the skincare range
product/*.html             16 product detail pages
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

Page hero · sticky category nav · five category sections · Not sure where to start · Closing CTA
· Footer.

**Fifty-one treatments**, restructured to the client's *Website Development, suggested amendments
and additions* document. Injectables and Body now carry the client's own sub-groups (five and four
respectively) rather than one flat run; Face became **Laser and device treatments**; titles were
made consistent, so *Sciton BBL for Rosacea, Vascular Lesions and Pigmentation* is now *Sciton BBL
London*. For men went from one treatment to four.

Numbering runs 01 to 21 in Injectables and 01 to 10 in Body, continuously across their sub-groups.
The document repeated 12 and 13 and skipped 14; nothing was added or dropped to fix that.

Renaming changed most treatment slugs, so every cross-link on the homepage, Conditions and Devices
was remapped and relabelled to match. Four points the document left open were settled with the
client and are recorded at the top of the Treatments section in `docs/COPY.md`.

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

## Blog sections

Page hero · lead article · topic filter · 31 more articles · cross-links · Closing CTA · Footer.

All 32 articles are extracted from the client's existing `/news/` page, supplied as an HTML
export. Titles, excerpts and images are theirs. The six topics are ours: the export carries no
categories, and no dates either, so **the page shows neither a date nor a reading time** rather
than inventing one. The lead article filters along with the grid, so every chip count is exact.

Excerpts are WordPress auto-excerpts and around half were cut mid-sentence. Each one is trimmed
back to its last complete sentence, or given an ellipsis where there was no sentence boundary to
fall back to. One stray *Read more*, one dropped initial letter (*orget chasing*) and one
*Malasma* were corrected.

**Two things need deciding before launch.**

1. **Article URLs.** Links point at `<slug>.html` at the root, matching the old site's
   `/<slug>/` exactly, so the existing rankings survive the migration. If the posts end up
   somewhere else, set up redirects.
2. **Article images are hot-linked from `londonrealskin.com`.** They work today and will break
   the moment the old site comes down. They need copying into `assets/img/blog/` as part of the
   content migration.

The homepage *Latest insights* cards now carry the four newest real articles instead of the
placeholders, which removes four of the hot-linked CDN images.

## Contact sections

Page hero · enquiry form and details card · Getting here · trust strip · Footer.

Content is the client's existing contact page: the address including **first floor**, which was
missing everywhere else on the site, the fifteen-minute arrival note, and the travel directions
for tube, bus, train and car.

This is the only page without the closing CTA. The whole page is the call to action, and
`#contact` points at the enquiry form instead, so every "Book free consultation" button on the
page lands somewhere useful.

**The form has no backend.** A static site cannot accept a POST, so a validated submit composes
a pre-filled email to `info@londonrealskin.com` and opens the visitor's mail client, with the
address and phone number repeated on screen in case nothing opens. It works today and it is
honest, but it should be replaced with a real endpoint when the booking system is wired up. The
markup will not need to change, only the submit handler in `assets/js/main.js`.

Validation only marks a field once submit has been pressed, never while typing.

The map is a full-bleed keyless Google Maps embed (`?output=embed`), lazily loaded, with the
address card floating over it on wide screens and dropping below it under 820px so it never
covers the pin or Google's attribution. The card takes pointer events, the rest of the section
does not, so the map stays draggable around it.

Note that the embed loads Google's own scripts and cookies. If that is a problem for the
clinic's cookie policy, the section degrades to the address card and the *Open in Google Maps*
link by removing one iframe.

## Shop sections

Page hero · Proud stockists and our own label · the range · How to buy · cross-links · Closing
CTA · Footer.

Sixteen products, built from the client's WooCommerce export: names, prices, descriptions, key
ingredients, key benefits, directions and cautions are all theirs, unrewritten. Photography is
theirs too, padded square on white and committed to `assets/img/shop/`, 250 KB for all sixteen.

Filters are the client's own product categories rather than groupings of ours. Cards carry the
photograph, name, price, opening line and add to basket, and link through to the product page;
the ingredients, directions and cautions live there rather than being duplicated on the card.

Primary nav order: About Us, Treatments, Conditions, Devices, Blog, Pricing, **Shop**, Contact.
The drawer matches, with Shop at 06 and Contact at 07.

Four names in the URLs differ from what the client actually calls the product, and the page uses
theirs: Eye Lift **Gel**, Ultra Hyaluronic **Serum**, Daily Skin Moisturiser and Sun Protection
**SPF50**, **Vitamin-C-E** Ferulic Antioxidant Gel.

## Product pages and the basket

Sixteen detail pages at `product/<slug>.html`, matching the old site's `/product/<slug>/` so the
URLs survive a migration. Each carries the photograph, name, price, quantity stepper and add to
basket, then the client's own description, ingredients, benefits, directions and cautions, and
three related products chosen by shared category.

**Product pages deliberately have no page hero.** Every other page below the homepage opens with
the full-height `.phero`; a product page has one job, which is to put the product and the price
above the fold, and a full-screen hero would bury both. Say the word and it goes back to the
standard. This is also why `onScrollHeader` now forces the solid masthead on any page with
neither hero: light-on-light was unreadable at the top of a product page.

**The basket is interface only.** Nothing is charged and nothing is sent. Contents live in
`localStorage` so the count survives navigation and the demo behaves like a real shop; the
checkout button is present and permanently disabled, with the clinic's number beside it. It is
one function in `assets/js/main.js` to swap for a commerce backend, and the markup will not need
to change.

The shop is **online with delivery**. No page offers collection, and no page states a delivery
cost, threshold or timeframe, because the client has not supplied any.

> **The shop sells online with delivery**, confirmed by the client. Nothing on the site offers
> collection. The remaining work is the checkout itself and the delivery terms: cost, thresholds,
> dispatch times, returns and the countries served. None of that is written anywhere yet, and
> none of it has been invented.

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

**Content and data**

0. **Supply the delivery terms** for the shop: cost, free-delivery threshold, dispatch time,
   returns and where you ship to. The basket and product pages say delivery and nothing more,
   because nothing more is known.
0b. **Connect the checkout.** A static build cannot take payment, so this needs a hosted
   checkout or a commerce backend.

1. **Confirm the price column.** `pricing.html` uses *Price LRS*; *FINAL PRICE* differs on about
   thirty lines. See the Pricing notes in `docs/COPY.md`.
2. **Confirm the device pricing and the six device descriptions** on `devices.html`. They came
   over from the first homepage build with no client source.
3. **Send the full *For men* and *Medical treatments* treatment lists.** The supplied menu
   screenshots were cut off.
4. Supply before/after pairs for the Microneedling, HydraFacial, BBL Hero and Sciton Moxi tabs.
5. **Confirm Mina's role.** She joined the team cards with a photograph and a biography from
   the client, but their own team list predates her and gives no title, so she carries
   *Aesthetician* by inference.
6. Real publication dates for the 32 blog articles, if they exist.

**Wiring**

7. **Point the enquiry form at a real endpoint.** It currently composes an email; see the
   Contact notes above.
8. Wire the *Book free consultation* buttons to Pabau.
9. **Decide the article URLs.** Links assume `<slug>.html` at the root, matching the old site,
   so the rankings survive. Anything else needs redirects.
10. Build the `treatments/` and `conditions/` detail pages, or point those links elsewhere.
    Until then they land on `404.html`.

**Assets**

11. **Localise the 20 hot-linked generated images** — `docs/ASSET-MANIFEST.md`.
12. **Copy the 32 article images off `londonrealskin.com`.** They break when the old site comes
    down.

**Compliance**

13. **Botox is named in one blog title**, carried over from the live site. Naming a
    prescription-only medicine in public advertising needs a legal view. It appears nowhere else:
    the price list and every treatment page say *anti-wrinkle injections*.
14. Nothing on the site promises a result, and no before/after imagery is synthetic. Keep it
    that way.
