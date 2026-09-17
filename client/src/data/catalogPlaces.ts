// Nome, endereço e fonte pública de cada referência editorial.
// A presença no catálogo não equivale a um cadastro aprovado no banco.
type Place = [category: string, name: string, address: string, source: string, description?: string];

export const catalogPlaces: Place[] = [
  // Farmácias
  ["Farmácias", "Farmácias Descontão Campo Comprido", "Rua Eduardo Sprada, 5053, Campo Comprido, Curitiba", "https://site.farmaciasdescontao.com.br/lojas-cidade/curitiba"],
  ["Farmácias", "Farmácia Campofarma", "Rua Eduardo Sprada, 4600, Campo Comprido, Curitiba", "https://www.apontador.com.br/local/pr/curitiba/farmacias_e_drogarias/EAUQ7QDZ/farmacia_campofarma_campo_comprido.html"],
  ["Farmácias", "Farmácias Nissei João Falarz", "Rua Professor João Falarz, 1709, Campo Comprido, Curitiba", "https://www.lojas24.com/curitiba/farmacias-nissei/r-prof-joao-falarz-1709-67/"],
  ["Farmácias", "Farmácia Pague Menos", "Rua Professor João Falarz, 1694, Campo Comprido, Curitiba", "https://www.locaisdobrasil.com.br/encontre/farmacias/campo-comprido/curitiba-pr"],

  // Mercados
  ["Mercados", "Super Michel", "Rua Padre José Lopacinski, 740, Campo Comprido, Curitiba", "https://supermichel.com.br/"],
  ["Mercados", "Supermercado Tissi", "Rua Eduardo Sprada, 5105, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/mercados-e-supermercados/supermercados"],
  ["Mercados", "Mercado Rocha e Sierra", "Rua Luiz Tramontin, 2215, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/mercados-e-supermercados/supermercados"],
  ["Mercados", "Mercado da Praça", "Rua Waldemar Cavanha, 945, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/mercados-e-supermercados/supermercados"],

  // Açougues
  ["Açougues", "Açougue Culpi", "Rua Professor João Falarz, 900, Orleans, Curitiba", "https://imageage0.wixsite.com/acougueculpi"],
  ["Açougues", "Frigorífico Bizinelli", "Rua Maria Bizinelli, 530, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/aves-carnes-e-pescados/acougues-e-frigorificos"],
  ["Açougues", "Açougue da Família", "Rua Eduardo Sprada, 4649, loja 2, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/aves-carnes-e-pescados/acougues-e-frigorificos"],
  ["Açougues", "Açougue São Gabriel", "Rua Waldemar Cavanha, 267, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/aves-carnes-e-pescados/acougues-e-frigorificos"],
  ["Açougues", "Comercial Paulista de Carnes", "Rua Rio do Sul, 2536, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/aves-carnes-e-pescados/acougues-e-frigorificos"],

  // Pet shops
  ["Pet Shops", "Aviário Belga", "Rua Eduardo Sprada, 4749, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/servicos-para-animais/pet-shop"],
  ["Pet Shops", "Aviário Juriti", "Rua Eduardo Sprada, 5437, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/servicos-para-animais/pet-shop"],
  ["Pet Shops", "Cuore de Cane", "Rua Antônio Macioski, 151, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/servicos-para-animais/pet-shop"],
  ["Pet Shops", "Clube Animal", "Rua Renato Polatti, 2671, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/servicos-para-animais/pet-shop"],

  // Bicicletarias: incluem bairros próximos.
  ["Bicicletarias", "Nova Bike", "Rua Eduardo Sprada, 4779, loja 3, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/servicos-diversos/bicicletarias"],
  ["Bicicletarias", "New Center Bike", "Rua Arnaldo Thá, 847, Fazendinha, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/fazendinha/servicos-diversos/bicicletarias"],
  ["Bicicletarias", "Cicles São Jorge", "Rua Carlos Klemtz, 2060, Fazendinha, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/fazendinha/servicos-diversos/bicicletarias"],
  ["Bicicletarias", "Cicles Souza", "Avenida Frederico Lambertucci, 39, Fazendinha, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/fazendinha/servicos-diversos/bicicletarias"],
  ["Bicicletarias", "Bike Sstaff", "Rua Desembargador Cid Campelo, 3916, Cidade Industrial, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/cidade-industrial/servicos-diversos/bicicletarias"],

  // Distribuidoras de bebidas
  ["Distribuidoras de bebidas", "Root Beer Distribuidora de Bebidas", "Rua Eduardo Sprada, 4191, Campo Comprido, Curitiba", "https://www.waze.com/live-map/directions/br/pr/root-beer-distribuidora-de-bebidas?to=place.ChIJa7incxfi3JQRCypknp79GTg"],
  ["Distribuidoras de bebidas", "Empório Weiss", "Rua Eduardo Sprada, 416, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/distribuidores-de-alimentos-e-bebidas/distribuidores-de-bebidas"],
  ["Distribuidoras de bebidas", "Bebidas Ecoville", "Rua Doutor Brasílio Vicente de Castro, 320, loja 10, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/distribuidores-de-alimentos-e-bebidas/distribuidores-de-bebidas"],
  ["Distribuidoras de bebidas", "Distribuidora de Bebidas MM", "Rua Luiz Tramontin, 2393, Campo Comprido, Curitiba", "https://www.lojalocal.com/05979132000120"],
  ["Distribuidoras de bebidas", "No Grau Bebidas", "Rua Arthur Martins Franco, 2951, Fazendinha, Curitiba", "https://www.nograubebidas.com.br/", "Distribuidora da Fazendinha que atende o Campo Comprido."],

  // Panificadoras
  ["Panificadoras", "Panificadora Ideal", "Rua Renato Polatti, 3386, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/lanches-e-salgados/padarias-e-confeitarias"],
  ["Panificadoras", "Panificadora e Confeitaria Quintessência", "Rua Eduardo Sprada, 1190, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/lanches-e-salgados/padarias-e-confeitarias"],
  ["Panificadoras", "Panificadora e Confeitaria Sonho Meu", "Rua Luiz Tramontin, 2195, Campo Comprido, Curitiba", "https://www.solutudo.com.br/empresas/pr/curitiba/panificadoras/panificadora-e-confeitaria-sonho-meu-3133420"],
  ["Panificadoras", "Panificadora Santos Andrade", "Rua Astolpho Nogueira, 127, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/lanches-e-salgados/padarias-e-confeitarias"],
  ["Panificadoras", "Panificadora Panivida", "Rua Luiz Tramontin, 2473, Campo Comprido, Curitiba", "https://www.rappi.com.br/restaurantes/900673458-panificadora-panivida"],

  // Lanchonetes
  ["Lanchonetes", "Bar e Lanchonete Prado", "Rua Frederico Müller, 245, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/lanches-e-salgados/lanchonetes"],
  ["Lanchonetes", "Salsicha Lanches", "Rua Eduardo Sprada, 3968, loja 4, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/lanches-e-salgados/lanchonetes"],
  ["Lanchonetes", "Senhor Lanches", "Rua João Alencar Guimarães, 2121, sala 2, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/lanches-e-salgados/lanchonetes"],
  ["Lanchonetes", "Lanchonete do Leo", "Rua Eduardo Sprada, 93, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/lanches-e-salgados/lanchonetes"],
  ["Lanchonetes", "Lanchonete da Rosa", "Rua Doutor Lubumir Viergbiski, 22, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/bares-e-pubs/bares"],

  // Restaurantes
  ["Restaurantes", "Restaurante Tio Zizo", "Rua Eduardo Sprada, 5665, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/restaurantes/restaurante"],
  ["Restaurantes", "Restaurante Tratoria da Mamma", "Rua Eduardo Sprada, 4649, sala 4, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/restaurantes/restaurante"],
  ["Restaurantes", "Pizzaria do Wal", "Rua Renato Polatti, 2535, loja 2, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/restaurantes/restaurante"],
  ["Restaurantes", "Dinorah Casa de Assados", "Rua Eduardo Sprada, 4603, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/restaurantes/restaurante"],
  ["Restaurantes", "Bambu Pizza Bar", "Rua Eduardo Sprada, 5780, Campo Comprido, Curitiba", "https://www.guiatelefone.com/empresas/curitiba-pr/bairro/campo-comprido/restaurantes/restaurante"],

  // Hortifrutis: incluem Mossunguê e CIC.
  ["Hortifrutis", "Fiorese Hortifrúti", "Rua Monsenhor Ivo Zanlorenzi, 1619, Mossunguê, Curitiba", "https://br.linkedin.com/company/fiorese-hortifr%C3%BAti"],
  ["Hortifrutis", "Natureto Hortifruti", "Rua Professor Pedro Viriato Parigot de Souza, 1548, Mossunguê, Curitiba", "https://www.saidelcoloniais.com.br/onde-encontrar"],
  ["Hortifrutis", "A Quitanda Ecoville", "Rua José Nicco, 641, Mossunguê, Curitiba", "https://www.waze.com/en-GB/live-map/directions/br/pr/a-quitanda-ecoville?to=place.ChIJ52JdOkvj3JQRhYAUDdWPLYI"],
  ["Hortifrutis", "Sacolão da Família", "Rua Renato Polatti, 2671, Campo Comprido, Curitiba", "https://www.econodata.com.br/consulta-empresa/12562579000165-sacolao-da-familia-ltda"],
  ["Hortifrutis", "Sacolão da Família Vila Sandra", "Rua Robert Redzimski, 1157, Cidade Industrial, Curitiba", "https://mid.curitiba.pr.gov.br/2024/00443892.pdf", "Programa municipal de frutas e hortaliças."],

  // Serviços públicos de saúde: não são comércios.
  ["Postos de saúde", "Unidade de Saúde Santos Andrade", "Rua Nelson Ferreira da Luz, 145, Campo Comprido, Curitiba", "https://saude.curitiba.pr.gov.br/conteudo/enderecos/1449", "Unidade básica de saúde."],
  ["Postos de saúde", "UPA Campo Comprido", "Rua Monsenhor Ivo Zanlorenzi, 3495, Campo Comprido, Curitiba", "https://saude.curitiba.pr.gov.br/conteudo/enderecos/1449", "Atendimento de urgência e emergência, 24 horas."],
  ["Postos de saúde", "Unidade de Saúde Atenas", "Rua Emília Erichsen, 45, Cidade Industrial, Curitiba", "https://saude.curitiba.pr.gov.br/conteudo/enderecos/1449", "Unidade básica de saúde."],
  ["Postos de saúde", "Unidade de Saúde Augusta", "Rua Robert Redzinski, 921, Cidade Industrial, Curitiba", "https://saude.curitiba.pr.gov.br/conteudo/enderecos/1449", "Unidade básica de saúde."],
  ["Postos de saúde", "Unidade de Saúde Nova Orleans", "Avenida Vereador Toaldo Túlio, 4577, Orleans, Curitiba", "https://saude.curitiba.pr.gov.br/conteudo/enderecos/1449", "Unidade básica de saúde."],
];
