/* =========================================================
   Hydrotechnika — interactions
   Scroll reveal, hero particles, guide drawer, modals,
   company data reveal (typewriter), card glow.
   ========================================================= */

(() => {
  "use strict";

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Hero floating particles ---------- */
  const particlesHost = document.getElementById("heroParticles");
  if (particlesHost) {
    const PARTICLE_COUNT = 26;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const span = document.createElement("span");
      const size = (Math.random() * 5 + 3).toFixed(1);
      const duration = (Math.random() * 9 + 11).toFixed(1);
      const delay = (Math.random() * 14).toFixed(1);
      const left = (Math.random() * 100).toFixed(1);
      const drift = (Math.random() * 60 - 30).toFixed(0);
      span.style.setProperty("--s", `${size}px`);
      span.style.setProperty("--t", `${duration}s`);
      span.style.setProperty("--delay", `${delay}s`);
      span.style.setProperty("--drift", `${drift}px`);
      span.style.left = `${left}%`;
      frag.appendChild(span);
    }
    particlesHost.appendChild(frag);
  }

  /* ---------- Service card cursor glow ---------- */
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  /* ---------- Right-side guide drawer ---------- */
  const drawerTab = document.getElementById("drawerTab");
  const drawerClose = document.getElementById("drawerClose");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const guideDrawer = document.getElementById("guideDrawer");

  // Forces a style flush so a just-unhidden element transitions instead of
  // jumping straight to its end state. Works even when the tab is not
  // visible, unlike requestAnimationFrame (which browsers pause then).
  const nextPaint = (el, fn) => {
    void el.offsetHeight;
    fn();
  };

  const openDrawer = () => {
    drawerOverlay.hidden = false;
    nextPaint(drawerOverlay, () => {
      guideDrawer.classList.add("is-open");
      drawerOverlay.classList.add("is-visible");
    });
    guideDrawer.setAttribute("aria-hidden", "false");
    drawerTab.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    guideDrawer.classList.remove("is-open");
    drawerOverlay.classList.remove("is-visible");
    guideDrawer.setAttribute("aria-hidden", "true");
    drawerTab.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    window.setTimeout(() => {
      if (!guideDrawer.classList.contains("is-open")) drawerOverlay.hidden = true;
    }, 500);
  };

  if (drawerTab && guideDrawer && drawerOverlay && drawerClose) {
    drawerTab.addEventListener("click", () => {
      guideDrawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
    });
    drawerClose.addEventListener("click", closeDrawer);
    drawerOverlay.addEventListener("click", closeDrawer);
  }

  /* ---------- Modals ---------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const modals = document.querySelectorAll(".modal");
  let lastFocusedEl = null;

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocusedEl = document.activeElement;

    modalOverlay.hidden = false;
    modal.hidden = false;
    nextPaint(modal, () => {
      modalOverlay.classList.add("is-visible");
      modal.classList.add("is-visible");
    });
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      const closeBtn = modal.querySelector(".modal-close");
      if (closeBtn) closeBtn.focus();
    }, 350);
  };

  const closeModal = () => {
    const openEl = document.querySelector(".modal.is-visible");
    modalOverlay.classList.remove("is-visible");
    if (openEl) openEl.classList.remove("is-visible");
    document.body.style.overflow = "";

    window.setTimeout(() => {
      modalOverlay.hidden = true;
      modals.forEach((m) => {
        if (!m.classList.contains("is-visible")) m.hidden = true;
      });
      if (lastFocusedEl instanceof HTMLElement) lastFocusedEl.focus();
    }, 500);
  };

  document.querySelectorAll(".guide-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal;
      closeDrawer();
      window.setTimeout(() => openModal(modalId), 200);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", () => closeModal());
  });

  if (modalOverlay) modalOverlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (document.querySelector(".modal.is-visible")) {
      closeModal();
    } else if (guideDrawer && guideDrawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  /* ---------- Company data reveal (staggered + typewriter) ---------- */
  const showDataBtn = document.getElementById("showDataBtn");
  const dataRows = document.querySelectorAll(".data-row");
  let dataRevealed = false;

  const typeText = (el) => {
    const full = el.textContent;
    el.dataset.typed = "true";
    el.textContent = "";
    let i = 0;
    const speed = Math.max(16, Math.min(34, 500 / full.length));
    const interval = window.setInterval(() => {
      i++;
      el.textContent = full.slice(0, i);
      if (i >= full.length) window.clearInterval(interval);
    }, speed);
  };

  if (showDataBtn) {
    showDataBtn.addEventListener("click", () => {
      dataRevealed = !dataRevealed;
      showDataBtn.setAttribute("aria-expanded", String(dataRevealed));
      showDataBtn.textContent = dataRevealed ? "Ukryj dane firmy" : "Pokaż dane firmy";

      dataRows.forEach((row, i) => {
        if (dataRevealed) {
          window.setTimeout(() => {
            row.classList.add("is-shown");
            const target = row.querySelector("[data-type-target]");
            if (target && !target.dataset.typed) typeText(target);
          }, i * 180);
        } else {
          row.classList.remove("is-shown");
        }
      });
    });
  }
})();
