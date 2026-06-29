/* ============================================================
   ISHANT SHARMA â€” PERSONAL BRAND SITE
   core.js â€” runs on every page: header, nav, Lenis, progress bar,
   back-to-top, magnetic buttons, active-link highlighting.
   Page-specific animation logic lives in each page's own script
   (home.js, about.js, etc) and reads window.SITE for shared state.
   ============================================================ */

window.SITE = (function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapAvailable = typeof window.gsap !== "undefined";

  let lenis = null;

  /* ----------------------------------------------------------
     LENIS SMOOTH SCROLL
  ---------------------------------------------------------- */
  function initLenis() {
    if (prefersReducedMotion || !window.Lenis) return;

    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    if (gsapAvailable && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  /* ----------------------------------------------------------
     HEADER scroll state + scroll progress + back-to-top
  ---------------------------------------------------------- */
  function initHeaderChrome() {
    const header = document.getElementById("header");
    const progressBar = document.getElementById("scrollProgressBar");
    const backToTop = document.getElementById("backToTop");
    if (!header) return;

    function update() {
      const y = window.scrollY || window.pageYOffset;
      header.classList.toggle("is-scrolled", y > 30);
      if (backToTop) backToTop.classList.toggle("is-visible", y > 700);
      if (progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = docHeight > 0 ? (y / docHeight) * 100 + "%" : "0%";
      }
    }

    if (gsapAvailable && window.ScrollTrigger) {
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: update });
    } else {
      window.addEventListener("scroll", update, { passive: true });
    }
    update();

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ----------------------------------------------------------
     MOBILE NAV
  ---------------------------------------------------------- */
  function initMobileNav() {
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const mobileNavClose = document.getElementById("mobileNavClose");
    if (!menuToggle || !mobileNav) return;

    function close() {
      menuToggle.classList.remove("is-open");
      mobileNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close button listener
    if (mobileNavClose) {
      mobileNavClose.addEventListener("click", close);
    }

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", close);
    });
  }

  /* ----------------------------------------------------------
     SMOOTH ANCHOR SCROLL (in-page hashes only; cross-page links
     are left to navigate normally)
  ---------------------------------------------------------- */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -16, duration: 1.2 });
        else target.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /* ----------------------------------------------------------
     ACTIVE NAV LINK â€” highlight current page in header + mobile nav
  ---------------------------------------------------------- */
  function initActiveNav() {
    const current = (document.body.getAttribute("data-page") || "").trim();
    if (!current) return;
    document.querySelectorAll(`.nav__link[data-page], .mobile-nav__link[data-page]`).forEach((link) => {
      if (link.getAttribute("data-page") === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ----------------------------------------------------------
     MAGNETIC BUTTONS â€” subtle pointer-follow on large CTAs
  ---------------------------------------------------------- */
  function initMagneticButtons() {
    if (prefersReducedMotion || !gsapAvailable) return;
    const targets = document.querySelectorAll("[data-magnetic]");
    if (!targets.length) return;

    targets.forEach((el) => {
      const strength = 18;
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, {
          x: (relX / rect.width) * strength,
          y: (relY / rect.height) * strength,
          duration: 0.4,
          ease: "power2.out",
        });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ----------------------------------------------------------
     FONT AWESOME ICONS - render all data-icon elements
  ---------------------------------------------------------- */
  function initSiteIcons() {
    const iconMap = {
      "arrow-right": "fa-arrow-right",
      "arrow-up-right": "fa-arrow-up-right-from-square",
      "shopping-cart": "fa-cart-shopping",
      "briefcase": "fa-briefcase",
      "heart-pulse": "fa-heart-pulse",
      "sparkles": "fa-wand-magic-sparkles",
      "building-2": "fa-building",
      "book": "fa-book-open",
      "utensils": "fa-utensils",
      "code": "fa-code",
      "globe": "fa-globe",
      "shopping-bag": "fa-bag-shopping",
      "zap": "fa-bolt",
      "activity": "fa-chart-line",
      "wrench": "fa-wrench",
      "plane": "fa-plane",
      "landmark": "fa-landmark"
    };

    document.querySelectorAll("[data-icon]").forEach((el) => {
      const name = el.getAttribute("data-icon");
      const faName = iconMap[name] || "fa-circle";
      el.innerHTML = '<i class="fa-solid ' + faName + '" aria-hidden="true"></i>';
    });
  }

  /* ----------------------------------------------------------
     RESUME VIEWER & DOWNLOADER
  ---------------------------------------------------------- */
  function initResumeViewer() {
    const resumeUrl = window.CONSTANTS?.RESUME_URL || "/img/resume/ishant-resume.jpg";
    
    // Find all resume action elements
    const resumeLinks = document.querySelectorAll("[data-action='view-resume'], [data-action='download-resume']");
    
    resumeLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const action = link.getAttribute("data-action");
        if (action === "view-resume") {
          openResumeViewer(resumeUrl);
        } else if (action === "download-resume") {
          downloadResume(resumeUrl);
        }
      });
    });
  }

  function openResumeViewer(resumeUrl) {
    let modal = document.getElementById("resumeViewerModal");
    
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "resumeViewerModal";
      modal.className = "resume-viewer-modal";
      modal.innerHTML = [
        '<div class="resume-viewer-modal__overlay"></div>',
        '<div class="resume-viewer-modal__content">',
        '  <div class="resume-viewer-modal__header">',
        '    <h2>My Resume</h2>',
        '    <button class="resume-viewer-modal__close" aria-label="Close resume viewer">×</button>',
        '  </div>',
        '  <div class="resume-viewer-modal__body">',
        '    <img id="resumeViewerImage" class="resume-viewer-modal__image" alt="Ishant Sharma Resume" loading="lazy">',
        '  </div>',
        '  <div class="resume-viewer-modal__footer">',
        '    <a id="resumeDownloadBtn" class="btn btn--primary" download>',
        '      <span>Download Resume</span>',
        '    </a>',
        '    <button class="resume-viewer-modal__close-btn btn btn--ghost">Close</button>',
        '  </div>',
        '</div>'
      ].join("\n");
      document.body.appendChild(modal);
    }

    const img = modal.querySelector("#resumeViewerImage");
    const downloadBtn = modal.querySelector("#resumeDownloadBtn");
    const closeBtn = modal.querySelector(".resume-viewer-modal__close");
    const closeBtnFooter = modal.querySelector(".resume-viewer-modal__close-btn");
    const overlay = modal.querySelector(".resume-viewer-modal__overlay");

    img.src = resumeUrl;
    downloadBtn.href = resumeUrl;
    
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    const close = () => {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    closeBtn.addEventListener("click", close);
    closeBtnFooter.addEventListener("click", close);
    overlay.addEventListener("click", close);
    
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        close();
      }
    }, { once: true });
  }

  function downloadResume(resumeUrl) {
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = true;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ----------------------------------------------------------
     INIT – shared across every page
  ---------------------------------------------------------- */
  function init() {
    initLenis();
    initHeaderChrome();
    initMobileNav();
    initAnchorScroll();
    initActiveNav();
    initMagneticButtons();
    initSiteIcons();
    initResumeViewer();

    if (gsapAvailable && window.ScrollTrigger) {
      window.addEventListener("load", () => ScrollTrigger.refresh());
    }
  }

  document.addEventListener("DOMContentLoaded", init);

  // Expose a small shared API for page-specific scripts.
  return {
    get lenis() { return lenis; },
    get gsapAvailable() { return gsapAvailable; },
    get prefersReducedMotion() { return prefersReducedMotion; },
    refreshIcons: initSiteIcons,
    openResumeViewer: function() { 
      openResumeViewer(window.CONSTANTS?.RESUME_URL || "/img/resume/ishant-resume.jpg"); 
    },
    downloadResume: function() { 
      downloadResume(window.CONSTANTS?.RESUME_URL || "/img/resume/ishant-resume.jpg"); 
    }
  };
})();
/* ============================================================
   HOME PAGE â€” hero reveal, parallax, counters, card stagger
   Depends on core.js having run (window.SITE) and GSAP/ScrollTrigger
   being loaded. Falls back to static (no animation) if GSAP is absent.
   ============================================================ */

