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

  /* Booking form — FormSubmit AJAX (https://formsubmit.co/ajax-documentation) */
  var form = document.getElementById("bookingForm");
  var bookingThanksModal = document.getElementById("bookingThanksModal");
  var bookingThanksBackdrop = document.getElementById("bookingThanksBackdrop");
  var closeBookingThanks = document.getElementById("closeBookingThanks");
  var bookingThanksTitle = document.getElementById("bookingThanksTitle");
  var bookingThanksMsg = document.getElementById("bookingThanksMsg");
  var bookingThanksPanel = document.getElementById("bookingThanksPanel");
  var bookingSubmitBtn = document.getElementById("bookingSubmitBtn");
  var FORMSUBMIT_AJAX = "https://formsubmit.co/ajax/aldair.santosrochadev@gmail.com";
  var bookingSubmitLabel = bookingSubmitBtn ? bookingSubmitBtn.textContent : "";

  function openBookingThanksModal(success, title, msg) {
    if (!bookingThanksModal) return;
    if (bookingThanksTitle) {
      bookingThanksTitle.textContent = title || (success ? "Solicitud enviada" : "No se pudo enviar");
    }
    if (bookingThanksMsg) {
      bookingThanksMsg.textContent =
        msg ||
        (success
          ? "Gracias. Hemos recibido tu solicitud; te contactaremos pronto."
          : "Ha ocurrido un error. Inténtalo de nuevo en unos minutos o llámanos por teléfono.");
    }
    if (bookingThanksPanel) {
      bookingThanksPanel.classList.toggle("modal-panel--booking-ok", success);
      bookingThanksPanel.classList.toggle("modal-panel--error", !success);
    }
    bookingThanksModal.hidden = false;
    document.body.classList.add("modal-open");
    if (closeBookingThanks) closeBookingThanks.focus();
  }

  function closeBookingThanksModal() {
    if (!bookingThanksModal) return;
    bookingThanksModal.hidden = true;
    document.body.classList.remove("modal-open");
    if (bookingSubmitBtn) bookingSubmitBtn.focus();
  }

  if (closeBookingThanks) closeBookingThanks.addEventListener("click", closeBookingThanksModal);
  if (bookingThanksBackdrop) bookingThanksBackdrop.addEventListener("click", closeBookingThanksModal);

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

      if (bookingSubmitBtn) {
        bookingSubmitBtn.disabled = true;
        bookingSubmitBtn.setAttribute("aria-busy", "true");
        bookingSubmitBtn.textContent = "Enviando…";
      }

      var fd = new FormData(form);

      fetch(FORMSUBMIT_AJAX, {
        method: "POST",
        body: fd,
        headers: {
          Accept: "application/json",
        },
      })
        .then(function (res) {
          return res.text().then(function (text) {
            var data = {};
            try {
              data = text ? JSON.parse(text) : {};
            } catch (err) {
              data = {};
            }
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok) {
            openBookingThanksModal(true);
            form.reset();
            var fi = document.getElementById("fecha");
            if (fi) {
              var t2 = new Date();
              var y2 = t2.getFullYear();
              var m2 = String(t2.getMonth() + 1).padStart(2, "0");
              var d2 = String(t2.getDate()).padStart(2, "0");
              fi.min = y2 + "-" + m2 + "-" + d2;
            }
          } else {
            openBookingThanksModal(false);
          }
        })
        .catch(function () {
          openBookingThanksModal(false);
        })
        .finally(function () {
          if (bookingSubmitBtn) {
            bookingSubmitBtn.disabled = false;
            bookingSubmitBtn.removeAttribute("aria-busy");
            bookingSubmitBtn.textContent = bookingSubmitLabel;
          }
        });
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
    if (e.key !== "Escape") return;
    if (bookingThanksModal && !bookingThanksModal.hidden) {
      closeBookingThanksModal();
      return;
    }
    if (legalModal && !legalModal.hidden) {
      closeLegalModal();
    }
  });
})();
