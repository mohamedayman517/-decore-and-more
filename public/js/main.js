// Initialize sidebar
const sidebarId = document.getElementById("sidebar");

if (sidebarId) {
  if (localStorage.getItem("isSmall") === "yes") {
    sidebarId.classList.add("small-sidebar");
  } else {
    sidebarId.classList.remove("small-sidebar");
  }

  const toggleSidebar = () => {
    if (localStorage.getItem("isSmall") === "yes") {
      localStorage.setItem("isSmall", "no");
      sidebarId.classList.remove("small-sidebar");
    } else {
      localStorage.setItem("isSmall", "yes");
      sidebarId.classList.add("small-sidebar");
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Main.js loaded and DOM ready");

  // Check for menu button and nav links
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Initialize all buttons with click handlers
  initializeButtons();

  // Initialize forms
  initializeForms();

  // Initialize navigation
  initializeNavigation();

  // Check for price range elements
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  if (priceRange && priceValue) {
    priceRange.addEventListener("input", () => {
      priceValue.textContent = priceRange.value;
    });
  }

  // Check for star rating elements
  const stars = document.querySelectorAll(".star");
  if (stars.length > 0) {
    stars.forEach((star) => {
      star.addEventListener("click", () => {
        selectedRating = parseInt(star.getAttribute("data-rating"));
        highlightStars(selectedRating);
      });
    });
  }

  // Check for rating form
  const ratingForm = document.getElementById("ratingForm");
  if (ratingForm) {
    ratingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const engineerId = form.querySelector('input[name="engineerId"]')?.value;
      const name = form.querySelector('input[name="name"]')?.value;
      const comment = form.querySelector('textarea[name="comment"]')?.value;

      if (selectedRating === 0) {
        showErrorAlert("Please select a rating before submitting.");
        return;
      }

      try {
        const response = await fetch("/rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            engineerId,
            name,
            rating: selectedRating,
            comment,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          showErrorAlert(
            errorData.message || "An error occurred while submitting feedback."
          );
          return;
        }

        const data = await response.json();
        showSuccessAlert("Thank you for your feedback!");
        form.reset();
        selectedRating = 0;
        highlightStars(0);
      } catch (error) {
        showErrorAlert("An error occurred while submitting feedback.");
      }
    });
  }
});

// timer
// Countdown Timer
const countdown = () => {
  // Set the event date (YYYY-MM-DD HH:MM:SS)
  const eventDate = new Date("2025-01-30 12:00:00").getTime();
  const now = new Date().getTime();

  // Calculate remaining time
  const timeLeft = eventDate - now;

  if (timeLeft > 0) {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Update HTML if elements exist
    const daysElement = document.querySelector(".days");
    const hoursElement = document.querySelector(".hours");
    const minutesElement = document.querySelector(".minutes");
    const secondsElement = document.querySelector(".seconds");
    const timerBox = document.getElementById("timer-box");

    if (daysElement) daysElement.textContent = days;
    if (hoursElement) hoursElement.textContent = hours;
    if (minutesElement) minutesElement.textContent = minutes;
    if (secondsElement) secondsElement.textContent = seconds;
  } else {
    // If the event is over
    const timerBox = document.getElementById("timer-box");
    if (timerBox) {
      timerBox.innerHTML = "<h3>Event Started!</h3>";
    }
  }
};