(function () {
  "use strict";

  if (document.body.dataset.page !== "home") return;
  if (!window.SITE || !window.SITE.gsapAvailable) return; // core.js handles the no-GSAP fallback chrome
  if (typeof gsap === "undefined") return;

  const prefersReducedMotion = window.SITE.prefersReducedMotion;

  /* ----------------------------------------------------------
     INITIAL STATES
  ---------------------------------------------------------- */
  gsap.set(".hero__title .word", { y: "110%" });
  gsap.set(".badge.reveal-up, .hero__subtitle, .hero__actions", { opacity: 0, y: 24 });
  gsap.set(".hero__stat", { opacity: 0, y: 20 });

  document.querySelectorAll(".reveal-up").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.set(el, { opacity: 0, y: 32 });
  });

  document.querySelectorAll("[data-card]").forEach((card) => {
    gsap.set(card, { opacity: 0, y: 48 });
  });

  /* ----------------------------------------------------------
     HERO timeline
  ---------------------------------------------------------- */
  const heroTl = gsap.timeline({ delay: 0.15 });

  heroTl
    .to(".hero__title .word", { y: "0%", duration: 1.1, ease: "power3.out", stagger: 0.045 })
    .to(".badge.reveal-up", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)
    .to(".hero__subtitle", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.45)
    .to(".hero__actions", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.6)
    .to(".hero__stat", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0.8);

  // Underline sweep on highlighted hero words
  document.querySelectorAll(".hero__title .word.hl").forEach((word, i) => {
    const underline = document.createElement("span");
    underline.className = "word__underline";
    underline.setAttribute("aria-hidden", "true");
    word.appendChild(underline);
    gsap.fromTo(underline, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.out", delay: 1.0 + i * 0.12 });
  });

  /* ----------------------------------------------------------
     Hero parallax (grid + glow) on scroll
  ---------------------------------------------------------- */
  if (window.ScrollTrigger) {
    gsap.to(".hero__grid", {
      yPercent: 16,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero__glow", {
      yPercent: 26,
      xPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  /* ----------------------------------------------------------
     Counters
  ---------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const counter = { val: 0 };
    gsap.to(counter, {
      val: target,
      duration: 1.6,
      ease: "power2.out",
      delay: 1.0,
      onUpdate: () => { el.textContent = Math.floor(counter.val) + suffix; },
    });
  }
  document.querySelectorAll(".hero__stat [data-count]").forEach(animateCounter);

  /* ----------------------------------------------------------
     Generic reveal-up (everything below the hero)
  ---------------------------------------------------------- */
  document.querySelectorAll(".reveal-up").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
    });
  });

  /* ----------------------------------------------------------
     Card grids stagger (featured projects, why-cards)
  ---------------------------------------------------------- */
  [".featured__grid", ".why-grid"].forEach((selector) => {
    const grid = document.querySelector(selector);
    if (!grid) return;
    const cards = grid.querySelectorAll("[data-card]");
    gsap.to(cards, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: grid, start: "top 82%", toggleActions: "play none none none" },
    });
  });
})();
/* ============================================================
   PAGE REVEAL â€” shared scroll-reveal logic for non-home pages
   (About, Experience, Services, Projects, Contact, Project Single)
   Handles: page-head fade-in, .reveal-up, [data-card] stagger,
   [data-count] counters, [data-tl] timeline items.
   Depends on core.js (window.SITE) + GSAP/ScrollTrigger.
   ============================================================ */

