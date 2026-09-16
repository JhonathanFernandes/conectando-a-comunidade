# Conectando a Comunidade

Plataforma web comunitária para o bairro Campo Comprido, em Curitiba - PR. O projeto reúne informações úteis para moradores, com foco em serviços locais, comércio, denúncias, sugestões, eventos, mural da comunidade, telefones úteis e mapa.

Este repositório faz parte de um projeto acadêmico de extensão do curso de Análise e Desenvolvimento de Sistemas, com o objetivo de aproximar tecnologia e necessidades reais da comunidade.

## Objetivo

Facilitar o acesso a informações do bairro e oferecer canais digitais para participação comunitária. A aplicação busca centralizar dados que normalmente ficam espalhados em redes sociais, conversas informais ou canais difíceis de acompanhar.

## Funcionalidades

- Página inicial com visão geral da comunidade.
- Catálogo de serviços e comércio local.
- Cadastro e avaliação de comércios.
- Mapa da região.
- Registro de denúncias comunitárias.
- Envio de sugestões.
- Divulgação de eventos.
- Mural da comunidade com moderação.
- Lista de telefones úteis.
- Galeria, notícias, FAQ e página sobre o projeto.
- Área administrativa para acompanhamento e moderação de cadastros.

## Tecnologias

- React 19
- TypeScript
- Vite
- Wouter
- Tailwind CSS
- Radix UI
- Express
- tRPC
- Drizzle ORM
- MySQL
- Vitest
- pnpm

## Estrutura do projeto

```text
client/                 Aplicação React
client/src/pages/       Páginas da interface
client/src/components/  Componentes reutilizáveis
server/                 Servidor Express, API tRPC e integrações
drizzle/                Schema e migrações do banco
shared/                 Tipos e constantes compartilhadas
patches/                Patches de dependências usados pelo pnpm
```

## Requisitos

- Node.js 24 ou superior
- pnpm
- Banco MySQL disponível para uso da aplicação

## Configuração

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
JWT_SECRET="troque-por-um-segredo-seguro"
OWNER_OPEN_ID=""
VITE_APP_ID=""
OAUTH_SERVER_URL=""
BUILT_IN_FORGE_API_URL=""
BUILT_IN_FORGE_API_KEY=""
PORT=3000
```

Observações:

- `DATABASE_URL` é necessária para as migrações e para gravar dados no MySQL.
- `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL` e `OWNER_OPEN_ID` são usados no fluxo de autenticação.
- `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` habilitam recursos de proxy de mapas, storage e upload de imagens.
- Em ambiente local, partes públicas da aplicação podem abrir mesmo sem todas as integrações configuradas, mas funcionalidades que dependem de banco, autenticação, mapas ou upload podem ficar limitadas.

## Instalação

```bash
pnpm install
```

## Banco de dados

Com o `.env` configurado, gere e aplique as migrações:

```bash
pnpm db:push
```

## Rodando em desenvolvimento

```bash
pnpm dev
```

Por padrão, a aplicação inicia em `http://localhost:3000`. Se a porta estiver ocupada, o servidor procura automaticamente uma porta livre próxima.

## Build de produção

```bash
pnpm build
pnpm start
```

## Scripts disponíveis

```bash
pnpm dev       # inicia o servidor em modo desenvolvimento
pnpm build     # gera o build da aplicação
pnpm start     # executa a versão de produção
pnpm check     # valida os tipos TypeScript
pnpm test      # executa os testes
pnpm format    # formata o código com Prettier
pnpm db:push   # gera e aplica migrações do Drizzle
```

## Modelo de dados

O schema principal está em `drizzle/schema.ts` e inclui tabelas para:

- usuários;
- comércios;
- denúncias;
- sugestões;
- eventos;
- telefones úteis;
- avaliações;
- mural da comunidade.

## Contexto acadêmico

**Curso:** Análise e Desenvolvimento de Sistemas  
**Instituição:** Centro Universitário Internacional UNINTER  
**Modalidade:** Projeto de extensão / atividade acadêmica  
**Área:** Tecnologia da Informação e Desenvolvimento Comunitário  
**Local de aplicação:** Campo Comprido, Curitiba - PR

## Autor

Jhonathan Silva Fernandes

## Licença

Projeto desenvolvido para fins acadêmicos. O `package.json` declara licença MIT para o código deste repositório.
