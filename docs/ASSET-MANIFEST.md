# Asset manifest

What every image on the site is, and where it came from. Covers every page.

## Summary

| | Count |
|---|---|
| Real client assets, committed to this repo | **29** |
| AI-generated, committed to this repo | 0 |
| AI-generated, still hot-linked from Higgsfield's CDN | **20** |
| Article images hot-linked from `londonrealskin.com` | **32** |

Everything the client supplied is now in the repo and in use. The remaining hot-linked images
are covered in section 4.

---

## 1. Real client assets in use

### Hero slideshow — 6 images · `assets/img/hero/`
The clinic's own photography, resized to 2400px and re-encoded (35 MB → 2.0 MB).

| File | What it shows |
|---|---|
| `hero-01-injectables.jpg` | Alma ClearLift handpiece being used near the eye |
| `hero-02-kleresca.jpg` | Kleresca gel mask being applied |
| `hero-03-examination.jpg` | Dr Martin Wade examining a patient with loupes |
| `hero-04-treatment.jpg` | Dr Wade treating a patient |
| `hero-05-device.jpg` | Device-led treatment in a clinic room |
| `hero-06-consultation.jpg` | Consultation with a hand mirror — **in the repo but not in use**, removed from the homepage hero at the client's request |
| `hero-07-skinpen.jpg` | SkinPen microneedling |

A light cool grade (`saturate(.78) contrast(1.05) brightness(.94) hue-rotate(-6deg)`) pulls the
mixed-source photography toward the brand palette without gutting it. These photographs also
drive the About section and four of the five treatment-group cards.

### Team — 7 portraits · `assets/img/team/`
`team-martin-wade.jpg` · `team-inna.jpg` · `team-meriem-martins.jpg` · `team-flor-kent.jpg` ·
`team-kylie.jpg` · `team-leigh.jpg` · `team-ellen.jpg`

Names, roles and bios come from the client's own microneedling landing page, where each
headshot filename maps to a person — so the pairing is the client's, not a guess.

> **Roles are now the client's own.** The supplied About Us page lists all seven, which
> corrected three of them: Dr Meriem Martins is an **Aesthetic Doctor** (previously a placeholder
> "Doctor"), Dr Flor Kent is an **Aesthetic Doctor** rather than a Dermatologist, and Leigh and
> Kylie are both **Aestheticians**. Homepage and About Us now carry the same seven cards, in the
> client's order.
>
> Individual bios are still ours. No source gives per-person biographies, so each one stays
> within what the role and the clinic's own copy support. Send real bios and they drop straight
> in.
>
> *Mina* now has a photograph. It arrived as a 1060x1412 PNG, cropped square around the subject
> and saved at 900x900 to match the other seven headshots exactly.

### Before & after — 4 consented patient pairs · `assets/img/ba/`
| Case | Files |
|---|---|
| Benign skin lesion | `ba-lesion-before/after.jpg` |
| Cherry angioma | `ba-angioma-before/after.jpg` |
| Dermatosis papulosa nigra | `ba-papulosa-before/after.jpg` |
| Seborrhoeic keratosis | `ba-sebk-before/after.jpg` |

Displayed with the client's own consent disclaimer, verbatim, beneath the gallery. The other
four tabs (Microneedling, HydraFacial, BBL Hero, Sciton Moxi) are built and wired — drop a pair
in and remove the `<em>soon</em>` marker.

### Devices — 6 · `assets/img/devices/`
Composited onto **one shared set**: a cool off-white gradient cyclorama, teal wash top-right and
a matched contact shadow. No plinth rule.

Five are built from the client's own transparent artwork — `BBL Hero transparent.png`,
`BTL Exion transparent.png`, `Sciton Moxi Laser tramsparent.png`, `emsculpt trasnparent.png` and
`Skin Xcell.webp` (which already ships with alpha). Only **Harmony XL** still uses a
border-seeded flood-fill cutout, as no transparent version was supplied. The hardware itself is
never redrawn — only relit and rescaled.

The hero offers widget uses the same artwork at full card height: `promo-emsculpt.png`,
`promo-xcellaris.png` and `promo-exion.png`.

### Brand · `assets/img/brand/`
`logo.png` (header + footer) · `logo-dark.png` (swapped in once the header sticks, since the
supplied wordmark is drawn for dark backgrounds) · `cqc.png` (footer) · `omd.png` (footer
"Powered by" line)

