/* ============================================
   BOTECO TABERNA - CABEÇALHO (header.js)
   ============================================
   Este arquivo controla o comportamento do
   cabeçalho: cursor personalizado, scroll,
   menu mobile e links ativos.
   
   NÃO REMOVA este arquivo, pois ele é
   essencial para a navegação do site.
   ============================================ */

// ==========================================
// CURSOR PERSONALIZADO
// ==========================================
/**
 * Substitui o cursor padrão do mouse por
 * um círculo estilizado (apenas em desktop).
 * 
 * O cursor segue o mouse suavemente e
 * aumenta de tamanho ao passar sobre
 * elementos interativos (links, botões, cards).
 * 
 * ATENÇÃO: Só funciona em dispositivos com
 * mouse (não em celulares/tablets).
 */
const initCustomCursor = () => {
    // Verifica se é um dispositivo com mouse
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    
    // Cria o elemento do cursor
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isVisible = false;

    /**
     * Atualiza a posição do cursor suavemente
     * usando requestAnimationFrame para ~60fps.
     * O fator 0.15 cria o efeito de "arrasto".
     */
    const updateCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15; // Suavização do movimento
        cursorY += dy * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(updateCursor);
    };

    // Captura a posição do mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isVisible) {
            isVisible = true;
            cursor.classList.add('visible');
        }
    });

    // Esconde o cursor quando sai da janela
    document.addEventListener('mouseleave', () => {
        isVisible = false;
        cursor.classList.remove('visible');
    });

    // Efeito hover em elementos interativos
    const interactiveElements = document.querySelectorAll(
        'a, button, .highlight-card, .menu-item, .event-card, .testimonial-card, .gallery__item, .btn'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Inicia o loop de animação
    updateCursor();
};

// ==========================================
// COMPORTAMENTO DO CABEÇALHO AO SCROLL
// ==========================================
/**
 * Controla a aparência do cabeçalho quando
 * o usuário rola a página:
 * - No topo: transparente
 * - Ao rolar: fundo escuro com blur
 * 
 * COMO EDITAR:
 * - Alterar 50 para mudar quando o efeito ativa
 * - Descomentar o bloco "header--hidden" para
 *   esconder o menu ao rolar para baixo
 */
const initHeaderScroll = () => {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Adiciona/remove a classe scrolled
        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        // OPÇÃO: Esconder header ao descer, mostrar ao subir
        // Basta descomentar o bloco abaixo:
        /*
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.classList.add('header--hidden');
        } else {
            header.classList.remove('header--hidden');
        }
        */

        lastScroll = currentScroll;
        ticking = false;
    };

    // Verifica posição inicial
    handleScroll();

    // Usa requestAnimationFrame para performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
};

// ==========================================
// MENU MOBILE (HAMBÚRGUER)
// ==========================================
/**
 * Controla o menu hambúrguer em dispositivos
 * móveis. Cria uma sobreposição escura (overlay)
 * para fechar o menu ao clicar fora.
 * 
 * FUNCIONALIDADES:
 * - Abre/fecha ao clicar no hambúrguer
 * - Fecha ao clicar em um link
 * - Fecha ao clicar no overlay (fundo escuro)
 * - Fecha com a tecla ESC
 * - Fecha automaticamente ao redimensionar para desktop
 */
const initMobileMenu = () => {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navList = nav?.querySelector('.nav__list');
    const hamburger = menuToggle?.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!menuToggle || !nav || !navList) return;

    // Cria overlay para o menu mobile
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.4s ease, visibility 0.4s ease;
    `;
    document.body.appendChild(overlay);

    /**
     * Abre ou fecha o menu mobile.
     * @param {boolean} open - true para abrir, false para fechar
     */
    const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !navList.classList.contains('active');
        
        menuToggle.classList.toggle('active', isOpen);
        hamburger?.classList.toggle('active', isOpen);
        navList.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        overlay.style.opacity = isOpen ? '1' : '0';
        overlay.style.visibility = isOpen ? 'visible' : 'hidden';
        document.body.style.overflow = isOpen ? 'hidden' : ''; // Trava o scroll
    };

    // Abre/fecha ao clicar no hambúrguer
    menuToggle.addEventListener('click', () => toggleMenu());

    // Fecha ao clicar em um link do menu
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Fecha ao clicar no overlay (fundo escuro)
    overlay.addEventListener('click', () => toggleMenu(false));

    // Fecha com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Fecha ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navList.classList.contains('active')) {
            toggleMenu(false);
        }
    });
};

// ==========================================
// DESTAQUE DO LINK ATIVO
// ==========================================
/**
 * Destaca automaticamente o link do menu
 * correspondente à seção visível na tela.
 * 
 * Funciona apenas na página inicial (index.html)
 * com links internos (#secao).
 */
const initActiveLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    const handleScroll = window.Taberna?.throttle(() => {
        let current = '';
        const scrollPos = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
};

// ==========================================
// INICIALIZAÇÃO
// ==========================================
/**
 * Executa todas as funções quando a
 * página carrega.
 */
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();   // Cursor personalizado
    initHeaderScroll();   // Comportamento do header
    initMobileMenu();     // Menu mobile
    initActiveLink();     // Link ativo por scroll
});