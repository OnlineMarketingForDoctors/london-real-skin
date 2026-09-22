# -*- coding: utf-8 -*-
"""Builds the Before & After gallery from the client's photo library.

Run from the repository root:

    python3 docs/before-and-after-manifest.py --images /path/to/unzipped/library

It reads the library's own index.csv, writes optimised WebP pairs into
assets/img/ba/lib/, and rewrites everything between the

    <!-- ============ Gallery ============ -->
and
    <!-- ============ Disclaimer ============ -->

comments in before-and-after.html. The site has no build step on purpose, so the
committed page stays plain static HTML; this script exists so that the tab list,
the per-category counts and the panels cannot drift apart, which they will if the
markup is edited by hand in three places.

Two rules the library's own README sets, enforced here rather than trusted to a
careful human:

  * Patient names appear only in folder titles and must never be published. Slugs
    and alt text are built from the procedure and the angle, never from PATIENT.
  * "Botox" is a brand of a prescription-only medicine. UK advertising rules bar
    naming a POM to the public, so the folder name never reaches the page — the
    category is "Anti-wrinkle injections" and the captions already use that term.

Adding photography later: drop it into the library in the same
<Procedure>/<Patient>/{before,after}.jpg shape, add the row to index.csv, map the
procedure in CATEGORIES below, and re-run.
"""
import argparse, csv, os, re, sys

# --- procedure -> category -------------------------------------------------
# The client asked for grouping by kind of work rather than one tab per folder:
# "one tab for all laser treatments, one tab for dermal fillers". A procedure
# missing from here stops the build rather than being silently dropped.
CATEGORIES = [
    ('lesions', 'Skin lesions, tags &amp; blemishes', 'Lesions, tags and blemishes',
     'Benign lumps, spots and growths treated under magnification. Most are a single '
     'appointment, and the skin is left to heal without a dressing.',
     ['01 ACP Electrolysis']),

    ('pigmentation', 'Pigmentation &amp; sun damage', 'Pigmentation and sun damage',
     'Age spots, freckling and uneven tone broken down with light and laser. Pigment is '
     'the one area where the wrong device can make things worse, which is why every case '
     'starts with a diagnosis rather than a machine.',
     ['02 AFT Laser - Age Spots', '03 Alma Laser - Pigmentation', '15 Laser - Pigmentation']),

    ('redness', 'Rosacea, redness &amp; thread veins', 'Rosacea, redness and thread veins',
     'Persistent flushing, visible vessels and inflammatory papules, treated with vascular '
     'light and laser over a course.',
     ['04 Alma Laser - Thread Veins', '07 Dye-VL Laser - Rosacea &amp; Flushing',
      '16 Rosacea &amp; Facial Flushing']),

    ('acne', 'Acne &amp; acne scarring', 'Acne and acne scarring',
     'Active breakouts and the scarring left behind are two different problems and are '
     'treated differently. Both are here, and the caption says which.',
     ['11 Kleresca Light Therapy', '20 Microneedling', '21 Acne Scarring',
      '08 Dermal Filler - Acne Scarring']),

    ('texture', 'Skin texture, pores &amp; resurfacing', 'Skin texture, pores and resurfacing',
     'Roughness, enlarged pores and general dullness, treated with fractional resurfacing, '
     'peels and regenerative work rather than anything that adds volume.',
     ['05 iPixel Laser Resurfacing', '14 Pore Refinement', '17 Skin Peels',
      '13 PRP - Skin Rejuvenation']),

    ('fillers', 'Dermal fillers &amp; facial contouring', 'Dermal fillers and facial contouring',
     'Volume replaced or added where it has been lost, and structure built where it helps. '
     'Every case here is a doctor-led injectable treatment.',
     ['08 Dermal Filler - 8 Point Lift', '08 Dermal Filler - Cheek Enhancement',
      '08 Dermal Filler - Jaw Enhancement', '08 Dermal Filler - Jowl',
      '08 Dermal Filler - Lip Enhancement', '09 Non-Surgical Rhinoplasty']),

    ('antiwrinkle', 'Anti-wrinkle injections', 'Anti-wrinkle injections',
     'Expression lines softened while movement is kept. Several of these are photographed '
     'in movement rather than at rest, which is the honest way to show this treatment.',
     ['19 Botox', '08 Dermal Filler - Jaw Reduction']),

    ('eyes', 'Eye rejuvenation', 'Eye rejuvenation',
     'The skin around the eye is the thinnest on the face and shows change first. These '
     'cases cover crepiness, fine lines and excess upper lid skin.',
     ['10 Eye Rejuvenation', '22 Nano Plasma - Non-Surgical Blepharoplasty']),

    ('body', 'Body, stretch marks &amp; laxity', 'Body, stretch marks and laxity',
     'Non-invasive body work: loose skin, stretch marks and contour, treated over a course '
     'rather than in a single visit.',
     ['06 Biodermogenesi']),

    ('removal', 'Hair &amp; tattoo removal', 'Hair and tattoo removal',
     'Laser removal is a course, not an appointment. These show where a full course gets to, '
     'and one case is shown part-way through so the pace is clear.',
     ['12 Laser Hair Removal', '18 Tattoo Removal']),
]

