// =============================================
// FORM.JS — Casper and Saint
// Contact form handling & validation
// =============================================

(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');

  // Simple field validation rules
  const rules = {
    name:    { required: true, minLength: 2, label: 'Full Name' },
    email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'Email Address' },
    message: { required: false }
  };

  function showError(field, message) {
    field.style.borderColor = '#c0392b';
    let errEl = field.parentElement.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'field-error';
      errEl.style.cssText = 'display:block;font-size:0.72rem;color:#c0392b;margin-top:4px;';
      field.parentElement.appendChild(errEl);
    }
    errEl.textContent = message;
  }

  function clearError(field) {
    field.style.borderColor = '';
    const errEl = field.parentElement.querySelector('.field-error');
    if (errEl) errEl.remove();
  }

  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;

    clearError(field);
    const val = field.value.trim();

    if (rule.required && !val) {
      showError(field, rule.label + ' is required.');
      return false;
    }

    if (rule.minLength && val.length < rule.minLength) {
      showError(field, rule.label + ' must be at least ' + rule.minLength + ' characters.');
      return false;
    }

    if (rule.pattern && !rule.pattern.test(val)) {
      showError(field, 'Please enter a valid ' + rule.label + '.');
      return false;
    }

    return true;
  }

  // Live validation on blur
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur', function () {
      validateField(this);
    });
    field.addEventListener('input', function () {
      if (this.style.borderColor === 'rgb(192, 57, 43)') {
        clearError(this);
      }
    });
  });

  // Submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    Object.keys(rules).forEach(function (name) {
      const field = form.elements[name];
      if (field && !validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Simulate form submission (replace with real endpoint)
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(function () {
      form.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(function () {
          successMsg.classList.remove('show');
        }, 5000);
      }
    }, 1200);
  });

})();
