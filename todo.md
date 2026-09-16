# Project TODO

## Backend e Banco de Dados
- [x] Criar schema: comércios (name, category, address, phone, instagram, lat, lng, coordsJson)
- [x] Criar schema: denúncias (name, phone, type, address, description, status)
- [x] Criar schema: sugestões (name, email, phone, type, message, status)
- [x] Criar schema: eventos (title, category, date, time, location, organizer, description)
- [x] Criar schema: telefones úteis (name, category, phone, address)
- [x] Criar procedures tRPC para CRUD de todas as tabelas
- [x] Atualizar AdminDashboard para buscar dados do banco real
- [x] Atualizar página Mapa para salvar comércios no banco
- [x] Atualizar página Denúncias para salvar no banco
- [x] Atualizar página Sugestões para salvar no banco
- [x] Testar painel admin com dados reais

## Correções de conteúdo
- [x] Corrigir todos endereços para região Campo Comprido (Barigui/Orleans/Gabinete)
- [x] Corrigir coordenadas de todos os comércios para região Campo Comprido
- [x] Adicionar overlay escuro no carrossel para legibilidade
- [x] Adicionar mais fotos da região de Curitiba

## Correções visuais e conteúdo real
- [x] Remover logo verde com casinha do Header
- [x] Texto do Header em linha única (sem quebra)
- [x] Corrigir sobreposição no hero mobile
- [x] Substituir estatísticas fake por dados reais (30.000 moradores, 3,72 km²)
- [x] Implementar upload de fotos no formulário de adicionar comércio
- [x] Implementar modo escuro com toggle no header

## Novos itens solicitados (atual)

- [x] Adicionar 10-15 escolas reais do Campo Comprido
- [x] Adicionar 10-15 açougues do Campo Comprido
- [x] Adicionar 10-15 mercados/supermercados do Campo Comprido
- [x] Adicionar 10-15 postos de saúde/UBS do Campo Comprido
- [x] Adicionar 10-15 farmácias do Campo Comprido
- [x] Adicionar 10-15 padarias/cafés do Campo Comprido
- [x] Adicionar 10-15 restaurantes/lanchonetes do Campo Comprido
- [x] Adicionar 10-15 academias do Campo Comprido
- [x] Adicionar 10-15 salões de beleza do Campo Comprido
- [x] Adicionar 10-15 lojas de comércio variado do Campo Comprido
- [x] Adicionar 10-15 pet shops do Campo Comprido
- [x] Adicionar 10-15 igrejas do Campo Comprido
- [x] Adicionar opção para o usuário cadastrar serviço na página de Serviços
- [x] Garantir mapa interativo visível automaticamente na página de Serviços
- [x] Mapa da página Mapa.tsx aparece automaticamente (verificado - OK)

## Feedback atual (a fazer)
- [x] Corrigir botão dark mode (não funciona no desktop)
- [x] Adicionar aba "Admin" visível no desktop
- [x] Reduzir excesso de abas no menu de navegação
- [x] Mesclar/consolidar Serviços/Comércio/Mapa (funções parecidas)
- [x] Adicionar imagem impactante na seção Denúncias
- [x] Agrupar filtros de notícias em dropdown (Todas/Segurança/Obras/Eventos/Saúde/Educação)

## Dark mode fixes (feedback atual)
- [x] Corrigir cards brancos no dark mode (texto claro invisível dentro de cards brancos)
- [x] Adicionar toggle de tema no painel Admin
- [x] Corrigir cores do AdminLogin no dark mode
- [x] Corrigir cores do AdminDashboard no dark mode (tabs, table headers, inputs)
- [x] Corrigir cards de comércios no dark mode (título claro, endereço claro)

## Feedback 3 (a fazer)
- [x] Remover botão mapa da página Comércio (cards devem ficar sempre visíveis)
- [x] Corrigir textos transparentes na aba Eventos (dark mode)
- [x] Adicionar botão para cadastrar evento na página Eventos
- [x] Corrigir textos transparentes na aba Denúncias (dark mode)
- [x] Adicionar imagem hero em todas as abas: Sugestões, Telefones, Eventos, Comércio, Notícias
- [x] Logo "Conectando a Comunidade" em maiúsculas com fonte diferente

## Feedback 4 (a fazer)
- [x] Adicionar foto hero na aba Serviços
- [x] Agrupar cards de serviços por categoria com accordion (evitar página infinita)

## Feedback 5 (a fazer)
- [x] Melhorar accordion dos Serviços: clicar na categoria principal abre subsegmentos (Saúde > Hospitais/UBS/Farmácias, etc.)
- [x] Adicionar foto hero na página Sobre o projeto
- [x] Remover seção "Alinhamento com os ODS" da página Sobre
- [x] Remover o quadro com a casinha (logo verde) da página Sobre
- [x] Trocar foto do hero da aba Telefones (atual é de ônibus BRT, combina)
- [x] Popup ao clicar no telefone mostra info do contato (nome, número, categoria, descrição)
- [x] Notícias: atualizadas com informações de 2026 (BRT, vacinação, festival, etc.)
- [x] Galeria: removidas abas de filtro (mostra todas as fotos)
- [x] Galeria: adicionadas fotos do terminal, viaduto Orleans, canaleta, Teatro Positivo, BRT, Parque Barigui

## Feedback 6 (a fazer)
- [x] Criar tabela de reviews no banco de dados (user, comércio/serviço, estrelas, comentário)
- [x] Criar tabela de mural no banco de dados (nome, mensagem, categoria)
- [x] Adicionar sistema de avaliação com estrelas nos cards de comércio (Comércio)
- [x] Adicionar sistema de avaliação com estrelas nos cards de serviços (Serviços)
- [x] Exibir reviews com média de estrelas nos cards
- [x] Criar página/seção Mural da Comunidade com comentários interativos
- [x] Adicionar link do Mural na navegação
- [x] Admin dashboard: abas Mural (aprovar/rejeitar) e Avaliações (ver/remover)

- [x] Trocar imagens foscas do carrossel da Home por fotos nítidas
- [x] Trocar imagens foscas da Galeria por fotos nítidas

- [x] Agrupar cards de Comércio em accordion por categoria (recolhidos por padrão)
- [x] Restaurar o mapa interativo na página de Comércio com pins dos comércios

- [x] Popular lat/lng reais dos 135 comércios no banco
- [x] Mostrar um pin por comércio no mapa (com info: nome, categoria, endereço)

- [x] Geocodificar endereços reais dos 135 comércios via Google Geocoding API e atualizar lat/lng no banco
