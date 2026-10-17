// Chitravision Production - Contact Page JavaScript

(function() {
  'use strict';

  const { $ } = window.ChitraUtils;

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

      // Submit form (simulate async API call)
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

  // Submit form data
  function submitForm(form) {
    const submitBtn = $('#submitBtn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoader = submitBtn.querySelector('.submit-loader');
    const submitArrow = submitBtn.querySelector('.submit-arrow');
    const formMessage = $('#formMessage');

    // Disable button and show loader
    submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Sending enquiry...';
    if (submitLoader) submitLoader.style.display = 'inline-flex';
    if (submitArrow) submitArrow.style.display = 'none';

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simulate network delay (1.5 seconds)
    setTimeout(() => {
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

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Reset form
      form.reset();

      // Log submission data (for development/demo purposes)
      console.log('Form submission successful:', data);

    }, 1500);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }

})();
