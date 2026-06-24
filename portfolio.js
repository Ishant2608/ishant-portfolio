(function () {
  "use strict";

  const DATA = window.PORTFOLIO_DATA;
  if (!DATA || !Array.isArray(DATA.projects) || !DATA.projects.length) return;

  const FALLBACK_IMAGE = "img/crm-dashboards/admin-board.png";
  const CATEGORY_ALIASES = {
    All: "All",
    "All Projects": "All",
    "API Integrations": "API Integration",
    "Admin Dashboards": "Dashboard"
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeCategory(value) {
    const label = String(value || "").trim();
    return CATEGORY_ALIASES[label] || label;
  }

  function refreshIcons() {
    if (window.SITE && typeof window.SITE.refreshIcons === "function") {
      window.SITE.refreshIcons();
    }
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function projectImage(project) {
    return project.thumbnail || project.heroImage || FALLBACK_IMAGE;
  }

  function getScreens(project) {
    const gallery = Array.isArray(project.galleryImages) ? project.galleryImages.slice(0, 5) : [];
    if (gallery.length) return gallery;
    const base = projectImage(project);
    return [
      { title: "Homepage", src: base },
      { title: "Dashboard", src: base },
      { title: "Checkout", src: base },
      { title: "Mobile View", src: base }
    ];
  }

  function uniqueCategories() {
    const categories = (DATA.categories && Array.isArray(DATA.categories)) ? DATA.categories : [];
    return categories.length ? categories : ['All'];
  }

  function matchesCategory(project, category) {
    if (category === "All") return true;
    const normalized = (project.categories || []).map(normalizeCategory);
    return normalized.includes(category);
  }

  function matchesSearch(project, query) {
    if (!query) return true;
    const haystack = [
      project.title,
      project.description,
      project.industry,
      project.projectType,
      (project.categories || []).map(normalizeCategory).join(" "),
      (project.technologies || []).join(" ")
    ].join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase());
  }

  function statusLabel(project) {
    if (project.liveUrl) return "Live";
    return "Completed";
  }

  function firstRole(project) {
    return (project.myRole && project.myRole[0]) || "Full Stack Development";
  }

  function cardTemplate(project, index) {
    const screens = getScreens(project);
    const primary = screens[0] || { title: "Preview", src: projectImage(project) };
    const tech = (project.technologies || []).slice(0, 5).map((item) => '<span class="tag">' + escapeHtml(item) + '</span>').join("");
    const shortDesc = project.description.length > 85 ? project.description.slice(0, 82) + '...' : project.description;

    const triggerHtml = screens.map((screen, i) => 
      '<button type="button" class="portfolio-gallery-trigger ' + (i === 0 ? 'is-primary' : '') + '" data-lightbox-group="' + escapeHtml(project.slug) + '" data-lightbox-index="' + i + '" data-lightbox-src="' + escapeHtml(screen.src) + '" data-lightbox-title="' + escapeHtml(screen.title || ('Screenshot ' + (i + 1))) + '" aria-label="View screenshot ' + (i + 1) + '" style="display:none;"></button>'
    ).join('');

    return [
      '<article class="portfolio-card-grid ' + (project.featuredProject ? 'portfolio-card-grid--featured' : '') + ' reveal-up" data-card tabindex="0" data-project-link="project-single.html?slug=' + encodeURIComponent(project.slug) + '">',
      '  <button type="button" class="portfolio-card-grid__image" data-lightbox-group="' + escapeHtml(project.slug) + '" data-lightbox-index="0" aria-label="Open screenshot gallery">',
      '    <span class="portfolio-card-grid__frame"></span>',
      '    <img src="' + escapeHtml(primary.src) + '" alt="' + escapeHtml(project.title) + '" loading="lazy" decoding="async">',
      '  </button>',
      triggerHtml,
      '  <div class="portfolio-card-grid__body">',
      '    <div class="portfolio-card-grid__head">',
      '      <h2 class="portfolio-card-grid__title">' + escapeHtml(project.title) + '</h2>',
      project.featuredProject ? '      <span class="portfolio-badge portfolio-badge--featured">Featured</span>' : '',
      '    </div>',
      '    <p class="portfolio-card-grid__category">' + escapeHtml((project.categories && project.categories[0]) || project.projectType) + '</p>',
      '    <p class="portfolio-card-grid__desc">' + escapeHtml(shortDesc) + '</p>',
      '    <div class="portfolio-card-grid__tech">' + tech + '</div>',
      '    <div class="portfolio-card-grid__actions">',
      '      <a href="project-single.html?slug=' + encodeURIComponent(project.slug) + '" class="btn btn--primary btn--small btn--full"><span>View Case Study</span></a>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join("\n");
  }

  function initCardInteractions(root) {
    const cards = root.querySelectorAll('.portfolio-card-grid');

    cards.forEach((card) => {
      card.addEventListener('click', (event) => {
        const ignore = event.target.closest('a, button');
        if (ignore) return;
        const href = card.getAttribute('data-project-link');
        if (href) window.location.href = href;
      });

      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const href = card.getAttribute('data-project-link');
          if (href) window.location.href = href;
        }
      });
    });
  }

  function initProjectsPage() {
    if (!/projects\.html$/i.test(window.location.pathname)) return;

    const root = document.getElementById('projectsDynamicRoot');
    if (!root) return;

    const state = { category: 'All', query: '' };
    const categories = uniqueCategories();

    const featuredFirst = DATA.projects.slice().sort((a, b) => {
      if (a.featuredProject === b.featuredProject) return 0;
      return a.featuredProject ? -1 : 1;
    });

    root.innerHTML = [
      '<div class="portfolio-intro reveal-up">',
      '  <p class="portfolio-intro__text">A selection of work showcasing modern design, clean code, and full-stack development across WordPress, Shopify, CRM systems, and custom solutions.</p>',
      '</div>',
      '<div class="portfolio-controls reveal-up">',
      '  <div class="portfolio-filter" id="portfolioFilter" role="tablist" aria-label="Project categories"></div>',
      '  <label class="portfolio-search" for="portfolioSearch">',
      '    <i data-lucide="search" aria-hidden="true"></i>',
      '    <input id="portfolioSearch" type="search" placeholder="Search projects...">',
      '  </label>',
      '</div>',
      '<div class="portfolio-grid" id="portfolioGrid" data-card-group></div>'
    ].join('\n');

    const filterRoot = document.getElementById('portfolioFilter');
    const search = document.getElementById('portfolioSearch');
    const grid = document.getElementById('portfolioGrid');

    function renderGrid() {
      const filtered = featuredFirst
        .filter((project) => matchesCategory(project, state.category))
        .filter((project) => matchesSearch(project, state.query));

      if (!filtered.length) {
        grid.innerHTML = '<div class="portfolio-empty"><p>No projects found for this filter. Try another selection.</p></div>';
        refreshIcons();
        return;
      }

      grid.classList.add('is-updating');
      window.setTimeout(() => {
        grid.innerHTML = filtered.map((project, index) => cardTemplate(project, index)).join('\n');
        initCardInteractions(grid);
        initLightbox(grid);
        refreshIcons();
        grid.classList.remove('is-updating');
      }, 120);
    }

    categories.forEach((category) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'portfolio-filter__btn' + (category === state.category ? ' is-active' : '');
      btn.textContent = category;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', category === state.category ? 'true' : 'false');
      btn.addEventListener('click', () => {
        state.category = category;
        Array.from(filterRoot.children).forEach((child) => {
          const active = child.textContent === category;
          child.classList.toggle('is-active', active);
          child.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        renderGrid();
      });
      filterRoot.appendChild(btn);
    });

    search.addEventListener('input', () => {
      state.query = search.value.trim();
      renderGrid();
    });

    renderGrid();
  }

  function initLightbox(scope) {
    const triggers = scope.querySelectorAll('[data-lightbox-group][data-lightbox-index]');
    if (!triggers.length) return;

    // Populate trigger elements with gallery data
    triggers.forEach((trigger) => {
      const card = trigger.closest('.portfolio-card-grid');
      if (!card) return;
      
      const slug = trigger.getAttribute('data-lightbox-group');
      const project = DATA.projects.find((p) => p.slug === slug);
      if (!project) return;

      const screens = getScreens(project);
      const card_triggers = card.querySelectorAll('[data-lightbox-group="' + slug + '"]');
      
      card_triggers.forEach((t, i) => {
        if (i < screens.length) {
          t.setAttribute('data-lightbox-src', screens[i].src);
          t.setAttribute('data-lightbox-title', screens[i].title || ('Screenshot ' + (i + 1)));
        }
      });
    });

    let lightbox = document.getElementById('portfolioLightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'portfolioLightbox';
      lightbox.className = 'portfolio-lightbox';
      lightbox.innerHTML = [
        '<button type="button" class="portfolio-lightbox__close" aria-label="Close image viewer"><i data-lucide="x" aria-hidden="true"></i></button>',
        '<button type="button" class="portfolio-lightbox__nav portfolio-lightbox__nav--prev" aria-label="Previous image"><i data-lucide="chevron-left" aria-hidden="true"></i></button>',
        '<div class="portfolio-lightbox__viewport">',
        '  <img class="portfolio-lightbox__img" alt="Project screenshot preview">',
        '</div>',
        '<button type="button" class="portfolio-lightbox__nav portfolio-lightbox__nav--next" aria-label="Next image"><i data-lucide="chevron-right" aria-hidden="true"></i></button>',
        '<p class="portfolio-lightbox__title"></p>'
      ].join('\n');
      document.body.appendChild(lightbox);
    }

    const viewport = lightbox.querySelector('.portfolio-lightbox__viewport');
    const image = lightbox.querySelector('.portfolio-lightbox__img');
    const title = lightbox.querySelector('.portfolio-lightbox__title');
    const closeBtn = lightbox.querySelector('.portfolio-lightbox__close');
    const prevBtn = lightbox.querySelector('.portfolio-lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.portfolio-lightbox__nav--next');

    let currentGroup = [];
    let currentIndex = 0;
    let scale = 1;
    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let startX = 0;
    let startY = 0;

    function applyTransform() {
      if (!image) return;
      image.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
      image.style.cursor = scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in';
    }

    function resetTransform() {
      scale = 1;
      panX = 0;
      panY = 0;
      applyTransform();
    }

    function openAt(index) {
      if (!currentGroup.length) return;
      currentIndex = (index + currentGroup.length) % currentGroup.length;
      const item = currentGroup[currentIndex];
      const src = item.getAttribute('data-lightbox-src') || '';
      const caption = item.getAttribute('data-lightbox-title') || 'Screenshot';

      image.src = src;
      title.textContent = caption;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      resetTransform();
      refreshIcons();
    }

    function close() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      resetTransform();
    }

    function setGroupAndOpen(trigger) {
      const groupName = trigger.getAttribute('data-lightbox-group') || '';
      currentGroup = Array.from(document.querySelectorAll('[data-lightbox-group="' + groupName + '"]'));
      if (!currentGroup.length) currentGroup = [trigger];

      const explicitIndex = Number(trigger.getAttribute('data-lightbox-index'));
      const index = Number.isFinite(explicitIndex) ? explicitIndex : currentGroup.indexOf(trigger);
      openAt(index >= 0 ? index : 0);
    }

    triggers.forEach((trigger) => {
      if (trigger.getAttribute('data-lightbox-bound') === 'true') return;
      trigger.setAttribute('data-lightbox-bound', 'true');
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        setGroupAndOpen(trigger);
      });
    });

    if (closeBtn && closeBtn.getAttribute('data-lightbox-bound') !== 'true') {
      closeBtn.setAttribute('data-lightbox-bound', 'true');
      closeBtn.addEventListener('click', close);
    }

    if (prevBtn && prevBtn.getAttribute('data-lightbox-bound') !== 'true') {
      prevBtn.setAttribute('data-lightbox-bound', 'true');
      prevBtn.addEventListener('click', () => openAt(currentIndex - 1));
    }

    if (nextBtn && nextBtn.getAttribute('data-lightbox-bound') !== 'true') {
      nextBtn.setAttribute('data-lightbox-bound', 'true');
      nextBtn.addEventListener('click', () => openAt(currentIndex + 1));
    }

    if (lightbox.getAttribute('data-lightbox-bound') !== 'true') {
      lightbox.setAttribute('data-lightbox-bound', 'true');

      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) close();
      });

      document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (event.key === 'Escape') close();
        if (event.key === 'ArrowLeft') openAt(currentIndex - 1);
        if (event.key === 'ArrowRight') openAt(currentIndex + 1);
        if (event.key === '+') {
          scale = Math.min(4, scale + 0.2);
          applyTransform();
        }
        if (event.key === '-') {
          scale = Math.max(1, scale - 0.2);
          if (scale === 1) {
            panX = 0;
            panY = 0;
          }
          applyTransform();
        }
      });

      viewport.addEventListener('wheel', (event) => {
        if (!lightbox.classList.contains('is-open')) return;
        event.preventDefault();
        const delta = event.deltaY > 0 ? -0.18 : 0.18;
        scale = Math.min(4, Math.max(1, scale + delta));
        if (scale === 1) {
          panX = 0;
          panY = 0;
        }
        applyTransform();
      }, { passive: false });

      image.addEventListener('mousedown', (event) => {
        if (scale <= 1) return;
        isPanning = true;
        startX = event.clientX - panX;
        startY = event.clientY - panY;
        applyTransform();
      });

      window.addEventListener('mousemove', (event) => {
        if (!isPanning) return;
        panX = event.clientX - startX;
        panY = event.clientY - startY;
        applyTransform();
      });

      window.addEventListener('mouseup', () => {
        isPanning = false;
        applyTransform();
      });

      let pinchStartDist = 0;
      let pinchStartScale = 1;

      viewport.addEventListener('touchstart', (event) => {
        if (event.touches.length === 2) {
          const dx = event.touches[0].clientX - event.touches[1].clientX;
          const dy = event.touches[0].clientY - event.touches[1].clientY;
          pinchStartDist = Math.hypot(dx, dy);
          pinchStartScale = scale;
        } else if (event.touches.length === 1 && scale > 1) {
          isPanning = true;
          startX = event.touches[0].clientX - panX;
          startY = event.touches[0].clientY - panY;
        }
      }, { passive: true });

      viewport.addEventListener('touchmove', (event) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (event.touches.length === 2) {
          const dx = event.touches[0].clientX - event.touches[1].clientX;
          const dy = event.touches[0].clientY - event.touches[1].clientY;
          const dist = Math.hypot(dx, dy);
          if (pinchStartDist > 0) {
            const factor = dist / pinchStartDist;
            scale = Math.min(4, Math.max(1, pinchStartScale * factor));
            applyTransform();
          }
        } else if (event.touches.length === 1 && isPanning && scale > 1) {
          panX = event.touches[0].clientX - startX;
          panY = event.touches[0].clientY - startY;
          applyTransform();
        }
      }, { passive: true });

      viewport.addEventListener('touchend', () => {
        isPanning = false;
        if (scale === 1) {
          panX = 0;
          panY = 0;
        }
        applyTransform();
      }, { passive: true });

      image.addEventListener('dblclick', () => {
        if (scale > 1) {
          resetTransform();
        } else {
          scale = 2;
          applyTransform();
        }
      });
    }

    refreshIcons();
  }

  function initProjectSinglePage() {
    if (!/project-single\.html$/i.test(window.location.pathname)) return;

    const project = getProjectFromQuery();
    if (!project) return;

    const title = document.querySelector('.project-hero__title');
    const subtitle = document.querySelector('.project-hero__subtitle');
    const crumbs = document.querySelector('.page-head__crumbs');
    const media = document.querySelector('.project-hero__media');

    if (title) title.textContent = project.title;
    if (subtitle) subtitle.textContent = project.projectType + ' | ' + project.industry;
    if (crumbs) {
      crumbs.innerHTML = '<a href="index.html">Home</a><span>/</span><a href="projects.html">Projects</a><span>/</span>' + escapeHtml(project.title);
    }
    if (media) {
      media.innerHTML = '<img src="' + escapeHtml(projectImage(project)) + '" alt="' + escapeHtml(project.title) + ' hero preview" loading="eager" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:16px;">';
    }
  }

  function getProjectFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    return DATA.projects.find((item) => item.slug === slug) || DATA.projects[0];
  }

  document.addEventListener('DOMContentLoaded', () => {
    initProjectsPage();
    initProjectSinglePage();
    refreshIcons();
  });
})();
