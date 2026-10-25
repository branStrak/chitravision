// Chitravision Production - Contact Page JavaScript

(function() {
  'use strict';

  const { $ } = window.ChitraUtils;

  // EmailJS Configuration
  const EMAILJS_CONFIG = {
    // Your EmailJS Public Key
    publicKey: 'WapsRfoCYYiIrNvpi',
    // Template configured to send every detail to sutharsanju1435@gmail.com
    templateId: 'template_kv8hl4m',
    // Your EmailJS Service ID (connect your Gmail or email service in EmailJS dashboard)
    serviceId: 'service_dnj2ka3'
  };

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: EMAILJS_CONFIG.publicKey
    });
  }

  // Initialize contact form
  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Clear previous errors and messages
      clearErrors();

      // Validate form
      if (!validateForm()) {
        return;
      }

      // Submit form
      submitForm(form);
    });

    // Real-time validation on blur/input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
    });
  }

  function initContactMotion() {
    if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.gsap.registerPlugin(window.ScrollTrigger);
    const timeline = window.gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline
      .from('.contact-signal', { autoAlpha: 0, scale: 0.86, rotate: -5, duration: 1.2 }, 0.15)
      .from('.contact-signal-badge', { autoAlpha: 0, y: 14, stagger: 0.12, duration: 0.6 }, 0.55)
      .from('.contact-hero-rail > *', { autoAlpha: 0, y: 10, stagger: 0.1, duration: 0.5 }, 0.72);

    window.gsap.fromTo('.contact-signal-line',
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }
    );

    window.gsap.to('.contact-signal-ring--outer', { rotate: 360, duration: 34, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
    window.gsap.to('.contact-signal-ring--middle', { rotate: -360, duration: 26, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
    window.gsap.to('.contact-signal-ring--inner', { rotate: 360, duration: 19, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
  }

  function initPage() {
    initContactForm();
    initContactMotion();
  }

  // Validate single field
  function validateField(field) {
    const name = field.getAttribute('name');
    const value = field.value.trim();
    const group = field.closest('.form-group');
    const errorEl = $(`#${name}Error`);

    if (!group) return true;

    let isValid = true;
    let errorMessage = '';

    // Required check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    } else if (name === 'email' && value) {
      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }

    if (!isValid) {
      group.classList.add('error');
      if (errorEl) {
        errorEl.textContent = errorMessage;
        errorEl.classList.add('visible');
      }
    } else {
      group.classList.remove('error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    }

    return isValid;
  }

  // Validate entire form
  function validateForm() {
    const form = $('#contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Scroll to first error if any
    if (!isValid) {
      const firstError = form.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  }

  // Clear all errors
  function clearErrors() {
    const form = $('#contactForm');
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
    });
    form.querySelectorAll('.form-error').forEach(err => {
      err.textContent = '';
      err.classList.remove('visible');
    });
  }

  // Submit form data to EmailJS
  function submitForm(form) {
    const submitBtn = $('#submitBtn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoader = submitBtn.querySelector('.submit-loader');
    const submitArrow = submitBtn.querySelector('.submit-arrow');
    const formMessage = $('#formMessage');

    // Check if EmailJS SDK is loaded
    if (typeof emailjs === 'undefined') {
      if (formMessage) {
        formMessage.textContent = 'Email service is currently unavailable. Please reach out directly to hello@chitravision.studio';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Disable button and show loader
    submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Sending enquiry...';
    if (submitLoader) submitLoader.style.display = 'inline-flex';
    if (submitArrow) submitArrow.style.display = 'none';

    // Hide any previous form message
    if (formMessage) {
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';
    }

    // Extract form fields with readable labels
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const companyInput = form.querySelector('#company');
    const serviceSelect = form.querySelector('#service');
    const budgetSelect = form.querySelector('#budget');
    const timelineSelect = form.querySelector('#timeline');
    const messageInput = form.querySelector('#message');

    const serviceLabel = serviceSelect && serviceSelect.selectedIndex >= 0 && serviceSelect.value
      ? serviceSelect.options[serviceSelect.selectedIndex].text
      : (serviceSelect ? serviceSelect.value : '');

    const budgetLabel = budgetSelect && budgetSelect.selectedIndex >= 0 && budgetSelect.value
      ? budgetSelect.options[budgetSelect.selectedIndex].text
      : 'Not specified';

    const timelineLabel = timelineSelect && timelineSelect.selectedIndex >= 0 && timelineSelect.value
      ? timelineSelect.options[timelineSelect.selectedIndex].text
      : 'Not specified';

    const templateParams = {
      name: nameInput ? nameInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      company: companyInput && companyInput.value.trim() ? companyInput.value.trim() : 'Not specified',
      service: serviceLabel,
      budget: budgetLabel,
      timeline: timelineLabel,
      message: messageInput ? messageInput.value.trim() : '',
      to_email: 'sutharsanju1435@gmail.com'
    };

    // Send email via EmailJS
    emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      {
        publicKey: EMAILJS_CONFIG.publicKey
      }
    )
    .then(function(response) {
      console.log('Enquiry sent successfully:', response.status, response.text);

      // Re-enable button
      submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Send enquiry';
      if (submitLoader) submitLoader.style.display = 'none';
      if (submitArrow) submitArrow.style.display = 'inline-block';

      // Show success message
      if (formMessage) {
        formMessage.textContent = 'Thank you for your enquiry. We have received your message and will get back to you within 1-2 business days.';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Reset form
      form.reset();
    })
    .catch(function(error) {
      console.error('Failed to send enquiry via EmailJS:', error);

      // Re-enable button
      submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Send enquiry';
      if (submitLoader) submitLoader.style.display = 'none';
      if (submitArrow) submitArrow.style.display = 'inline-block';

      // Show friendly error message
      if (formMessage) {
        formMessage.textContent = 'Oops! We could not send your message right now. Please try again or email us directly at hello@chitravision.studio';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }

})();