(function () {
  "use strict";

  if (document.body.dataset.page === "home") return;
  if (!window.SITE || !window.SITE.gsapAvailable) return;
  if (typeof gsap === "undefined") return;

  /* ----------------------------------------------------------
     INITIAL STATES
  ---------------------------------------------------------- */
  gsap.set(".page-head__crumbs, .page-head__title, .page-head__sub", { opacity: 0, y: 24 });

  document.querySelectorAll(".reveal-up").forEach((el) => {
    if (el.closest(".page-head")) return;
    if (el.closest(".section-head")) return; // handled by the .section-head block below
    gsap.set(el, { opacity: 0, y: 32 });
  });

  document.querySelectorAll("[data-card]").forEach((card) => {
    gsap.set(card, { opacity: 0, y: 48 });
  });

  document.querySelectorAll("[data-tl]").forEach((item) => {
    const fromLeft = item.classList.contains("tl-item--left");
    const fromRight = item.classList.contains("tl-item--right");
    const card = item.querySelector("[data-tl-card]") || item;
    if (fromLeft) gsap.set(card, { opacity: 0, x: -50 });
    else if (fromRight) gsap.set(card, { opacity: 0, x: 50 });
    else gsap.set(card, { opacity: 0, y: 40 });

    const dot = item.querySelector("[data-tl-dot]");
    if (dot) gsap.set(dot, { opacity: 0, scale: 0 });
  });

  /* ----------------------------------------------------------
     PAGE HEAD reveal (runs immediately, not scroll-triggered)
  ---------------------------------------------------------- */
  gsap.timeline({ delay: 0.1 })
    .to(".page-head__crumbs", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)
    .to(".page-head__title", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.1)
    .to(".page-head__sub", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.25);

  /* ----------------------------------------------------------
     GENERIC REVEAL-UP
  ---------------------------------------------------------- */
  document.querySelectorAll(".reveal-up").forEach((el) => {
    if (el.closest(".page-head")) return;
    if (el.closest(".section-head")) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
    });
  });

  /* ----------------------------------------------------------
     SECTION HEAD (eyebrow + title together)
  ---------------------------------------------------------- */
  document.querySelectorAll(".section-head").forEach((head) => {
    const items = head.querySelectorAll(".eyebrow, .section-title, .section-sub");
    gsap.set(items, { opacity: 0, y: 26 });
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: head, start: "top 85%", toggleActions: "play none none none" },
    });
  });

  /* ----------------------------------------------------------
     CARD GRIDS â€” stagger by shared container
  ---------------------------------------------------------- */
  document.querySelectorAll("[data-card-group]").forEach((grid) => {
    const cards = grid.querySelectorAll("[data-card]");
    gsap.to(cards, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: grid, start: "top 82%", toggleActions: "play none none none" },
    });
  });

  // Cards with no declared group (e.g. a loose list) animate individually
  document.querySelectorAll("[data-card]:not([data-card-group] [data-card])").forEach((card) => {
    if (card.closest("[data-card-group]")) return;
    gsap.to(card, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
    });
  });

  /* ----------------------------------------------------------
     COUNTERS
  ---------------------------------------------------------- */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const counter = { val: 0 };
    gsap.to(counter, {
      val: target, duration: 1.6, ease: "power2.out",
      onUpdate: () => { el.textContent = Math.floor(counter.val) + suffix; },
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
    });
  });

  /* ----------------------------------------------------------
     TIMELINE items ([data-tl]) â€” alternating or stacked reveal
  ---------------------------------------------------------- */
  document.querySelectorAll("[data-tl]").forEach((item) => {
    const card = item.querySelector("[data-tl-card]") || item;
    const dot = item.querySelector("[data-tl-dot]");

    const tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: "top 80%", toggleActions: "play none none none" },
    });
    if (dot) tl.to(dot, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" });
    tl.to(card, { opacity: 1, x: 0, y: 0, duration: 0.9, ease: "power3.out" }, dot ? "-=0.25" : 0);
  });

  /* ----------------------------------------------------------
     Timeline vertical progress line ([data-tl-line] wraps a
     [data-tl-fill] span that grows with scroll)
  ---------------------------------------------------------- */
  document.querySelectorAll("[data-tl-line]").forEach((line) => {
    const fill = line.querySelector("[data-tl-fill]");
    const wrapper = line.closest("[data-tl-wrap]") || line;
    if (!fill) return;
    gsap.to(fill, {
      height: "100%",
      ease: "none",
      scrollTrigger: { trigger: wrapper, start: "top 70%", end: "bottom 80%", scrub: 0.6 },
    });
  });
})();
/* ============================================================
   CONTACT PAGE â€” form validation + mailto fallback
   No backend exists for this static site, so the form validates
   client-side and then opens a pre-filled mailto: link. This is
   clearly disclosed to the user via the note under the submit
   button rather than silently pretending to "send" the message.
   ============================================================ */