# Under-eye iPixel cases read better beside the other eye work than beside the
# resurfacing cases, so they are moved by patient folder rather than procedure.
MOVE_TO_EYES = {'Under eye - female patient', 'Under eye - female patient 2'}

# The library's caption for this case names a prescription-only topical, which UK
# advertising rules do not allow on a public page. The treatment is unchanged;
# only the wording is. Recorded in docs/COPY.md for the client.
CAPTION_OVERRIDES = {
    ('20 Microneedling', 'Acne scarring - male patient', 'main'):
        'Acne scarring treated with a combination of microneedling and a prescription '
        'topical retinoid.',
}

PROC_LABEL = {
    '01 ACP Electrolysis': 'ACP electrolysis',
    '02 AFT Laser - Age Spots': 'AFT laser',
    '03 Alma Laser - Pigmentation': 'Alma laser',
    '04 Alma Laser - Thread Veins': 'Alma laser',
    '05 iPixel Laser Resurfacing': 'iPixel fractional laser',
    '06 Biodermogenesi': 'Biodermogenesi',
    '07 Dye-VL Laser - Rosacea &amp; Flushing': 'Dye-VL laser',
    '08 Dermal Filler - 8 Point Lift': 'Dermal filler &middot; eight-point lift',
    '08 Dermal Filler - Acne Scarring': 'Dermal filler &middot; scar subcision',
    '08 Dermal Filler - Cheek Enhancement': 'Dermal filler &middot; cheek',
    '08 Dermal Filler - Jaw Enhancement': 'Dermal filler &middot; jawline',
    '08 Dermal Filler - Jaw Reduction': 'Masseter treatment',
    '08 Dermal Filler - Jowl': 'Dermal filler &middot; jowl',
    '08 Dermal Filler - Lip Enhancement': 'Dermal filler &middot; lips',
    '09 Non-Surgical Rhinoplasty': 'Non-surgical rhinoplasty',
    '10 Eye Rejuvenation': 'Eye rejuvenation',
    '11 Kleresca Light Therapy': 'Kleresca biophotonic light therapy',
    '12 Laser Hair Removal': 'Laser hair removal',
    '13 PRP - Skin Rejuvenation': 'PRP skin rejuvenation',
    '14 Pore Refinement': 'Pore refinement',
    '15 Laser - Pigmentation': 'Laser pigmentation treatment',
    '16 Rosacea &amp; Facial Flushing': 'Vascular laser',
    '17 Skin Peels': 'Medical-grade skin peel',
    '18 Tattoo Removal': 'Laser tattoo removal',
    '19 Botox': 'Anti-wrinkle injections',
    '20 Microneedling': 'Medical microneedling',
    '21 Acne Scarring': 'Acne scar treatment',
    '22 Nano Plasma - Non-Surgical Blepharoplasty': 'Nano plasma',
}

