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

## Notícias automáticas da Tribuna do Paraná

O feed é `https://www.tribunapr.com.br/feed/`, confirmado pelo link “Feed RSS” do site da própria Tribuna. A importação grava apenas título, resumo curto, metadados, imagem e a URL individual da matéria. A API `news.listCurrent` mostra somente notícias do ciclo de hoje no horário de São Paulo. A migration `drizzle/pg/0001_little_mandrill.sql` cria apenas a tabela `news` e seus índices; ela deve ser aplicada antes da primeira execução do cron.

O `render.yaml` declara um serviço Cron Job adicional no Render. Ao sincronizar o Blueprint com a branch `main`, confirmar que o serviço foi criado e está ativo no painel do Render. O plano `0.5c-512mb` é cobrado pelo Render conforme o tempo de execução:

- Repositório e branch: os mesmos da aplicação, branch `main`.
- Runtime: Node.js; build command: `pnpm install --frozen-lockfile --prod=false`.
- Schedule: `0 11,17 * * *` (Render usa UTC; corresponde a 08h e 14h em `America/Sao_Paulo` enquanto o fuso estiver em UTC−3).
- Command: `pnpm exec tsx scripts/sync-news.ts auto`.
- Variável de ambiente: `DATABASE_URL`, usando a conexão PostgreSQL acessível pelo Cron Job. Nenhuma nova chave ou senha precisa ser criada no código.

O comando identifica a fase pelo horário em São Paulo: às 08h inicia o conjunto diário; às 14h completa ou substitui matérias conforme recência e diversidade das seções presentes nas URLs do RSS. Não inventa categorias ausentes do feed. Falhas de RSS encerram apenas a execução do cron e preservam os registros válidos; a API e as demais páginas continuam independentes. O banco retém até 60 dias de registros dessa tabela e a API retorna no máximo 10 notícias ativas do dia atual. Se houver mudança legal no fuso de São Paulo, revisar a expressão UTC do Render.

Para executar o primeiro ciclo imediatamente, abra o Cron Job no painel do Render, entre em **Runs** e clique em **Trigger Run**. O modo `auto` escolhe manhã antes das 14h e tarde a partir das 14h em São Paulo, permitindo esse teste manual mesmo fora do horário agendado. Também é possível usar `morning` ou `afternoon` no lugar de `auto` em uma execução direta do comando. Isso grava dados no mesmo PostgreSQL configurado para o job; confirme que é o mesmo banco usado pelo Vercel. O Cron Job é um serviço adicional ao serviço web gratuito existente.
