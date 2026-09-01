/* =====================================================================
   London Real Skin homepage interactions
   Vanilla, no dependencies. Everything degrades to a readable static
   page if JS fails, and every motion path respects prefers-reduced-motion.
   ===================================================================== */
(function () {
  'use strict';

  var CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG/';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Scroll reveal ----------
     IntersectionObserver drives this, but a geometry check runs alongside it.
     An element that starts visually hidden can report a zero-area intersection
     rect and so never fire, which would leave it hidden for good. */
  var revealables = $$('.r, .r-clip, .r-line');
  function revealBy(el) { el.classList.add('is-in'); }
  function sweepReveals() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = revealables.length - 1; i >= 0; i--) {
      var el = revealables[i];
      if (el.classList.contains('is-in')) { revealables.splice(i, 1); continue; }
      var top = el.getBoundingClientRect().top;
      if (top < vh * 0.92) { revealBy(el); revealables.splice(i, 1); }
    }
  }
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { revealBy(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealables.slice().forEach(function (el) { io.observe(el); });
    sweepReveals();
    window.addEventListener('load', sweepReveals);
  } else {
    revealables.slice().forEach(revealBy);
    revealables.length = 0;
  }

  /* ---------- Header: floats over the hero, frosts once scrolled ---------- */
  var masthead = $('#masthead');
  function measureHead() {
    document.documentElement.style.setProperty('--mast-h', masthead.offsetHeight + 'px');
  }
  var onScrollHeader = function () {
    // Switch as soon as the dark area behind the bar no longer sits under it.
    // A page with neither hero has nothing dark to float over, so the bar is
    // solid from the first pixel; light-on-light would be unreadable.
    var hero = $('.hero') || $('.phero');
    if (!hero) { masthead.classList.add('is-stuck'); return; }
    var limit = hero.offsetHeight - masthead.offsetHeight - 40;
    masthead.classList.toggle('is-stuck', window.scrollY > limit);
  };
  measureHead();
  onScrollHeader();
  window.addEventListener('resize', function () { measureHead(); onScrollHeader(); }, { passive: true });
  window.addEventListener('load', measureHead);

  /* ---------- Scroll listener (header state only; the rail was removed) ---------- */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScrollHeader(); sweepReveals(); toTopState(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  /* ---------- Mobile drawer ---------- */
  var burger = $('#burger'), drawer = $('#drawer'), drawerClose = $('#drawerClose');
  if (burger && drawer && drawerClose) {
  function setDrawer(open) {
    drawer.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setDrawer(!drawer.classList.contains('is-open')); });
  drawerClose.addEventListener('click', function () { setDrawer(false); });
  $$('.drawer__a', drawer).forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
  });
  }

  /* ---------- Primary nav dropdown ----------
     Hover is handled in CSS. This adds the keyboard and touch path: the caret
     button toggles, Escape closes and returns focus, and a click anywhere else
     closes it. The parent link is left alone so it still navigates. */
  $$('.nav__has').forEach(function (wrap) {
    var btn = $('.nav__toggle', wrap);
    if (!btn) return;
    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      wrap.classList.toggle('is-open', open);
    }
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) setOpen(false);
    });
  });

  /* ---------- Hero slideshow (homepage only) ---------- */
  var slides = $$('.hero__slide');
  var heroNum = $('#heroNum');
  var heroI = 0, heroTimer = null;
  if (slides.length) {
  function heroGo(n) {
    slides[heroI].classList.remove('is-on');
    heroI = (n + slides.length) % slides.length;
    var el = slides[heroI];
    // force the Ken Burns keyframes to restart from the top on every slide
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
    el.classList.add('is-on');
    if (heroNum) heroNum.textContent = String(heroI + 1).padStart(2, '0');
  }
  function heroStart() {
    if (reduced || slides.length < 2) return;
    heroTimer = window.setInterval(function () { heroGo(heroI + 1); }, 4200);
  }
  heroStart();
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { window.clearInterval(heroTimer); }
    else { window.clearInterval(heroTimer); heroStart(); }
  });
  }

  /* ---------- Promotions slider (homepage only) ---------- */
  (function () {
    var pTrack = $('#promoTrack');
    var pDots = $$('#promoDots .promo__dot');
    var pNext = $('#promoNext'), pPrev = $('#promoPrev');
    if (!pTrack || !pDots.length || !pNext || !pPrev) return;
    var pCount = pDots.length, pI = 0, pTimer = null;
    function pGo(n) {
      pI = (n + pCount) % pCount;
      pTrack.style.transform = 'translateX(' + (-100 * pI) + '%)';
      pDots.forEach(function (d, i) { d.classList.toggle('is-on', i === pI); });
    }
    function pStart() { if (!reduced) pTimer = window.setInterval(function () { pGo(pI + 1); }, 7000); }
    function pReset() { window.clearInterval(pTimer); pStart(); }
    pNext.addEventListener('click', function () { pGo(pI + 1); pReset(); });
    pPrev.addEventListener('click', function () { pGo(pI - 1); pReset(); });
    pDots.forEach(function (d, i) { d.addEventListener('click', function () { pGo(i); pReset(); }); });
    pStart();
  })();

  /* ---------- Reviews marquee ----------
     Real, verbatim Google reviews supplied by the clinic.                */
  var REVIEWS = [
    { n: 'Paula Gorski', m: '6 reviews · 2 months ago', i: 'P',
      t: "I’ve been seeing medical aesthetician Kylie for the last 4 months for laser and microneedling, and she has been an absolute dream! Always so warm, personable and accommodating, provides great care and makes me confident that my skin is in great hands. Could not recommend her enough!" },
    { n: 'AK', m: 'Local Guide · 21 reviews · a month ago', i: 'A',
      t: "I was a regular client at this clinic for over a year, and aesthetician Leigh was always so helpful, knowledgeable and kind. She took time to discuss different treatment options with me and to tailor them to my skin’s specific needs. I especially appreciated her warmth and how she went out of her way to answer my (numerous!) skincare questions." },
    { n: 'Kakter Lalql', m: 'Local Guide · 71 reviews · 2 months ago', i: 'K',
      t: "I had an appointment with Dr Inna for milia extraction and sebaceous hyperplasia. I had this issue for years and she managed to resolve it in a few minutes. I’m over the moon with the treatment. She also helped me treat a few broken capillaries so my skin now looks fresh and spotless." },
    { n: 'Светлана Коршикова', m: '2 reviews · 9 months ago', i: 'C',
      t: "Dr. Inna is absolutely amazing! I recently had an RF Microneedling treatment with her, and the experience was fantastic from start to finish. She explained everything clearly, made me feel completely comfortable, and the results are already visible, my skin looks tighter, smoother, and glowing." },
    { n: 'Jasmeet Klair', m: '2 reviews · 10 months ago', i: 'J',
      t: "Had such a fantastic experience with the team at London Real Skin right from the moment of booking! Loretta was amazing, super attentive and made sure I got the right appointment for my needs. Kelly was absolutely brilliant, so skilled at what she does and really took the time to explain everything clearly." },
    { n: 'Peter Cummins', m: '9 reviews · 5 months ago', i: 'P',
      t: "Had an amazing experience today at the clinic. I had a great consultation with Kate, we discussed in-depth my concerns with my skin and what I hoped to achieve. I was recommended a HydraFacial to start off my journey. This was done with Mina, who was also fabulous. My skin looks like glass!" },
    { n: 'ES', m: '6 reviews · 5 months ago', i: 'E',
      t: "I had the best experience today with Dr Inna for a milia removal. Dr Inna was very informative, she made me feel super comfortable the whole time and made my experience as smooth as possible the whole way. I will definitely be returning back for more treatments. Very happy customer :)" }
  ];
  var STAR = '<svg viewBox="0 0 24 24"><path d="M12 2l3 6.9 7.5.7-5.6 5 1.6 7.4L12 18l-6.5 4 1.6-7.4-5.6-5 7.5-.7z"/></svg>';
  function revCard(r) {
    return '<article class="rev">' +
      '<div class="rev__top">' +
        '<span class="rev__av">' + r.i + '</span>' +
        '<span><span class="rev__who">' + r.n + '</span><br><span class="rev__when">' + r.m + '</span></span>' +
      '</div>' +
      '<div class="rev__stars">' + STAR + STAR + STAR + STAR + STAR + '</div>' +
      '<p class="rev__body">' + r.t + '</p>' +
      '<button class="rev__more" type="button">Read more</button>' +
      '<p class="rev__g">' + '<svg class="rev__g-mark" viewBox="0 0 48 48" aria-hidden="true">' +'<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +'<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +'<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +'<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +'</svg>' + 'Posted on Google</p>' +
    '</article>';
  }
  var revTrack = $('#revTrack');
  if (revTrack) {
    var html = REVIEWS.map(revCard).join('');
    revTrack.innerHTML = html + html;           // duplicated → seamless -50% loop
    if (reduced) revTrack.style.animation = 'none';

    // Expand a review in place. Only clamped cards need the control.
    $$('.rev', revTrack).forEach(function (card) {
      var body = $('.rev__body', card), btn = $('.rev__more', card);
      if (!body || !btn) return;
      if (body.scrollHeight <= body.clientHeight + 2) { btn.style.display = 'none'; return; }
      btn.addEventListener('click', function () {
        var open = card.classList.toggle('is-open');
        btn.textContent = open ? 'Read less' : 'Read more';
      });
    });
  }

  /* ---------- Before & after tabs ---------- */
  var tabs = $$('.ba__tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    });
    tab.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') { tabs[(i + 1) % tabs.length].focus(); tabs[(i + 1) % tabs.length].click(); }
      if (e.key === 'ArrowLeft')  { tabs[(i - 1 + tabs.length) % tabs.length].focus(); tabs[(i - 1 + tabs.length) % tabs.length].click(); }
    });
  });

  /* ---------- Before & after: draggable comparison ----------
     Wired up now so that dropping real consented photos into a
     .cmp (with .cmp__before / .cmp__after) needs no further code.        */
  $$('.cmp').forEach(function (cmp) {
    if (cmp.classList.contains('cmp--empty')) return;
    var dragging = false;
    function setPos(clientX) {
      var r = cmp.getBoundingClientRect();
      var pct = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
      cmp.style.setProperty('--pos', pct + '%');
    }
    cmp.addEventListener('pointerdown', function (e) { dragging = true; cmp.setPointerCapture(e.pointerId); setPos(e.clientX); });
    cmp.addEventListener('pointermove', function (e) { if (dragging) setPos(e.clientX); });
    cmp.addEventListener('pointerup',   function () { dragging = false; });
    cmp.addEventListener('pointercancel', function () { dragging = false; });
  });

  /* ---------- Before & after carousel (two cases in view) ---------- */
  (function () {
    var track = $('#baTrack'), prev = $('#baPrev'), next = $('#baNext');
    if (!track || !prev || !next) return;
    var i = 0;
    function step() {
      var card = $('.ba__case', track);
      if (!card) return 0;
      return card.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 0);
    }
    function maxX() { return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth); }
    function go(n) {
      var st = step(), pages = st ? Math.ceil(maxX() / st) : 0;
      i = Math.max(0, Math.min(pages, n));
      track.style.transform = 'translateX(' + (-Math.min(i * st, maxX())) + 'px)';
      prev.disabled = i === 0;
      next.disabled = i >= pages;
    }
    next.addEventListener('click', function () { go(i + 1); });
    prev.addEventListener('click', function () { go(i - 1); });
    window.addEventListener('resize', function () { go(0); }, { passive: true });
    window.addEventListener('load', function () { go(0); });
    go(0);
  })();

  /* ---------- Treatments: accordion + synced imagery ---------- */
  var svcRows = $$('.svc__row');
  var svcImgs = $$('.svc__viz-img');
  var svcCap = $('#svcVizCap');
  var SVC_NAMES = ['Injectables', 'Face', 'Body', 'For Men', 'Medical'];

  function svcOpen(row) {
    svcRows.forEach(function (r) {
      var on = r === row;
      r.classList.toggle('is-on', on);
      var btn = $('.svc__trigger', r);
      var panel = $('.svc__panel', r);
      var inner = $('.svc__panel-in', r);
      btn.setAttribute('aria-expanded', String(on));
      panel.style.height = on ? (inner.offsetHeight + 'px') : '0px';
    });
    var idx = parseInt(row.getAttribute('data-viz'), 10) || 0;
    svcImgs.forEach(function (img, i) { img.classList.toggle('is-on', i === idx); });
    if (svcCap) svcCap.textContent = SVC_NAMES[idx];
  }
  svcRows.forEach(function (row) {
    $('.svc__trigger', row).addEventListener('click', function () {
      if (row.classList.contains('is-on')) return;  // one always stays open
      svcOpen(row);
    });
  });
  // Set the initial open row's height once fonts have settled.
  window.addEventListener('load', function () {
    var open = $('.svc__row.is-on');
    if (open) svcOpen(open);
  });
  window.addEventListener('resize', function () {
    var open = $('.svc__row.is-on');
    if (open) {
      var panel = $('.svc__panel', open), inner = $('.svc__panel-in', open);
      panel.style.height = inner.offsetHeight + 'px';
    }
  }, { passive: true });

  /* ---------- Conditions: the dermatoscope ---------- */
  /* One plate per concern, in the SAME ORDER as the .cond__btn list in the
     markup — condGo() indexes this array by the button's position, so the two
     must be reordered together or every image shows the wrong concern. */
  var PLATES = [
    'hf_20260805_221518_c62357cc-4f33-41f5-853b-8fac0619d6ea.png',   // Acne scarring
    'hf_20260805_221518_70dc563b-4ad4-441b-989b-c6117b432cfe.png',   // Pigmentation
    'hf_20260805_221518_7767a1b4-2d6a-440e-9265-ca70a99bbf34.png',   // Rosacea
    'hf_20260805_221518_e61e1d16-c206-4825-a17d-fe426a2969ac.png',   // Thread veins
    'hf_20260805_221518_3cc610fc-06c4-4e01-bf02-4fe70ea31fc7.png',   // Skin tags
    'hf_20260805_221518_1c04d77b-08f7-4790-a04c-4cc83512e71e.png',   // Genital tags and warts (instruments)
    'hf_20260805_221518_8bf0b401-88e1-4092-b8bb-7b3d554ef260.png',   // Teeth grinding
    'hf_20260805_221518_7858a2f9-378f-490f-a1bb-8c8a7f60549a.png',   // Fine lines
    'hf_20260805_221518_c6e1b1d0-4f59-4db4-aa8b-f0a7e12c9c63.png',   // Ageing skin
    'hf_20260805_221518_7067dbbf-d0c8-4f3b-8c15-c5b2e9d25915.png',   // Crepey skin
    'hf_20260805_222244_206e16e2-d3ad-410a-81cd-094b26de7c11.png',   // Stretch marks
    'hf_20260805_221518_f69fbb70-041f-4608-8a70-6870cc219253.png'    // Excess hair
  ];
  var scope = $('#scope'), scopeName = $('#scopeName'), scopeNo = $('#scopeNo');
  var condBtns = $$('.cond__btn');
  var plateEls = [];

  if (scope) {
    PLATES.forEach(function (file, i) {
      var d = document.createElement('div');
      d.className = 'scope__plate' + (i === 0 ? ' is-on' : '');
      d.style.backgroundImage = "url('" + CDN + file + "')";
      scope.insertBefore(d, scope.firstChild);
      plateEls.push(d);
    });
  }

  var condI = 0;
  function condGo(i) {
    if (i === condI) return;
    condI = i;
    plateEls.forEach(function (p, n) { p.classList.toggle('is-on', n === i); });
    condBtns.forEach(function (b, n) { b.classList.toggle('is-on', n === i); });
    var label = $('.cond__label', condBtns[i]).textContent;
    if (scopeName) scopeName.textContent = label;
    if (scopeNo) scopeNo.textContent = 'FIELD ' + String(i + 1).padStart(2, '0') + ' / ' + condBtns.length;
  }
  condBtns.forEach(function (b, i) {
    b.addEventListener('mouseenter', function () { condGo(i); });
    b.addEventListener('focus', function () { condGo(i); });
    b.addEventListener('click', function () { condGo(i); });
  });

  /* ---------- Team bios: Read more ---------- */
  $$('.team__card').forEach(function (card) {
    var bio = $('.team__bio', card), btn = $('.team__more', card);
    /* Read more is a link to the full biography now, not an expander. */
    if (!bio || !btn || btn.tagName !== 'BUTTON') return;
    btn.addEventListener('click', function () {
      var open = card.classList.toggle('is-open');
      btn.textContent = open ? 'Read less' : 'Read more';
    });
  });

  /* ---------- Team carousel ---------- */
  (function () {
    var track = $('#teamTrack'), prev = $('#teamPrev'), next = $('#teamNext');
    if (!track || !prev || !next) return;
    var i = 0;
    function step() {
      var card = $('.team__card', track);
      if (!card) return 0;
      return card.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 0);
    }
    function maxX() { return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth); }
    function go(n) {
      var st = step(), pages = st ? Math.ceil(maxX() / st) : 0;
      i = Math.max(0, Math.min(pages, n));
      track.style.transform = 'translateX(' + (-Math.min(i * st, maxX())) + 'px)';
      prev.disabled = i === 0;
      next.disabled = i >= pages;
    }
    next.addEventListener('click', function () { go(i + 1); });
    prev.addEventListener('click', function () { go(i - 1); });
    window.addEventListener('resize', function () { go(0); }, { passive: true });
    window.addEventListener('load', function () { go(0); });
    go(0);
  })();

  /* ---------- Devices slider ---------- */
  var devTrack = $('#devTrack');
  var devPrev = $('#devPrev'), devNext = $('#devNext'), devBar = $('#devBar');
  var devI = 0;

  function devStep() {
    var card = $('.dev__card', devTrack);
    if (!card) return 0;
    var gap = parseFloat(getComputedStyle(devTrack).gap) || 0;
    return card.offsetWidth + gap;
  }
  function devMax() {
    var vp = devTrack.parentElement.offsetWidth;
    return Math.max(0, devTrack.scrollWidth - vp);
  }
  function devGo(i) {
    var step = devStep();
    var maxCards = Math.max(0, Math.ceil(devMax() / step));
    devI = Math.max(0, Math.min(maxCards, i));
    var x = Math.min(devI * step, devMax());
    devTrack.style.transform = 'translateX(' + (-x) + 'px)';
    devPrev.disabled = devI === 0;
    devNext.disabled = devI >= maxCards;
    if (devBar) {
      var pct = maxCards === 0 ? 100 : ((devI / maxCards) * 100);
      devBar.style.width = Math.max(12, pct) + '%';
    }
  }
  if (devTrack) {
    devNext.addEventListener('click', function () { devGo(devI + 1); });
    devPrev.addEventListener('click', function () { devGo(devI - 1); });
    window.addEventListener('resize', function () { devGo(0); }, { passive: true });
    window.addEventListener('load', function () { devGo(0); });
    devGo(0);
  }

  /* ---------- Back to top ---------- */
  var toTop = $('#toTop');
  function toTopState() {
    if (toTop) toTop.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.75);
  }
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
    toTopState();
  }

  /* ---------- Treatments: sticky category nav ----------
     Marks the category you are currently reading. Cheap enough to run on
     every scroll frame: five elements, one rect read each. */
  var tnav = $('#tnav');
  if (tnav) {
    var chips = $$('.tnav__chip', tnav);
    var trtSecs = chips.map(function (c) { return document.querySelector(c.getAttribute('href')); });
    var spyTnav = function () {
      var line = masthead.offsetHeight + tnav.offsetHeight + 40;
      var active = 0;
      for (var i = 0; i < trtSecs.length; i++) {
        if (trtSecs[i] && trtSecs[i].getBoundingClientRect().top <= line) active = i;
      }
      chips.forEach(function (c, i) { c.classList.toggle('is-on', i === active); });
    };
    window.addEventListener('scroll', spyTnav, { passive: true });
    window.addEventListener('resize', spyTnav);
    spyTnav();
  }

  /* ---------- Blog: filter by topic ---------- */
  var jf = $('#jf'), jcGrid = $('#jcGrid');
  if (jf && jcGrid) {
    var jfChips = $$('.jf__chip', jf);
    /* the lead article filters with the grid, so the chip counts stay honest */
    var jcCards = $$('.jlead[data-cat]').concat($$('.jc', jcGrid));
    var jfEmpty = $('#jfEmpty');
    function jfApply(cat) {
      var shown = 0;
      jfChips.forEach(function (c) {
        var on = c.getAttribute('data-cat') === cat;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      jcCards.forEach(function (card) {
        var show = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.hidden = !show;
        if (show) shown++;
      });
      if (jfEmpty) jfEmpty.hidden = shown > 0;
    }
    jfChips.forEach(function (chip) {
      chip.addEventListener('click', function () { jfApply(chip.getAttribute('data-cat')); });
    });
    /* Arriving from a category link elsewhere on the site — the article sidebar,
       for one — lands here with ?cat=<slug>. Only honoured when a chip actually
       carries that value, so a stale or hand-typed link falls back to All. */
    var wanted = new URLSearchParams(location.search).get('cat');
    if (wanted && jfChips.some(function (c) { return c.getAttribute('data-cat') === wanted; })) {
      jfApply(wanted);
      var head = $('#latest') || jf;
      if (head) {
        var y = head.getBoundingClientRect().top + window.scrollY - masthead.offsetHeight - 20;
        window.scrollTo({ top: y, behavior: 'auto' });
      }
    }
  }

  /* ---------- Basket ----------
     Interface only. Nothing is charged and nothing is sent; the contents live in
     localStorage so the count survives navigation and the demo behaves like a
     real shop. Swap this for the commerce backend when there is one. */
  var KEY = 'lrs-basket-v1';
  var cartEl = $('#cart'), cartBtn = $('#cartBtn');
  function readCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function writeCart(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    renderCart(items);
  }
  function money(n) { return '£' + n.toFixed(2); }
  function renderCart(items) {
    items = items || readCart();
    var count = items.reduce(function (n, i) { return n + i.qty; }, 0);
    var total = items.reduce(function (n, i) { return n + i.qty * i.price; }, 0);
    var badge = $('#cartBadge'), nEl = $('#cartN'), totalEl = $('#cartTotal'), body = $('#cartBody');
    if (badge) { badge.textContent = count; badge.hidden = count === 0; }
    if (nEl) nEl.textContent = count;
    if (totalEl) totalEl.textContent = money(total);
    var go = $('.bk__go');
    if (go) go.disabled = true;              /* no checkout yet, by design */
    if (!body) return;
    if (!items.length) { body.innerHTML = '<p class="bk__empty">Your basket is empty.</p>'; return; }
    body.innerHTML = items.map(function (i, n) {
      return '<div class="bki">' +
        '<img class="bki__img" src="' + i.img + '" alt="">' +
        '<div><p class="bki__n">' + i.name + '</p>' +
        '<p class="bki__p">' + money(i.price) + '</p>' +
        '<div class="bki__row"><span class="bki__q">' +
          '<button class="bki__s" type="button" data-step="-1" data-i="' + n + '" aria-label="Decrease quantity">&minus;</button>' +
          '<span class="bki__v">' + i.qty + '</span>' +
          '<button class="bki__s" type="button" data-step="1" data-i="' + n + '" aria-label="Increase quantity">+</button>' +
        '</span><button class="bki__x" type="button" data-remove="' + n + '">Remove</button></div>' +
        '</div></div>';
    }).join('');
  }
  function openCart(on) {
    if (!cartEl) return;
    if (on) { cartEl.hidden = false; requestAnimationFrame(function () { cartEl.classList.add('is-on'); }); }
    else { cartEl.classList.remove('is-on'); setTimeout(function () { cartEl.hidden = true; }, 420); }
    document.body.classList.toggle('bk-open', !!on);
    if (cartBtn) cartBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
  }
  if (cartEl) {
    renderCart();
    if (cartBtn) cartBtn.addEventListener('click', function () { openCart(cartEl.hidden); });
    cartEl.addEventListener('click', function (e) {
      if (e.target.closest('[data-cart-close]')) {
        if (!e.target.closest('.bk__cont')) e.preventDefault();
        openCart(false);
        return;
      }
      var step = e.target.closest('[data-step]'), rm = e.target.closest('[data-remove]');
      if (step) {
        var items = readCart(), i = +step.getAttribute('data-i');
        items[i].qty += +step.getAttribute('data-step');
        if (items[i].qty < 1) items.splice(i, 1);
        writeCart(items);
      } else if (rm) {
        var it = readCart(); it.splice(+rm.getAttribute('data-remove'), 1); writeCart(it);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !cartEl.hidden) openCart(false);
    });
  }
  $$('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var qty = 1, from = btn.getAttribute('data-qty-from');
      if (from) { var f = $('#' + from); qty = Math.max(1, parseInt(f && f.value, 10) || 1); }
      var slug = btn.getAttribute('data-slug');
      var items = readCart();
      var found = items.filter(function (i) { return i.slug === slug; })[0];
      if (found) found.qty += qty;
      else items.push({ slug: slug, name: btn.getAttribute('data-name'),
                        price: parseFloat(btn.getAttribute('data-price')),
                        img: btn.getAttribute('data-img'), qty: qty });
      writeCart(items);
      openCart(true);
    });
  });
  $$('.pd__step').forEach(function (b) {
    b.addEventListener('click', function () {
      var input = $('#qty'); if (!input) return;
      var v = (parseInt(input.value, 10) || 1) + (+b.getAttribute('data-qty'));
      input.value = Math.min(99, Math.max(1, v));
    });
  });

  /* ---------- Shop: filter and product details ---------- */
  var pf = $('#pf'), pcGrid = $('#pcGrid');
  if (pf && pcGrid) {
    var pfChips = $$('.pf__chip', pf);
    var pcCards = $$('.pc', pcGrid);
    var pfEmpty = $('#pfEmpty');
    pfChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var cat = chip.getAttribute('data-cat'), shown = 0;
        pfChips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-on', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        pcCards.forEach(function (card) {
          var cats = (card.getAttribute('data-cat') || '').split(' ');
          var show = cat === 'all' || cats.indexOf(cat) > -1;
          card.hidden = !show;
          if (show) shown++;
        });
        if (pfEmpty) pfEmpty.hidden = shown > 0;
      });
    });
  }

  /* ---------- Contact: enquiry form ----------
     There is no backend on a static site, so a validated submit composes a
     pre-filled email to the clinic. Replace with a real endpoint when the
     booking system is wired up; the markup will not need to change. */
  var enquiry = $('#enquiryForm');
  if (enquiry) {
    var frmDone = $('#frmDone');
    enquiry.addEventListener('submit', function (e) {
      e.preventDefault();
      enquiry.classList.add('is-checked');
      if (!enquiry.checkValidity()) {
        var bad = enquiry.querySelector(':invalid');
        if (bad) { bad.focus(); }
        return;
      }
      var get = function (id) { var el = $('#' + id); return el ? el.value.trim() : ''; };
      var name = (get('fName') + ' ' + get('lName')).trim();
      var lines = [
        'Name: ' + name,
        'Email: ' + get('email'),
        'Phone: ' + get('phone'),
        'Interested in: ' + get('interest'),
        '',
        get('message'),
        '',
        'Sent from the London Real Skin website enquiry form.'
      ];
      var href = 'mailto:info@londonrealskin.com'
        + '?subject=' + encodeURIComponent('Website enquiry from ' + name)
        + '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
      if (frmDone) {
        frmDone.hidden = false;
        frmDone.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
      }
    });
  }

  /* ---------- Before & after carousel ----------
     Scrolls by whole pages rather than one card, so the arrows advance the
     track by however many cards are actually in view at the current width. */
  (function () {
    var track = $('[data-ba-track]');
    if (!track) return;
    var prev = $('[data-ba-prev]'), next = $('[data-ba-next]');
    function page() {
      var first = track.children[0];
      if (!first) return track.clientWidth * 0.8;
      var cs = getComputedStyle(track);
      var gap = parseFloat(cs.columnGap || cs.gap) || 26;
      var per = first.getBoundingClientRect().width + gap;
      var visible = Math.max(1, Math.floor((track.clientWidth + gap) / per));
      return per * visible;
    }
    function ends() {
      var max = track.scrollWidth - track.clientWidth - 1;
      if (prev) prev.disabled = track.scrollLeft <= 0;
      if (next) next.disabled = track.scrollLeft >= max;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -page(), behavior: reduced ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: page(), behavior: reduced ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', ends, { passive: true });
    window.addEventListener('resize', ends, { passive: true });
    ends();
  })();

  /* ---------- FAQ accordion ----------
     Height is animated from a measured pixel value rather than max-height, so
     a long answer opens at the same speed as a short one. Several may be open
     at once: on a two-column layout, closing one to open another would make
     the other column jump. */
  $$('.mnfaq__i').forEach(function (item) {
    var q = $('.mnfaq__q', item), a = $('.mnfaq__a', item);
    if (!q || !a) return;
    var inner = a.firstElementChild;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', String(open));
      a.style.height = open ? inner.offsetHeight + 'px' : '0px';
    });
  });
  window.addEventListener('resize', function () {
    $$('.mnfaq__i.is-open').forEach(function (item) {
      var a = $('.mnfaq__a', item);
      if (a && a.firstElementChild) a.style.height = a.firstElementChild.offsetHeight + 'px';
    });
  }, { passive: true });

  /* ---------- Smooth in-page anchors, allowing for the sticky header ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      /* the chip bar sits below the masthead and would otherwise cover the heading */
      var offset = masthead.offsetHeight + 12 + (tnav ? tnav.offsetHeight : 0);
      var y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

})();
