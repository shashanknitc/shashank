(() => {
  "use strict";

  const root = document.documentElement;
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const themeToggle = document.getElementById("themeToggle");
  const themeLabel = themeToggle.querySelector(".theme-toggle__label");

  /* ---------- theme ---------- */

  const storedTheme = (() => {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  })();

  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(storedTheme || (prefersLight ? "light" : "dark"));

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }

  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  /* ---------- mobile nav ---------- */

  const setMenu = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("is-open", open);
  };

  navToggle.addEventListener("click", () => {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });

  navMenu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) setMenu(false);
  });

  /* ---------- sticky nav shadow ---------- */

  const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- scroll reveal ---------- */

  const revealables = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          setTimeout(() => entry.target.classList.add("is-visible"), i * 70);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- active nav link ---------- */

  const links = [...navMenu.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- contact form ---------- */

  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email."),
    message: (v) => (v.trim().length >= 10 ? "" : "Message must be at least 10 characters.")
  };

  function validateField(field) {
    const rule = rules[field.name];
    const slot = form.querySelector(`.error[data-for="${field.name}"]`);
    const message = rule ? rule(field.value) : "";
    slot.textContent = message;
    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) validateField(field);
      status.textContent = "";
      status.classList.remove("ok");
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = Object.keys(rules).map((n) => form.elements[n]);
    const valid = fields.map(validateField).every(Boolean);

    if (!valid) {
      status.classList.remove("ok");
      status.textContent = "Please fix the highlighted fields.";
      return;
    }

    status.classList.add("ok");
    status.textContent = "Thanks! This demo form doesn't send anything yet — hook it up to your backend.";
    form.reset();
  });

  /* ---------- graphical abstracts ---------- */

  document.querySelectorAll(".pub__ga img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.remove();
        img.closest(".pub__ga")?.classList.add("is-empty");
      },
      { once: true }
    );
  });

  /* ---------- graphical abstract rotator ---------- */

  (() => {
    const rot = document.getElementById("gaRotator");
    const link = document.getElementById("gaSlide");
    const img = document.getElementById("gaSlideImg");
    const cap = document.getElementById("gaCap");
    const dots = document.getElementById("gaDots");
    const prev = document.getElementById("gaPrev");
    const next = document.getElementById("gaNext");
    if (!rot || !link || !img) return;

    const HOLD = 4200;
    const FADE = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 480;

    const entries = [...document.querySelectorAll(".pub--ga .pub__ga")]
      .map((a) => {
        const thumb = a.querySelector("img");
        const src = thumb?.getAttribute("src");
        if (!src) return null;
        return {
          src,
          alt: thumb.getAttribute("alt") || "Graphical abstract",
          label: a.querySelector(".pub__ga-cap")?.textContent.trim() || "",
          href: a.getAttribute("href") || "#publications"
        };
      })
      .filter(Boolean);

    if (!entries.length) return;

    const probe = (src) =>
      new Promise((resolve) => {
        const t = new Image();
        t.addEventListener("load", () => resolve(src), { once: true });
        t.addEventListener("error", () => resolve(null), { once: true });
        t.src = src;
      });

    Promise.all(entries.map((e) => probe(e.src))).then((loaded) => {
      const slides = entries.filter((e) => loaded.includes(e.src));
      if (!slides.length) return;

      let index = 0;
      let timer = null;

      if (slides.length > 1) {
        slides.forEach((_, i) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "garot__dot";
          dot.setAttribute("role", "tab");
          dot.setAttribute("aria-selected", String(i === 0));
          dot.setAttribute("aria-label", `Graphical abstract ${i + 1} of ${slides.length}`);
          dot.addEventListener("click", () => {
            go(i);
            restart();
          });
          dots.append(dot);
        });
      } else {
        rot.classList.add("is-single");
      }

      const render = (i) => {
        const s = slides[i];
        img.src = s.src;
        img.alt = s.alt;
        link.href = s.href;
        cap.textContent = s.label;
        [...dots.children].forEach((d, j) =>
          d.setAttribute("aria-selected", String(j === i))
        );
      };

      const go = (i) => {
        if (FADE === 0) {
          index = (i + slides.length) % slides.length;
          render(index);
          return;
        }
        link.classList.add("is-fading");
        setTimeout(() => {
          index = (i + slides.length) % slides.length;
          render(index);
          link.classList.remove("is-fading");
        }, FADE);
      };

      const step = (delta) => {
        go(index + delta);
        restart();
      };

      const stop = () => {
        if (timer === null) return;
        clearInterval(timer);
        timer = null;
      };

      const restart = () => {
        stop();
        if (slides.length < 2) return;
        timer = setInterval(() => go(index + 1), HOLD);
      };

      render(0);
      rot.hidden = false;
      restart();

      prev.addEventListener("click", () => step(-1));
      next.addEventListener("click", () => step(1));
      rot.addEventListener("mouseenter", stop);
      rot.addEventListener("mouseleave", restart);
      rot.addEventListener("focusin", stop);
      document.addEventListener("visibilitychange", () =>
        document.hidden ? stop() : restart()
      );
      rot.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
      });
    });
  })();

  /* ---------- year ---------- */

  document.getElementById("year").textContent = new Date().getFullYear();
})();
