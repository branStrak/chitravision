(() => {
  'use strict';

  function initAboutMotion() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = document.querySelector('.about-hero');
    if (!hero) return;

    gsap.registerPlugin(ScrollTrigger);

    if (reduceMotion) {
      gsap.set('.about-svg-path, .studio-signal-wave', { clearProps: 'all' });
      return;
    }

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from('.about-hero-art', { autoAlpha: 0, scale: .82, rotate: -7, duration: 1.35 }, .15)
      .from('.about-art-mark', { autoAlpha: 0, scale: .5, duration: .8 }, .55)
      .from('.about-art-badge', { autoAlpha: 0, y: 16, stagger: .12, duration: .65 }, .7)
      .from('.about-hero-rail > *', { autoAlpha: 0, y: 10, stagger: .1, duration: .55 }, .8);

    gsap.fromTo('.about-svg-path',
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 2, stagger: .14, ease: 'power2.inOut' }
    );

    gsap.to('.about-svg-ring--outer', { rotate: 360, duration: 34, repeat: -1, ease: 'none' });
    gsap.to('.about-svg-ring--middle', { rotate: -360, duration: 26, repeat: -1, ease: 'none' });
    gsap.to('.about-svg-ring--inner', { rotate: 360, duration: 18, repeat: -1, ease: 'none' });

    gsap.to('.about-hero-film', {
      yPercent: 12,
      scale: 1.15,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 }
    });

    gsap.to('.about-hero-copy', {
      yPercent: 18,
      autoAlpha: .2,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 }
    });

    const art = document.querySelector('.about-hero-art');
    if (art && window.matchMedia('(pointer: fine)').matches) {
      art.addEventListener('pointermove', event => {
        const rect = art.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        gsap.to(art, { rotateY: x * 9, rotateX: y * -9, duration: .65, ease: 'power3.out' });
      });
      art.addEventListener('pointerleave', () => {
        gsap.to(art, { rotateX: 0, rotateY: 0, duration: .9, ease: 'elastic.out(1, .5)' });
      });
    }

    gsap.utils.toArray('.leadership-image').forEach(image => {
      gsap.fromTo(image,
        { scale: 1.08, yPercent: -3 },
        {
          scale: 1.08,
          yPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: image.closest('.leadership-image-wrap'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    });

    gsap.fromTo('.studio-signal-wave',
      { strokeDasharray: 1, strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.studio-placeholder',
          start: 'top 76%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );

    gsap.to('.studio-signal-ring--one', { rotate: 360, duration: 24, repeat: -1, ease: 'none' });
    gsap.to('.studio-signal-ring--two', { rotate: -360, duration: 18, repeat: -1, ease: 'none' });
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutMotion, { once: true });
  } else {
    initAboutMotion();
  }
})();