**Favicon set**, all generated from the LRS mark inside the supplied wordmark, set in teal on a
navy rounded tile so it holds up against both light and dark browser chrome:
`favicon.ico` (16/32/48) · `favicon-32.png` · `favicon.png` (48) ·
`apple-touch-icon.png` (180) · `icon-512.png` (512, maskable), wired up via `site.webmanifest`.

> The client's original 48px favicon was the bare teal mark on transparency, which vanished
> against a light tab strip. The mark itself is unchanged, only placed on a plate.

### Media logos — 4 · `assets/img/media/`
`media-independent.webp` · `media-closer.png` · `Daily_Express_masthead.svg` · `Sheerluxe.svg`

Used in the *As featured in* stripe beneath the hero. Rendered greyscale at one weight with
`mix-blend-mode: multiply`, which drops the white plates the raster files ship with.

> The Closer artwork arrived as a 900×500 canvas holding only 863×221 of ink, so it rendered
> optically much smaller than the others at a shared height. `media-closer.png` is trimmed to
> its ink box; the untrimmed original is kept alongside it.

### Location · `assets/img/clinic-location.jpg`
The real 233 High Holborn entrance, used as the closing CTA's portrait image across the site.

### About Us · client photography
| Slot | File |
|---|---|
| Page hero | `waiting-room.jpg`, shared with the Contact page hero |
| Our story, main | `team-shot.jpg` |
| Our story, inset | `hydrafacial-treatment.jpg` |
| Our mission | `consultation.jpg` |
| Our vision | `laser-treatment.jpg` |
| Skincare banner | `shop-banner.jpg` |
| Closing CTA | `clinic-location.jpg` |

The five new files arrived as PNG, 12 MB between them, and were converted to progressive JPEG
at quality 86, longest edge 1500–1900px. That is under 1 MB for all five, and it is why they
are `.jpg` here and `.png` in the upload.

`waiting-room.jpg` is also cropped. The right-hand strip of the original carries the clinic
name in vinyl on the far side of the glass partition, so from inside the room it reads
backwards. The frame now stops short of it, and the ceiling is trimmed to bring the aspect back
to roughly 3:2. Everything still in shot, including the SkinTyte poster, reads the right way
round.

---

## 2. Real content used verbatim

| Item | Source |
|---|---|
| 7 Google reviews | Drive › *Reviews* screenshots, OCR'd |
| Team bios and roles | Client's microneedling landing page |
| Phone **020 7183 5892** | Confirmed against both client HTML references |
| `info@londonrealskin.com` | Client's landing page footer |
| Instagram / Facebook / TikTok URLs | Client's landing page footer |
| Opening hours, address | Questionnaire + landing page |
| About copy, before/after disclaimer, legal line | Supplied in the brief |
| Conditions list, product names and prices | Drive documents |
| Treatment pricing, Dr Wade's credentials | Brand questionnaire |

> An earlier draft had the phone as 020 7183 5**0**92, misread from a screenshot. Both HTML
> references agree on 5**8**92; that is what is now live.

---

## 3. Still not real

| Item | Status |
|---|---|
| 4 journal cards | **Placeholder.** `londonrealskin.com/news/` is blocked by this environment's egress policy. Titles are topic placeholders. **Replace before launch.** |
| Shop banner | Generated, and now committed to the repo. The product screenshot was not among the uploads; prices and names in the copy are real. |
| "Body" treatment-group card | Generated — the only group with no matching real photo. |

---

### Treatments · category images
Five new images, one per category, generated with Nano Banana Pro at 2K in 4:5. Each carries the
palette lock and, where skin is in frame, the skin-realism lock. None of them shows a result, a
before or an after, so nothing here reads as an outcome claim.

| Category | Subject |
|---|---|
| Injectables | Gloved hands and a fine-gauge syringe at a patient's cheekbone, needle not inserted |
| Face | Laser resurfacing handpiece over a patient in protective eyewear |
| Body | A contouring applicator on a draped torso, no face in frame |
| For men | A man examined with a dermatoscope, stubble and real skin texture |
| Medical treatments | Macro of an electrolysis probe at the temple, face out of shot |

The page hero reuses `hero/hero-07-skinpen.jpg` and *Not sure where to start* reuses
`consultation.jpg`. The 404 hero reuses `hero/hero-04-treatment.jpg`.

