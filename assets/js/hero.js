/* ============================================
   HERO CAROUSEL - CONTRIBUIÇÃO (JS)
   Re-implementa um carrossel leve com:
   - autoplay configurável via data-autoplay
   - controles prev/next
   - indicadores clicáveis
   - preload de imagens e preferência a reduced-motion
   - mantém os botões do hero com rolagem suave
   ============================================ */
(function () {
    'use strict';

    // Smooth scroll para botões do hero (preserva comportamento anterior)
    function initHeroButtons() {
        const heroButtons = document.querySelectorAll('.hero__btn');
        heroButtons.forEach(btn => btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }));
    }

    const hero = document.querySelector('.hero--carousel');
    if (!hero) {
        document.addEventListener('DOMContentLoaded', initHeroButtons);
        return;
    }

    const slider = hero.querySelector('.hero__slider');
    const slides = Array.from(slider.querySelectorAll('.hero__slide'));
    const indicatorsContainer = hero.querySelector('.hero__indicators');
    const prevBtn = hero.querySelector('[data-action="prev"]');
    const nextBtn = hero.querySelector('[data-action="next"]');
    const autoplayMs = Number(hero.dataset.autoplay) || 5000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let activeIndex = 0;
    let autoplayId = null;

    function preloadImage(src) {
        if (!src) return;
        const img = new Image();
        img.src = src;
    }

    function applyBackground(slide) {
        const src = slide.dataset.image;
        const backdrop = slide.querySelector('.hero__backdrop');
        if (!backdrop || backdrop.dataset.loaded === 'true' || !src) return;

        // Prefer using an <img> with object-fit to avoid visual distortion
        let img = backdrop.querySelector('img.hero__bgimg');
        if (!img) {
            img = document.createElement('img');
            img.className = 'hero__bgimg';
            img.alt = '';
            backdrop.appendChild(img);
        }

        // Set src (browser will preserve aspect ratio via object-fit)
        img.src = src;
        backdrop.dataset.loaded = 'true';
        preloadImage(src);
        // keep background-image as fallback
        backdrop.style.backgroundImage = `url('${src}')`;
    }

    function buildIndicators() {
        if (!indicatorsContainer) return;
        indicatorsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'hero__indicator';
            btn.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
            btn.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(btn);
        });
    }

    function updateIndicators() {
        if (!indicatorsContainer) return;
        const dots = indicatorsContainer.querySelectorAll('.hero__indicator');
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === activeIndex);
            dot.setAttribute('aria-current', i === activeIndex ? 'true' : 'false');
        });
    }

    function updateSlides() {
        slides.forEach((slide, i) => {
            const isActive = i === activeIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            if (isActive) applyBackground(slide);
        });
        updateIndicators();
    }

    function goToSlide(index, {restart = true} = {}) {
        if (!slides.length) return;
        activeIndex = (index + slides.length) % slides.length;
        updateSlides();
        if (restart) restartAutoplay();
    }

    function startAutoplay() {
        if (reducedMotion || autoplayMs <= 0 || slides.length <= 1) return;
        stopAutoplay();
        autoplayId = window.setInterval(() => goToSlide(activeIndex + 1, {restart: false}), autoplayMs);
    }

    function stopAutoplay() {
        if (autoplayId) {
            window.clearInterval(autoplayId);
            autoplayId = null;
        }
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    function attachEvents() {
        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(activeIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(activeIndex + 1));
        hero.addEventListener('mouseenter', stopAutoplay);
        hero.addEventListener('mouseleave', startAutoplay);

        // touch swipe
        let touchStartX = 0;
        hero.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, {passive:true});
        hero.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const delta = touchEndX - touchStartX;
            if (delta > 50) goToSlide(activeIndex - 1);
            else if (delta < -50) goToSlide(activeIndex + 1);
        }, {passive:true});

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') goToSlide(activeIndex + 1);
            if (e.key === 'ArrowLeft') goToSlide(activeIndex - 1);
        });
    }

    function init() {
        initHeroButtons();
        buildIndicators();
        updateSlides();
        attachEvents();
        startAutoplay();
        // preload next image
        preloadImage(slides[1]?.dataset.image);
    }

    // aguarda DOM
    document.addEventListener('DOMContentLoaded', init);
})();