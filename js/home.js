// Chitravision Production - Homepage JavaScript

(function() {
  'use strict';

  const { $, escapeHtml } = window.ChitraUtils;

  // Sample project data (replace with real data)
  const featuredProjects = [
    {
      title: 'Visual Identity System',
      category: 'Brand Films',
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    },
    {
      title: 'Product Launch Campaign',
      category: 'Campaigns',
      gradient: 'linear-gradient(135deg, #2d1b3d 0%, #1e1b3d 100%)'
    },
    {
      title: 'Motion Graphics Suite',
      category: 'Motion Design',
      gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0f2537 100%)'
    }
  ];

  // Sample testimonials data
  const testimonials = [
    {
      quote: 'Working with Chitravision elevated our entire brand presence. They captured what we stood for in ways we hadnt imagined.',
      author: 'Creative Director',
      company: 'ASTER HOUSE'
    },
    {
      quote: 'Rare to find a team that listens this deeply and translates vision into something that feels inevitable.',
      author: 'Founder',
      company: 'STUDIO KAI'
    },
    {
      quote: 'Every frame felt intentional. They didnt just make a film — they made our story unmissable.',
      author: 'Brand Lead',
      company: 'COMMON GROUND'
    }
  ];

  // Setup reel showcase interactions
  function setupReelShowcase() {
    const reelItems = document.querySelectorAll('.reel-item');

    reelItems.forEach(item => {
      item.addEventListener('click', function() {
        const reelId = this.getAttribute('data-reel');
        openReelModal(reelId);
      });

      // Keyboard support
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const reelId = this.getAttribute('data-reel');
          openReelModal(reelId);
        }
      });
    });
  }

  // Open reel modal
  function openReelModal(reelId) {
    const title = document.querySelector(`[data-reel="${reelId}"] .reel-title`)?.textContent || 'Video';
    const category = document.querySelector(`[data-reel="${reelId}"] .reel-category`)?.textContent || '';

    const modalHTML = `
      <div class="modal active" id="reelModal" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <button class="modal-close" aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <div class="modal-body">
            <div class="modal-header">
              <span class="modal-kicker">${escapeHtml(category)}</span>
              <h2 id="modalTitle">${escapeHtml(title)}</h2>
            </div>

            <div class="modal-video">
              <div class="video-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4l14 8-14 8z"/>
                </svg>
                <p>Video player would be embedded here</p>
              </div>
            </div>

            <div class="modal-footer">
              <a href="work.html" class="text-link">
                View more work
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 17 17 7M7 7h10v10"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    window.ChitraUtils.openModal(modalHTML);
  }

  // Render featured work preview
  function renderFeaturedWork() {
    const container = $('#workPreview');
    if (!container) return;

    const html = featuredProjects.map(project => `
      <article class="work-card">
        <div class="work-thumb" style="background: ${escapeHtml(project.gradient)};">
          <div class="play-overlay">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8z"/>
            </svg>
          </div>
        </div>
        <div class="work-card-content">
          <h3>${escapeHtml(project.title)}</h3>
          <p class="work-card-meta">${escapeHtml(project.category)}</p>
        </div>
      </article>
    `).join('');

    container.innerHTML = html;

    // Add click handlers
    const workCards = container.querySelectorAll('.work-card');
    workCards.forEach(card => {
      card.addEventListener('click', function() {
        window.location.href = 'work.html';
      });
      card.style.cursor = 'pointer';
    });
  }

  // Render testimonials
  function renderTestimonials() {
    const container = $('#testimonials');
    if (!container) return;

    const html = testimonials.map(testimonial => `
      <article class="testimonial-card">
        <blockquote>
          "${escapeHtml(testimonial.quote)}"
        </blockquote>
        <div class="testimonial-meta">
          <div class="testimonial-author">${escapeHtml(testimonial.author)}</div>
          <div class="testimonial-role">${escapeHtml(testimonial.company)}</div>
        </div>
      </article>
    `).join('');

    container.innerHTML = html;
  }

  // Setup hero play button
  function setupHeroPlayButton() {
    const playBtn = $('#playBtn');
    const playDisc = document.querySelector('.play-disc');
    const mobileReelBtn = document.querySelector('[data-showreel-trigger]');

    if (playBtn) {
      playBtn.addEventListener('click', openShowreelModal);
      playBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openShowreelModal();
        }
      });
    }

    if (playDisc) {
      playDisc.addEventListener('click', (e) => {
        e.stopPropagation();
        openShowreelModal();
      });
      playDisc.style.cursor = 'pointer';
      playDisc.style.pointerEvents = 'auto';
    }

    if (mobileReelBtn) {
      mobileReelBtn.addEventListener('click', openShowreelModal);
    }
  }

  function initHeroMotion() {
    if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

    intro
      .from('.hero-mobile-header .hero-cat-tag', { y: 12, opacity: 0, duration: 0.6 })
      .from('.hero-mobile-headline > *', { yPercent: 115, opacity: 0, rotate: 2, stagger: 0.09, duration: 0.9 }, '-=0.3')
      .from('.hero-mobile-copy, .hero-mobile-actions', { y: 18, opacity: 0, stagger: 0.08, duration: 0.7 }, '-=0.45')
      .from('.orbit-scene', { scale: 0.76, opacity: 0, rotate: -10, duration: 1.15 }, '-=0.75')
      .from('.hero-mobile-footer', { y: 12, opacity: 0, duration: 0.6 }, '-=0.5');

    gsap.to('.hero-background-film', {
      scale: 1.14,
      yPercent: 7,
      ease: 'none',
      scrollTrigger: ScrollTrigger ? {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8
      } : undefined
    });

    gsap.to('.hero-mobile-headline', {
      yPercent: -12,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: ScrollTrigger ? {
        trigger: '.hero',
        start: '35% top',
        end: 'bottom top',
        scrub: 0.8
      } : undefined
    });

    const scene = document.getElementById('orbitScene');
    if (!scene) return;

    scene.addEventListener('pointermove', event => {
      const bounds = scene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      gsap.to(scene, { rotateY: x * 10, rotateX: y * -10, duration: 0.45, ease: 'power2.out', transformPerspective: 700 });
    });

    scene.addEventListener('pointerleave', () => {
      gsap.to(scene, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    });
  }

  // Real-time Studio Clock (IST / New Delhi, UTC+5:30)
  function initHeroClock() {
    const clockEl = document.getElementById('heroClockTime');
    if (!clockEl) return;

    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    function updateClock() {
      try {
        clockEl.textContent = formatter.format(new Date());
      } catch (e) {
        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        const istDate = new Date(utc + (3600000 * 5.5));
        const hh = String(istDate.getHours()).padStart(2, '0');
        const mm = String(istDate.getMinutes()).padStart(2, '0');
        const ss = String(istDate.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hh}:${mm}:${ss}`;
      }
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // Atmospheric Audio Ambience Toggle (Web Audio API subtle warm room drone)
  function initHeroAudio() {
    const toggleBtn = document.getElementById('heroAudioToggle');
    const statusTag = document.getElementById('audioToggleStatus');
    if (!toggleBtn) return;

    let audioCtx = null;
    let masterGain = null;
    let osc1 = null;
    let osc2 = null;
    let isPlaying = false;

    function startDrone() {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtx) {
          audioCtx = new AudioContextClass();
        }

        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.0001, now);
        masterGain.gain.exponentialRampToValueAtTime(0.06, now + 1.2);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, now);

        osc1 = audioCtx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, now);

        osc2 = audioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(110.5, now);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(audioCtx.destination);

        osc1.start(now);
        osc2.start(now);

        isPlaying = true;
        toggleBtn.classList.add('active');
        if (statusTag) statusTag.textContent = 'LIVE';
      } catch (err) {
        console.warn('Atmospheric audio unavailable:', err);
      }
    }

    function stopDrone() {
      if (!audioCtx || !masterGain) {
        isPlaying = false;
        toggleBtn.classList.remove('active');
        if (statusTag) statusTag.textContent = 'OFF';
        return;
      }

      try {
        const now = audioCtx.currentTime;
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        setTimeout(() => {
          if (osc1) { try { osc1.stop(); osc1.disconnect(); } catch (_) {} osc1 = null; }
          if (osc2) { try { osc2.stop(); osc2.disconnect(); } catch (_) {} osc2 = null; }
        }, 650);

        isPlaying = false;
        toggleBtn.classList.remove('active');
        if (statusTag) statusTag.textContent = 'OFF';
      } catch (err) {
        isPlaying = false;
        toggleBtn.classList.remove('active');
        if (statusTag) statusTag.textContent = 'OFF';
      }
    }

    toggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopDrone();
      } else {
        startDrone();
      }
    });
  }

  // Open showreel modal
  function openShowreelModal() {
    const modalHTML = `
      <div class="modal active" id="showreelModal" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
        <div class="modal-overlay"></div>
        <div class="modal-content modal-large">
          <button class="modal-close" aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <div class="modal-body">
            <div class="modal-header">
              <span class="modal-kicker">Showreel 2025</span>
              <h2 id="modalTitle">Stories worth telling</h2>
            </div>

            <div class="modal-video">
              <div class="video-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4l14 8-14 8z"/>
                </svg>
                <p>Showreel video player would be embedded here</p>
              </div>
            </div>

            <div class="modal-footer">
              <p>A collection of our recent work across brand films, campaigns, and motion design.</p>
              <a href="work.html" class="cta-button">
                Explore all projects
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 17 17 7M7 7h10v10"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    window.ChitraUtils.openModal(modalHTML);
  }


  // Animate statistics counters
  function initStatsCounters() {
    const counters = document.querySelectorAll('.stat-number');

    if (!counters.length) return;

    const duration = 2000;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.target);
        const suffix = counter.dataset.suffix || '';
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const progress = Math.min(
            (currentTime - startTime) / duration,
            1
          );

          // Smooth ease-out effect
          const easedProgress = 1 - Math.pow(1 - progress, 4);
          const currentValue = Math.floor(easedProgress * target);

          counter.textContent = currentValue.toLocaleString('en-IN') + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString('en-IN') + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(counter);
      });
    }, {
      threshold: 0.4
    });

    counters.forEach(counter => observer.observe(counter));
  }



  
  // Initialize scroll animations
  function initScrollAnimations() {
    const sections = document.querySelectorAll('.section-pad');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  // Initialize everything when DOM is ready
  function init() {
    // setupReelShowcase(); uncomment this to show reel directly on page 
    renderFeaturedWork();
    renderTestimonials();
    setupHeroPlayButton();
    initHeroMotion();
    initHeroClock();
    initHeroAudio();
    initScrollAnimations();
    initStatsCounters();
  }

  





  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();


