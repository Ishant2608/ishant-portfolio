/* ============================================================
   ISHANT SHARMA — PORTFOLIO
   GSAP + ScrollTrigger + Lenis
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapAvailable = typeof window.gsap !== "undefined";

  if (!gsapAvailable) {
    // GSAP failed to load (e.g. CDN blocked). Fall back to a lightweight
    // experience: basic nav/menu/contact interactivity still works,
    // scroll-reveal animations are simply skipped (content stays visible).
    initBasicInteractivity();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------
     INITIAL STATES — set before any animation timeline is built
     so there is never a flash of unstyled / wrongly-positioned content.
  ---------------------------------------------------------- */
  gsap.set(".hero__title .word", { y: "110%" });
  gsap.set(".eyebrow.reveal-up, .hero__subtitle, .hero__actions", { opacity: 0, y: 24 });
  gsap.set(".hero__right .dev-card", { opacity: 0, y: 40, scale: 0.96 });
  gsap.set(".hero__badge", { opacity: 0, scale: 0.8 });

  document.querySelectorAll(".reveal-up").forEach((el) => {
    if (el.closest(".hero")) return; // hero items set individually above
    gsap.set(el, { opacity: 0, y: 32 });
  });

  document.querySelectorAll(".section-head").forEach((head) => {
    gsap.set(head.querySelectorAll(".section-eyebrow, .section-title"), { opacity: 0, y: 28 });
  });

  document.querySelectorAll(".services__grid [data-card], .why__grid [data-card]").forEach((card) => {
    gsap.set(card, { opacity: 0, y: 56 });
  });

  document.querySelectorAll(".project-card[data-card]").forEach((card) => {
    gsap.set(card, { opacity: 0, y: 64 });
  });

  document.querySelectorAll(".skills__group .pill").forEach((pill) => {
    gsap.set(pill, { opacity: 0, y: 16, scale: 0.92 });
  });

  document.querySelectorAll(".timeline__item").forEach((item) => {
    gsap.set(item.querySelector(".timeline__card"), {
      opacity: 0,
      x: item.classList.contains("timeline__item--left") ? -50 : 50,
    });
    gsap.set(item.querySelector(".timeline__dot"), { opacity: 0, scale: 0 });
  });

  /* ----------------------------------------------------------
     LENIS SMOOTH SCROLL
  ---------------------------------------------------------- */
  let lenis;
  if (!prefersReducedMotion && window.Lenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ----------------------------------------------------------
     HEADER: scrolled state + scroll progress bar
  ---------------------------------------------------------- */
  const header = document.getElementById("header");
  const progressBar = document.getElementById("scrollProgressBar");
  const backToTop = document.getElementById("backToTop");

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      header.classList.toggle("is-scrolled", self.scroll() > 40);
      progressBar.style.width = self.progress * 100 + "%";
      backToTop.classList.toggle("is-visible", self.scroll() > 700);
    },
  });

  /* ----------------------------------------------------------
     MOBILE NAV
  ---------------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
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

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  /* ----------------------------------------------------------
     SMOOTH ANCHOR SCROLL (works with Lenis or native fallback)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -16, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  backToTop.addEventListener("click", () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ----------------------------------------------------------
     HERO — text reveal (words sliding upward) + stagger
  ---------------------------------------------------------- */
  const heroTl = gsap.timeline({ delay: 0.2 });

  heroTl
    .to(".hero__title .word", {
      y: "0%",
      duration: 1.1,
      ease: "power3.out",
      stagger: 0.045,
    })
    .to(
      ".eyebrow.reveal-up",
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0
    )
    .to(
      ".hero__subtitle",
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      0.5
    )
    .to(
      ".hero__actions",
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      0.65
    )
    .fromTo(
      ".hero__right .dev-card",
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out" },
      0.4
    )
    .fromTo(
      ".hero__badge",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out", stagger: 0.12 },
      0.8
    );

  // Blue underline sweep on highlighted words — built as a real
  // absolutely-positioned span so GSAP can animate its scale directly.
  document.querySelectorAll(".hero__title .word.hl").forEach((word, i) => {
    const underline = document.createElement("span");
    underline.className = "word__underline";
    underline.setAttribute("aria-hidden", "true");
    word.appendChild(underline);

    gsap.fromTo(
      underline,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 1.05 + i * 0.12,
      }
    );
  });

  /* ----------------------------------------------------------
     HERO floating animation for dev card + badges (ambient)
  ---------------------------------------------------------- */
  if (!prefersReducedMotion) {
    gsap.to("#devCard", {
      y: -14,
      duration: 3.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.6,
    });
    gsap.to(".hero__badge--1", {
      y: -10,
      x: 4,
      duration: 2.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.8,
    });
    gsap.to(".hero__badge--2", {
      y: 12,
      x: -4,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 2,
    });
    gsap.to(".hero__badge--3", {
      y: -8,
      x: 6,
      duration: 2.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.9,
    });
  }

  /* ----------------------------------------------------------
     HERO grid parallax on scroll
  ---------------------------------------------------------- */
  gsap.to(".hero__grid", {
    yPercent: 18,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  gsap.to(".hero__glow", {
    yPercent: 30,
    xPercent: -10,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  /* ----------------------------------------------------------
     GENERIC REVEAL-UP elements (fade + slide on scroll)
  ---------------------------------------------------------- */
  document.querySelectorAll(".reveal-up").forEach((el) => {
    // skip hero items — already controlled by heroTl above
    if (el.closest(".hero")) return;

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ----------------------------------------------------------
     SECTION HEAD fade-in (eyebrow + title together, slight stagger)
  ---------------------------------------------------------- */
  document.querySelectorAll(".section-head").forEach((head) => {
    const items = head.querySelectorAll(".section-eyebrow, .section-title");
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: head,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ----------------------------------------------------------
     CARDS — stagger upward animation (services, why)
  ---------------------------------------------------------- */
  const cardGroups = [".services__grid", ".why__grid"];
  cardGroups.forEach((selector) => {
    const grid = document.querySelector(selector);
    if (!grid) return;
    const cards = grid.querySelectorAll("[data-card]");
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: grid,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });
  });

  // Project cards animate individually (vertical list, not a grid)
  document.querySelectorAll(".project-card[data-card]").forEach((card) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ----------------------------------------------------------
     ABOUT — stat counters (animate numbers on scroll)
  ---------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const counter = { val: 0 };

    gsap.to(counter, {
      val: target,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.floor(counter.val) + suffix;
      },
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  }

  document.querySelectorAll("[data-count]").forEach(animateCounter);

  /* ----------------------------------------------------------
     SKILLS — pills stagger in
  ---------------------------------------------------------- */
  document.querySelectorAll(".skills__group").forEach((group) => {
    const pills = group.querySelectorAll(".pill");
    gsap.to(pills, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.04,
      scrollTrigger: {
        trigger: group,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ----------------------------------------------------------
     TIMELINE — alternating side reveal + progress line
  ---------------------------------------------------------- */
  document.querySelectorAll(".timeline__item").forEach((item) => {
    const card = item.querySelector(".timeline__card");
    const dot = item.querySelector(".timeline__dot");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    tl.to(dot, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }).to(
      card,
      { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" },
      "-=0.25"
    );
  });

  // Timeline vertical progress fill
  const timelineEl = document.getElementById("timeline");
  const timelineProgress = document.getElementById("timelineProgress");
  if (timelineEl && timelineProgress) {
    gsap.to(timelineProgress, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: timelineEl,
        start: "top 70%",
        end: "bottom 80%",
        scrub: 0.6,
      },
    });
  }

  /* ----------------------------------------------------------
     TRUST marquee — pause on hover
  ---------------------------------------------------------- */
  const trustTrack = document.getElementById("trustTrack");
  if (trustTrack) {
    trustTrack.addEventListener("mouseenter", () => {
      trustTrack.style.animationPlayState = "paused";
    });
    trustTrack.addEventListener("mouseleave", () => {
      trustTrack.style.animationPlayState = "running";
    });
  }

  /* ----------------------------------------------------------
     CONTACT — slight parallax glow
  ---------------------------------------------------------- */
  gsap.to(".contact__glow", {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: ".contact",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  /* ----------------------------------------------------------
     Refresh ScrollTrigger after fonts/images settle
  ---------------------------------------------------------- */
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  /* ----------------------------------------------------------
     Trust marquee CSS keyframes already handle the motion;
     nothing further needed here for the GSAP-available path.
  ---------------------------------------------------------- */

  function initBasicInteractivity() {
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const backToTop = document.getElementById("backToTop");
    const progressBar = document.getElementById("scrollProgressBar");

    function onScroll() {
      const y = window.scrollY || window.pageYOffset;
      header.classList.toggle("is-scrolled", y > 40);
      backToTop.classList.toggle("is-visible", y > 700);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = docHeight > 0 ? (y / docHeight) * 100 + "%" : "0%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Animate stat counters without GSAP using a simple rAF-based tween,
    // triggered once each element enters the viewport.
    const counters = document.querySelectorAll("[data-count]");
    const seen = new WeakSet();
    function checkCounters() {
      counters.forEach((el) => {
        if (seen.has(el)) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          seen.add(el);
          const target = parseInt(el.getAttribute("data-count"), 10);
          const suffix = el.getAttribute("data-suffix") || "";
          const start = performance.now();
          const duration = 1200;
          function tick(now) {
            const progress = Math.min(1, (now - start) / duration);
            el.textContent = Math.floor(progress * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    }
    window.addEventListener("scroll", checkCounters, { passive: true });
    checkCounters();
  }
})();
