/* =====================================================================
   London Real Skin — homepage interactions
   Vanilla, no dependencies. Everything degrades to a readable static
   page if JS fails, and every motion path respects prefers-reduced-motion.
   ===================================================================== */
(function () {
  'use strict';

  var CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG/';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Scroll reveal ---------- */
  var revealables = $$('.r, .r-clip, .r-line');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Header: floats over the hero, frosts once scrolled ---------- */
  var masthead = $('#masthead');
  function measureHead() {
    document.documentElement.style.setProperty('--mast-h', masthead.offsetHeight + 'px');
  }
  var onScrollHeader = function () {
    // Switch as soon as the hero's dark area no longer sits behind the bar.
    var hero = $('.hero');
    var limit = hero ? hero.offsetHeight - masthead.offsetHeight - 40 : 12;
    masthead.classList.toggle('is-stuck', window.scrollY > limit);
  };
  measureHead();
  onScrollHeader();
  window.addEventListener('resize', function () { measureHead(); onScrollHeader(); }, { passive: true });
  window.addEventListener('load', measureHead);

  /* ---------- Rail: progress, section label, dark inversion ---------- */
  var rail = $('.rail');
  var railBar = $('#railBar');
  var railLabel = $('#railLabel');
  var darkSections = ['.hero', '.svc', '.shop', '.cta'];
  var labelled = $$('[data-rail]');

  function updateRail() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (railBar) railBar.style.height = (pct * 100) + '%';

    // Which labelled section owns the vertical middle of the viewport?
    var mid = window.scrollY + window.innerHeight * 0.5;
    var current = null;
    labelled.forEach(function (s) {
      var top = s.offsetTop, bottom = top + s.offsetHeight;
      if (mid >= top && mid < bottom) current = s;
    });
    if (current && railLabel) {
      var next = current.getAttribute('data-rail');
      if (railLabel.textContent !== next) railLabel.textContent = next;
    }

    // Invert the rail over dark sections so it never disappears.
    var isDark = darkSections.some(function (sel) {
      var el = $(sel);
      if (!el) return false;
      var r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5;
    });
    if (rail) rail.classList.toggle('is-dark', isDark);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    onScrollHeader();
    if (!ticking) {
      window.requestAnimationFrame(function () { updateRail(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateRail, { passive: true });
  updateRail();

  /* ---------- Mobile drawer ---------- */
  var burger = $('#burger'), drawer = $('#drawer'), drawerClose = $('#drawerClose');
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

  /* ---------- Hero slideshow ---------- */
  var slides = $$('.hero__slide');
  var heroNum = $('#heroNum');
  var heroI = 0, heroTimer = null;
  function heroGo(n) {
    slides[heroI].classList.remove('is-on');
    heroI = (n + slides.length) % slides.length;
    var el = slides[heroI];
    // restart the Ken Burns pan cleanly
    el.classList.add('is-on');
    if (heroNum) heroNum.textContent = String(heroI + 1).padStart(2, '0');
  }
  function heroStart() {
    if (reduced || slides.length < 2) return;
    heroTimer = window.setInterval(function () { heroGo(heroI + 1); }, 6200);
  }
  heroStart();
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { window.clearInterval(heroTimer); }
    else { window.clearInterval(heroTimer); heroStart(); }
  });

  /* ---------- Promotions slider ---------- */
  var pTrack = $('#promoTrack');
  var pDots = $$('#promoDots .promo__dot');
  var pCount = pDots.length, pI = 0, pTimer = null;
  function pGo(n) {
    pI = (n + pCount) % pCount;
    pTrack.style.transform = 'translateX(' + (-100 * pI) + '%)';
    pDots.forEach(function (d, i) { d.classList.toggle('is-on', i === pI); });
  }
  function pStart() { if (!reduced) pTimer = window.setInterval(function () { pGo(pI + 1); }, 7000); }
  function pReset() { window.clearInterval(pTimer); pStart(); }
  $('#promoNext').addEventListener('click', function () { pGo(pI + 1); pReset(); });
  $('#promoPrev').addEventListener('click', function () { pGo(pI - 1); pReset(); });
  pDots.forEach(function (d, i) { d.addEventListener('click', function () { pGo(i); pReset(); }); });
  pStart();

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
      t: "Dr. Inna is absolutely amazing! I recently had an RF Microneedling treatment with her, and the experience was fantastic from start to finish. She explained everything clearly, made me feel completely comfortable, and the results are already visible — my skin looks tighter, smoother, and glowing." },
    { n: 'Jasmeet Klair', m: '2 reviews · 10 months ago', i: 'J',
      t: "Had such a fantastic experience with the team at London Real Skin right from the moment of booking! Loretta was amazing, super attentive and made sure I got the right appointment for my needs. Kelly was absolutely brilliant — so skilled at what she does and really took the time to explain everything clearly." },
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
      '<p class="rev__g">Posted on Google</p>' +
    '</article>';
  }
  var revTrack = $('#revTrack');
  if (revTrack) {
    var html = REVIEWS.map(revCard).join('');
    revTrack.innerHTML = html + html;           // duplicated → seamless -50% loop
    if (reduced) revTrack.style.animation = 'none';
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
  var PLATES = [
    'hf_20260805_221518_c62357cc-4f33-41f5-853b-8fac0619d6ea.png', // Acne scarring
    'hf_20260805_221518_c6e1b1d0-4f59-4db4-aa8b-f0a7e12c9c63.png', // Ageing skin
    'hf_20260805_221518_7067dbbf-d0c8-4f3b-8c15-c5b2e9d25915.png', // Crepey skin
    'hf_20260805_221518_f69fbb70-041f-4608-8a70-6870cc219253.png', // Excess hair
    'hf_20260805_221518_7858a2f9-378f-490f-a1bb-8c8a7f60549a.png', // Fine lines
    'hf_20260805_221518_1c04d77b-08f7-4790-a04c-4cc83512e71e.png', // Genital tags/warts (instruments)
    'hf_20260805_221518_70dc563b-4ad4-441b-989b-c6117b432cfe.png', // Pigmentation
    'hf_20260805_221518_7767a1b4-2d6a-440e-9265-ca70a99bbf34.png', // Rosacea
    'hf_20260805_221518_3cc610fc-06c4-4e01-bf02-4fe70ea31fc7.png', // Skin tags
    'hf_20260805_222244_206e16e2-d3ad-410a-81cd-094b26de7c11.png', // Stretch marks
    'hf_20260805_221518_8bf0b401-88e1-4092-b8bb-7b3d554ef260.png', // Teeth grinding
    'hf_20260805_221518_e61e1d16-c206-4825-a17d-fe426a2969ac.png'  // Thread veins
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
    if (scopeNo) scopeNo.textContent = 'FIELD ' + String(i + 1).padStart(2, '0') + ' / 12';
  }
  condBtns.forEach(function (b, i) {
    b.addEventListener('mouseenter', function () { condGo(i); });
    b.addEventListener('focus', function () { condGo(i); });
    b.addEventListener('click', function () { condGo(i); });
  });

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

  /* ---------- Smooth in-page anchors, allowing for the sticky header ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = masthead.offsetHeight + 12;
      var y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

})();
