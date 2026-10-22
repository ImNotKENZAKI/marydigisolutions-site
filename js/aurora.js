/* MDS Aurora progressive enhancements: native scrolling, no animation library. */
(() => {
  'use strict';
  const body = document.body;
  if (!body.classList.contains('mds-aurora')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const videos = [...document.querySelectorAll('video[autoplay]')];
  let paused = false;
  try { paused = localStorage.getItem('mds-ambient-motion') === 'paused'; } catch (_) {}
  let pageVisible = !document.hidden;
  const videoVisibility = new Map(videos.map(video => [video, true]));
  const controls = [...document.querySelectorAll('[data-aurora-motion]')];
  const activePreviews = new Set();

  // A control is available on every page, including interior pages and the funnel.
  const footer = document.querySelector('.footer-ultra-brand,.f3-footer .f3-wrap');
  if (footer) {
    const wrap = document.createElement('div');
    wrap.className = 'aurora-footer-motion';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'aurora-motion';
    wrap.append(button);
    footer.append(wrap);
    controls.push(button);
  }

  function syncMotion() {
    const stop = paused || reduced.matches;
    body.classList.toggle('mds-motion-paused', stop);
    controls.forEach(button => {
      button.hidden = false;
      button.disabled = reduced.matches;
      button.setAttribute('aria-pressed', String(stop));
      button.setAttribute('aria-label', reduced.matches ? 'Reduced motion follows your device settings' : stop ? 'Play ambient motion' : 'Pause ambient motion');
      button.textContent = reduced.matches ? 'Reduced motion on' : stop ? 'Play motion' : 'Pause motion';
    });
    videos.forEach(video => {
      if (stop || !pageVisible || !videoVisibility.get(video)) video.pause();
      else video.play().catch(() => {});
    });
    if (stop || !pageVisible) activePreviews.forEach(stopPreview);
    window.dispatchEvent(new CustomEvent('mds:motionchange'));
  }
  controls.forEach(button => button.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('mds-ambient-motion', paused ? 'paused' : 'playing'); } catch (_) {}
    syncMotion();
  }));
  reduced.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; syncMotion(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => videoVisibility.set(entry.target, entry.isIntersecting));
      syncMotion();
    }, { threshold: .05 });
    videos.forEach(video => observer.observe(video));
  }
  syncMotion();
  body.classList.add('aurora-ready');

  // Progress and camera drift share one passive, frame-limited scroll update.
  if (!document.querySelector('.f3-progress')) {
    const progress = document.createElement('div');
    progress.className = 'aurora-reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    body.prepend(progress);
  }
  const hero = document.querySelector('.hero2');
  let queued = false;
  function updateScroll() {
    const range = document.documentElement.scrollHeight - innerHeight;
    body.style.setProperty('--aurora-page-progress', range > 0 ? Math.min(1, Math.max(0, scrollY / range)).toFixed(4) : '0');
    if (hero && !reduced.matches && !paused && innerWidth > 980) {
      const top = hero.getBoundingClientRect().top;
      hero.style.setProperty('--aurora-hero-drift', `${Math.max(0, Math.min(70, -top * .1)).toFixed(1)}px`);
    } else if (hero) hero.style.setProperty('--aurora-hero-drift', '0px');
    queued = false;
  }
  function requestScroll() { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }
  addEventListener('scroll', requestScroll, { passive: true });
  addEventListener('resize', requestScroll, { passive: true });
  addEventListener('mds:motionchange', requestScroll);
  updateScroll();

  // Real project previews load on pointer intent, rather than seven hidden players.
  function stopPreview(card) {
    card.querySelector('.work-autoplay')?.remove();
    card.querySelector('.work-thumb')?.classList.remove('has-autoplay');
    activePreviews.delete(card);
  }
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('pointerenter', () => {
      if (!finePointer.matches || reduced.matches || paused) return;
      const thumb = card.querySelector('.work-thumb');
      const id = (card.dataset.url || '').match(/youtu\.be\/([\w-]+)/)?.[1];
      if (!thumb || !id || activePreviews.has(card)) return;
      const iframe = document.createElement('iframe');
      iframe.className = 'work-autoplay';
      iframe.title = `${card.dataset.title || 'Project'} muted preview`;
      iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0`;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.setAttribute('aria-hidden', 'true');
      iframe.tabIndex = -1;
      iframe.style.opacity = '0';
      iframe.addEventListener('load', () => {
        if (!iframe.isConnected || !activePreviews.has(card)) return;
        iframe.style.opacity = '1';
        thumb.classList.add('has-autoplay');
      }, { once: true });
      thumb.prepend(iframe);
      activePreviews.add(card);
    });
    card.addEventListener('pointerleave', () => stopPreview(card));
    card.querySelector('.play-btn')?.addEventListener('click', () => stopPreview(card));
  });

  const scene = document.querySelector('.aurora-core-scene');
  if (scene) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.target.classList.toggle('scene-active', entry.isIntersecting));
      }, { threshold: .1 });
      observer.observe(scene);
    } else scene.classList.add('scene-active');
    let pointerFrame = 0;
    let px = 0, py = 0;
    scene.addEventListener('pointermove', event => {
      if (reduced.matches || paused || !finePointer.matches) return;
      const rect = scene.getBoundingClientRect();
      px = ((event.clientX - rect.left) / rect.width - .5) * 9;
      py = -((event.clientY - rect.top) / rect.height - .5) * 7;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
        scene.style.setProperty('--core-x', `${px.toFixed(2)}deg`);
        scene.style.setProperty('--core-y', `${py.toFixed(2)}deg`);
        pointerFrame = 0;
      });
    });
    scene.addEventListener('pointerleave', () => {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      scene.style.setProperty('--core-x', '0deg');
      scene.style.setProperty('--core-y', '0deg');
    });
  }

  // Keep the original mobile menu; expose its state and keyboard dismissal.
  const menu = document.querySelector('.nav-menu');
  const toggle = document.querySelector('.hamburger');
  if (menu && toggle) {
    menu.id = 'mds-navigation';
    toggle.setAttribute('aria-controls', menu.id);
    const syncMenu = () => {
      const open = menu.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.inert = innerWidth <= 980 && !open;
    };
    new MutationObserver(syncMenu).observe(menu, { attributes: true, attributeFilter: ['class'] });
    addEventListener('resize', syncMenu, { passive: true });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !menu.classList.contains('open')) return;
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.focus();
    });
    menu.querySelector('a.active')?.setAttribute('aria-current', 'page');
    syncMenu();
  }
})();
