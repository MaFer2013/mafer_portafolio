const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main .section");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card[data-category]");
const magneticItems = document.querySelectorAll(".magnetic");
const galleryMain = document.querySelector(".gallery-main");
const galleryThumbs = document.querySelector(".gallery-thumbs");
const galleryButtons = document.querySelectorAll("[data-gallery]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const requestedAssetPaths = [
  "assets/images/decorations/nube_morada.svg",
  "assets/images/decorations/nube_rosa.svg",
  "assets/images/decorations/nube_celeste.svg",
  "assets/images/about/mi_viaje.svg",
  "assets/images/hero/Forma_no_terminada.svg",
  "assets/images/tarjetas/FORMA_01",
  "assets/images/tarjetas/animación",
  "assets/images/tarjetas/Aplicación",
  "assets/images/tarjetas/artes",
  "assets/images/tarjetas/rediseño",
];

const galleryItems = [
  {
    title: "Origen libre",
    bg: "radial-gradient(circle at 24% 58%, #f5bba8, transparent 22%), radial-gradient(circle at 68% 36%, #8f61ff, transparent 36%), linear-gradient(135deg, #120d2b, #03040a)",
  },
  {
    title: "Territorio suave",
    bg: "radial-gradient(circle at 50% 62%, #f7d0be, transparent 26%), radial-gradient(circle at 40% 36%, #c398ff, transparent 32%), linear-gradient(135deg, #1b1232, #0b0b17)",
  },
  {
    title: "Sistema claro",
    bg: "radial-gradient(circle at 28% 34%, #f5bba8, transparent 26%), radial-gradient(circle at 72% 58%, #c398ff, transparent 30%), linear-gradient(135deg, #f7f1ec, #f4c9d8)",
  },
  {
    title: "Expansion",
    bg: "radial-gradient(circle at 70% 32%, #ee9fca, transparent 22%), radial-gradient(circle at 36% 60%, #8f61ff, transparent 34%), linear-gradient(135deg, #0b0c18, #281449)",
  },
];

let galleryIndex = 0;

function reportMissingRequestedAssets() {
  requestedAssetPaths.forEach((path) => {
    fetch(encodeURI(path), { method: "HEAD" })
      .then((response) => {
        if (!response.ok) {
          console.warn(`Ruta falta: ${path}`);
        }
      })
      .catch(() => {
        console.warn(`Ruta falta: ${path}`);
      });
  });
}

function closeMenu() {
  navToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

function hasGsap() {
  return Boolean(window.gsap) && !prefersReducedMotion;
}

function smoothScrollTo(target) {
  if (!target) return;

  const headerOffset = 18;
  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  const distance = targetY - startY;
  const duration = hasGsap() ? 950 : 700;
  const startTime = performance.now();

  function easeInOutCubic(progress) {
    return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  if (prefersReducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }

  requestAnimationFrame(step);
}

function revealElement(item) {
  item.classList.add("is-visible");

  if (!hasGsap() || item.closest(".hero-section")) return;

  const isCard = item.classList.contains("project-card");
  window.gsap.fromTo(
    item,
    {
      autoAlpha: 0,
      y: isCard ? 58 : 36,
      scale: isCard ? 0.96 : 1,
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: isCard ? 0.95 : 0.82,
      ease: "power3.out",
    }
  );
}

function initGsapAnimations() {
  if (!hasGsap()) return;

  const gsap = window.gsap;
  document.documentElement.classList.add("gsap-active");

  gsap.set(".site-header", { autoAlpha: 0, y: -18 });
  gsap.set(".hero-copy > *, .hero-art, .scroll-cue", { autoAlpha: 0, y: 34 });
  gsap.set(".hero-art", { scale: 0.96 });

  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .to(".site-header", { autoAlpha: 1, y: 0, duration: 0.7 })
    .to(".hero-copy > *", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09 }, "-=0.35")
    .to(".hero-art", { autoAlpha: 1, y: 0, scale: 1, duration: 1.15 }, "-=0.7")
    .to(".scroll-cue", { autoAlpha: 1, y: 0, duration: 0.65 }, "-=0.45");

  gsap.to(".hero-illustration", {
    y: 24,
    rotation: 2,
    scale: 1.018,
    duration: 5.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.to(".project-blob-stage .blob-xl, .blob-md, .portrait-blob, .unfinished-form", {
    y: 18,
    rotation: -3,
    duration: 6.4,
    repeat: -1,
    yoyo: true,
    stagger: 0.45,
    ease: "sine.inOut",
  });

  gsap.to(".spark", {
    x: 8,
    y: -12,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    stagger: 0.22,
    ease: "sine.inOut",
  });

  gsap.to(".decor-cloud", {
    x: "random(-12, 18)",
    y: "random(-16, 18)",
    rotation: "random(-4, 4)",
    duration: "random(7, 10)",
    repeat: -1,
    yoyo: true,
    stagger: 0.35,
    ease: "sine.inOut",
  });

  gsap.to(".skill-outline", {
    y: "random(-5, 6)",
    rotation: "random(-1.5, 1.5)",
    duration: "random(4.8, 6.4)",
    repeat: -1,
    yoyo: true,
    stagger: 0.18,
    ease: "sine.inOut",
  });
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    closeMenu();
    smoothScrollTo(target);
  });
});

initGsapAnimations();

const activeNavObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      navLinks.forEach((link) => {
        const target = link.getAttribute("href").replace("#", "");
        link.classList.toggle("is-active", target === id);
      });
    });
  },
  {
    rootMargin: "-42% 0px -48% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => activeNavObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.12,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

function renderGallery() {
  const currentItem = galleryItems[galleryIndex];

  galleryMain.style.setProperty("--gallery-bg", currentItem.bg);
  galleryMain.setAttribute("data-title", currentItem.title);

  galleryThumbs.innerHTML = galleryItems
    .map(
      (item, index) =>
        `<button class="gallery-thumb${index === galleryIndex ? " is-active" : ""}" type="button" style="--gallery-bg: ${item.bg}" data-gallery-index="${index}" aria-label="Ver ${item.title}"></button>`
    )
    .join("");
}

if (galleryMain && galleryThumbs) {
  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.gallery === "next" ? 1 : -1;
      galleryIndex = (galleryIndex + direction + galleryItems.length) % galleryItems.length;
      renderGallery();
    });
  });

  galleryThumbs.addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-gallery-index]");
    if (!thumb) return;

    galleryIndex = Number(thumb.dataset.galleryIndex);
    renderGallery();
  });

  renderGallery();
}

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
    item.style.transform = `translate(${x}px, ${y}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
});

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
});

reportMissingRequestedAssets();
