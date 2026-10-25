// Chitravision Production - Services Page JavaScript

(function() {
  'use strict';

  const { $, $$, openModal, escapeHtml } = window.ChitraUtils;

  // Service showcase data - 3-4 videos per service
  const serviceShowcases = {
    brandFilms: [
      {
        title: 'Heritage in Motion',
        client: 'Aster House',
        gradient: 'linear-gradient(135deg, #2a2a2d 0%, #1f1f22 100%)',
        description: 'A 90-second brand story exploring tradition and craftsmanship.'
      },
      {
        title: 'The Makers',
        client: 'Studio Kai',
        gradient: 'linear-gradient(135deg, #1f1f22 0%, #2d2d30 100%)',
        description: 'Documentary-style brand film celebrating the people behind the product.'
      },
      {
        title: 'Essence',
        client: 'Atelier N°7',
        gradient: 'linear-gradient(135deg, #252528 0%, #1a1a1c 100%)',
        description: 'Visual narrative capturing brand philosophy and values.'
      },
      {
        title: 'Origin Story',
        client: 'Common Ground',
        gradient: 'linear-gradient(135deg, #1a1a1c 0%, #252528 100%)',
        description: 'Founder-led story connecting past, present, and future vision.'
      }
    ],
    campaigns: [
      {
        title: 'Launch Week',
        client: 'Noma',
        gradient: 'linear-gradient(135deg, #2d2d30 0%, #1f1f22 100%)',
        description: 'Multi-platform campaign for new product line launch.'
      },
      {
        title: 'Urban Narratives',
        client: 'Atelier N°7',
        gradient: 'linear-gradient(135deg, #1f1f22 0%, #2a2a2d 100%)',
        description: 'Social-first campaign exploring city stories and culture.'
      },
      {
        title: 'Season One',
        client: 'Aster House',
        gradient: 'linear-gradient(135deg, #1a1a1c 0%, #2d2d30 100%)',
        description: 'Ongoing content series with consistent visual identity.'
      }
    ],
    motionDesign: [
      {
        title: 'Brand Identity System',
        client: 'Studio Kai',
        gradient: 'linear-gradient(135deg, #252528 0%, #2d2d30 100%)',
        description: 'Animated logo, typography, and motion guidelines.'
      },
      {
        title: 'Kinetic Typography',
        client: 'Common Ground',
        gradient: 'linear-gradient(135deg, #2a2a2d 0%, #1a1a1c 100%)',
        description: 'Dynamic type animations for social media and digital channels.'
      },
      {
        title: 'Explainer Series',
        client: 'Noma',
        gradient: 'linear-gradient(135deg, #1f1f22 0%, #252528 100%)',
        description: '2D animated explainers breaking down complex concepts.'
      },
      {
        title: 'Light & Form',
        client: 'Atelier N°7',
        gradient: 'linear-gradient(135deg, #1a1a1c 0%, #1f1f22 100%)',
        description: '3D motion study exploring space, light, and movement.'
      }
    ]
  };

  const showcaseMedia = {
    brandFilmsGrid: [
      'assets/reels/main-1.mp4',
      'assets/reels/hori-1.mp4',
      'assets/reels/car-hori-2.mp4',
      'assets/reels/verti-1.mp4'
    ],
    campaignsGrid: [
      'assets/reels/car-hori-2.mp4',
      'assets/reels/verti-2.mp4',
      'assets/reels/hori-1.mp4'
    ],
    motionDesignGrid: [
      'assets/reels/verti-1.mp4',
      'assets/reels/main-1.mp4',
      'assets/reels/verti-2.mp4',
      'assets/reels/car-hori-2.mp4'
    ]
  };

  // Initialize services page
  function init() {
    renderServiceShowcases();
    initShowcaseItems();
    initShowcaseMedia();
    initServicesMotion();
  }

  // Render showcase grids for each service
  function renderServiceShowcases() {
    renderShowcaseGrid('brandFilmsGrid', serviceShowcases.brandFilms);
    renderShowcaseGrid('campaignsGrid', serviceShowcases.campaigns);
    renderShowcaseGrid('motionDesignGrid', serviceShowcases.motionDesign);
  }

  // Render a single showcase grid
  function renderShowcaseGrid(gridId, items) {
    const grid = $(`#${gridId}`);
    if (!grid) return;

    const html = items.map((item, index) => {
      const showcase = {
        ...item,
        media: showcaseMedia[gridId][index]
      };

      return `
      <div class="showcase-item"
        data-showcase='${JSON.stringify(showcase).replace(/'/g, '&#39;')}'
        role="button"
        tabindex="0"
        aria-label="View ${escapeHtml(item.title)}">
        <div class="showcase-thumb" style="background: ${escapeHtml(item.gradient)}">
          <video autoplay muted loop playsinline preload="metadata" aria-hidden="true">
            <source src="${escapeHtml(showcase.media)}" type="video/mp4">
          </video>
        </div>
        <div class="showcase-overlay">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l14 8-14 8z"/>
          </svg>
        </div>
        <div class="showcase-label">
          <h4 class="showcase-label-title">${escapeHtml(item.title)}</h4>
          <p class="showcase-label-meta">${escapeHtml(item.client)}</p>
        </div>
      </div>
    `;
    }).join('');

    grid.innerHTML = html;
  }

  // Initialize showcase item interactions
  function initShowcaseItems() {
    const items = $$('.showcase-item');

    items.forEach(item => {
      // Click handler
      item.addEventListener('click', function() {
        const data = JSON.parse(this.getAttribute('data-showcase'));
        openShowcaseModal(data);
      });

      // Keyboard handler
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const data = JSON.parse(this.getAttribute('data-showcase'));
          openShowcaseModal(data);
        }
      });
    });
  }

  function initShowcaseMedia() {
    const videos = document.querySelectorAll('.showcase-thumb video');
    if (!videos.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { rootMargin: '180px 0px', threshold: 0.08 });

    videos.forEach(video => observer.observe(video));
  }

  // Open showcase modal
  function openShowcaseModal(showcase) {
    const modalContent = `
      <div class="modal-close" role="button" tabindex="0" aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </div>
      <div style="
        max-width: 1200px;
        width: 100%;
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 12px;
        overflow: hidden;
      ">
        <div style="
          aspect-ratio: 16/9;
          background: ${escapeHtml(showcase.gradient)};
          position: relative;
        ">
          <video controls autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;display:block;">
            <source src="${escapeHtml(showcase.media)}" type="video/mp4">
          </video>
        </div>

        <!-- Showcase Details -->
        <div style="padding: 40px; display: flex; flex-direction: column; gap: 20px;">
          <div style="
            font-size: 12px;
            letter-spacing: .14em;
            text-transform: uppercase;
            color: var(--mithril);
          ">${escapeHtml(showcase.client)}</div>

          <h2 style="
            font-family: var(--display);
            font-weight: 800;
            text-transform: uppercase;
            font-size: clamp(28px, 4vw, 38px);
            line-height: 1.1;
            margin: 0;
          ">${escapeHtml(showcase.title)}</h2>

          <p style="
            font-size: 17px;
            line-height: 1.6;
            color: var(--mithril);
            margin: 0;
            max-width: 640px;
          ">${escapeHtml(showcase.description)}</p>

          <div style="
            margin-top: 16px;
            padding-top: 24px;
            border-top: 1px solid var(--line);
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          ">
            <a href="contact.html" style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 14px 28px;
              background: var(--brilliance);
              color: var(--stone);
              border-radius: 999px;
              font-size: 14px;
              font-weight: 600;
              text-decoration: none;
              transition: transform .2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              Discuss a similar project
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17 17 7M7 7h10v10"/>
              </svg>
            </a>
            <a href="work.html" style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 14px 28px;
              border: 1px solid var(--line);
              border-radius: 999px;
              font-size: 14px;
              font-weight: 600;
              text-decoration: none;
              color: var(--ink);
              transition: background .2s;
            " onmouseover="this.style.background='rgba(255,255,255,.05)'" onmouseout="this.style.background='transparent'">
              View all work
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17 17 7M7 7h10v10"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;

    openModal(modalContent, `${showcase.title} - ${showcase.client}`, 'showcase-modal');
  }

  function initServicesMotion() {
    if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const heroStage = document.querySelector('.services-hero-stage');

    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.services-hero-film', {
      scale: 1.12,
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.services-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8
      }
    });

    gsap.from('.services-float-badge', {
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      delay: 0.35,
      ease: 'back.out(1.6)'
    });

    if (heroStage) {
      heroStage.addEventListener('pointermove', event => {
        const bounds = heroStage.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        gsap.to(heroStage, { rotateY: x * 9, rotateX: y * -9, duration: 0.45, ease: 'power2.out', transformPerspective: 800 });
      });

      heroStage.addEventListener('pointerleave', () => {
        gsap.to(heroStage, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      });
    }

    document.querySelectorAll('.service-showcase, .process-section').forEach(section => {
      const link = document.querySelector(`.services-index a[href="#${section.id}"]`);
      if (!link) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: self => link.classList.toggle('active', self.isActive)
      });
    });
  }

  // Smooth scroll to service sections
  function initServiceNavigation() {
    // Check if URL has hash
    if (window.location.hash) {
      const target = $(window.location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }

    // Handle future hash navigation
    window.addEventListener('hashchange', function() {
      const target = $(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Initialize progressive process steps reveal
  function initProcessSteps() {
    const processGrid = $('.process-grid');
    const processSteps = $$('.process-step');

    if (!processGrid || processSteps.length === 0) return;

    // Intersection Observer for individual steps
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    // Observe each step
    processSteps.forEach(step => {
      stepObserver.observe(step);
    });

    // Progress line animation based on scroll position
    const updateProgressLine = () => {
      const rect = processGrid.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const gridTop = rect.top;
      const gridHeight = rect.height;

      // Calculate how much of the grid is visible
      if (gridTop < windowHeight && gridTop + gridHeight > 0) {
        const visibleTop = Math.max(0, windowHeight - gridTop);
        const visibleHeight = Math.min(gridHeight, windowHeight - Math.max(0, gridTop));
        const progressPercent = Math.min(100, (visibleTop / gridHeight) * 100);

        // Update progress class
        processGrid.classList.remove('progress-25', 'progress-50', 'progress-75', 'progress-100');

        if (progressPercent >= 90) {
          processGrid.classList.add('progress-100');
        } else if (progressPercent >= 65) {
          processGrid.classList.add('progress-75');
        } else if (progressPercent >= 40) {
          processGrid.classList.add('progress-50');
        } else if (progressPercent >= 15) {
          processGrid.classList.add('progress-25');
        }
      }
    };

    // Update on scroll with throttle
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(updateProgressLine);
    });

    // Initial check
    updateProgressLine();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      init();
      initServiceNavigation();
      initProcessSteps();
    });
  } else {
    init();
    initServiceNavigation();
    initProcessSteps();
  }

})();