// Only start countdown if timer elements exist
const timerBox = document.getElementById("timer-box");
if (timerBox) {
  setInterval(countdown, 1000);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Initialize all buttons with proper event handlers
function initializeButtons() {
  console.log("Initializing buttons...");

  // Book Now buttons
  document
    .querySelectorAll('.book-now-btn, .btn-book, [data-action="book"]')
    .forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const packageId =
          this.dataset.packageId || this.getAttribute("data-package-id");
        const eventType =
          this.dataset.eventType || this.getAttribute("data-event-type");

        if (packageId) {
          window.location.href = `/booking?packageId=${packageId}&eventType=${
            eventType || ""
          }`;
        } else {
          window.location.href = "/booking";
        }
      });
    });

  // View Profile buttons
  document
    .querySelectorAll(
      '.view-profile-btn, .btn-profile, [data-action="profile"]'
    )
    .forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const engineerId =
          this.dataset.engineerId || this.getAttribute("data-engineer-id");
        if (engineerId) {
          window.location.href = `/profile/${engineerId}`;
        }
      });
    });

  // Contact buttons
  document
    .querySelectorAll('.contact-btn, .btn-contact, [data-action="contact"]')
    .forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "/contact";
      });
    });

  // Login/Register buttons
  document.querySelectorAll(".login-btn, .btn-login").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "/login";
    });
  });

  document.querySelectorAll(".register-btn, .btn-register").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "/register";
    });
  });

  // Logout buttons
  document.querySelectorAll(".logout-btn, .btn-logout").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("Are you sure you want to logout?")) {
        fetch("/logout", { method: "POST" })
          .then(() => (window.location.href = "/"))
          .catch((err) => console.error("Logout error:", err));
      }
    });
  });

  console.log("Buttons initialized successfully");
}

// Initialize forms with proper validation
function initializeForms() {
  console.log("Initializing forms...");

  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      // Basic form validation
      const requiredFields = this.querySelectorAll("[required]");
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("is-invalid");
        } else {
          field.classList.remove("is-invalid");
        }
      });

      if (!isValid) {
        e.preventDefault();
        if (typeof showErrorAlert === "function") {
          showErrorAlert("Please fill in all required fields");
        } else {
          alert("Please fill in all required fields");
        }
      }
    });
  });

  console.log("Forms initialized successfully");
}

// Initialize navigation
function initializeNavigation() {
  console.log("Initializing navigation...");

  // Handle dropdown menus
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle, .nav-link");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        menu.classList.toggle("show");
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
        menu.classList.remove("show");
      });
    }
  });

  console.log("Navigation initialized successfully");
}

// Initialize AOS only if it exists
if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 1200,
    once: true,
  });
}

function changeImages(category) {
  const images = {
    nature: [
      "imgs/img1.jpg",
      "imgs/img2.jpg",
      "imgs/img3.jpg",
      "imgs/img4.webp",
      "imgs/img5.jpg",
      "imgs/img6.webp",
      "imgs/img7.png",
      "imgs/img8.webp",
      "imgs/img9.webp",
    ],
    urban: [
      "imgs/p-1.jpg",
      "imgs/p-2.jpg",
      "imgs/p-3.avif",
      "imgs/p-4.avif",
      "imgs/p-5.jpg",
      "imgs/p-6.jpg",
      "imgs/p-7.jpg",
      "imgs/p-8.jpg",
      "imgs/p-9.jpg",
    ],
    abstract: [
      "imgs/t-1.avif",
      "imgs/t-2.avif",
      "imgs/t-3.avif",
      "imgs/t-4.avif",
      "imgs/t-5.avif",
      "imgs/t-6.avif",
      "imgs/t-7.avif",
      "imgs/t-8.avif",
      "imgs/t-9.avif",
    ],
    modern: [
      "imgs/r-1.jpg",
      "imgs/r-2.jpg",
      "imgs/r-3.jpg",
      "imgs/r-4.jpg",
      "imgs/r-5.jpg",
      "imgs/r-6.jpg",
      "imgs/r-7.jpg",
      "imgs/r-8.jpg",
      "imgs/r-9.jpg",
    ],
  };

  for (let i = 1; i <= 9; i++) {
    document.getElementById(`img${i}`).src = images[category][i - 1];
  }
}

function highlightStars(rating) {
  document.querySelectorAll(".star").forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

function showPopup() {
  popup.style.display = "block";
  overlay.style.display = "block";
}

function closePopup() {
  popup.style.display = "none";
  overlay.style.display = "none";
}