# The heading for each case, keyed on (procedure, patient folder). Explicit
# rather than derived: this is client-facing copy about a real person's
# treatment, and a heuristic that produced "Face" nine times or "scar
# subcision" in lower case is worse than a table. Patient folders are only
# ever keys here — the names in them never reach the page.
HEADINGS = {
 ('01 ACP Electrolysis', 'Angioma - male patient'): 'Cherry angioma on the forehead',
 ('01 ACP Electrolysis', 'Dermatosis papulosa nigra - female patient'): 'Dermatosis papulosa nigra',
 ('01 ACP Electrolysis', 'Benign lesions - male patient (Bailleul)'): 'Benign lesions on the cheek',
 ('02 AFT Laser - Age Spots', 'Hands - female patient (Joy)'): 'Age spots on the hands',
 ('02 AFT Laser - Age Spots', 'Face - female patient (Joy)'): 'Sun damage and age spots on the face',
 ('03 Alma Laser - Pigmentation', 'Chest - female patient'): 'Freckling across the chest',
 ('03 Alma Laser - Pigmentation', 'Face - female patient'): 'Dense facial pigmentation',
 ('04 Alma Laser - Thread Veins', 'Face - female patient'): 'Thread veins across the cheeks',
 ('05 iPixel Laser Resurfacing', 'Skin texture - female patient'): 'Uneven texture and open pores',
 ('05 iPixel Laser Resurfacing', 'Under eye - female patient'): 'Fine lines under the eye',
 ('05 iPixel Laser Resurfacing', 'Under eye - female patient 2'): 'Crepey skin under the eye',
 ('05 iPixel Laser Resurfacing', 'Decolletage - female patient'): 'Sun damage on the d\u00e9colletage',
 ('06 Biodermogenesi', 'Abdomen - male patient (Adrian Stewart)'): 'Loose skin across the abdomen',
 ('06 Biodermogenesi', 'Waist - female patient (Camilla Hooper)'): 'Contour through the waist and flank',
 ('06 Biodermogenesi', 'Stretch marks - female patient'): 'Stretch marks on the thigh',
 ('07 Dye-VL Laser - Rosacea &amp; Flushing', 'Female patient (Yasmina)'): 'Persistent facial redness',
 ('07 Dye-VL Laser - Rosacea &amp; Flushing', 'Male patient'): 'Rosacea across the forehead and cheeks',
 ('07 Dye-VL Laser - Rosacea &amp; Flushing', 'Female patient (Charlotte Cass)'): 'Inflamed papules and flushing',
 ('08 Dermal Filler - 8 Point Lift', 'Female patient'): 'Midface volume, eight-point lift',
 ('08 Dermal Filler - Acne Scarring', 'Female patient (Tara Mac Auley)'): 'Depressed acne scars on the cheek',
 ('08 Dermal Filler - Cheek Enhancement', 'Female patient (Louise Sutton)'): 'Cheekbone volume',
 ('08 Dermal Filler - Jaw Enhancement', 'Male patient'): 'Jawline definition',
 ('08 Dermal Filler - Jaw Reduction', 'Female patient'): 'A narrower lower face',
 ('08 Dermal Filler - Jowl', 'Female patient'): 'Early jowling along the jawline',
 ('08 Dermal Filler - Lip Enhancement', 'Female patient'): 'Lip definition and proportion',
 ('08 Dermal Filler - Lip Enhancement', 'Male patient'): 'Subtle lip shaping',
 ('09 Non-Surgical Rhinoplasty', 'Male patient (Farbord)'): 'A dorsal hump camouflaged',
 ('09 Non-Surgical Rhinoplasty', 'Female patient (Jen Topliss)'): 'Bridge smoothed and tip lifted',
 ('09 Non-Surgical Rhinoplasty', 'Female patient (Zuzana Barak)'): 'Bridge balanced against the tip',
 ('10 Eye Rejuvenation', 'Female patient'): "Crow's feet and crepey eyelid skin",
 ('11 Kleresca Light Therapy', 'Male patient (Daniel Pectu)'): 'Active inflammatory acne on the cheek',
 ('11 Kleresca Light Therapy', 'Male patient (Preben Forer)'): 'Breakouts across the cheek and jaw',
 ('11 Kleresca Light Therapy', 'Female patient (Joanna Raven)'): 'Widespread active acne',
 ('12 Laser Hair Removal', 'Chest - male patient'): 'Dense chest hair',
 ('13 PRP - Skin Rejuvenation', 'Male patient'): 'Texture and acne scarring on the cheek',
 ('14 Pore Refinement', 'Female patient'): 'Enlarged pores, nose and cheeks',
 ('15 Laser - Pigmentation', 'Chest - female patient'): 'Sun-induced pigmentation on the chest',
 ('15 Laser - Pigmentation', 'Neck - female patient'): 'A dense patch of pigmentation on the neck',
 ('16 Rosacea &amp; Facial Flushing', 'Female patient (Victoria Bolton)'): 'Facial redness across the cheeks',
 ('17 Skin Peels', 'Female patient'): 'Overall clarity and tone',
 ('17 Skin Peels', 'Male patient (Dalmar Costa)'): 'Breakouts and post-inflammatory marking',
 ('18 Tattoo Removal', 'Forearm - male patient'): 'A small forearm tattoo',
 ('18 Tattoo Removal', 'Lettering - forearm'): 'Dense black lettering on the forearm',
 ('18 Tattoo Removal', 'Tribal design - upper arm'): 'A tribal design, part-way through a course',
 ('18 Tattoo Removal', 'Torso - female patient'): 'An older tattoo on the torso',
 ('18 Tattoo Removal', 'Theatre masks - arm'): 'A dark arm tattoo',
 ('19 Botox', 'Female patient A'): 'Forehead, frown and eye lines',
 ('19 Botox', 'Female patient B'): 'Treated lines seen in movement',
 ('19 Botox', 'Male patient'): 'Deep horizontal forehead lines',
 ('19 Botox', 'Forehead - female patient (Louise Sutton)'): 'Horizontal forehead lines',
 ('20 Microneedling', 'Acne scarring - female patient'): 'Pitted acne scarring on the cheek',
 ('20 Microneedling', 'Acne scarring - female patient (SkinPen)'): 'Textured acne scarring',
 ('20 Microneedling', 'Acne scarring - male patient'): 'Acne scarring, combination treatment',
 ('21 Acne Scarring', 'Male patient (Adam Wallus)'): 'Extensive scarring across cheek and jaw',
 ('22 Nano Plasma - Non-Surgical Blepharoplasty', 'Female patient'): 'Excess upper eyelid skin',
}

