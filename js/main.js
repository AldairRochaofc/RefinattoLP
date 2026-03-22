(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  var navLinks = mainNav ? mainNav.querySelectorAll('a[href^="#"]') : [];

  function setHeaderShadow() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function closeMobileNav() {
    if (!header || !navToggle) return;
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("modal-open");
  }

  function openMobileNav() {
    if (!header || !navToggle) return;
    header.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("modal-open");
  }

  function toggleNav() {
    if (!header || !navToggle) return;
    if (header.classList.contains("nav-open")) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  if (navToggle && header) {
    navToggle.addEventListener("click", toggleNav);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 768px)").matches) {
        closeMobileNav();
      }
    });
  });

  window.addEventListener("scroll", setHeaderShadow, { passive: true });
  setHeaderShadow();

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Active nav link */
  var sectionIds = ["showcase", "intro", "cocina", "carta", "reservas", "granada", "eventos", "contacto", "ubicacion"];
  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var current = null;
    for (var i = sections.length - 1; i >= 0; i--) {
      var sec = sections[i];
      if (sec.offsetTop <= scrollPos) {
        current = sec.id;
        break;
      }
    }
    navLinks.forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === "#" + current) {
        a.setAttribute("aria-current", "true");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  if (sections.length) {
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();
  }

  /* Booking form */
  var form = document.getElementById("bookingForm");
  var successEl = document.getElementById("formSuccess");

  function showError(id, msg) {
    var el = document.getElementById(id);
    if (el) el.textContent = msg || "";
  }

  function clearErrors() {
    ["err-nombre", "err-email", "err-telefono", "err-fecha", "err-personas"].forEach(function (id) {
      showError(id, "");
    });
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhone(value) {
    var digits = value.replace(/\D/g, "");
    return digits.length >= 9;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();
      if (successEl) {
        successEl.hidden = true;
      }

      var nombre = document.getElementById("nombre");
      var email = document.getElementById("email");
      var telefono = document.getElementById("telefono");
      var fecha = document.getElementById("fecha");
      var personas = document.getElementById("personas");

      var ok = true;
      if (!nombre || !nombre.value.trim()) {
        showError("err-nombre", "Indica tu nombre.");
        ok = false;
      }
      if (!email || !validateEmail(email.value.trim())) {
        showError("err-email", "Email no válido.");
        ok = false;
      }
      if (!telefono || !validatePhone(telefono.value)) {
        showError("err-telefono", "Teléfono con al menos 9 dígitos.");
        ok = false;
      }
      if (!fecha || !fecha.value) {
        showError("err-fecha", "Elige una fecha.");
        ok = false;
      } else {
        var chosen = new Date(fecha.value + "T12:00:00");
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (chosen < today) {
          showError("err-fecha", "La fecha debe ser hoy o posterior.");
          ok = false;
        }
      }
      if (!personas || !personas.value) {
        showError("err-personas", "Selecciona el número de personas.");
        ok = false;
      }

      if (!ok) return;

      if (successEl) {
        successEl.hidden = false;
      }
      form.reset();
    });
  }

  /* Min date for reservation */
  var fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    var t = new Date();
    var y = t.getFullYear();
    var m = String(t.getMonth() + 1).padStart(2, "0");
    var d = String(t.getDate()).padStart(2, "0");
    fechaInput.min = y + "-" + m + "-" + d;
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Legal modal */
  var legalModal = document.getElementById("legalModal");
  var legalBackdrop = document.getElementById("legalBackdrop");
  var closeLegal = document.getElementById("closeLegal");
  var legalBody = document.getElementById("legalModalBody");
  var legalTitle = document.getElementById("legalModalTitle");

  var legalContent = {
    privacidad: {
      title: "Política de privacidad",
      html:
        "<p>Este sitio es una demostración para portfolio. En un entorno real, aquí figuraría la información exigida por el RGPD y la LOPDGDD: identidad del responsable del tratamiento, finalidad de los datos recogidos en el formulario de reservas, base legal, plazos de conservación, destinatarios, derechos (acceso, rectificación, supresión, limitación, portabilidad, oposición) y reclamación ante la AEPD.</p>"
    },
    cookies: {
      title: "Política de cookies",
      html:
        "<p>Contenido de ejemplo. En producción se describirían las cookies propias y de terceros, finalidad, duración y cómo configurar el navegador o el panel de consentimiento.</p>"
    }
  };

  function openLegal(key) {
    if (!legalModal || !legalContent[key]) return;
    var data = legalContent[key];
    if (legalTitle) legalTitle.textContent = data.title;
    if (legalBody) legalBody.innerHTML = data.html;
    legalModal.hidden = false;
    document.body.classList.add("modal-open");
    if (closeLegal) closeLegal.focus();
  }

  function closeLegalModal() {
    if (!legalModal) return;
    legalModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  var openLegalBtn = document.getElementById("openLegal");
  if (openLegalBtn) {
    openLegalBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openLegal("privacidad");
    });
  }

  var openCookiesBtn = document.getElementById("openCookies");
  if (openCookiesBtn) {
    openCookiesBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openLegal("cookies");
    });
  }

  if (closeLegal) closeLegal.addEventListener("click", closeLegalModal);
  if (legalBackdrop) legalBackdrop.addEventListener("click", closeLegalModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && legalModal && !legalModal.hidden) {
      closeLegalModal();
    }
  });
})();
