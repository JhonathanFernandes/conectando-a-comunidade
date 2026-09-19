# Conectando a Comunidade — Campo Comprido

Portal comunitário do bairro Campo Comprido, em Curitiba, com diretório de
serviços e comércios, eventos, notícias, mural, avaliações, telefones úteis,
canal de denúncias e painel administrativo.

## Requisitos

- Node.js 20 ou superior
- pnpm 10
- PostgreSQL acessível pela aplicação

## Executar localmente

1. Instale as dependências:

   ```bash
   pnpm install --frozen-lockfile
   ```

2. Copie `.env.example` para `.env` e preencha as variáveis obrigatórias.

3. Aplique as migrações:

   ```bash
   node scripts/migrate-postgres.mjs
   ```

4. Inicie o ambiente de desenvolvimento:

   ```bash
   pnpm dev
   ```

A aplicação fica disponível em `http://localhost:3000`.

## Validação antes da entrega

```bash
pnpm validate
```

Esse comando verifica os tipos TypeScript, executa os testes automatizados e
gera o build de produção.

## Publicação

O projeto está preparado para publicação no Vercel ou no Render. As instruções
de configuração, migrações, painel administrativo e atualização automática de
notícias estão em [DEPLOYMENT.md](./DEPLOYMENT.md).

Variáveis obrigatórias em produção:

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Nunca envie o arquivo `.env` ou credenciais reais ao repositório.

## Principais rotas

- `/` — página inicial
- `/servicos` e `/comercio` — diretórios locais
- `/eventos`, `/noticias` e `/mural` — conteúdo comunitário
- `/denuncias` e `/sugestoes` — formulários da comunidade
- `/admin` — acesso ao painel administrativo

## Tecnologias

React, TypeScript, Vite, Express, tRPC, PostgreSQL, Drizzle ORM, Tailwind CSS e
Vitest.