ANGLE_LABEL = {'front': 'front', 'profile': 'profile', 'close': 'close-up',
               'three-quarter': 'three-quarter', 'crows-feet': "crow's feet",
               'brow-raise': 'brow raise', 'frown': 'frowning', 'smile': 'smiling',
               'hands-flat': 'palms down', 'hands-closed': 'closed'}


def esc(s):
    return (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
             .replace("'", '&rsquo;'))


def slugify(s):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')


def heading(proc, patient, angle):
    try:
        base = HEADINGS[(proc, patient)]
    except KeyError:
        sys.exit('No heading for %r / %r — add one to HEADINGS.' % (proc, patient))
    if angle and angle != 'main':
        return '%s (%s)' % (base, ANGLE_LABEL.get(angle, angle))
    return base


def build(images_root, repo_root):
    from PIL import Image
    rows = list(csv.DictReader(open(os.path.join(images_root, 'index.csv'))))
    # index.csv is written with a literal "&"; the category tables use entities.
    for r in rows:
        r['Procedure'] = r['Procedure'].replace('&', '&amp;')

    proc_to_cat = {}
    for cid, _, _, _, procs in CATEGORIES:
        for p in procs:
            proc_to_cat[p] = cid

    unknown = sorted({r['Procedure'] for r in rows} - set(proc_to_cat))
    if unknown:
        sys.exit('Unmapped procedures, refusing to drop them silently:\n  ' + '\n  '.join(unknown))

    out_dir = os.path.join(repo_root, 'assets/img/ba/lib')
    os.makedirs(out_dir, exist_ok=True)

    buckets = {cid: [] for cid, *_ in CATEGORIES}
    seen, total_bytes = set(), 0
    for r in rows:
        proc, patient, angle = r['Procedure'], r['Patient'], r['Angle']
        cid = 'eyes' if patient in MOVE_TO_EYES else proc_to_cat[proc]

        # Slug from the published label, never the folder name: the folder for the
        # anti-wrinkle cases is "19 Botox", and a POM brand must not appear in a
        # filename any more than in the copy.
        stem = slugify(PROC_LABEL[proc].replace('&middot;', ' ').replace('&amp;', 'and'))
        if angle and angle != 'main':
            stem += '-' + slugify(angle)
        n = 2
        base = stem
        while stem in seen:                      # never include the patient name
            stem = '%s-%d' % (base, n); n += 1
        seen.add(stem)

        for half, col in (('before', 'Before file'), ('after', 'After file')):
            src = os.path.join(images_root, r[col])
            dst = os.path.join(out_dir, '%s-%s.webp' % (stem, half))
            im = Image.open(src)
            if im.width > 1200:                  # 1600px is more than the slot ever needs
                im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
            im.save(dst, 'WEBP', quality=82, method=6)
            total_bytes += os.path.getsize(dst)

        cap = CAPTION_OVERRIDES.get((proc, patient, angle), r['Caption'])
        buckets[cid].append(dict(
            stem=stem,
            h3=esc(heading(proc, patient, angle)),
            p=esc(cap),
            meta=PROC_LABEL[proc],
            flagged=bool(r['Flagged as best guess'].strip()),
        ))
    return buckets, total_bytes


ARROW = '<svg viewBox="0 0 24 24"><path d="M8 9h11l-3-3M16 15H5l3 3"/></svg>'


