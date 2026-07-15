import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Substitui o hero carrossel por um hero único simples
old_hero = '''    <!-- ==========================================
         SEÇÃO HOME - HERO CARROSSEL PREMIUM
         ========================================== -->
    <section class="hero hero--carousel" id="home" aria-label="Hero principal do Boteco Taberna" data-autoplay="6500">
        <div class="hero__slider" aria-live="polite">
            <article class="hero__slide is-active" data-image="assets/images/banner01.png" aria-hidden="false">
                <div class="hero__backdrop" aria-hidden="true"></div>
                <div class="hero__content">
                    
                    <p class="hero__eyebrow">Ambiente premium • Música ao vivo • Drinks exclusivos</p>
                    <h1 class="hero__title">Experimente o melhor da noite</h1>
                    <p class="hero__description">Um espaço acolhedor com petiscos artesanais, churrasco premium e o clima perfeito para reunir amigos.</p>
                    <div class="hero__actions">
                        <a href="#sobre" class="hero__btn hero__btn--primary">Conheça o espaço</a>
                        <a href="#cardapio" class="hero__btn hero__btn--secondary">Ver menu</a>
                    </div>
                </div>
            </article>

            <article class="hero__slide" data-image="assets/images/baner1.jpg" aria-hidden="true">
                <div class="hero__backdrop" aria-hidden="true"></div>
                <div class="hero__content">
                    
                    <p class="hero__eyebrow">Happy hour • Música ao vivo</p>
                    <h1 class="hero__title">A noite perfeita começa aqui</h1>
                    <p class="hero__description">Happy hour especial, boa música e um ambiente que convida a ficar mais um pouco.</p>
                    <div class="hero__actions">
                        <a href="#sobre" class="hero__btn hero__btn--primary">Veja os eventos</a>
                        <a href="#cardapio" class="hero__btn hero__btn--secondary">Explorar menu</a>
                    </div>
                </div>
            </article>

            <article class="hero__slide" data-image="assets/images/hero-banner.jpg" aria-hidden="true">
                <div class="hero__backdrop" aria-hidden="true"></div>
                <div class="hero__content">
                    
                    <a href="#sobre" class="hero__btn hero__btn--primary">Reservar mesa</a>
                    <a href="#cardapio" class="hero__btn hero__btn--secondary">Ver petiscos</a>
                </div>
            </article>
        </div>

        <div class="hero__nav" aria-label="Navegação do hero">
            <button class="hero__arrow" type="button" data-action="prev" aria-label="Slide anterior">
                <i class="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button class="hero__arrow" type="button" data-action="next" aria-label="Próximo slide">
                <i class="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
        </div>

        <div class="hero__indicators" aria-label="Indicadores do carrossel"></div>
    </section>'''

new_hero = '''    <!-- ==========================================
         SEÇÃO HOME - HERO ÚNICO
         ========================================== -->
    <section class="hero" id="home" aria-label="Hero principal do Boteco Taberna">
        <div class="hero__backdrop" aria-hidden="true"></div>
        <div class="hero__content">
            <img class="hero__logo" src="assets/images/logocompleto.png" alt="Logo Boteco Taberna">
            <p class="hero__eyebrow">Ambiente premium • Música ao vivo • Drinks exclusivos</p>
            <h1 class="hero__title">Experimente o melhor da noite</h1>
            <p class="hero__description">Um espaço acolhedor com petiscos artesanais, churrasco premium e o clima perfeito para reunir amigos.</p>
            <div class="hero__actions">
                <a href="#sobre" class="hero__btn hero__btn--primary">Conheça o espaço</a>
                <a href="#cardapio" class="hero__btn hero__btn--secondary">Ver menu</a>
            </div>
        </div>
    </section>'''

content = content.replace(old_hero, new_hero)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Hero section simplificado com sucesso!")