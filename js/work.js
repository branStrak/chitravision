// Chitravision Production - Work Page JavaScript

(function() {
  'use strict';

  const { $, $$, openModal, escapeHtml } = window.ChitraUtils;

  /**
   * Reels Portfolio Data
   * 
   * TO ADD A NEW REEL:
   * Simply add a new object to this array under the desired category.
   * Available categories (match the filter buttons):
   *   - 'brand-films'
   *   - 'campaigns'
   *   - 'wedding-films'
   *   - 'commercials'
   *   - 'motion-design'
   * 
   * Object properties:
   *   - title: Name of the reel (used for accessibility / modal)
   *   - category: One of the category slugs above
   *   - video: Path to local .mp4 (e.g. 'assets/reels/verti-1.mp4') or video URL
   *   - poster: (Optional) URL or path to thumbnail image
   *   - link: (Optional) Instagram / external reel link
   *   - gradient: Fallback background gradient when video is loading or placeholder
   */
  const projects = [
    {
      title: 'Everyday Elevated',
      category: 'brand-films',
      video: 'assets/reels/verti-1.mp4',
      link: 'https://www.instagram.com/reel/DdwqnlETsbp/',
      gradient: 'linear-gradient(135deg, #2a2a2d 0%, #1f1f22 100%)'
    },
    {
      title: 'Form Follows Feeling',
      category: 'campaigns',
      video: 'assets/reels/verti-2.mp4',
      link: 'https://www.instagram.com/chitravision_production/',
      gradient: 'linear-gradient(135deg, #1f1f22 0%, #2a2a2d 100%)'
    },
    {
      title: 'The Sound of Steel',
      category: 'commercials',
      video: 'assets/reels/car-hori-2.mp4',
      link: 'https://www.instagram.com/chitravision_production/',
      gradient: 'linear-gradient(135deg, #1a1a1c 0%, #2d2d30 100%)'
    },
    {
      title: 'Eternal Promise',
      category: 'wedding-films',
      video: 'assets/reels/verti-1.mp4',
      link: 'https://www.instagram.com/chitravision_production/',
      gradient: 'linear-gradient(135deg, #252528 0%, #1f1f22 100%)'
    },
    {
      title: 'Urban Rhythm',
      category: 'campaigns',
      video: 'assets/reels/main-1.mp4',
      link: 'https://www.instagram.com/chitravision_marketing/',
      gradient: 'linear-gradient(135deg, #2d2d30 0%, #1a1a1c 100%)'
    },
    {
      title: 'Light & Form',
      category: 'motion-design',
      video: 'assets/reels/hori-1.mp4',
      link: 'https://www.instagram.com/chitravision_production/',
      gradient: 'linear-gradient(135deg, #1f1f22 0%, #252528 100%)'
    },
    {
      title: 'Heritage in Motion',
      category: 'brand-films',
      video: 'assets/reels/verti-2.mp4',
      link: 'https://www.instagram.com/chitravision_production/',
      gradient: 'linear-gradient(135deg, #2a2a2d 0%, #1a1a1c 100%)'
    },
    {
      title: 'Vows in Silence',
      category: 'wedding-films',
      video: 'assets/reels/verti-2.mp4',
      link: 'https://www.instagram.com/chitravision_production/',
      gradient: 'linear-gradient(135deg, #252528 0%, #1a1a1c 100%)'
    },
    {
      title: 'Precision Craft',
      category: 'commercials',
      video: 'assets/reels/main-1.mp4',
      link: 'https://www.instagram.com/chitravision_production/',
      gradient: 'linear-gradient(135deg, #1a1a1c 0%, #1f1f22 100%)'
    },
    {
      title: 'Kinetic Movement',
      category: 'motion-design',
      video: 'assets/reels/verti-1.mp4',
      link: 'https://www.instagram.com/chitravision_production/',
      gradient: 'linear-gradient(135deg, #2a2a2d 0%, #1f1f22 100%)'
    }
  ];

  let currentFilter = 'all';

  // Initialize work page
  function init() {
    renderProjects();
    setupFilters();
  }

  // Render all reel project cards (9:16 format only, no under-card text or titles)
  function renderProjects() {
    const grid = $('#portfolioGrid');
    if (!grid) return;

    const html = projects.map((project, index) => {
      const hasVideo = Boolean(project.video);
      return `
        <article class="project-card"
          data-category="${escapeHtml(project.category)}"
          data-index="${index}"
          style="animation-delay: ${index * 0.04}s"
          role="button"
          tabindex="0"
          aria-label="${escapeHtml(project.title || 'Reel')}">
          <div class="project-thumb">
            ${hasVideo ? `
              <video autoplay muted loop playsinline preload="metadata" ${project.poster ? `poster="${escapeHtml(project.poster)}"` : ''}>
                <source src="${escapeHtml(project.video)}" type="video/mp4">
              </video>
            ` : ''}
            <div class="project-gradient" style="background: ${escapeHtml(project.gradient || 'linear-gradient(135deg, #252528 0%, #1a1a1c 100%)')}"></div>
            <div class="project-play">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4l14 8-14 8z"/>
              </svg>
            </div>
          </div>
        </article>
      `;
    }).join('');

    grid.innerHTML = html;
    initProjectCards();
  }

  // Setup filter functionality
  function setupFilters() {
    const chips = $$('.filter-chip');

    chips.forEach(chip => {
      chip.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        applyFilter(filter);

        // Update active state
        chips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
      });
    });
  }

  // Apply filter to reels
  function applyFilter(filter) {
    currentFilter = filter;
    const cards = $$('.project-card');
    const emptyState = $('#emptyState');
    let visibleCount = 0;

    cards.forEach((card, index) => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        card.setAttribute('data-hidden', 'false');
        card.style.display = '';
        card.style.animationDelay = `${visibleCount * 0.03}s`;
        visibleCount++;
      } else {
        card.setAttribute('data-hidden', 'true');
        card.style.display = 'none';
      }
    });

    // Show/hide empty state
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Initialize project card interactions
  function initProjectCards() {
    const cards = $$('.project-card');

    cards.forEach(card => {
      // Click handler
      card.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'), 10);
        openProjectModal(projects[index]);
      });

      // Keyboard handler
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const index = parseInt(this.getAttribute('data-index'), 10);
          openProjectModal(projects[index]);
        }
      });
    });
  }

  // Open 9:16 reel modal
  function openProjectModal(project) {
    if (!project) return;
    const hasVideo = Boolean(project.video);

    const modalContent = `
      <div style="position: relative; max-width: 420px; width: 100%;">
        <div class="modal-close" role="button" tabindex="0" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </div>
        <div style="
          aspect-ratio: 9 / 16;
          width: 100%;
          background: #000;
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 24px 60px rgba(0,0,0,.9);
          display: grid;
          place-items: center;
        ">
          ${hasVideo ? `
            <video src="${escapeHtml(project.video)}" controls autoplay playsinline style="width: 100%; height: 100%; object-fit: cover; display: block;"></video>
          ` : `
            <div style="background: ${escapeHtml(project.gradient || '#18181b')}; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; text-align: center; gap: 16px;">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.4;">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
              </svg>
              <h3 style="font-family: var(--display); font-size: 24px; text-transform: uppercase; margin: 0; color: var(--ink);">${escapeHtml(project.title || 'Reel')}</h3>
            </div>
          `}
        </div>
        ${project.link ? `
          <div style="margin-top: 14px; text-align: center;">
            <a href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer" style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 10px 22px;
              background: var(--panel);
              border: 1px solid var(--line);
              border-radius: 999px;
              color: var(--ink);
              text-decoration: none;
              font-size: 13px;
              font-weight: 500;
              transition: all .2s;
            " onmouseover="this.style.borderColor='var(--brilliance)'" onmouseout="this.style.borderColor='var(--line)'">
              <span>View on Instagram</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg>
            </a>
          </div>
        ` : ''}
      </div>
    `;

    openModal(modalContent, project.title || 'Chitravision Reel', 'reel-modal');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
