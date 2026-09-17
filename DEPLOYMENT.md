# Publicação no Vercel

O Vercel deve receber o projeto inteiro, a partir da raiz deste repositório. O `vercel.json` publica o frontend Vite e envia as chamadas `/api/*` para uma função Node.js que usa as mesmas rotas do servidor local.

## Configuração

1. Importar o repositório no Vercel com a raiz do projeto. O comando de build e a pasta de saída já estão em `vercel.json`.
2. Adicionar as variáveis de ambiente `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` no Vercel. Usar uma conexão PostgreSQL acessível publicamente pelo Vercel; endereços internos do Render não funcionam fora do Render.
3. Publicar. O build executa as migrações do banco, compila o frontend e empacota a função da API. Se a conexão com o banco estiver ausente, o deploy falha em vez de publicar formulários sem persistência. Para PostgreSQL no Render, use a URL externa com `sslmode=require`.
4. Confirmar que `https://SEU-DOMINIO/api/trpc/complaint.listPublic` responde com HTTP 200 e acessar `https://SEU-DOMINIO/admin` com o usuário e a senha definidos no Vercel.

Fotos enviadas pelo formulário dependem das variáveis de armazenamento usadas em `server/storage.ts`. O cadastro sem foto continua funcionando se esse serviço não estiver configurado.

## Endereço antigo do GitHub Pages

Depois que o Vercel estiver funcionando, definir a variável de repositório `PUBLIC_APP_URL` com a origem HTTPS do novo site, sem caminho final (por exemplo, `https://meu-site.vercel.app`). O workflow do GitHub Pages testa a API antes de publicar um redirecionamento do endereço antigo para o Vercel.