(function () {
  "use strict";

  const form = document.getElementById("contactForm");
  if (!form) return;

  const note = document.getElementById("formNote");
  const DESTINATION_EMAIL = "ishantsantoshsharma@gmail.com";

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setFieldError(field, hasError) {
    const wrapper = field.closest(".form-field");
    if (!wrapper) return;
    wrapper.classList.toggle("has-error", hasError);
  }

  function validate() {
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");

    let valid = true;

    if (!name.value.trim()) {
      setFieldError(name, true);
      valid = false;
    } else {
      setFieldError(name, false);
    }

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      setFieldError(email, true);
      valid = false;
    } else {
      setFieldError(email, false);
    }

    if (!message.value.trim()) {
      setFieldError(message, true);
      valid = false;
    } else {
      setFieldError(message, false);
    }

    return valid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validate()) {
      if (note) {
        note.textContent = "Please fill in the highlighted fields before sending.";
        note.classList.remove("contact-form__note--success");
      }
      return;
    }

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const projectType = form.querySelector("#projectType").value;
    const message = form.querySelector("#message").value.trim();

    const subject = `New inquiry: ${projectType} â€” from ${name}`;
    const body =
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Type: ${projectType}\n\n` +
      `${message}`;

    const mailtoUrl =
      `mailto:${DESTINATION_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    if (note) {
      note.textContent = "Opening your email client with this message pre-filledâ€¦";
      note.classList.add("contact-form__note--success");
    }
  });

  // Clear individual field errors as the person corrects them.
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      const wrapper = field.closest(".form-field");
      if (wrapper && wrapper.classList.contains("has-error")) {
        if (field.type === "email") {
          if (isValidEmail(field.value.trim())) setFieldError(field, false);
        } else if (field.value.trim()) {
          setFieldError(field, false);
        }
      }
    });
  });
})();