def case_html(c, i):
    alt = re.sub('<[^>]+>', '', c['h3'])
    return '''        <figure class="gal__case r" style="--d:%dms">
          <div class="cmp" style="--pos:50%%">
            <div class="cmp__side cmp__before"><img loading="lazy" width="1200" height="900" src="assets/img/ba/lib/%s-before.webp" alt="%s, before treatment at London Real Skin"></div>
            <div class="cmp__side cmp__after"><img loading="lazy" width="1200" height="900" src="assets/img/ba/lib/%s-after.webp" alt="%s, after treatment at London Real Skin"></div>
            <span class="cmp__tag cmp__tag--b">Before</span>
            <span class="cmp__tag cmp__tag--a">After</span>
            <div class="cmp__handle"><span class="cmp__knob">%s</span></div>
          </div>
          <figcaption class="gal__cap">
            <h3>%s</h3>
            <p>%s</p>
            <p class="gal__meta">%s</p>
          </figcaption>
        </figure>''' % (min(i, 3) * 70, c['stem'], alt, c['stem'], alt, ARROW,
                        c['h3'], c['p'], c['meta'])


def render(buckets):
    tabs, panels = [], []
    for n, (cid, name, h2, lede, _) in enumerate(CATEGORIES):
        cases = buckets[cid]
        on = n == 0
        tabs.append('''        <button class="gal__tab%s" type="button" role="tab" id="gtab-%s"
                aria-controls="gpan-%s" aria-selected="%s" tabindex="%s">
          <span class="u-idx">%02d</span>
          <span class="gal__tab-n">%s</span>
          <span class="gal__tab-c">%d</span>
        </button>''' % (' is-on' if on else '', cid, cid, str(on).lower(),
                        '0' if on else '-1', n + 1, name, len(cases)))
        panels.append('''      <section class="gal__panel" role="tabpanel" id="gpan-%s" aria-labelledby="gtab-%s"%s>
        <div class="gal__phead">
          <h2 class="u-display u-h2 r">%s</h2>
          <p class="u-lede r" style="--d:80ms">%s</p>
        </div>
        <div class="gal__cases">
%s
        </div>
      </section>''' % (cid, cid, '' if on else ' hidden', h2, lede,
                       '\n'.join(case_html(c, i) for i, c in enumerate(cases))))

    return ('<!-- ============ Gallery ============ -->\n'
            '<section class="u-sec gal" id="gallery" data-rail="Before &amp; after">\n'
            '  <div class="u-wrap">\n'
            '    <div class="gal__grid">\n\n'
            '      <aside class="gal__side">\n'
            '        <div class="gal__side-in">\n'
            '          <p class="u-eyebrow r">Browse by</p>\n'
            '          <div class="gal__nav" role="tablist" aria-orientation="vertical" aria-label="Treatment categories">\n'
            + '\n'.join(tabs) + '\n'
            '          </div>\n'
            '          <p class="gal__side-note">Drag the handle across any image to compare.</p>\n'
            '          <a class="u-btn u-btn--ink gal__side-cta" href="contact.html"><span>Book a free consultation</span></a>\n'
            '        </div>\n'
            '      </aside>\n\n'
            '      <div class="gal__main">\n'
            + '\n\n'.join(panels) + '\n'
            '      </div>\n\n'
            '    </div>\n'
            '  </div>\n'
            '</section>\n')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--images', required=True, help='root of the unzipped photo library')
    ap.add_argument('--repo', default='.', help='repository root')
    a = ap.parse_args()

    buckets, nbytes = build(a.images, a.repo)
    body = render(buckets)

    page = os.path.join(a.repo, 'before-and-after.html')
    s = open(page, encoding='utf-8').read()
    i = s.index('<!-- ============ Gallery ============ -->')
    j = s.index('<!-- ============ Disclaimer ============ -->')
    open(page, 'w', encoding='utf-8').write(s[:i] + body + '\n' + s[j:])

    total = sum(len(v) for v in buckets.values())
    flagged = [c for v in buckets.values() for c in v if c['flagged']]
    print('%d cases across %d categories, %d KB of images' % (total, len(CATEGORIES), nbytes // 1024))
    for cid, name, *_ in CATEGORIES:
        print('  %-14s %2d  %s' % (cid, len(buckets[cid]), name.replace('&amp;', '&')))
    print('%d pairs flagged best-guess by the library, needing client confirmation:' % len(flagged))
    for c in flagged:
        print('   ', c['stem'])
