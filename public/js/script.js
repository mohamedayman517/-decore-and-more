/**
 * Main Script File - Fallback for any pages that reference script.js
 * This file provides basic functionality and redirects to main.js
 */

// Load main.js functionality if it exists
if (typeof window !== 'undefined') {
  // Basic console message
  console.log('Script.js loaded - redirecting to main functionality');
  
  // Try to load main.js functionality
  const script = document.createElement('script');
  script.src = '/js/main.js';
  script.async = true;
  document.head.appendChild(script);
}

// Basic utility functions that might be expected
window.utils = window.utils || {};

// Basic smooth scroll function
window.utils.smoothScroll = function(target) {
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth'
    });
  }
};

// Basic form validation helper
window.utils.validateForm = function(form) {
  if (!form) return false;
  
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
  });
  
  return isValid;
};

// Basic alert function
window.utils.showAlert = function(message, type = 'info') {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      text: message,
      icon: type,
      confirmButtonText: 'OK'
    });
  } else {
    alert(message);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script.js DOM ready');
  
  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.utils.smoothScroll(target);
      }
    });
  });
  
  // Add basic form validation
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!window.utils.validateForm(this)) {
        e.preventDefault();
        window.utils.showAlert('Please fill in all required fields', 'warning');
      }
    });
  });
});
