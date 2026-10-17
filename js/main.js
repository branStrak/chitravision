// Chitravision Production - Main JavaScript

(function() {
  'use strict';

  // Utility function
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Mobile Menu Toggle
  function initMobileMenu() {
    const menuBtn = $('#menuBtn');
    const nav = $('#nav');
    const menuIcon = $('#menuIcon');

    if (!menuBtn) return;

    menuBtn.addEventListener('click', function() {
      const isOpen = nav.classList.contains('open');
      nav.classList.toggle('open', !isOpen);
      menuBtn.setAttribute('aria-expanded', !isOpen);

      // Update icon
      menuIcon.innerHTML = !isOpen
        ? '<path d="M18 6 6 18M6 6l12 12"/>'
        : '<path d="M4 6h16M4 12h16M4 18h16"/>';
    });

    // Close menu on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuIcon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16"/>';
      });
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
