import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar e substituir o hero carrossel por um hero único
# Procura pelo início do hero até o fechamento da section
pattern = r'<!--\s*===========================================\s*-->\s*<!--\s*SEÇÃO HOME - HERO CARROSSEL PREMIUM\s*-->\s*<section class="hero hero--carousel"[^>]*>.*?</section>'

replacement = '''<!-- ==========================================
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

content_new = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content_new)

print("Hero simplificado com sucesso!")