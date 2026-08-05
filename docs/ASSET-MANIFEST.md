# Asset manifest & swap guide

Every image on the homepage, where it comes from today, and what should replace it.

## ⚠️ Read this first — images are currently hot-linked

This build session ran inside a sandbox whose **egress policy blocks almost every outbound
host**. `drive.google.com`, `londonrealskin.com` and the Higgsfield CDN all returned
`403` at the gateway, so **no binary file could be downloaded into this repository**.

Consequences:

1. **Your Drive assets are not in this repo.** Hero photos, review screenshots, team headshots,
   skin-tag before/afters and device shots could not be fetched. They are represented either by
   generated stand-ins or by explicit placeholder states.
2. **Generated images are referenced by URL, not committed.** They live on Higgsfield's
   CloudFront and are hot-linked from `index.html` and `main.js`. They render fine in a normal
   browser. **Before launch they must be downloaded and committed to `assets/img/`** — a
   third-party CDN is not a hosting strategy.

To localise every generated image once you have unrestricted network access:

```bash
# from the repo root
mkdir -p assets/img
grep -oE 'https://d8j0ntlcm91z4\.cloudfront\.net/[^")'"'"' ]+' index.html assets/js/main.js \
  | sed 's/^[^:]*://' | sort -u \
  | while read -r u; do curl -sSL -o "assets/img/$(basename "$u")" "$u"; done
# then rewrite the references
sed -i 's|https://d8j0ntlcm91z4\.cloudfront\.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG/|assets/img/|g' \
  index.html assets/js/main.js
```

---

## 1. Generated imagery — 38 images, Nano Banana Pro @ 2K

All prompts are in `IMAGE-PROMPTS.md`. All are palette-locked to `#2A4664` / `#1DB0BA` /
`#E7EEF5` and every image containing skin carries the realism directive (visible pores, natural
imperfections, no plastic look).

| Section | Count | Should ultimately be replaced by |
|---|---|---|
| Hero slideshow | 5 | **Yes** — the client's own photos in Drive › *Homepage hero images* (Kleresca, laser, SkinPen sets) |
| About | 2 | Optional — real clinic photography would be stronger |
| Treatment groups | 5 | Optional |
| Conditions lens plates | 12 | Optional — these are macro skin studies, they work as-is |
| Devices | 6 | **Yes** — use official manufacturer product shots (Sciton, BTL, xCellaris, Alma) |
| Journal thumbnails | 4 | **Yes** — with the real post artwork |
| Shop banner | 1 | **Yes** — real LRS product photography |
| CTA background | 1 | Optional — a real photo of the Holborn reception would be better |
| Texture | 1 | Unused in the final build, kept for future sections |

One prompt (stretch marks / cellulite) was refused by the model's safety filter on the first
pass and was regenerated as an abstract skin-surface crop.

---

## 2. Deliberate placeholders — these need YOUR files

### 2a. Before & after — patient photographs
**Location:** `index.html` › `#results` › `.cmp--empty`
**Source waiting in Drive:** `Skin tags › patient 1–4`

Rendered as dashed, labelled empty frames. **No synthetic before/after imagery was generated,
and none should be.** Fabricating patient results for a CQC-registered clinic would breach
ASA/CAP rules on before-and-after advertising and misrepresent clinical outcomes.

The draggable comparison slider is already built and wired. To activate a case, replace the
placeholder block with:

```html
<div class="cmp" style="--pos:50%">
  <div class="cmp__side cmp__before" style="background-image:url('assets/img/ba/patient-1-before.jpg')"></div>
  <div class="cmp__side cmp__after"  style="background-image:url('assets/img/ba/patient-1-after.jpg')"></div>
  <span class="cmp__tag cmp__tag--b">Before</span>
  <span class="cmp__tag cmp__tag--a">After</span>
  <div class="cmp__handle"><span class="cmp__knob">
    <svg viewBox="0 0 24 24"><path d="M9 6l-5 6 5 6M15 6l5 6-5 6"/></svg>
  </span></div>
</div>
```

No JS changes needed — `main.js` picks up any `.cmp` that is not `.cmp--empty`.

The four remaining tabs (Microneedling, HydraFacial, BBL Hero, Sciton Moxi) are built and
marked *soon*; drop cases into their panels the same way and remove the `<em>soon</em>`.

### 2b. Team headshots
**Location:** `index.html` › `#team` › `.team__ph`
**Source waiting in Drive:** `Headshots` — `martin-sq.jpg`, `dr-inna.jpg`,
`Dr-Flor-Kent-headshot-square.jpg`, `leigh-2.jpg`, `ellen-aesthetician-featured.jpg`,
`kylie-featured-800x600.jpg`, `IMG_6454-scaled-e1717162366154.jpg`

Rendered as monogram tiles. **No synthetic faces were generated.** These are real, named,
GMC-registered clinicians; an AI face captioned "Dr Martin Wade" would misrepresent an
identifiable person.

Swap by replacing the tile's contents with `<img class="team__img" src="…" alt="…">` and adding
`.team__img{width:100%;height:100%;object-fit:cover}`.

Names used are from the brand questionnaire: Dr Martin Wade, Dr Meriem Martins, Dr Flor Kent,
Leigh, Ellen, Mina, Kylie — plus Dr Inna and Kate Flory, who appear in the supplied Google
reviews and Drive headshots. **Please confirm the roster and spellings.**

### 2c. Logo, favicon and accreditation marks
**Source waiting in Drive:** `london-real-skin-logo.png`, `favicon_londonrealskin_com_48x48.png`,
`CQC-Logo-300x141-1.png`

The header currently uses a typographic `LRS` monogram lockup. Drop the real logo in when
available. CQC and BAD are text badges in the footer pending the real marks.

---

## 3. Real content used verbatim

| Item | Source |
|---|---|
| 7 Google reviews (names, dates, text) | Drive › *Reviews* screenshots, OCR'd |
| Rating 4.9 / 338 reviews | Brand questionnaire + homepage screenshot |
| About copy | Supplied by the client in the brief |
| Before/after disclaimer | Client's own before-and-after layout, unchanged |
| Conditions list (12) | Drive › conditions document |
| Product names and prices (8) | Drive › shop products screenshot |
| Treatment pricing | Brand questionnaire |
| Address, phone, opening hours | Brand questionnaire + homepage screenshot |
| Dr Wade's credentials | Brand questionnaire |
| Legal footer line | Supplied by the client in the brief |

## 4. Content that is NOT real

| Item | Status |
|---|---|
| 4 journal article cards | **Placeholder.** `londonrealskin.com/news/` is blocked by the egress policy, so real titles, dates and URLs could not be retrieved. Topics were drawn from subjects the questionnaire says the clinic treats. **Replace before launch.** |
| Social media links | Point to `#`. Real profile URLs needed. |
| "Hundreds of satisfied patients" | Client-supplied selling point, used verbatim as instructed. |
