// Chitravision Production - Work Page JavaScript

(function() {
  'use strict';

  const { $, $$, openModal, escapeHtml } = window.ChitraUtils;

  // Project data - expandable portfolio
  const projects = [
    {
      title: 'Heritage in Motion',
      category: 'brand-films',
      categoryLabel: 'Brand Film',
      client: 'Aster House',
      description: 'A visual journey through craftsmanship and tradition, capturing the essence of heritage.',
      tags: ['Cinematography', 'Brand Story'],
      gradient: 'linear-gradient(135deg, #2a2a2d 0%, #1f1f22 100%)',
      videoUrl: '',
      year: '2025'
    },
    {
      title: 'Urban Narratives',
      category: 'campaigns',
      categoryLabel: 'Campaign',
      client: 'Atelier N°7',
      description: 'Stories from the intersection of space and culture in modern cities.',
      tags: ['Documentary', 'Campaign'],
      gradient: 'linear-gradient(135deg, #1f1f22 0%, #2a2a2d 100%)',
      videoUrl: '',
      year: '2025'
    },
    {
      title: 'Light & Form',
      category: 'motion-design',
      categoryLabel: 'Motion Design',
      client: 'Noma',
      description: 'An exploration of movement, light, and architectural space.',
      tags: ['Motion Graphics', '3D Animation'],
      gradient: 'linear-gradient(135deg, #2d2d30 0%, #1a1a1c 100%)',
      videoUrl: '',
      year: '2024'
    },
    {
      title: 'Eternal Promise',
      category: 'wedding-films',
      categoryLabel: 'Wedding Film',
      client: 'Private Commission',
      description: 'A cinematic celebration of love, family, and new beginnings.',
      tags: ['Wedding', 'Cinematic'],
      gradient: 'linear-gradient(135deg, #252528 0%, #1f1f22 100%)',
      videoUrl: '',
      year: '2024'
    },
    {
      title: 'Product Essence',
      category: 'commercials',
      categoryLabel: 'Commercial',
      client: 'Common Ground',
      description: 'High-impact commercial showcasing design, craftsmanship, and functionality.',
      tags: ['Product Film', 'Commercial'],
      gradient: 'linear-gradient(135deg, #1a1a1c 0%, #2d2d30 100%)',
      videoUrl: '',
      year: '2024'
    },
    {
      title: 'Brand Identity Reel',
      category: 'brand-films',
      categoryLabel: 'Brand Film',
      client: 'Studio Kai',
      description: 'A comprehensive brand story told through motion and emotion.',
      tags: ['Brand Identity', 'Motion'],
      gradient: 'linear-gradient(135deg, #1f1f22 0%, #252528 100%)',
      videoUrl: '',
      year: '2024'
    },
    {
      title: 'Launch Campaign',
      category: 'campaigns',
      categoryLabel: 'Campaign',
      client: 'Aster House',
      description: 'Multi-platform campaign launch for a new product line.',
      tags: ['Campaign', 'Social Media'],
      gradient: 'linear-gradient(135deg, #2a2a2d 0%, #1a1a1c 100%)',
      videoUrl: '',
      year: '2024'
    },
    {
      title: 'Kinetic Typography',
      category: 'motion-design',
      categoryLabel: 'Motion Design',
      client: 'Atelier N°7',
      description: 'Dynamic type animations for brand messaging and social content.',
      tags: ['Typography', 'Animation'],
      gradient: 'linear-gradient(135deg, #1a1a1c 0%, #1f1f22 100%)',
      videoUrl: '',
      year: '2023'
    }
  ];

  let currentFilter = 'all';

  // Initialize work page
  function init() {
    renderProjects();
    setupFilters();
    initProjectCards();
  }

  // Render all projects
  function renderProjects() {
    const grid = $('#portfolioGrid');
    if (!grid) return;

    const html = projects.map((project, index) => `
      <article class="project-card"
        data-category="${escapeHtml(project.category)}"
        data-index="${index}"
        style="animation-delay: ${index * 0.05}s"
        role="button"
        tabindex="0"
        aria-label="View ${escapeHtml(project.title)} project">
        <div class="project-thumb">
          <div class="project-gradient" style="background: ${escapeHtml(project.gradient)}"></div>
          <div class="project-play">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8z"/>
            </svg>
          </div>
        </div>
        <div class="project-info">
          <div class="project-meta">
            <span class="project-category">${escapeHtml(project.categoryLabel)}</span>
            <span class="project-dot"></span>
            <span>${escapeHtml(project.year)}</span>
          </div>
          <h3 class="project-title">${escapeHtml(project.title)}</h3>
          <p class="project-description">${escapeHtml(project.description)}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `
              <span class="project-tag">${escapeHtml(tag)}</span>
            `).join('')}
          </div>
        </div>
      </article>
    `).join('');

    grid.innerHTML = html;
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

  // Apply filter to projects
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
        // Stagger animation on filter change
        card.style.animationDelay = `${index * 0.03}s`;
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
        const index = parseInt(this.getAttribute('data-index'));
        openProjectModal(projects[index]);
      });

      // Keyboard handler
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const index = parseInt(this.getAttribute('data-index'));
          openProjectModal(projects[index]);
        }
      });
    });
  }

  // Open project detail modal
  function openProjectModal(project) {
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
        <!-- Video Player Placeholder -->
        <div style="
          aspect-ratio: 16/9;
          background: ${escapeHtml(project.gradient)};
          display: grid;
          place-items: center;
          position: relative;
        ">
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.3;">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
          </svg>
        </div>

        <!-- Project Details -->
        <div style="padding: 40px; display: flex; flex-direction: column; gap: 24px;">
          <div style="display: flex; align-items: center; gap: 12px; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--mithril);">
            <span>${escapeHtml(project.categoryLabel)}</span>
            <span style="width: 3px; height: 3px; border-radius: 50%; background: var(--mithril);"></span>
            <span>${escapeHtml(project.year)}</span>
            <span style="width: 3px; height: 3px; border-radius: 50%; background: var(--mithril);"></span>
            <span>${escapeHtml(project.client)}</span>
          </div>

          <h2 style="
            font-family: var(--display);
            font-weight: 800;
            text-transform: uppercase;
            font-size: clamp(28px, 4vw, 42px);
            line-height: 1.1;
            margin: 0;
          ">${escapeHtml(project.title)}</h2>

          <p style="
            font-size: 18px;
            line-height: 1.7;
            color: var(--mithril);
            margin: 0;
            max-width: 720px;
          ">${escapeHtml(project.description)}</p>

          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
            ${project.tags.map(tag => `
              <span style="
                padding: 6px 14px;
                border: 1px solid var(--line);
                border-radius: 4px;
                font-size: 12px;
                color: var(--ink);
                background: rgba(255,255,255,.04);
              ">${escapeHtml(tag)}</span>
            `).join('')}
          </div>

          <div style="
            margin-top: 16px;
            padding-top: 24px;
            border-top: 1px solid var(--line);
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
              Start a similar project
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17 17 7M7 7h10v10"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;

    openModal(modalContent, `${project.title} - ${project.categoryLabel}`, 'project-modal');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
