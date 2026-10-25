// Chitravision Production - Main JavaScript

(function() {
  'use strict';

  // Utility function
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  function initSmoothScroll() {
    if (!window.Lenis || window.__chitravisionLenis) return;

    const lenis = new window.Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      syncTouch: false,
      anchors: {
        offset: -72
      },
      prevent: node => Boolean(node.closest && node.closest('.modal-content, [data-lenis-prevent]'))
    });

    window.__chitravisionLenis = lenis;

    if (window.gsap) {
      if (window.ScrollTrigger) {
        lenis.on('scroll', window.ScrollTrigger.update);
      }

      window.gsap.ticker.add(time => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }
  }

  // Mobile Menu Toggle
  function initMobileMenu() {
    const menuBtn = $('#menuBtn');
    const nav = $('#nav');
    if (!menuBtn || !nav) return;

    menuBtn.innerHTML = `
      <span class="menu-toggle-label">MENU</span>
      <svg id="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
        <path class="menu-toggle-line menu-toggle-line-top" d="M5 8h14"/>
        <path class="menu-toggle-line menu-toggle-line-bottom" d="M5 16h14"/>
      </svg>
    `;

    if (!nav.querySelector('.mobile-menu-meta')) {
      nav.insertAdjacentHTML('beforeend', `
        <div class="mobile-menu-meta" aria-hidden="true">
          <span class="mobile-menu-location"><span class="mobile-menu-status"></span>[LOC] INDIA — GLOBAL</span>
          <span>2026 EDITION</span>
        </div>
      `);
    }

    const label = menuBtn.querySelector('.menu-toggle-label');
    const links = Array.from(nav.querySelectorAll('a'));
    const meta = nav.querySelector('.mobile-menu-meta');
    const iconLines = menuBtn.querySelectorAll('.menu-toggle-line');
    const mobileQuery = window.matchMedia('(max-width: 720px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGsap = Boolean(window.gsap);
    let isOpen = false;
    let timeline = null;

    if (hasGsap && !reduceMotion) {
      timeline = window.gsap.timeline({
        paused: true,
        onReverseComplete: finishClose
      });

      timeline
        .set(nav, { visibility: 'visible' })
        .to(nav, {
          clipPath: 'circle(150% at calc(100% - 54px) calc(34px + env(safe-area-inset-top, 0px)))',
          duration: 0.85,
          ease: 'power4.inOut'
        })
        .to(iconLines[0], { y: 4, rotation: 45, duration: 0.35, ease: 'power2.inOut' }, 0.18)
        .to(iconLines[1], { y: -4, rotation: -45, duration: 0.35, ease: 'power2.inOut' }, 0.18)
        .to(links, {
          y: '0%',
          skewY: 0,
          opacity: 1,
          duration: 0.68,
          stagger: 0.075,
          ease: 'power3.out'
        }, '-=0.4')
        .to(meta, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        }, '-=0.35');
    }

    function finishClose() {
      nav.classList.remove('open');
      document.querySelector('.glass-nav')?.classList.remove('menu-active');
      document.body.classList.remove('menu-open');
      window.__chitravisionLenis?.start();
    }

    function openMenu() {
      if (!mobileQuery.matches || isOpen) return;
      isOpen = true;
      label.textContent = 'CLOSE';
      menuBtn.setAttribute('aria-expanded', 'true');
      nav.classList.add('open');
      document.querySelector('.glass-nav')?.classList.add('menu-active');
      document.body.classList.add('menu-open');
      window.__chitravisionLenis?.stop();

      if (timeline) {
        timeline.play();
      } else {
        nav.style.visibility = 'visible';
        nav.style.clipPath = 'circle(150% at calc(100% - 54px) calc(34px + env(safe-area-inset-top, 0px)))';
        links.forEach(link => {
          link.style.opacity = '1';
          link.style.transform = 'none';
        });
        meta.style.opacity = '1';
        meta.style.transform = 'none';
      }
    }

    function closeMenu(restoreFocus = false) {
      if (!isOpen) return;
      isOpen = false;
      label.textContent = 'MENU';
      menuBtn.setAttribute('aria-expanded', 'false');

      if (timeline) {
        timeline.reverse();
      } else {
        nav.removeAttribute('style');
        links.forEach(link => link.removeAttribute('style'));
        meta.removeAttribute('style');
        finishClose();
      }

      if (restoreFocus) menuBtn.focus();
    }

    menuBtn.addEventListener('click', () => {
      if (isOpen) closeMenu();
      else openMenu();
    });

    links.forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && isOpen) closeMenu(true);
    });

    mobileQuery.addEventListener('change', event => {
      if (event.matches) return;
      isOpen = false;
      label.textContent = 'MENU';
      menuBtn.setAttribute('aria-expanded', 'false');
      timeline?.pause(0);
      finishClose();

      if (hasGsap) {
        window.gsap.set(nav, { clearProps: 'visibility,clipPath' });
        window.gsap.set(links, { clearProps: 'opacity,transform' });
        window.gsap.set(meta, { clearProps: 'opacity,transform' });
        window.gsap.set(iconLines, { clearProps: 'transform' });
      }
    });
  }

  // Set active nav link based on current page
  function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = $$('.nav-links a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage ||
          (currentPage === '' && href === 'index.html') ||
          (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // Modal System
  window.openModal = function(html, label, testid) {
    const modalSlot = $('#modalSlot');
    if (!modalSlot) return;

    modalSlot.innerHTML = `
      <div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="${escapeHtml(label)}" data-testid="${testid}">
        ${html}
      </div>
    `;

    document.body.style.overflow = 'hidden';
    window.__chitravisionLenis?.stop();

    const closeBtn = $('.modal-close');
    if (closeBtn) closeBtn.focus();

    // Close on backdrop click or close button
    const backdrop = $('.modal-backdrop');
    backdrop.addEventListener('click', function(e) {
      if (e.target === this || e.target.closest('.modal-close')) {
        closeModal();
      }
    });
  };

  window.closeModal = function() {
    const modalSlot = $('#modalSlot');
    if (modalSlot) {
      modalSlot.innerHTML = '';
    }
    document.body.style.overflow = '';
    window.__chitravisionLenis?.start();
  };

  // Escape key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // HTML escape utility
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Expose escape utility globally
  window.escapeHtml = escapeHtml;

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initMobileMenu();
    setActiveNav();
  });

  // Export utilities
  window.ChitraUtils = {
    $,
    $$,
    escapeHtml,
    openModal: window.openModal,
    closeModal: window.closeModal
  };
})();
