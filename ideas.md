# Brainstorm de Design — Campo Comprido Plataforma Comunitária

## Três Abordagens Estilísticas

### 1. Terra Viva — Organic Warmth
Uma abordagem quente e orgânica que remete à terra, verde e comunidade. Usa tons de verde-musgo, terracota e areia com tipografia humanista. Evoca a sensação de um bairro acolhedor e vivo.

**Probability: 0.07**

### 2. Neo-Brutalismo Comunitário
Layout ousado com bordas grossas, cores saturadas, tipografia condensada e um visual que prioriza a funcionalidade e acessibilidade. Inspirado em pôsteres comunitários e sinalização urbana.

**Probability: 0.03**

### 3. Horizonte Urbano — Cityscape Modern
Design contemporâneo e limpo inspirado no skyline de Curitiba. Usa azuis profundos, cinzas quentes e brancos crispados. Layouts assimétricos com sobreposições de fotos urbanas e tipografia geométrica.

**Probability: 0.08**

---

## Abordagem Escolhida: Terra Viva — Organic Warmth

### Design Movement
Inspirado no **Biophilic Design** e no movimento de design comunitário brasileiro, combinando a estética natural com a funcionalidade urbana. Referência visual aos parques e áreas verdes de Curitiba (como o Lago do Barigui próximo ao Campo Comprido).

### Core Principles
1. **Calor humano** — Cores e formas que transmitem acolhimento e pertencimento ao bairro
2. **Organização natural** — Layouts fluidos que evitam rigidez excessiva, como ruas e praças
3. **Acessibilidade visual** — Contraste forte, tipografia legível, ícones claros para todos os moradores
4. **Identidade local** — Elementos visuais que remetem a Curitiba e ao Campo Comprido

### Color Philosophy
- **Verde Musgo (#3D6B4F)** — Cor primária. Representa os parques, árvores e a vida do bairro. É a cor da esperança e renovação.
- **Terracota (#C4622A)** — Cor de destaque/CTA. Representa a terra, os tijolos, a construção do bairro. Transmite energia e ação.
- **Areia Quente (#F5E6D0)** — Background secundário. Cria conforto visual e lembra o sol do Paraná.
- **Grafite (#2D2D2D)** — Texto principal. Legibilidade máxima.
- **Branco Off (#FDFCF8)** — Background principal. Quente, não frio.

### Layout Paradigm
Layout baseado em **blocos irregulares e sobrepostos** inspirados na topografia do bairro. Seções com bordas curvas suaves, cards com cantos assimétricos (alguns arredondados, outros retos), e um grid que respira com whitespace generoso.

### Signature Elements
1. **Ondas suaves** — Divisores de seção com curvas orgânicas que remetem às colinas de Curitiba
2. **Cards com bordas duplas** — Alguns cards com uma borda decorativa em terracota que evoca molduras de fotos antigas do bairro
3. **Ícones em badge circular** — Categorias e estatísticas com círculos em verde musgo

### Interaction Philosophy
Interações suaves e naturais, como folhas ao vento. Hover effects com transições lentas (250ms), botões que "crescem" levemente. Nada agressivo ou mecânico.

### Animation
- Entradas com fade-up suave (opacity 0→1, translateY 20px→0) com stagger de 60ms
- Hover em cards: leve elevação (translateY -4px) com sombra mais profunda
- Carrossel: transição suave com easing cubic-bezier(0.23, 1, 0.32, 1)
- Botões: scale(0.97) no active, 160ms
- Nada de keyframes repetitivos — apenas transições responsivas

### Typography System
- **Display/Headlines**: `Playfair Display` (Google Fonts) — serif elegante que transmite tradição e comunidade
- **Body**: `Source Sans 3` (Google Fonts) — sans-serif limpa e legível para leitura densa
- **Hierarchy**: H1 = 3rem/700, H2 = 2rem/600, H3 = 1.25rem/600, Body = 1rem/400
- **Letter-spacing**: Headlines com tracking leve (+0.02em)

### Brand Essence
"A voz digital do Campo Comprido — conectando moradores, serviços e a alma do bairro."
**Personalidade**: Acolhedora, Prática, Raiz

### Brand Voice
- Headlines: diretas e com identidade local. Ex: "Seu bairro, sua voz."
- CTAs: convidativos e simples. Ex: "Faça sua denúncia", "Conheça o comércio"
- Microcopy: amigável e acessível. Ex: "Encontramos 23 serviços perto de você"
- **Proibido**: "Welcome to our website", "Get started today", "Discover more"

### Wordmark & Logo
Um símbolo de **casa estilizada com uma árvore crescendo do telhado** — em verde musgo sobre fundo transparente. Representa o lar (comunidade) e a natureza (Curitiba = Cidade Modelo Verde).

### Signature Brand Color
**Verde Musgo (#3D6B4F)** — oklch(0.45 0.08 160) — é a cor que define toda a identidade visual. Usada em headers, botões primários, ícones e divisores.