/* ============================================================
   SCROLL CUE â€" Make the scroll indicator button clickable
   Scrolls to the next section below the hero
   ============================================================ */
(function () {
  "use strict";
  const scrollCue = document.getElementById("scrollCue");
  if (!scrollCue) return;

  scrollCue.addEventListener("click", () => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const nextSection = hero.nextElementSibling;
    if (!nextSection) return;

    if (window.SITE && window.SITE.lenis) {
      window.SITE.lenis.scrollTo(nextSection, { offset: -16, duration: 1.2 });
    } else {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  });
})();

/* ============================================================
   WHATSAPP INTEGRATION — Convert all phone number links to WhatsApp
   Finds all [data-whatsapp] elements and phone links, converts them
   to WhatsApp links with pre-filled message
   ============================================================ */
(function () {
  "use strict";

  if (!window.CONSTANTS || !window.CONSTANTS.CONTACT) return;

  const WHATSAPP_LINK = window.CONSTANTS.CONTACT.whatsappMessage;
  const PHONE_TEXT = window.CONSTANTS.CONTACT.phone;

  // Convert all [data-whatsapp] elements to WhatsApp links
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.href = WHATSAPP_LINK;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.classList.add("whatsapp-link");
  });

  // Replace all tel: phone links with WhatsApp
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    const text = link.textContent.trim();
    // Check if this is our phone number
    if (text.includes("97204") || text.includes("9720435032")) {
      link.href = WHATSAPP_LINK;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.classList.add("whatsapp-link");
    }
  });

  // Add WhatsApp icon to phone number links
  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    // Check if it doesn't already have an icon
    if (!link.querySelector("[data-lucide='message-circle']")) {
      const iconSpan = document.createElement("span");
      iconSpan.className = "whatsapp-icon";
      iconSpan.setAttribute("data-lucide", "message-circle");
      iconSpan.setAttribute("aria-hidden", "true");
      link.insertAdjacentElement("beforeend", iconSpan);
    }
  });

  // Refresh Lucide icons after adding them
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
})();
