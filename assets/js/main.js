/* ============================================
   BOTECO TABERNA - FUNÇÕES PRINCIPAIS (main.js)
   ============================================
   Este arquivo contém as funções principais
   do site: loading screen, lazy load de imagens,
   scroll suave, notificações e validação de
   formulários.
   
   NÃO REMOVA este arquivo, pois ele é
   essencial para o funcionamento do site.
   ============================================ */

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

/**
 * debounce - Evita que uma função seja chamada
 * muitas vezes em sequência.
 * 
 * @param {Function} func - A função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} - Função com debounce
 * 
 * COMO USAR:
 * window.addEventListener('resize', debounce(minhaFuncao, 200));
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * throttle - Limita a frequência de chamadas
 * de uma função (ex: durante o scroll).
 * 
 * @param {Function} func - A função a ser executada
 * @param {number} limit - Intervalo mínimo entre execuções
 * @returns {Function} - Função com throttle
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ==========================================
// TELA DE CARREGAMENTO (LOADING SCREEN)
// ==========================================
/**
 * Mostra uma tela de carregamento enquanto
 * o site carrega. Desaparece automaticamente
 * quando a página estiver pronta.
 * 
 * COMO EDITAR:
 * - Altere a imagem do logo (src)
 * - Altere o tempo em setTimeout (ms)
 */
const initLoadingScreen = () => {
    if (document.getElementById('preloader')) return;

    // Cria o elemento da tela de carregamento
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-logo">
            <img src="./assets/images/logo.png" alt="Boteco Taberna" style="height: 80px;">
        </div>
    `;
    document.body.prepend(loadingScreen);

    // Quando a página terminar de carregar
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            // Remove o elemento após a transição
            setTimeout(() => {
                loadingScreen.remove();
            }, 600);
        }, 500);
    });

    // Fallback: esconde após 3s se o load não funcionar
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => loadingScreen.remove(), 600);
        }
    }, 3000);
};

// ==========================================
// CARREGAMENTO SOB DEMANDA (LAZY LOAD)
// ==========================================
/**
 * Carrega imagens apenas quando elas
 * aparecem na tela (melhora a performance).
 * 
 * COMO USAR NO HTML:
 * <img data-src="imagem.jpg" alt="..." loading="lazy">
 * 
 * Em vez de src="...", use data-src="..."
 * que esta função cuidará de carregar.
 */
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    // Se a imagem falhar, carrega uma padrão
                    img.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e6fd?w=400&h=300&fit=crop&q=80';
                    img.classList.add('loaded');
                });
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
};

// ==========================================
// ROLAGEM SUAVE (SMOOTH SCROLL)
// ==========================================
/**
 * Faz a rolagem suave ao clicar em links
 * internos (âncoras como #secao).
 * 
 * COMO USAR NO HTML:
 * <a href="#secao">Ir para seção</a>
 */
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 100; // Altura do cabeçalho fixo
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ==========================================
// SISTEMA DE NOTIFICAÇÕES (TOAST)
// ==========================================
/**
 * Mostra uma notificação temporária no canto
 * inferior direito da tela.
 * 
 * @param {string} message - A mensagem a exibir
 * @param {string} icon - Classe do ícone Font Awesome
 * 
 * COMO USAR:
 * showNotification('Mensagem aqui', 'fa-check-circle');
 * showNotification('Erro!', 'fa-exclamation-circle');
 */
const showNotification = (message, icon = 'fa-check-circle') => {
    // Remove notificação anterior se existir
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Cria a notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    // Mostra com animação
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Auto-destruição após 3.5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3500);
};

// ==========================================
// VALIDAÇÃO DE FORMULÁRIOS
// ==========================================
/**
 * Valida os campos obrigatórios de um formulário.
 * 
 * @param {HTMLElement} form - O formulário a validar
 * @returns {boolean} - true se válido, false se inválido
 * 
 * COMO USAR:
 * if (validateForm(meuForm)) { enviar(); }
 */
const validateForm = (form) => {
    let isValid = true;
    const inputs = form.querySelectorAll('[required]');
    
    inputs.forEach(input => {
        const errorSpan = input.parentElement.querySelector('.form__error');
        if (!errorSpan) return;
        
        // Reseta o estado
        input.classList.remove('form__input--error', 'form__input--success');
        errorSpan.classList.remove('visible');
        
        if (!input.value.trim()) {
            errorSpan.textContent = 'Este campo é obrigatório';
            errorSpan.classList.add('visible');
            input.classList.add('form__input--error');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            errorSpan.textContent = 'Email inválido';
            errorSpan.classList.add('visible');
            input.classList.add('form__input--error');
            isValid = false;
        } else {
            input.classList.add('form__input--success');
        }
    });
    
    return isValid;
};

/**
 * Verifica se um email é válido.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ==========================================
// INICIALIZAÇÃO - EXECUTA AO CARREGAR
// ==========================================
/**
 * Tudo aqui dentro executa automaticamente
 * quando a página é carregada.
 */
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();  // Tela de carregamento
    lazyLoadImages();     // Carregamento sob demanda
    smoothScroll();       // Rolagem suave
});

// Otimizações leves para imagens não essenciais:
// - marca imagens não-críticas como `loading=lazy`
// - define `decoding=async` para melhorar paint
document.addEventListener('DOMContentLoaded', () => {
    const criticalSelectors = ['#logo', '.preloader__logo'];
    const imgs = Array.from(document.querySelectorAll('img'));
    imgs.forEach(img => {
        const isCritical = criticalSelectors.some(sel => img.closest(sel) || img.matches(sel));
        if (isCritical) return;
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
    });
});

// ==========================================
// EXPORTAÇÃO - DISPONÍVEL GLOBALMENTE
// ==========================================
/**
 * Disponibiliza funções para outros arquivos JS.
 * 
 * COMO USAR EM OUTROS ARQUIVOS:
 * window.Taberna.debounce(minhaFuncao, 200);
 * window.Taberna.showNotification('Olá!');
 */
window.Taberna = {
    debounce,
    throttle,
    showNotification,
    validateForm
};