UPDATE "suggestions"
SET "createdAt" = CASE "message"
  WHEN 'Seria muito útil instalar mais bancos e áreas cobertas próximas ao Terminal Campo Comprido para quem aguarda o transporte.' THEN TIMESTAMP '2026-08-12 08:37:00'
  WHEN 'Sugiro reforçar a iluminação pública nas ruas próximas ao terminal e aos principais pontos de ônibus do bairro.' THEN TIMESTAMP '2026-08-16 19:14:00'
  WHEN 'Poderia haver mais lixeiras para coleta seletiva em pontos movimentados do Campo Comprido.' THEN TIMESTAMP '2026-08-21 12:46:00'
  WHEN 'Uma feira comunitária periódica ajudaria pequenos produtores, artesãos e comerciantes da região.' THEN TIMESTAMP '2026-08-26 16:22:00'
  WHEN 'Sugiro a instalação de bicicletários próximos ao terminal e aos espaços públicos mais frequentados.' THEN TIMESTAMP '2026-08-30 10:08:00'
  WHEN 'Seria importante melhorar a sinalização das faixas de pedestres perto das escolas e unidades de saúde do bairro.' THEN TIMESTAMP '2026-09-03 07:51:00'
  WHEN 'Gostaria de sugerir mais atividades culturais e oficinas gratuitas para crianças e adolescentes da comunidade.' THEN TIMESTAMP '2026-09-07 14:33:00'
  WHEN 'Uma campanha comunitária de conscientização sobre descarte correto de resíduos seria muito bem-vinda.' THEN TIMESTAMP '2026-09-11 18:05:00'
  WHEN 'Sugiro ampliar a acessibilidade das calçadas, principalmente nos trajetos utilizados por idosos e pessoas com mobilidade reduzida.' THEN TIMESTAMP '2026-09-15 09:27:00'
  WHEN 'Seria interessante criar mais espaços de convivência com árvores, bancos e brinquedos para as famílias do bairro.' THEN TIMESTAMP '2026-09-18 20:11:00'
  ELSE "createdAt"
END
WHERE "message" IN (
  'Seria muito útil instalar mais bancos e áreas cobertas próximas ao Terminal Campo Comprido para quem aguarda o transporte.',
  'Sugiro reforçar a iluminação pública nas ruas próximas ao terminal e aos principais pontos de ônibus do bairro.',
  'Poderia haver mais lixeiras para coleta seletiva em pontos movimentados do Campo Comprido.',
  'Uma feira comunitária periódica ajudaria pequenos produtores, artesãos e comerciantes da região.',
  'Sugiro a instalação de bicicletários próximos ao terminal e aos espaços públicos mais frequentados.',
  'Seria importante melhorar a sinalização das faixas de pedestres perto das escolas e unidades de saúde do bairro.',
  'Gostaria de sugerir mais atividades culturais e oficinas gratuitas para crianças e adolescentes da comunidade.',
  'Uma campanha comunitária de conscientização sobre descarte correto de resíduos seria muito bem-vinda.',
  'Sugiro ampliar a acessibilidade das calçadas, principalmente nos trajetos utilizados por idosos e pessoas com mobilidade reduzida.',
  'Seria interessante criar mais espaços de convivência com árvores, bancos e brinquedos para as famílias do bairro.'
);--> statement-breakpoint

UPDATE "muralPosts"
SET "createdAt" = CASE "message"
  WHEN 'Muito bom ter um espaço onde podemos acompanhar notícias, eventos e serviços do Campo Comprido em um só lugar.' THEN TIMESTAMP '2026-08-10 09:18:00'
  WHEN 'Encontrei informações úteis sobre os comércios da região. A iniciativa ajuda bastante quem mora no bairro.' THEN TIMESTAMP '2026-08-15 17:42:00'
  WHEN 'Parabéns pelo projeto. O mural pode aproximar os moradores e facilitar a troca de informações importantes.' THEN TIMESTAMP '2026-08-20 11:06:00'
  WHEN 'Gostei da proposta de valorizar os serviços e os pequenos negócios do Campo Comprido.' THEN TIMESTAMP '2026-08-25 19:35:00'
  WHEN 'A página de telefones úteis ficou muito prática. Já deixei salva para consultar quando precisar.' THEN TIMESTAMP '2026-08-29 08:24:00'
  WHEN 'Que bom contar com um canal para enviar sugestões e acompanhar assuntos relacionados à comunidade.' THEN TIMESTAMP '2026-09-02 13:57:00'
  WHEN 'As fotos do bairro ficaram bonitas e ajudam a reconhecer os lugares que fazem parte da nossa rotina.' THEN TIMESTAMP '2026-09-06 16:09:00'
  WHEN 'Espero que mais moradores participem do mural e compartilhem ideias para melhorar o Campo Comprido.' THEN TIMESTAMP '2026-09-12 10:41:00'
  WHEN 'A agenda de eventos é muito útil para descobrir atividades em Curitiba e programar o fim de semana.' THEN TIMESTAMP '2026-09-18 18:26:00'
  ELSE "createdAt"
END
WHERE "message" IN (
  'Muito bom ter um espaço onde podemos acompanhar notícias, eventos e serviços do Campo Comprido em um só lugar.',
  'Encontrei informações úteis sobre os comércios da região. A iniciativa ajuda bastante quem mora no bairro.',
  'Parabéns pelo projeto. O mural pode aproximar os moradores e facilitar a troca de informações importantes.',
  'Gostei da proposta de valorizar os serviços e os pequenos negócios do Campo Comprido.',
  'A página de telefones úteis ficou muito prática. Já deixei salva para consultar quando precisar.',
  'Que bom contar com um canal para enviar sugestões e acompanhar assuntos relacionados à comunidade.',
  'As fotos do bairro ficaram bonitas e ajudam a reconhecer os lugares que fazem parte da nossa rotina.',
  'Espero que mais moradores participem do mural e compartilhem ideias para melhorar o Campo Comprido.',
  'A agenda de eventos é muito útil para descobrir atividades em Curitiba e programar o fim de semana.'
);
