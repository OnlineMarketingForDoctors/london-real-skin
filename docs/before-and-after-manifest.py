# -*- coding: utf-8 -*-
"""Generates the gallery body of before-and-after.html from the manifest below.

Run it, then paste the output over everything between the
    <!-- ============ Gallery ============ -->
and
    <!-- ============ Disclaimer ============ -->
comments in before-and-after.html. The site has no build step on purpose, so the
committed page is plain static HTML; this file exists so that the tab list, the
per-category counts and the panels cannot drift apart, which they will if the
markup is edited by hand in three places.

Adding a case: append a dict to the right category. Each case needs a before and
an after file as SEPARATE images (the reveal slider cannot use a composite with
both states baked in) and an "ar" giving the true aspect ratio of the pair, so
the slider crops nothing. 27/13 cases automatically run full width.


The manifest is the single source of truth for the gallery: adding a case means
adding a dict here and re-running, not hand-editing markup in three places.
"""
import io, os, re

# ar: the true aspect ratio of the pair, so .cmp crops nothing.
#   600x400 skin-tag pairs -> 3/2 ; split verticals -> 27/13 ; split horizontals -> 27/52
CATS = [
  dict(id='lesions', name='Skin lesions, tags &amp; blemishes',
       h2='Lesions, tags and blemishes',
       lede='Benign lumps, spots and growths removed under magnification with Sterex ACP '
            'electrolysis. Most are a single visit, and the skin is left to heal without a dressing.',
       cases=[
    dict(slug='ba-lesion', ar='3/2', ext='jpg', dir='',
         h3='Benign skin lesion',
         p='Removed cleanly with Sterex ACP electrolysis, with minimal downtime and no dressing needed.',
         meta='Sterex ACP electrolysis &middot; one session'),
    dict(slug='ba-angioma', ar='3/2', ext='jpg', dir='',
         h3='Cherry angioma',
         p='A benign red blood spot, settled with pinpoint ACP diathermy in a single session.',
         meta='Sterex ACP diathermy &middot; one session'),
    dict(slug='ba-papulosa', ar='3/2', ext='jpg', dir='',
         h3='Dermatosis papulosa nigra',
         p='Clusters of benign papules cleared with fine-probe ACP electrolysis, chosen here for '
           'how predictably it behaves on deeper skin tones.',
         meta='Fine-probe ACP electrolysis &middot; one session'),
    dict(slug='ba-sebk', ar='3/2', ext='jpg', dir='',
         h3='Seborrhoeic keratosis',
         p='A common age-related benign growth, lifted away in one appointment after a '
           'dermatology-led check that it was what it appeared to be.',
         meta='Sterex ACP electrolysis &middot; one session'),
  ]),
  dict(id='texture', name='Acne scarring &amp; skin texture',
       h2='Acne scarring and skin texture',
       lede='Needling and fractional radiofrequency, used to remodel scarred or uneven skin over a '
            'course rather than a single visit. Change here is gradual by design &mdash; collagen '
            'remodelling runs for months after the last session.',
       cases=[
    dict(slug='acne-scarring', ar='27/52',
         h3='Acne scarring, cheek',
         p='Boxcar and rolling scarring softened across a course of microneedling with a '
           'regenerative serum selected at consultation.',
         meta='Microneedling &middot; course of sessions'),
    dict(slug='exion-7', ar='27/52',
         h3='Pitted acne scarring',
         p='Deeper pitted scarring treated with fractional radiofrequency, which places the energy '
           'beneath the surface rather than ablating it.',
         meta='BTL Exion fractional RF &middot; course of sessions'),
    dict(slug='exion-1', ar='27/13',
         h3='Acne scarring and uneven texture',
         p='Scarring and surface roughness treated together, with needle depth adjusted across the '
           'face rather than held at one setting.',
         meta='BTL Exion fractional RF &middot; course of sessions'),
    dict(slug='exion-3', ar='27/13',
         h3='Acne scarring and firmness',
         p='Textural scarring addressed alongside a general loss of firmness through the lower face.',
         meta='BTL Exion fractional RF &middot; course of sessions'),
    dict(slug='exion-6', ar='27/13',
         h3='Acne scarring on deeper skin',
         p='Fractional radiofrequency chosen deliberately here: it does not rely on melanin as a '
           'target, so it behaves predictably on richly pigmented skin.',
         meta='BTL Exion fractional RF &middot; course of sessions'),
    dict(slug='exion-4', ar='27/13',
         h3='Uneven tone and texture',
         p='A combination of surface irregularity and patchy tone, treated over a course.',
         meta='BTL Exion fractional RF &middot; course of sessions'),
    dict(slug='exion-5', ar='27/13',
         h3='Congested, uneven skin',
         p='Congestion and enlarged pores, improved as the treated tissue remodelled.',
         meta='BTL Exion fractional RF &middot; course of sessions'),
  ]),
  dict(id='laxity', name='Lines, laxity &amp; skin quality',
       h2='Lines, laxity and skin quality',
       lede='Radiofrequency and RF microneedling, used where the concern is looseness and crepey '
            'skin rather than scarring. Nothing here adds volume or changes facial shape.',
       cases=[
    dict(slug='rf-1', ar='27/52',
         h3='Lower face laxity and lines',
         p='Established lines and loose skin through the lower face and jawline, treated with RF '
           'microneedling across a course.',
         meta='SkinXcell RF microneedling &middot; course of sessions'),
    dict(slug='rf-2', ar='27/52',
         h3='Skin quality and firmness',
         p='A general improvement in firmness and surface quality rather than the removal of any '
           'one feature.',
         meta='SkinXcell RF microneedling &middot; course of sessions'),
    dict(slug='exion-2', ar='27/13',
         h3='Fine lines and crepey skin',
         p='Crepey texture and fine lines, treated with fractional radiofrequency over a course.',
         meta='BTL Exion fractional RF &middot; course of sessions'),
  ]),
]