### Conditions · hero and cards
One new image: the page hero, a dermatoscope examination generated with Nano Banana Pro at 2K in
16:9, carrying the palette lock and the skin-realism lock, with the left third held dark for the
headline.

The twelve cards reuse the twelve macro plates already generated for the homepage lens, so the
same specimen appears in both places and nothing new was needed. *When it is not cosmetic* reuses
`hero/hero-03-examination.jpg`.

### Devices · cutouts
`devices.html` uses none of the composited `device-*.jpg` shots. Those carry a light cyclorama
baked into the file, which reads as a white plate on the page's dark ground, the exact thing the
client asked to be removed from the hero promo widget.

Instead the page uses `cutout-*.png`, built from the client's own transparent artwork: trimmed
to the alpha bounding box, scaled to a common 1100px square canvas with 6% padding, so all six
devices sit at the same optical weight. The lit ground behind them is CSS.

| Slug | Built from |
|---|---|
| `cutout-sciton-moxi.png` | `Sciton Moxi Laser tramsparent.png` |
| `cutout-bbl-hero.png` | `BBL Hero transparent.png` (palette transparency, converted to RGBA) |
| `cutout-emsculpt-neo.png` | `emsculpt trasnparent.png` |
| `cutout-btl-exion.png` | `BTL Exion transparent.png` |
| `cutout-xcellaris.png` | `Skin Xcell.webp` |
| `cutout-harmony-xl.png` | `Harmony XL.webp` |

> **The fifth device was misnamed.** It had been carried since the first build as *xCellaris Pro
> Twist*, described as a microneedling pen. The client's own artwork is branded **skinXcell** and
> shows a console with three RF handpieces, and their treatment menu lists *SkinXcell RF
> Micro-needling*. Corrected on both the Devices page and the homepage, along with an
> unsupported *£350 with exosomes* price line.

The page hero uses `laser-treatment.jpg`, real hardware in the real clinic, in preference to a
generated device photograph.

## 4. Hot-linked images

### From `d8j0ntlcm91z4.cloudfront.net` (20)

- **12** macro condition plates, used twice: the homepage dermatoscope lens
  (`assets/js/main.js`, `PLATES`) and the Conditions cards (`conditions.html`)
- **1** "Body" treatment card (`index.html`)
- **1** *Why choose LRS* full-bleed background on About Us (`about.html`)
- **5** Treatments category images, one per category (`treatments.html`)
- **1** Conditions page hero (`conditions.html`)

The four generated journal thumbnails are gone: the homepage now carries the four newest real
articles, with the client's own photography.

### From `londonrealskin.com` (32)

Every article image on `blog.html`, plus the four repeated on the homepage. These are the
client's own files on their current WordPress install. **They will break the moment the old site
comes down** and need copying into `assets/img/blog/` as part of the content migration. This
build environment cannot reach the domain, so they could not be pulled in here.

They are macro skin studies and abstract stock-style imagery — nothing patient-identifying.
They render fine in a browser, but a third-party CDN on the critical render path is not a
launch-ready position.

**Why they aren't committed:** this environment's network policy 403s every host except a small
allowlist, and the Higgsfield CDN is not on it. The bytes cannot reach this container. The Drive
connector can't substitute — it returns files as base64 through the conversation, which is fine
for a 9 KB logo and impossible for photographs.

**To fix, from a machine with normal network access:**

```bash
CDN=https://d8j0ntlcm91z4.cloudfront.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG
mkdir -p assets/img/generated

# Every generated filename on the site. The 12 condition plates are stored in main.js as
# bare filenames joined to a CDN constant, so match on the filename, not on the full URL.
grep -ohE 'hf_[0-9]{8}_[0-9]{6}_[a-f0-9-]+\.png' *.html assets/js/main.js \
  | sort -u \
  | while read -r f; do curl -sSL -o "assets/img/generated/$f" "$CDN/$f"; done

sed -i "s|$CDN/|/assets/img/generated/|g" *.html assets/js/main.js
```

That should write **20** files. `main.js` builds the plate URLs as `CDN + file`, and the `sed`
rewrites `CDN` itself, so the plates follow automatically.

> Note the leading slash. A relative `url()` inside a CSS custom property resolves against the
> **stylesheet**, not the document, so image paths used via `--img` must be root-relative.
