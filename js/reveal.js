(function() {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) return;

  const root = document.documentElement;
  root.classList.add('reveal-ready');

  const groupSelectors = [
    '.reel-grid',
    '.service-cards-grid',
    '.stats-grid',
    '.testimonial-grid',
    '.philosophy-grid',
    '.capabilities-grid',
    '.values-grid',
    '.leadership-profiles',
    '.service-showcase-grid',
    '.portfolio-grid',
    '.filter-chips',
    '.contact-form',
    '.cv-footer-top'
  ];

  const standardSelectors = [
    'main section h1',
    'main section h2:not(.stat-number)',
    'main .header-intro',
    'main .intro-large',
    'main .intro-body',
    'main .intro-copy > p',
    'main .leadership-intro',
    'main .leadership-content > *',
    'main .studio-text > p',
    'main .cta-note',
    'main .service-description',
    'main .service-approach',
    'main .contact-info > *',
    'main .text-link',
    'main .cta-button'
  ];

  const fadeSelectors = [
    'main .section-kicker',
    'main .filter-label',
    'main .showcase-label'
  ];

  const scaleSelectors = [
    'main .leadership-image-wrap',
    'main .studio-visual',
    'main .service-widget',
    'main .hero-clock-card',
    'main .hero-audio-pill-wrap',
    'footer .cv-footer-monogram'
  ];

  function canTag(element) {
    return element &&
      !element.hasAttribute('data-reveal') &&
      !element.closest('.hero') &&
      !element.closest('.process-section') &&
      !element.closest('[data-reveal-group]');
  }

  function tagElements() {
    document.querySelectorAll(groupSelectors.join(',')).forEach(group => {
      if (group.closest('.hero') || group.closest('.process-section')) return;

      group.setAttribute('data-reveal-group', '');

      Array.from(group.children).forEach(child => {
        if (!child.hasAttribute('data-reveal')) {
          child.setAttribute('data-reveal', 'fade-up');
        }
      });
    });

    document.querySelectorAll(standardSelectors.join(',')).forEach(element => {
      if (canTag(element)) element.setAttribute('data-reveal', 'fade-up');
    });

    document.querySelectorAll(fadeSelectors.join(',')).forEach(element => {
      if (canTag(element)) element.setAttribute('data-reveal', 'fade-in');
    });

    document.querySelectorAll(scaleSelectors.join(',')).forEach(element => {
      if (canTag(element)) element.setAttribute('data-reveal', 'scale-blur');
    });

    document.querySelectorAll('[data-reveal]').forEach(element => {
      element.dataset.revealProfile = element.dataset.reveal;
    });
  }

  function finish(element) {
    element.removeAttribute('data-reveal');
    window.gsap.set(element, {
      clearProps: 'opacity,visibility,transform,filter,willChange'
    });
  }

  function hiddenState(profile) {
    if (profile === 'fade-in') {
      return { autoAlpha: 0, y: 0, scale: 1, filter: 'blur(0px)' };
    }

    if (profile === 'scale-blur') {
      return { autoAlpha: 0, y: 0, scale: 0.92, filter: 'blur(12px)' };
    }

    return { autoAlpha: 0, y: 30, scale: 1, filter: 'blur(0px)' };
  }

  function revealElements(elements, profile, stagger) {
    elements.forEach(element => element.setAttribute('data-reveal', profile));

    window.gsap.fromTo(elements, hiddenState(profile), {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.85,
      stagger,
      ease: 'power3.out',
      overwrite: 'auto',
      onComplete: () => elements.forEach(finish)
    });
  }

  function concealElements(elements, profile, stagger) {
    elements.forEach(element => element.setAttribute('data-reveal', profile));

    window.gsap.set(elements, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)'
    });

    window.gsap.to(elements, {
      ...hiddenState(profile),
      duration: 0.55,
      stagger,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        window.gsap.set(elements, {
          clearProps: 'opacity,visibility,transform,filter,willChange'
        });
      }
    });
  }

  function animateGroups(ScrollTrigger) {
    document.querySelectorAll('[data-reveal-group]').forEach(group => {
      const items = Array.from(group.querySelectorAll('[data-reveal]'))
        .filter(item => item.closest('[data-reveal-group]') === group);

      if (!items.length) return;

      ScrollTrigger.create({
        trigger: group,
        start: 'top 86%',
        onEnter: () => revealElements(items, 'fade-up', 0.15),
        onLeaveBack: () => concealElements(items.slice().reverse(), 'fade-up', 0.08)
      });
    });
  }

  function animateBatch(ScrollTrigger, profile) {
    const elements = Array.from(document.querySelectorAll(`[data-reveal="${profile}"]`))
      .filter(element => !element.closest('[data-reveal-group]'));

    if (!elements.length) return;

    ScrollTrigger.batch(elements, {
      start: 'top 88%',
      interval: 0.08,
      batchMax: 6,
      onEnter: batch => revealElements(batch, profile, 0.12),
      onLeaveBack: batch => concealElements(Array.from(batch).reverse(), profile, 0.06)
    });
  }

  function init() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);
    tagElements();
    root.classList.add('reveal-active');

    if (reduceMotion) {
      gsap.set('[data-reveal]', { clearProps: 'all' });
      root.classList.remove('reveal-ready');
      return;
    }

    animateGroups(ScrollTrigger);
    animateBatch(ScrollTrigger, 'fade-up');
    animateBatch(ScrollTrigger, 'fade-in');
    animateBatch(ScrollTrigger, 'scale-blur');

    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  function safeInit() {
    try {
      init();
    } catch (error) {
      document.querySelectorAll('[data-reveal]').forEach(element => {
        element.removeAttribute('data-reveal');
      });
      root.classList.remove('reveal-ready', 'reveal-active');
      console.error('Reveal animations disabled:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
  } else {
    safeInit();
  }
})();
