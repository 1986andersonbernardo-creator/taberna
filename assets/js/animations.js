/* ============================================
   BOTECO TABERNA - ANIMAÇÕES (animations.js)
   ============================================
   Este arquivo controla as animações visuais
   do site: revelação ao scroll, efeito parallax,
   3D tilt nos cards, contadores e barras de
   progresso.
   
   NÃO REMOVA este arquivo, pois ele é
   essencial para os efeitos visuais do site.
   ============================================ */

// ==========================================
// REVELAÇÃO AO SCROLL (INTERSECTION OBSERVER)
// ==========================================
/**
 * Faz os elementos aparecerem suavemente
 * quando o usuário rola a página até eles.
 * 
 * COMO USAR NO HTML:
 * Adicione data-delay="0" (ou 100, 200, etc.)
 * aos elementos que devem aparecer com animação.
 * 
 * Exemplo:
 * <div class="card" data-delay="0">...</div>
 * <div class="card" data-delay="100">...</div>
 * 
 * O delay cria um efeito cascata.
 */
const initRevealAnimations = () => {
    // Seleciona todos os elementos com data-delay
    const animatedElements = document.querySelectorAll('[data-delay]');
    
    const observerOptions = {
        threshold: 0.1,          // Ativa quando 10% do elemento aparece
        rootMargin: '0px 0px -60px 0px'  // Margem para ativar um pouco antes
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Adiciona transição suave
                    entry.target.style.transition = `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`;
                }, delay);
                obs.unobserve(entry.target); // Para de observar após ativar
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
};

// ==========================================
// EFEITO PARALLAX NO HERO
// ==========================================
/**
 * Cria um efeito de profundidade onde o
 * banner principal se move mais devagar
 * que o resto da página ao rolar.
 * 
 * Funciona apenas na seção .hero (home).
 */
const initParallax = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 768px)').matches) return;

    // Usa throttle para limitar a frequência (~60fps)
    const handleScroll = window.Taberna?.throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.12;
        // Só aplica se o hero ainda estiver visível
        if (scrolled < window.innerHeight) {
            hero.style.setProperty('--hero-parallax', `${scrolled * parallaxSpeed}px`);
        }
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
};

// ==========================================
// EFEITO 3D TILT NOS CARDS
// ==========================================
/**
 * Cria um efeito 3D nos cards quando o
 * usuário passa o mouse: o card inclina
 * suavemente seguindo a posição do mouse.
 * 
 * FUNCIONA EM:
 * - .highlight-card (destaques)
 * - .menu-item (cardápio)
 * - .event-card (eventos)
 * - .testimonial-card (depoimentos)
 * - .gallery__item (galeria)
 */
const initMouseFollow = () => {
    const cards = document.querySelectorAll('.highlight-card, .menu-item, .event-card, .testimonial-card, .gallery__item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calcula o ângulo de inclinação (máximo 4 graus)
            const rotateX = ((y - centerY) / centerY) * 4;
            const rotateY = ((x - centerX) / centerX) * 4;
            
            // Aplica a transformação 3D
            card.style.transform = `
                perspective(1000px) 
                rotateX(${-rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-5px)
            `;
            card.style.boxShadow = `
                0 20px 40px rgba(0, 0, 0, 0.3), 
                0 0 20px rgba(240, 240, 32, ${0.05 + (Math.abs(rotateX) + Math.abs(rotateY)) / 100})
            `;
        });

        // Restaura ao sair com o mouse
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
};

// ==========================================
// ANIMAÇÃO DE CONTADORES
// ==========================================
/**
 * Anima números de 0 até o valor final
 * quando o elemento aparece na tela.
 * 
 * COMO USAR NO HTML:
 * <span data-count="100">0</span>
 * 
 * O número dentro da tag será animado
 * até o valor definido em data-count.
 */
const initCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.dataset.count);
                const duration = 2000; // 2 segundos de animação
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out cúbico (desacelera no final)
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const currentValue = Math.floor(eased * targetValue);
                    
                    target.textContent = currentValue;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        target.textContent = targetValue;
                    }
                };
                
                requestAnimationFrame(animate);
                obs.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
};

// ==========================================
// ANIMAÇÃO DE BARRAS DE PROGRESSO
// ==========================================
/**
 * Anima barras de progresso enchendo
 * quando aparecem na tela.
 * 
 * COMO USAR NO HTML:
 * <div class="progress-bar" data-progress="75"></div>
 * 
 * A barra encherá até 75% ao aparecer.
 */
const initProgressBars = () => {
    const bars = document.querySelectorAll('.progress-bar');
    if (bars.length === 0) return;
    
    const barObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.dataset.progress || '0';
                setTimeout(() => {
                    bar.style.width = `${width}%`;
                    bar.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
                }, 200);
                obs.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => barObserver.observe(bar));
};

// ==========================================
// INICIALIZAÇÃO
// ==========================================
/**
 * Executa todas as animações quando a
 * página carrega.
 */
document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimations();  // Revelação ao scroll
    initParallax();          // Efeito parallax
    initMouseFollow();       // Efeito 3D nos cards
    initCounters();          // Contadores animados
    initProgressBars();      // Barras de progresso
});

/**
 * Re-inicializa para conteúdo carregado
 * dinamicamente (se necessário).
 */
document.addEventListener('contentLoaded', () => {
    initRevealAnimations();
    initMouseFollow();
});