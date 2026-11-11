
document.addEventListener("DOMContentLoaded", () => {
  const pageLoader = document.getElementById("pageLoader");
  const header = document.getElementById("siteHeader");
  const scrollProgress = document.getElementById("scrollProgress");

  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");

  const enquiryForm = document.getElementById("enquiryForm");
  const submitButton = document.getElementById("submitButton");
  const formFeedback = document.getElementById("formFeedback");

  /* PAGE LOADER */

  const hideLoader = () => {
    if (pageLoader) {
      pageLoader.classList.add("loaded");
    }
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }

  // Fallback for slow image loading.
  window.setTimeout(hideLoader, 2500);

  /* MOBILE NAVIGATION */

  function closeMenu() {
    if (!menuToggle || !primaryNav) return;

    menuToggle.classList.remove("active");
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("is-open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      document.body.classList.toggle("menu-open", isOpen);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        primaryNav.classList.contains("is-open") &&
        !primaryNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        closeMenu();
      }
    });
  }

  /* SCROLL EFFECTS */

  function handleScroll() {
    const scrollTop = window.scrollY;
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (header) {
      header.classList.toggle("scrolled", scrollTop > 40);
    }

    if (scrollProgress) {
      const progress =
        scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

      scrollProgress.style.width = `${progress}%`;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* REVEAL ANIMATIONS */

  const revealElements = document.querySelectorAll(".reveal");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ANIMATED IMPACT COUNTERS */

  const counters = document.querySelectorAll(".counter");
  let countersStarted = false;

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target) || target < 0) return;

    const duration = 1600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out animation.
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(target * easedProgress);

      counter.textContent = currentValue.toLocaleString("en-IN");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString("en-IN");
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const impactSection = document.getElementById("impact");

  if (impactSection && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;

            counters.forEach((counter) => {
              animateCounter(counter);
            });

            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    counterObserver.observe(impactSection);
  } else {
    counters.forEach((counter) => {
      counter.textContent = Number(counter.dataset.target).toLocaleString("en-IN");
    });
  }

  /* ACTIVE NAVIGATION */

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  const navLinks = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* ENQUIRY FORM */

  if (enquiryForm && submitButton) {
    enquiryForm.addEventListener("submit", (event) => {
      if (!enquiryForm.checkValidity()) {
        event.preventDefault();
        enquiryForm.reportValidity();
        return;
      }

      const originalButtonHTML = submitButton.innerHTML;

      submitButton.disabled = true;
      submitButton.innerHTML =
        '<span>Sending enquiry...</span><i class="fa-solid fa-spinner fa-spin"></i>';

      if (formFeedback) {
        formFeedback.textContent = "Please wait while your enquiry is submitted.";
        formFeedback.classList.add("visible");
      }

      // The browser continues with the normal Netlify form POST.
      // Restore the button if navigation is prevented by the environment.
      window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonHTML;
        }
      }, 10000);
    });
  }

  /* COPYRIGHT YEAR */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});


const donationOptions = document.querySelectorAll(
  'input[name="donation_amount"]'
);

const customAmount = document.getElementById("customAmount");

donationOptions.forEach((option) => {
  option.addEventListener("change", function () {
    const isCustom = this.value === "Custom";

    customAmount.hidden = !isCustom;
    customAmount.required = isCustom;

    if (!isCustom) {
      customAmount.value = "";
    }
  });
});

