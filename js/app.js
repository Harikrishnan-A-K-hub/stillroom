/* =========================================================================
   STILLROOM — interaction layer
   - Signature moment: image crossfade ("The Reveal")
   - Live utility rails, scroll reveal, accessible form completion
   ========================================================================= */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- tiny live region for the stage (screen readers) ---- */
  var srLive = document.createElement('span');
  srLive.className = 'sr-only';
  srLive.setAttribute('aria-live', 'polite');
  document.body.appendChild(srLive);

  /* =====================================================================
     1. THE REVEAL — crossfade controller
     ===================================================================== */
  var stageRoot = document.querySelector('[data-stage-root]');
  if (stageRoot) {
    var MEMORIES = ['photo', 'voice', 'letter'];
    var STAGE_TAGS = ['STAGE 01 — RAW FRAGMENT', 'STAGE 02 — THE RED ROOM', 'STAGE 03 — KEEPSAKE, REVEALED'];
    var MAX = 2;

    var scenes = Array.prototype.slice.call(stageRoot.querySelectorAll('.scene'));
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
    var prevBtn = document.querySelector('[data-prev]');
    var nextBtn = document.querySelector('[data-next]');
    var progress = document.querySelector('[data-progress]');
    var idTag = document.querySelector('[data-stage-tag]');
    var revealCta = document.querySelector('[data-reveal-cta]');

    var state = { memory: 'photo', stage: 0 };
    var autoTimer = null, autoplayed = false, userTouched = false;

    function render() {
      // scene grouping + crossfade
      scenes.forEach(function (sc) {
        var onMemory = sc.getAttribute('data-memory') === state.memory;
        sc.classList.toggle('mem-on', onMemory);
        var active = onMemory && (+sc.getAttribute('data-stage') === state.stage);
        sc.classList.toggle('is-active', active);
        sc.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      // steps
      steps.forEach(function (st, i) {
        st.classList.toggle('is-active', i === state.stage);
        st.classList.toggle('is-done', i < state.stage);
      });
      // stepper chrome
      if (prevBtn) prevBtn.disabled = state.stage === 0;
      if (nextBtn) nextBtn.disabled = state.stage === MAX;
      if (progress) progress.style.width = ((state.stage + 1) / (MAX + 1) * 100) + '%';
      if (idTag) idTag.textContent = STAGE_TAGS[state.stage];
      if (revealCta) revealCta.classList.toggle('is-hidden', state.stage !== MAX);
      srLive.textContent = STAGE_TAGS[state.stage] + ', memory: ' + state.memory;
    }

    function setStage(n, viaUser) {
      n = Math.max(0, Math.min(MAX, n));
      if (viaUser) { userTouched = true; clearTimeout(autoTimer); }
      state.stage = n;
      render();
    }

    function setMemory(mem, viaUser) {
      if (MEMORIES.indexOf(mem) < 0) return;
      if (viaUser) { userTouched = true; clearTimeout(autoTimer); }
      state.memory = mem;
      state.stage = 0;
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-memory') === mem;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      render();
    }

    // tab interactions (click + roving arrow keys per ARIA)
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { setMemory(t.getAttribute('data-memory'), true); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var dir = e.key === 'ArrowRight' ? 1 : -1;
          var next = tabs[(i + dir + tabs.length) % tabs.length];
          next.focus();
          setMemory(next.getAttribute('data-memory'), true);
        }
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { setStage(state.stage - 1, true); });
    if (nextBtn) nextBtn.addEventListener('click', function () { setStage(state.stage + 1, true); });

    // step click = jump
    steps.forEach(function (st) {
      st.addEventListener('click', function () { setStage(+st.getAttribute('data-step'), true); });
    });

    // arrow keys on the frame itself
    stageRoot.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); setStage(state.stage + 1, true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setStage(state.stage - 1, true); }
    });

    // demonstration play-through, once, when scrolled into view
    function autoplay() {
      if (autoplayed || userTouched || reduce.matches) return;
      autoplayed = true;
      var tick = function () {
        if (userTouched) return;
        if (state.stage < MAX) { setStage(state.stage + 1, false); autoTimer = setTimeout(tick, 1500); }
      };
      autoTimer = setTimeout(tick, 1400);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting && en.intersectionRatio > 0.5) { autoplay(); io.disconnect(); } });
      }, { threshold: [0, 0.5, 1] });
      io.observe(document.getElementById('reveal'));
    }

    render();
  }

  /* =====================================================================
     2. SCROLL REVEAL (baseline polish)
     ===================================================================== */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reveals.length && 'IntersectionObserver' in window && !reduce.matches) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { rio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* =====================================================================
     3. LIVE UTILITY RAILS — active section label
     ===================================================================== */
  var railIndex = document.querySelector('[data-rail-index]');
  var railSection = document.querySelector('[data-rail-section]');
  var MAP = [
    ['top', '01', 'THE STUDIO'], ['offer', '02', 'THE OFFER'], ['reveal', '03', 'THE REVEAL'],
    ['process', '04', 'PROCESS'], ['work', '05', 'SELECTED WORK'], ['materials', '05', 'MATERIALS'],
    ['trusted', '06', 'DISCRETION'], ['commission', '07', 'COMMISSION'], ['faq', '07', 'QUESTIONS'],
    ['contact', '08', 'BEGIN']
  ];
  if ((railIndex || railSection) && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var m = MAP.filter(function (x) { return x[0] === en.target.id; })[0];
        if (!m) return;
        if (railIndex) railIndex.textContent = m[1];
        if (railSection) railSection.textContent = m[2];
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    MAP.forEach(function (m) { var el = document.getElementById(m[0]); if (el) sio.observe(el); });
  }

  /* =====================================================================
     4. CONTACT FORM — accessible completed state (no transmission)
     ===================================================================== */
  var form = document.querySelector('[data-form]');
  if (form) {
    var done = form.querySelector('[data-done]');
    var echo = form.querySelector('[data-echo]');
    var resetBtn = form.querySelector('[data-reset]');
    var submitBtn = form.querySelector('[data-submit]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var fmt = (form.querySelector('#f-form') || {}).value;
      if (echo) echo.textContent = fmt ? fmt.toLowerCase() : 'your memory';
      if (submitBtn) { submitBtn.textContent = 'Sent ✓'; submitBtn.disabled = true; }
      if (done) { done.hidden = false; }
    });

    if (resetBtn) resetBtn.addEventListener('click', function () {
      form.reset();
      if (done) done.hidden = true;
      if (submitBtn) { submitBtn.textContent = 'Send the memory →'; submitBtn.disabled = false; }
      var first = form.querySelector('#f-name'); if (first) first.focus();
    });
  }
})();
