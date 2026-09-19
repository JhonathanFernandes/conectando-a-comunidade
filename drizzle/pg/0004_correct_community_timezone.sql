UPDATE "suggestions"
SET "createdAt" = "createdAt" + INTERVAL '3 hours'
WHERE "name" IN ('Mariana Oliveira', 'Carlos Eduardo Souza', 'Ana Paula Ribeiro', 'Rafael Martins', 'Juliana Ferreira', 'Bruno Henrique Lima', 'Fernanda Alves', 'Paulo Roberto Mendes', 'Camila Rodrigues', 'Lucas Pereira');--> statement-breakpoint

UPDATE "muralPosts"
SET "createdAt" = "createdAt" + INTERVAL '3 hours'
WHERE "authorName" IN ('Patrícia Gomes', 'Marcelo dos Santos', 'Renata Carvalho', 'André Luiz Costa', 'Sônia Aparecida', 'Felipe Almeida', 'Márcia Fernandes', 'Ricardo Nunes', 'Daniela Moreira');
