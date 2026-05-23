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
    message: { required: false, label: 'Message' } // FIXED: Added fallback label
  };

  function showError(field, message) {
    field.style.borderColor = '#c0392b';
    field.setAttribute('data-has-error', 'true'); // FIXED: Using a data attribute instead of parsing CSS colors
    
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
    field.removeAttribute('data-has-error');
    const errEl = field.parentElement.querySelector('.field-error');
    if (errEl) errEl.remove();
  }

  function validateField(field) {
    // FIXED: Prevent crash if an element matching a rule name doesn't exist in HTML
    if (!field) return true; 

    const rule = rules[field.name];
    if (!rule) return true;

    clearError(field);
    const val = field.value.trim();
    const label = rule.label || 'Field'; // FIXED: Safe fallback string if label is missing

    if (rule.required && !val) {
      showError(field, label + ' is required.');
      return false;
    }

    if (rule.minLength && val.length < rule.minLength) {
      showError(field, label + ' must be at least ' + rule.minLength + ' characters.');
      return false;
    }

    if (rule.pattern && !rule.pattern.test(val)) {
      showError(field, 'Please enter a valid ' + label + '.');
      return false;
    }

    return true;
  }

  // Live validation on blur & input
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur', function () {
      validateField(this);
    });
    
    field.addEventListener('input', function () {
      // FIXED: Safely clears the error red line as soon as the user starts correcting it
      if (this.getAttribute('data-has-error') === 'true') {
        clearError(this);
      }
    });
  });

  // Submit Handler
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    Object.keys(rules).forEach(function (name) {
      const field = form.elements[name];
      if (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      }
    });

    if (!isValid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }

    const formData = new FormData(form);

    fetch('https://formspree.io/f/mpqnllrr', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function (response) {
      if (submitBtn) {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }
      
      if (response.ok) {
        form.reset();
        if (successMsg) {
          successMsg.classList.add('show');
          setTimeout(function () {
            successMsg.classList.remove('show');
          }, 5000);
        }
      } else {
        alert('Something went wrong. Please email us directly at info@casperandsaint.com');
      }
    })
    .catch(function () {
      if (submitBtn) {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }
      alert('Connection error. Please email us directly at info@casperandsaint.com');
    });
  });
})();