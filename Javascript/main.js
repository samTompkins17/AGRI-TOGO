/* =========================================
   AGRI-TOGO — Scripts globaux
   Thème clair/sombre, animations au scroll,
   validation du formulaire de contact
========================================= */

// ---- 1. THÈME CLAIR/SOMBRE ----
(function initTheme() {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");

    if (saved) {
        root.setAttribute("data-theme", saved);
    } else {
        root.setAttribute(
            "data-theme",
            matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        );
    }

    // Suit les préférences système tant que l'utilisateur n'a pas choisi manuellement
    const mql = matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = (e) => {
        if (!localStorage.getItem("theme")) {
            root.setAttribute("data-theme", e.matches ? "dark" : "light");
            syncToggle();
        }
    };
    if (mql.addEventListener) {
        mql.addEventListener("change", onSystemThemeChange);
    } else if (mql.addListener) {
        mql.addListener(onSystemThemeChange); // Safari < 14
    }

    const toggle = document.querySelector(".theme-toggle");

    function syncToggle() {
        if (!toggle) return;
        const isDark = root.getAttribute("data-theme") === "dark";
        const icon = toggle.querySelector(".material-symbols-outlined");
        if (icon) icon.textContent = isDark ? "light_mode" : "dark_mode";
        toggle.setAttribute("aria-label", isDark ? "Passer en mode clair" : "Passer en mode sombre");
        toggle.setAttribute("title", isDark ? "Mode clair" : "Mode sombre");
    }

    if (toggle) {
        toggle.addEventListener("click", () => {
            const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            syncToggle();
        });
    }

    syncToggle();
})();

// ---- 2. ANIMATIONS AU DÉFILEMENT (SCROLL REVEAL) ----
document.addEventListener("DOMContentLoaded", () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll(
        "main > section:not(:first-of-type), " +
        "main .stat, main .actualite, main .about-image, " +
        "main .identity-card, main .team-card, main .product-card, " +
        "main .news-card, main .event-card, " +
        "main .featured-image, main .featured-content"
    );

    // ---- Animation de compteur pour les statistiques ----
    function animateCounter(el) {
        const text = el.textContent.trim();
        const target = parseInt(text, 10);
        if (isNaN(target) || target === 0) return;
        const suffix = text.replace(/^\d+/, "");
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = text;
        }
        requestAnimationFrame(tick);
    }

    // ---- Applique le délai progressif et une direction aux enfants d'une grille ----
    function applyStagger(selector, root) {
        root.querySelectorAll(selector).forEach((grid) => {
            grid.querySelectorAll(".reveal").forEach((child, idx) => {
                child.style.setProperty("--delay", `${idx * 80}ms`);
                const dirs = ["reveal-up", "reveal-left", "reveal-right", "reveal-scale"];
                child.classList.add(dirs[idx % dirs.length]);
            });
        });
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add("is-visible");

                // Lance le compteur animé sur les statistiques
                if (el.matches(".stat")) {
                    const h3 = el.querySelector("h3");
                    if (h3) animateCounter(h3);
                }

                // Révèle les enfants avec délai progressif
                if (el.matches("section")) {
                    el.querySelectorAll(".reveal").forEach((child, idx) => {
                        if (!child.style.getPropertyValue("--delay")) {
                            child.style.setProperty("--delay", `${idx * 80}ms`);
                        }
                        child.classList.add("is-visible");
                        observer.unobserve(child);
                    });
                }
                observer.unobserve(el);
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    // Ajoute la classe de révélation et observe chaque cible
    targets.forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
    });

    // Applique le délai progressif et les directions aux grilles
    applyStagger(".products-grid", document);
    applyStagger(".news-grid", document);
    applyStagger(".events-grid", document);
    applyStagger(".actualites-container", document);
    applyStagger(".identity-container", document);
    applyStagger(".team-grid", document);
    applyStagger(".stats-container", document);
});

