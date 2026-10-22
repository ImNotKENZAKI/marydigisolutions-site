(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  const main = doc.querySelector('main.f3');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');

  body.classList.add('f3-motion');

  const revealItems = [...doc.querySelectorAll('[data-f3-reveal]')];
  revealItems.forEach((item, index) => {
    item.style.setProperty('--f3-delay', `${(index % 4) * 75}ms`);
  });

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const progressBar = doc.querySelector('[data-f3-progress]');
  const header = doc.querySelector('[data-f3-header]');
  let scrollFrame = 0;

  const updateScrollState = () => {
    const available = Math.max(doc.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / available, 0), 1);
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 28);
    scrollFrame = 0;
  };

  const requestScrollUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollState);
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  updateScrollState();

  const emitFunnelEvent = (name, properties = {}) => {
    const detail = { event: `mds_${name}`, funnel: 'free_funnel_review', ...properties };
    window.dispatchEvent(new CustomEvent('mds:funnel-event', { detail }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ ...detail });
  };

  doc.addEventListener('click', (event) => {
    const tracked = event.target.closest?.('[data-f3-track]');
    if (!tracked) return;
    emitFunnelEvent('cta_click', { source: tracked.dataset.f3Track || 'unknown' });
  });

  const attributionKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
  const attributionStorageKey = 'mds_funnel_attribution_v1';
  const attribution = {};

  try {
    const stored = JSON.parse(window.sessionStorage.getItem(attributionStorageKey) || '{}');
    attributionKeys.forEach((key) => {
      if (typeof stored[key] === 'string' && stored[key]) attribution[key] = stored[key].slice(0, 250);
    });
  } catch (_) {
    // Attribution remains optional when storage is unavailable.
  }

  const pageParams = new URLSearchParams(window.location.search);
  attributionKeys.forEach((key) => {
    const value = pageParams.get(key)?.trim();
    if (value) attribution[key] = value.slice(0, 250);
  });

  if (Object.keys(attribution).length) {
    try {
      window.sessionStorage.setItem(attributionStorageKey, JSON.stringify(attribution));
    } catch (_) {
      // The form still works without browser storage.
    }
  }

  const formFrame = doc.querySelector('[data-f3-form]');
  if (formFrame && Object.keys(attribution).length) {
    try {
      const formUrl = new URL(formFrame.getAttribute('src'), window.location.href);
      Object.entries(attribution).forEach(([key, value]) => formUrl.searchParams.set(key, value));
      formFrame.setAttribute('src', formUrl.toString());
    } catch (_) {
      // Preserve the original form URL if it cannot be parsed.
    }
  }

  const observedSections = [...doc.querySelectorAll('#system, #demo, #capabilities, #process, #team, #faq, #review')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        emitFunnelEvent('section_view', { section: entry.target.id });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.28 });
    observedSections.forEach((section) => sectionObserver.observe(section));

    if (formFrame) {
      const formObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        emitFunnelEvent('form_view');
        observer.disconnect();
      }, { threshold: 0.2 });
      formObserver.observe(formFrame);
    }
  }

  const navigationLinks = [...doc.querySelectorAll('.f3-header a[href^="#"]')];
  const navigationTargets = navigationLinks
    .map((link) => doc.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (navigationLinks.length && navigationTargets.length && 'IntersectionObserver' in window) {
    const navigationObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${visible.target.id}`;
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0.05, 0.2, 0.45] });
    navigationTargets.forEach((section) => navigationObserver.observe(section));
  }

  const faqItems = [...doc.querySelectorAll('.f3-faq details')];
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  const route = doc.querySelector('[data-f3-route]');
  const routeSteps = route ? [...route.querySelectorAll('article')] : [];
  let routeIndex = 0;
  let routeTimer = 0;
  let routeVisible = !('IntersectionObserver' in window);

  const paintRoute = (index) => {
    routeIndex = routeSteps.length ? index % routeSteps.length : 0;
    routeSteps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === routeIndex));
    if (route) {
      const divisor = Math.max(routeSteps.length - 1, 1);
      route.style.setProperty('--f3-route-progress', String(routeIndex / divisor));
    }
  };

  const stopRoute = () => {
    if (!routeTimer) return;
    window.clearInterval(routeTimer);
    routeTimer = 0;
  };

  const startRoute = () => {
    stopRoute();
    if (doc.hidden || !routeVisible || reduceMotion.matches || doc.body.classList.contains("mds-motion-paused") || routeSteps.length < 2) return;
    routeTimer = window.setInterval(() => paintRoute(routeIndex + 1), 3200);
  };

  paintRoute(0);
  startRoute();
  if (route && 'IntersectionObserver' in window) {
    const routeObserver = new IntersectionObserver((entries) => {
      routeVisible = entries.some((entry) => entry.isIntersecting);
      if (routeVisible) startRoute();
      else stopRoute();
    }, { threshold: 0.12 });
    routeObserver.observe(route);
  }

  const flow = doc.querySelector('[data-f4-flow]');
  const flowStages = flow ? [...flow.querySelectorAll('[data-f4-stage]')] : [];
  const flowStatus = flow?.querySelector('[data-f4-status]');
  const flowState = flow?.querySelector('[data-f4-state]');
  const flowMessages = [
    ['Campaign context retained', 'CAPTURED'],
    ['Need and intent recorded', 'CONTEXT'],
    ['Contact, source, and owner assigned', 'ASSIGNED'],
    ['MDS reviews fit and next step', 'IN REVIEW'],
    ['Approved follow-up is queued', 'READY']
  ];
  let flowIndex = 0;
  let flowTimer = 0;
  let flowVisible = !('IntersectionObserver' in window);

  const paintFlow = () => {
    if (!flow || !flowStages.length) return;
    flow.dataset.f4Step = String(flowIndex);
    flowStages.forEach((stage, index) => {
      stage.classList.toggle('is-active', index === flowIndex);
    });
    if (flowStatus) flowStatus.textContent = flowMessages[flowIndex][0];
    if (flowState) flowState.textContent = flowMessages[flowIndex][1];
  };

  const startFlow = () => {
    if (flowTimer) window.clearInterval(flowTimer);
    flowTimer = 0;
    if (doc.hidden || !flowVisible || reduceMotion.matches || doc.body.classList.contains("mds-motion-paused") || flowStages.length < 2) return;
    flowTimer = window.setInterval(() => {
      flowIndex = (flowIndex + 1) % flowStages.length;
      paintFlow();
    }, 2400);
  };

  paintFlow();
  startFlow();
  if (flow && 'IntersectionObserver' in window) {
    const flowObserver = new IntersectionObserver((entries) => {
      flowVisible = entries.some((entry) => entry.isIntersecting);
      if (flowVisible) startFlow();
      else if (flowTimer) {
        window.clearInterval(flowTimer);
        flowTimer = 0;
      }
    }, { threshold: 0.12 });
    flowObserver.observe(flow);
  }

  const metricSection = doc.querySelector('[data-f4-metrics]');
  const metricItems = metricSection ? [...metricSection.querySelectorAll('[data-f4-count]')] : [];

  const finishMetrics = () => {
    metricItems.forEach((item) => {
      item.textContent = item.dataset.f4Count || '0';
    });
  };

  const animateMetrics = () => {
    if (!metricItems.length || reduceMotion.matches) {
      finishMetrics();
      return;
    }

    const startedAt = performance.now();
    const duration = 1200;
    metricItems.forEach((item) => { item.textContent = '0'; });
    metricSection?.classList.add('is-counting');

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      metricItems.forEach((item) => {
        const target = Number.parseInt(item.dataset.f4Count || '0', 10);
        item.textContent = String(Math.round(target * eased));
      });
      if (progress < 1) window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  };

  if (metricSection && metricItems.length && 'IntersectionObserver' in window) {
    const metricObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      animateMetrics();
      observer.disconnect();
    }, { threshold: 0.25 });
    metricObserver.observe(metricSection);
  } else {
    finishMetrics();
  }

  if (finePointer.matches && !reduceMotion.matches) {
    doc.querySelectorAll('[data-f3-tilt]').forEach((card) => {
      let tiltFrame = 0;
      let pointerEvent = null;
      card.addEventListener('pointermove', (event) => {
        pointerEvent = event;
        if (tiltFrame) return;
        tiltFrame = window.requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = (pointerEvent.clientX - rect.left) / rect.width - 0.5;
          const y = (pointerEvent.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty('--f3-tx', `${x * 3.2}deg`);
          card.style.setProperty('--f3-ty', `${y * -3.2}deg`);
          tiltFrame = 0;
        });
      });
      card.addEventListener('pointerleave', () => {
        if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
        tiltFrame = 0;
        card.style.setProperty('--f3-tx', '0deg');
        card.style.setProperty('--f3-ty', '0deg');
      });
    });
  }

  const videoModal = doc.querySelector('[data-f3-video-modal]');
  const videoFrame = videoModal?.querySelector('iframe');
  const videoClose = videoModal?.querySelector('[data-f3-video-close]');
  const videoTriggers = [...doc.querySelectorAll('[data-f3-video-open]')];
  let videoReturnFocus = null;

  const openVideo = (trigger) => {
    if (!videoModal || !videoFrame) return;
    videoReturnFocus = trigger || doc.activeElement;
    videoModal.hidden = false;
    videoModal.setAttribute('aria-hidden', 'false');
    videoFrame.src = videoFrame.dataset.src || '';
    body.classList.add('f3-video-open');
    videoClose?.focus();
    main?.setAttribute('inert', '');
    main?.setAttribute('aria-hidden', 'true');
    emitFunnelEvent('demo_open');
  };

  const closeVideo = () => {
    if (!videoModal || !videoFrame || videoModal.hidden) return;
    videoFrame.removeAttribute('src');
    videoModal.setAttribute('aria-hidden', 'true');
    videoModal.hidden = true;
    body.classList.remove('f3-video-open');
    main?.removeAttribute('inert');
    main?.removeAttribute('aria-hidden');
    videoReturnFocus?.focus?.();
    emitFunnelEvent('demo_close');
  };

  videoTriggers.forEach((trigger) => trigger.addEventListener('click', () => openVideo(trigger)));
  videoClose?.addEventListener('click', closeVideo);
  videoModal?.addEventListener('click', (event) => {
    if (event.target === videoModal) closeVideo();
  });
  doc.addEventListener('keydown', (event) => {
    if (!videoModal || videoModal.hidden) return;
    if (event.key === 'Escape') {
      closeVideo();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = [videoClose, videoFrame].filter(Boolean);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  doc.addEventListener('visibilitychange', () => {
    startRoute();
    startFlow();
  });

  reduceMotion.addEventListener?.('change', () => {
    paintRoute(0);
    paintFlow();
    startRoute();
    startFlow();
    if (reduceMotion.matches) finishMetrics();
  });

  window.addEventListener("mds:motionchange", () => { startRoute(); startFlow(); });

})();