ARROW = ('<svg viewBox="0 0 24 24"><path d="M8 9h11l-3-3M16 15H5l3 3"/></svg>')

def case_html(c, i):
    d = c.get('dir', 'pairs/')
    ext = c.get('ext', 'webp')
    if d == '':
        b = 'assets/img/ba/%s-before.%s' % (c['slug'], ext)
        a = 'assets/img/ba/%s-after.%s'  % (c['slug'], ext)
    else:
        b = 'assets/img/ba/pairs/%s-before.webp' % c['slug']
        a = 'assets/img/ba/pairs/%s-after.webp'  % c['slug']
    alt = re.sub('<[^>]+>', '', c['h3'])
    # A pair split from a vertically-stacked composite is extremely wide (27/13);
    # side by side it would be a letterbox slot. Those run full width instead.
    wide = ' gal__case--wide' if c['ar'] == '27/13' else ''
    return '''        <figure class="gal__case%s r" style="--d:%dms">
          <div class="cmp" style="--pos:50%%;--ar:%s">
            <div class="cmp__side cmp__before"><img loading="lazy" src="%s" alt="%s before treatment at London Real Skin"></div>
            <div class="cmp__side cmp__after"><img loading="lazy" src="%s" alt="%s after treatment at London Real Skin"></div>
            <span class="cmp__tag cmp__tag--b">Before</span>
            <span class="cmp__tag cmp__tag--a">After</span>
            <div class="cmp__handle"><span class="cmp__knob">%s</span></div>
          </div>
          <figcaption class="gal__cap">
            <h3>%s</h3>
            <p>%s</p>
            <p class="gal__meta">%s</p>
          </figcaption>
        </figure>''' % (wide, min(i, 3) * 70, c['ar'], b, alt, a, alt, ARROW, c['h3'], c['p'], c['meta'])

tabs, panels = [], []
for n, cat in enumerate(CATS):
    on = 'true' if n == 0 else 'false'
    tabs.append('''        <button class="gal__tab%s" type="button" role="tab" id="gtab-%s"
                aria-controls="gpan-%s" aria-selected="%s" tabindex="%s">
          <span class="u-idx">%02d</span>
          <span class="gal__tab-n">%s</span>
          <span class="gal__tab-c">%d</span>
        </button>''' % (' is-on' if n == 0 else '', cat['id'], cat['id'], on,
                        '0' if n == 0 else '-1', n + 1, cat['name'], len(cat['cases'])))
    panels.append('''      <section class="gal__panel" role="tabpanel" id="gpan-%s" aria-labelledby="gtab-%s"%s>
        <div class="gal__phead">
          <h2 class="u-display u-h2 r">%s</h2>
          <p class="u-lede r" style="--d:80ms">%s</p>
        </div>
        <div class="gal__cases">
%s
        </div>
      </section>''' % (cat['id'], cat['id'], '' if n == 0 else ' hidden',
                       cat['h2'], cat['lede'],
                       '\n'.join(case_html(c, i) for i, c in enumerate(cat['cases']))))

total = sum(len(c['cases']) for c in CATS)
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gal-body.html'), 'w').write(
  '<!-- ============ Gallery ============ -->\n'
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
print('cases', total, 'cats', len(CATS))