// ---- 3. CARROUSEL DES PARTENAIRES ----
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const prev = carousel.querySelector(".carousel-arrow.prev");
    const next = carousel.querySelector(".carousel-arrow.next");
    const dotsWrap = carousel.querySelector(".carousel-dots");
    if (!track || !dotsWrap || slides.length === 0) return;

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;
    let timer = null;

    // Création des points de navigation
    const dots = [];
    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Aller à la diapositive " + (i + 1));
        dot.addEventListener("click", () => {
            goTo(i);
            play();
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
    });

    function goTo(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, j) => dot.classList.toggle("active", j === index));
        slides.forEach((slide, j) => slide.setAttribute("aria-hidden", String(j !== index)));
    }

    function play() {
        if (reducedMotion) return;
        stop();
        timer = window.setInterval(() => goTo(index + 1), 4000);
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    if (prev) prev.addEventListener("click", () => { goTo(index - 1); play(); });
    if (next) next.addEventListener("click", () => { goTo(index + 1); play(); });

    // Pause au survol
    let isHovered = false;
    carousel.addEventListener("mouseenter", () => { isHovered = true; stop(); });
    carousel.addEventListener("mouseleave", () => {
        isHovered = false;
        if (isCarouselVisible()) play();
    });

    // Lecture uniquement quand le carrousel est visible à l'écran
    function isCarouselVisible() {
        const rect = carousel.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
    }

    let wasVisible = isCarouselVisible();
    if (wasVisible && !isHovered) play();

    window.addEventListener("scroll", () => {
        const visible = isCarouselVisible();
        if (visible && !wasVisible && !isHovered) play();
        if (!visible && wasVisible) stop();
        wasVisible = visible;
    }, { passive: true });
});

// ---- 4. VALIDATION DU FORMULAIRE DE CONTACT ----
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const rules = {
        nom: {
            test: (v) => v.trim().length >= 2,
            message: "Veuillez saisir votre nom (2 caractères minimum)."
        },
        email: {
            test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            message: "Veuillez saisir une adresse email valide."
        },
        sujet: {
            test: () => true,
            message: ""
        },
        message: {
            test: (v) => v.trim().length >= 10,
            message: "Votre message doit contenir au moins 10 caractères."
        }
    };

    function setError(input, message) {
        const field = input.closest(".field") || input.parentElement;
        if (!field) return;
        field.classList.toggle("invalid", Boolean(message));
        let error = field.querySelector(".form-error");
        if (message) {
            if (!error) {
                error = document.createElement("small");
                error.className = "form-error";
                field.appendChild(error);
            }
            error.textContent = message;
        } else if (error) {
            error.remove();
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let isValid = true;
        Object.entries(rules).forEach(([id, rule]) => {
            const input = document.getElementById(id);
            if (!input) return;
            const ok = rule.test(input.value);
            if (!ok) isValid = false;
            setError(input, ok ? "" : rule.message);
        });

        if (!isValid) return;

        // Évite l'empilement des messages de succès
        const old = form.querySelector(".form-success");
        if (old) old.remove();

        const success = document.createElement("div");
        success.className = "form-success";
        success.setAttribute("role", "status");
        success.textContent =
            "Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.";
        form.prepend(success);
        form.reset();
        window.setTimeout(() => success.remove(), 6000);
    });

    form.querySelectorAll("input, textarea").forEach((input) => {
        input.addEventListener("input", () => setError(input, ""));
    });
});

// ---- 5. PLACEHOLDER DES PHOTOS D'ÉQUIPE (en attendant les vraies photos) ----
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".team-card img").forEach((img) => {
        // Placeholder : SVG avec les initiales du membre, vert de la marque
        const setPlaceholder = () => {
            const h3 = img.closest(".team-card").querySelector("h3");
            const name = h3 ? h3.textContent.trim() : "";
            const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            img.src = "data:image/svg+xml;utf8," + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">' +
                '<rect width="100%" height="100%" fill="#2E7D32"/>' +
                '<text x="50%" y="50%" font-family="Poppins, Arial, sans-serif" font-size="220" ' +
                'font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="central">' +
                initials + "</text></svg>"
            );
            img.onerror = null;
        };
        // Déjà en erreur au chargement (image 404) : placeholder immédiat
        if (img.complete && img.naturalWidth === 0) {
            setPlaceholder();
        } else {
            img.addEventListener("error", setPlaceholder);
        }
    });
});
