# Asset manifest

What every image on the homepage is, and where it came from.

## Summary

| | Count |
|---|---|
| Real client assets, committed to this repo | **29** |
| AI-generated, committed to this repo | 0 |
| AI-generated, still hot-linked from Higgsfield's CDN | **18** |

Everything the client supplied is now in the repo and in use. The 18 remaining hot-linked
images are covered in section 4.

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
| `hero-06-consultation.jpg` | Consultation with a hand mirror — **in the repo but not in use**, removed from the hero at the client's request |
| `hero-07-skinpen.jpg` | SkinPen microneedling |

A light cool grade (`saturate(.78) contrast(1.05) brightness(.94) hue-rotate(-6deg)`) pulls the
mixed-source photography toward the brand palette without gutting it. These photographs also
drive the About section and four of the five treatment-group cards.

### Team — 7 portraits · `assets/img/team/`
`team-martin-wade.jpg` · `team-inna.jpg` · `team-meriem-martins.jpg` · `team-flor-kent.jpg` ·
`team-kylie.jpg` · `team-leigh.jpg` · `team-ellen.jpg`

Names, roles and bios come from the client's own microneedling landing page, where each
headshot filename maps to a person — so the pairing is the client's, not a guess.

> **Dr Meriem Martins** (`team-meriem-martins.jpg`, formerly `IMG_6454`) was identified by the
> client. Her **role is listed as "Doctor" and her bio is a neutral placeholder** — no source
> gives either. Send her actual title and bio and they drop straight in.
>
> *Mina*, named in the questionnaire and in a Google review, still has no photo.

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
The real 233 High Holborn entrance, used as the closing CTA's portrait image.

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
| Shop banner | Generated. The product screenshot was not among the uploads; prices and names in the copy are real. |
| "Body" treatment-group card | Generated — the only group with no matching real photo. |

---

## 4. The 18 hot-linked images

Still served from `d8j0ntlcm91z4.cloudfront.net`, not this repo:

- **12** condition plates for the dermatoscope lens (`assets/js/main.js`, `PLATES`)
- **4** journal thumbnails
- **1** shop banner
- **1** "Body" treatment card

They are macro skin studies and abstract stock-style imagery — nothing patient-identifying.
They render fine in a browser, but a third-party CDN on the critical render path is not a
launch-ready position.

**Why they aren't committed:** this environment's network policy 403s every host except a small
allowlist, and the Higgsfield CDN is not on it. The bytes cannot reach this container. The Drive
connector can't substitute — it returns files as base64 through the conversation, which is fine
for a 9 KB logo and impossible for photographs.

**To fix, from a machine with normal network access:**

```bash
mkdir -p assets/img/generated
grep -ohE 'https://d8j0ntlcm91z4\.cloudfront\.net/[^")'"'"' ]+' index.html assets/js/main.js \
  | sort -u \
  | while read -r u; do curl -sSL -o "assets/img/generated/$(basename "$u")" "$u"; done
sed -i 's|https://d8j0ntlcm91z4\.cloudfront\.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG/|/assets/img/generated/|g' \
  index.html assets/js/main.js
```

> Note the leading slash. A relative `url()` inside a CSS custom property resolves against the
> **stylesheet**, not the document, so image paths used via `--img` must be root-relative.
