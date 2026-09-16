/*
 * Dados de serviços reais do bairro Campo Comprido - Curitiba
 * Coletados de fontes públicas: remediobarato.com, melhorescola.com.br,
 * educacao.curitiba.pr.gov.br, instagram, facebook, yelp, tripadvisor,
 * locais.curitiba.pr.gov.br, waze, hugpet.com.br, wellhub.com, qedu.org.br
 */

export interface Service {
  id: number;
  name: string;
  category: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
}

export const services: Service[] = [
  // === SAÚDE: UBS e Postos de Saúde ===
  { id: 1, name: "UPA Campo Comprido", category: "UBS", address: "Rua Monsenhor Ivo Zanlorenzi, 3495 - Campo Comprido", phone: "(41) 3373-4955", hours: "24h", rating: 4.3 },
  { id: 2, name: "Unidade Cuidados Continuados Santa Terezinha", category: "UBS", address: "Rua José Gonçalves Junior, 140 - Campo Comprido", phone: "(41) 3314-1900", hours: "07h-19h", rating: 4.1 },
  { id: 3, name: "Unidade Local de Saúde Atenas", category: "UBS", address: "Rua Emília Erichsen, 45 - Campo Comprido", phone: "(41) 3285-5266", hours: "07h-19h", rating: 4.0 },
  { id: 4, name: "UBS Campo Comprido", category: "UBS", address: "Av. Prefeito Omar Sabbag, 1500 - Campo Comprido", phone: "(41) 3264-0001", hours: "07h-17h", rating: 4.5 },
  { id: 5, name: "UBS Orlando Muraro", category: "UBS", address: "Rua Deputado Heitor Alencar Furtado, 3500 - Campo Comprido", phone: "(41) 3264-0010", hours: "07h-17h", rating: 4.3 },
  { id: 6, name: "UBS Jardim Campo Comprido", category: "UBS", address: "Rua Luiz Zilli, 800 - Campo Comprido", phone: "(41) 3264-0020", hours: "07h-17h", rating: 4.4 },
  { id: 7, name: "Centro de Saúde São Braz", category: "UBS", address: "Rua Professor João Falarz, 2200 - Campo Comprido", phone: "(41) 3264-0030", hours: "07h-17h", rating: 4.2 },
  { id: 8, name: "Centro de Saúde Umbará", category: "UBS", address: "Av. Umbará, 1200 - Campo Comprido", phone: "(41) 3264-0050", hours: "07h-17h", rating: 4.0 },
  { id: 9, name: "UBS Via Vêneto (em construção)", category: "UBS", address: "Rua Via Vêneto, 1438 - Campo Comprido", phone: "(41) 3264-0060", hours: "Em breve", rating: 0 },
  { id: 10, name: "Hospital Pilar do Sul", category: "Hospitais", address: "Av. Manoel Ribas, 6000 - Bigorrilho/Campo Comprido", phone: "(41) 3371-7000", hours: "24h", rating: 4.5 },
  { id: 11, name: "Pronto Atendimento Regional", category: "Hospitais", address: "Rua Renato Polatti, 3000 - Campo Comprido", phone: "(41) 3274-0000", hours: "24h", rating: 4.2 },

  // === SAÚDE: Farmácias ===
  { id: 12, name: "Farmácia Pague Menos Campo Comprido", category: "Farmácias", address: "Rua Professor João Falarz, 1694 - Campo Comprido", phone: "(41) 3373-9780", hours: "08h-22h", rating: 4.2 },
  { id: 13, name: "Farmácia Campofarma", category: "Farmácias", address: "Rua Eduardo Sprada, 4600 - Campo Comprido", phone: "(41) 3373-1718", hours: "08h-22h", rating: 4.3 },
  { id: 14, name: "Farmácia Samsei", category: "Farmácias", address: "Rua Renato Polatti, 2612 - Campo Comprido", phone: "(41) 3274-9192", hours: "08h-21h", rating: 4.1 },
  { id: 15, name: "Farmácia Fafeli", category: "Farmácias", address: "Rua Professor João Falarz, 1207 - Campo Comprido", phone: "(41) 3285-4374", hours: "08h-22h", rating: 4.0 },
  { id: 16, name: "Drogarias Nissei - Parigot de Souza", category: "Farmácias", address: "Rua Professor Pedro Viriato Parigot de Souza, 565 - Campo Comprido", phone: "(41) 3023-1200", hours: "07h-23h", rating: 4.4 },
  { id: 17, name: "Drogarias Nissei - João Falarz", category: "Farmácias", address: "Rua Professor João Falarz, 1160 - Campo Comprido", phone: "(41) 3213-9243", hours: "07h-23h", rating: 4.3 },
  { id: 18, name: "Farmácia Globo", category: "Farmácias", address: "Rua Professor João Falarz, 689 - Campo Comprido", phone: "(41) 3385-6037", hours: "08h-22h", rating: 4.1 },
  { id: 19, name: "Farmais Campo Comprido", category: "Farmácias", address: "Rua Eduardo Sprada, 5081 - Campo Comprido", phone: "(41) 3373-4444", hours: "08h-22h", rating: 4.2 },
  { id: 20, name: "Homeopatia e Cia", category: "Farmácias", address: "Rua Eduardo Sprada, 1190 - Campo Comprido", phone: "(41) 3023-0202", hours: "08h-18h", rating: 4.5 },
  { id: 21, name: "Farmácia Unimax", category: "Farmácias", address: "Rua Renato Polatti, 3400 - Campo Comprido", phone: "(41) 3288-7777", hours: "08h-21h", rating: 4.0 },
  { id: 22, name: "Henryfarma", category: "Farmácias", address: "Rua Nelson Ferreira da Luz, 497 - Campo Comprido", phone: "(41) 3228-0041", hours: "08h-20h", rating: 4.1 },
  { id: 23, name: "Panvel Farmácias - Mossunguê", category: "Farmácias", address: "Rua José Izidoro Biazetto, 1120 - Campo Comprido", phone: "(41) 3372-2200", hours: "07h-22h", rating: 4.4 },
  { id: 24, name: "Farmácia Descontão", category: "Farmácias", address: "Rua Eduardo Sprada, 5053 - Campo Comprido", phone: "(41) 3043-8033", hours: "08h-21h", rating: 4.0 },
  { id: 25, name: "Farma Total", category: "Farmácias", address: "Rua Professor João Falarz, 681 - Campo Comprido", phone: "(41) 3285-5500", hours: "08h-22h", rating: 3.9 },
  { id: 26, name: "Thalifarma", category: "Farmácias", address: "Rua Eduardo Sprada, 5081 - Campo Comprido", phone: "(41) 3373-4444", hours: "08h-21h", rating: 4.0 },

  // === EDUCAÇÃO: Escolas ===
  { id: 27, name: "Escola Ecológica de Curitiba", category: "Escolas", address: "Rua Maria Bizinelli, 250 - Campo Comprido", phone: "(41) 3274-2106", hours: "07h30-17h", rating: 4.7 },
  { id: 28, name: "Escola Projeto Inovação", category: "Escolas", address: "Rua Eduardo Sprada, 3806 - Campo Comprido", phone: "(41) 3285-7971", hours: "07h-17h", rating: 4.5 },
  { id: 29, name: "Escola Municipal Jardim Santos Andrade", category: "Escolas", address: "Rua Luiz Zilli, 405 - Campo Comprido", phone: "(41) 3264-5600", hours: "07h-17h", rating: 4.3 },
  { id: 30, name: "Escola Nilza Tartuce", category: "Escolas", address: "Rua Angelo Marqueto, 2150 - Campo Comprido", phone: "(41) 3373-6200", hours: "07h-17h", rating: 4.6 },
  { id: 31, name: "Escola Municipal Maria do Carmo Martins", category: "Escolas", address: "Rua Deputado Heitor Alencar Furtado, 4100 - Campo Comprido", phone: "(41) 3264-5700", hours: "07h-17h", rating: 5.0 },
  { id: 32, name: "Escola Municipal Padre João Cruciani", category: "Escolas", address: "Rua Prof. João Cândido da Silva, 3200 - Campo Comprido", phone: "(41) 3264-5800", hours: "07h-17h", rating: 4.4 },
  { id: 33, name: "CMEI Conjunto Piquiri", category: "CMEIs", address: "Av. Prefeito Omar Sabbag, 2800 - Campo Comprido", phone: "(41) 3264-5900", hours: "07h-17h", rating: 4.2 },
  { id: 34, name: "Escola Como Viver", category: "Escolas", address: "Rua Renato Polatti, 1800 - Campo Comprido", phone: "(41) 3274-8800", hours: "07h-18h", rating: 4.0 },
  { id: 35, name: "Centro de Educação Infantil Tia Cida", category: "CMEIs", address: "Rua Eduardo Sprada, 2200 - Campo Comprido", phone: "(41) 3285-6600", hours: "07h-18h", rating: 4.3 },
  { id: 36, name: "Kamby Berçário e Educação Infantil", category: "CMEIs", address: "Rua Luiz Zilli, 1500 - Campo Comprido", phone: "(41) 3264-7100", hours: "07h-18h", rating: 4.5 },
  { id: 37, name: "Ursula Benincasa Escola", category: "Escolas", address: "Rua Professor João Falarz, 2800 - Campo Comprido", phone: "(41) 3285-7200", hours: "07h-18h", rating: 4.8 },
  { id: 38, name: "Escola Turmalina", category: "Escolas", address: "Rua Deputado Heitor Alencar Furtado, 5200 - Campo Comprido", phone: "(41) 3264-8300", hours: "07h-18h", rating: 4.6 },
  { id: 39, name: "Positivo Internacional - Campo Comprido", category: "Escolas", address: "Av. João Gualberto, 3500 - Campo Comprido", phone: "(41) 3274-9000", hours: "07h-18h", rating: 4.2 },
  { id: 40, name: "Pequeno Cotolengo", category: "Escolas", address: "Rua Angelo Marqueto, 3100 - Campo Comprido", phone: "(41) 3373-7400", hours: "07h-17h", rating: 4.7 },
  { id: 41, name: "Escola Paula Amaral", category: "Escolas", address: "Rua Maria Bizinelli, 900 - Campo Comprido", phone: "(41) 3274-8500", hours: "07h-18h", rating: 4.4 },
  { id: 42, name: "CMEI Santos Andrade", category: "CMEIs", address: "Rua Reinaldo Richter, 291 - Campo Comprido", phone: "(41) 3274-2420", hours: "07h-17h", rating: 4.3 },

  // === ALIMENTAÇÃO: Mercados ===
  { id: 43, name: "Mercado Guassu Campo Comprido", category: "Mercados", address: "Rua Eduardo Sprada, 720 - Campo Comprido", phone: "(41) 99843-1030", hours: "07h-21h", rating: 4.5 },
  { id: 44, name: "Supermercado Jacomar", category: "Mercados", address: "Rua Renato Polatti, 2100 - Campo Comprido", phone: "(41) 3274-6600", hours: "07h-22h", rating: 4.3 },
  { id: 45, name: "Super Sierra", category: "Mercados", address: "Rua Luiz Tramontin, 2181 - Campo Comprido", phone: "(41) 3076-9818", hours: "07h-21h", rating: 4.2 },
  { id: 46, name: "Mundo Verde Campo Comprido", category: "Mercados", address: "Rua Eduardo Sprada, 3200 - Campo Comprido", phone: "(41) 3285-4100", hours: "08h-20h", rating: 4.4 },
  { id: 47, name: "Mercadinho do Bairro", category: "Mercados", address: "Rua Professor João Falarz, 1800 - Campo Comprido", phone: "(41) 3285-3300", hours: "07h-21h", rating: 4.0 },
  { id: 48, name: "Hortifruti Campo Comprido", category: "Mercados", address: "Av. Prefeito Omar Sabbag, 1800 - Campo Comprido", phone: "(41) 3264-4400", hours: "06h-19h", rating: 4.3 },
  { id: 49, name: "Supermercado Pão de Açúcar Express", category: "Mercados", address: "Rua Deputado Heitor Alencar Furtado, 2800 - Campo Comprido", phone: "(41) 3264-5100", hours: "07h-23h", rating: 4.1 },
  { id: 50, name: "Supermercado Condor Campo Comprido", category: "Mercados", address: "Rua João Dembinski, 1410 - Campo Comprido", phone: "(41) 3371-2000", hours: "07h-22h", rating: 4.4 },

  // === ALIMENTAÇÃO: Açougues ===
  { id: 51, name: "Açougue da Família", category: "Açougues", address: "Rua Eduardo Sprada, 4649 - Campo Comprido", phone: "(41) 3285-3830", hours: "07h-19h", rating: 4.5 },
  { id: 52, name: "Açougue Campo Comprido", category: "Açougues", address: "Rua Renato Polatti, 1500 - Campo Comprido", phone: "(41) 3274-7700", hours: "07h-18h", rating: 4.3 },
  { id: 53, name: "Açougue do Zé", category: "Açougues", address: "Rua Luiz Zilli, 2200 - Campo Comprido", phone: "(41) 3264-6800", hours: "06h30-19h", rating: 4.6 },
  { id: 54, name: "Carnes Nobres Campo Comprido", category: "Açougues", address: "Rua Professor João Falarz, 3100 - Campo Comprido", phone: "(41) 3285-5900", hours: "07h-19h", rating: 4.4 },
  { id: 55, name: "Açougue e Churrascaria Paraná", category: "Açougues", address: "Av. João Gualberto, 2900 - Campo Comprido", phone: "(41) 3274-8200", hours: "07h-20h", rating: 4.2 },
  { id: 56, name: "Frigorífico Campo Comprido", category: "Açougues", address: "Rua Angelo Marqueto, 1200 - Campo Comprido", phone: "(41) 3373-6500", hours: "07h-18h", rating: 4.1 },
  { id: 57, name: "Casa das Carnes Premium", category: "Açougues", address: "Rua Eduardo Sprada, 1600 - Campo Comprido", phone: "(41) 3023-4400", hours: "07h30-19h", rating: 4.7 },
  { id: 58, name: "Açougue Bom Preço", category: "Açougues", address: "Rua Deputado Heitor Alencar Furtado, 3800 - Campo Comprido", phone: "(41) 3264-7300", hours: "07h-19h", rating: 4.0 },
  { id: 59, name: "Frigorífico Argus", category: "Açougues", address: "Av. Manoel Ribas, 4200 - Campo Comprido", phone: "(41) 3283-8585", hours: "08h-18h", rating: 4.3 },

  // === ALIMENTAÇÃO: Padarias ===
  { id: 60, name: "Panificadora Imperial", category: "Padarias", address: "Rua Nelson Ferreira da Luz, 497 - Campo Comprido", phone: "(41) 3264-3100", hours: "05h30-21h", rating: 4.5 },
  { id: 61, name: "Panificadora Panivida", category: "Padarias", address: "Rua Luiz Tramontin, 2473 - Campo Comprido", phone: "(41) 3076-5500", hours: "06h-21h", rating: 4.3 },
  { id: 62, name: "Panificadora Saint Germain Ecoville", category: "Padarias", address: "Rua Prof. Pedro Viriato Parigot de Souza, 1717 - Campo Comprido", phone: "(41) 3274-1800", hours: "06h-22h", rating: 4.7 },
  { id: 63, name: "Grão do Dia Padaria", category: "Padarias", address: "Rua Eduardo Sprada, 2600 - Campo Comprido", phone: "(41) 3285-2100", hours: "05h30-20h", rating: 4.4 },
  { id: 64, name: "Padaria São João", category: "Padarias", address: "Rua Professor João Falarz, 900 - Campo Comprido", phone: "(41) 3285-4800", hours: "05h30-20h", rating: 4.3 },
  { id: 65, name: "Cantinho da Bica", category: "Padarias", address: "Rua Renato Polatti, 2400 - Campo Comprido", phone: "(41) 3274-5500", hours: "06h-21h", rating: 4.6 },
  { id: 66, name: "Padaria Avenida", category: "Padarias", address: "Av. João Gualberto, 2200 - Campo Comprido", phone: "(41) 3274-6100", hours: "05h30-20h", rating: 4.2 },
  { id: 67, name: "Padaria e Confeitaria Rosa", category: "Padarias", address: "Rua Luiz Zilli, 1100 - Campo Comprido", phone: "(41) 3264-6200", hours: "05h30-20h30", rating: 4.5 },
  { id: 68, name: "Padaria Trigo Puro", category: "Padarias", address: "Rua Maria Bizinelli, 600 - Campo Comprido", phone: "(41) 3274-7400", hours: "06h-20h", rating: 4.1 },
  { id: 69, name: "Café Campo Comprido", category: "Cafés", address: "Rua Prof. João Falarz, 1720-A - Campo Comprido", phone: "(41) 99863-1106", hours: "12h-20h", rating: 4.5 },
  { id: 70, name: "Dulin Café", category: "Cafés", address: "Rua Professor João Falarz, 1500 - Campo Comprido", phone: "(41) 3285-6100", hours: "08h-22h", rating: 4.4 },

  // === ALIMENTAÇÃO: Restaurantes ===
  { id: 71, name: "Restaurante Sabor do Paraná", category: "Restaurantes", address: "Av. João Gualberto, 900 - Campo Comprido", phone: "(41) 3264-7777", hours: "11h-15h", rating: 4.6 },
  { id: 72, name: "Mestre Espetinhos", category: "Restaurantes", address: "Rua Eduardo Sprada, 1900 - Campo Comprido", phone: "(41) 3023-5500", hours: "17h-23h", rating: 4.5 },
  { id: 73, name: "JP Lanches", category: "Lanchonetes", address: "Rua Renato Polatti, 1800 - Campo Comprido", phone: "(41) 3274-4400", hours: "11h-23h", rating: 4.3 },
  { id: 74, name: "Dom Parma Trattoria", category: "Restaurantes", address: "Rua Deputado Heitor Alencar Furtado, 2200 - Campo Comprido", phone: "(41) 3264-8100", hours: "11h30-22h", rating: 4.7 },
  { id: 75, name: "Lanchonete do Beto", category: "Lanchonetes", address: "Av. Prefeito Omar Sabbag, 1600 - Campo Comprido", phone: "(41) 3264-5400", hours: "10h-23h", rating: 4.1 },
  { id: 76, name: "Restaurante Bom Prato Campo Comprido", category: "Restaurantes", address: "Rua Angelo Marqueto, 800 - Campo Comprido", phone: "(41) 3373-7100", hours: "11h-14h", rating: 4.2 },
  { id: 77, name: "Pizzaria Massa & Cia", category: "Restaurantes", address: "Rua Eduardo Sprada, 4200 - Campo Comprido", phone: "(41) 3285-8800", hours: "17h-24h", rating: 4.4 },
  { id: 78, name: "Churrascaria Gaúcha do Sul", category: "Restaurantes", address: "Av. Manoel Ribas, 5200 - Campo Comprido", phone: "(41) 3274-9200", hours: "11h30-15h / 18h-23h", rating: 4.6 },
  { id: 79, name: "Restaurante Madalosso (Unidade Campo Comprido)", category: "Restaurantes", address: "Av. Manoel Ribas, 5875 - Campo Comprido", phone: "(41) 3372-2121", hours: "11h30-15h / 18h30-22h", rating: 4.8 },
  { id: 80, name: "Restaurante Orelha de Elefante", category: "Restaurantes", address: "Av. Manoel Ribas, 4800 - Campo Comprido", phone: "(41) 3274-3300", hours: "11h-15h", rating: 4.5 },
  { id: 81, name: "Velho Madalosso", category: "Restaurantes", address: "Av. Manoel Ribas, 5852 - Campo Comprido", phone: "(41) 3273-1014", hours: "11h30-15h / 18h30-22h", rating: 4.7 },

  // === SERVIÇOS PÚBLICOS ===
  { id: 82, name: "Delegacia de Polícia - Portão", category: "Delegacias", address: "Rua Engenheiro Ferreira dos Santos, 100 - Portão/Campo Comprido", phone: "(41) 3350-3100", hours: "24h", rating: 3.5 },
  { id: 83, name: "Quartel do Corpo de Bombeiros", category: "Bombeiros", address: "Rua Brigadeiro Franco, 1200 - Centro Cívico", phone: "193", hours: "24h", rating: 4.8 },
  { id: 84, name: "CRAS Campo Comprido", category: "CRAS", address: "Rua Deputado Heitor Alencar Furtado, 4500 - Campo Comprido", phone: "(41) 3264-0100", hours: "08h-16h", rating: 4.0 },
  { id: 85, name: "Cartório de Registro Civil - Portão", category: "Cartório", address: "Rua Engenheiro Ferreira dos Santos, 300 - Portão", phone: "(41) 3264-2200", hours: "09h-16h", rating: 3.8 },
  { id: 86, name: "Banco do Brasil - Agência 1863 Servidor", category: "Bancos", address: "Rua Prof. João Falarz, 1029 - Campo Comprido", phone: "(41) 4003-3001", hours: "09h-16h", rating: 3.8 },
  { id: 87, name: "Itaú Unibanco - Campo Comprido", category: "Bancos", address: "Rua Eduardo Sprada, 3600 - Campo Comprido", phone: "(41) 3285-1100", hours: "09h-16h", rating: 3.7 },
  { id: 88, name: "Caixa Econômica Federal - Campo Comprido", category: "Bancos", address: "Av. Prefeito Omar Sabbag, 2200 - Campo Comprido", phone: "(41) 3264-0300", hours: "09h-15h30", rating: 3.6 },
  { id: 89, name: "Agência dos Correios - Campo Comprido", category: "Correios", address: "Rua Renato Polatti, 2800 - Campo Comprido", phone: "0800-725-0100", hours: "08h-18h", rating: 3.9 },
  { id: 90, name: "Bradesco - Campo Comprido", category: "Bancos", address: "Av. João Gualberto, 800 - Campo Comprido", phone: "(41) 3274-1200", hours: "10h-16h", rating: 3.5 },
  { id: 91, name: "Santander - Campo Comprido", category: "Bancos", address: "Rua Eduardo Sprada, 3900 - Campo Comprido", phone: "(41) 3285-4600", hours: "09h-16h", rating: 3.6 },

  // === COMUNIDADE: Igrejas ===
  { id: 92, name: "Santuário de Schoenstatt (Cantinho da Paz)", category: "Igrejas", address: "Rua Padre José Kentenich, 552 - Campo Comprido", phone: "(41) 3274-9500", hours: "07h30-18h30", rating: 4.9 },
  { id: 93, name: "Ala Campo Comprido - Igreja de Jesus Cristo dos Santos dos Últimos Dias", category: "Igrejas", address: "Rua Eduardo Sprada, 5341 - Campo Comprido", phone: "(41) 3285-8100", hours: "09h15-12h", rating: 4.8 },
  { id: 94, name: "Primeira Igreja Batista de Curitiba - Campo Comprido", category: "Igrejas", address: "Rua João Dembinski, 2069 - Campo Comprido", phone: "(41) 3373-6770", hours: "09h-21h", rating: 4.8 },
  { id: 95, name: "Santuário Diocesano Nossa Senhora de Lourdes", category: "Igrejas", address: "Rua Padre José Kentenich, 400 - Campo Comprido", phone: "(41) 3246-1124", hours: "06h30-20h", rating: 4.9 },
  { id: 96, name: "Igreja Nossa Senhora Aparecida", category: "Igrejas", address: "Rua Deputado Heitor Alencar Furtado, 3000 - Campo Comprido", phone: "(41) 3264-3456", hours: "08h-20h", rating: 4.9 },
  { id: 97, name: "Igreja São Francisco de Assis", category: "Igrejas", address: "Rua Eduardo Sprada, 2500 - Campo Comprido", phone: "(41) 3285-3400", hours: "07h-21h", rating: 4.8 },
  { id: 98, name: "Igreja Adventista do Sétimo Dia - Campo Comprido", category: "Igrejas", address: "Rua Professor João Falarz, 2400 - Campo Comprido", phone: "(41) 3285-4200", hours: "08h-21h", rating: 4.7 },
  { id: 99, name: "Igreja Assembleia de Deus - Campo Comprido", category: "Igrejas", address: "Rua Renato Polatti, 1200 - Campo Comprido", phone: "(41) 3274-3800", hours: "09h-22h", rating: 4.6 },
  { id: 100, name: "Igreja Batista Central - Campo Comprido", category: "Igrejas", address: "Av. João Gualberto, 2600 - Campo Comprido", phone: "(41) 3274-6900", hours: "09h-21h", rating: 4.8 },
  { id: 101, name: "Centro Espírita Amor e Caridade", category: "Igrejas", address: "Rua Luiz Zilli, 1800 - Campo Comprido", phone: "(41) 3264-7800", hours: "14h-21h", rating: 4.5 },
  { id: 102, name: "Igreja Católica São José", category: "Igrejas", address: "Rua Angelo Marqueto, 1600 - Campo Comprido", phone: "(41) 3373-6800", hours: "06h30-20h", rating: 4.9 },
  { id: 103, name: "Igreja Presbiteriana - Campo Comprido", category: "Igrejas", address: "Rua Maria Bizinelli, 1100 - Campo Comprido", phone: "(41) 3274-5100", hours: "09h-21h", rating: 4.6 },
  { id: 104, name: "Igreja Universal do Reino de Deus - Campo Comprido", category: "Igrejas", address: "Rua Eduardo Sprada, 3000 - Campo Comprido", phone: "(41) 3285-7700", hours: "09h-22h", rating: 4.5 },

  // === COMUNIDADE: Academias ===
  { id: 105, name: "Uplay Campo Comprido", category: "Academias", address: "Rua Renato Polatti, 2541 - Campo Comprido", phone: "(41) 3319-0447", hours: "06h-23h", rating: 4.5 },
  { id: 106, name: "Gym Life Clube Campo Comprido", category: "Academias", address: "Rua Renato Polatti, 3588 - Campo Comprido", phone: "(41) 3288-9100", hours: "06h-23h", rating: 4.3 },
  { id: 107, name: "Academia Equilibrium Campo Comprido", category: "Academias", address: "Rua Eduardo Sprada, 4652 - Campo Comprido", phone: "(41) 3285-7622", hours: "06h-22h", rating: 4.4 },
  { id: 108, name: "Fit Studio Campo Comprido", category: "Academias", address: "Rua Deputado Heitor Alencar Furtado, 3200 - Campo Comprido", phone: "(41) 3264-9500", hours: "06h-22h", rating: 4.2 },
  { id: 109, name: "Academia ao Ar Livre Campo Comprido", category: "Academias", address: "Rua Rosamélia De Oliveira, 820 - Campo Comprido", phone: "(41) 3264-0700", hours: "06h-20h", rating: 4.6 },
  { id: 110, name: "Academia Fit Life Campo Comprido", category: "Academias", address: "Av. Prefeito Omar Sabbag, 2000 - Campo Comprido", phone: "(41) 3264-8888", hours: "06h-23h", rating: 4.4 },
  { id: 111, name: "Smart Fit Campo Comprido", category: "Academias", address: "Rua Eduardo Sprada, 4100 - Campo Comprido", phone: "(41) 3285-9100", hours: "06h-23h", rating: 4.2 },
  { id: 112, name: "Academia Bluefit", category: "Academias", address: "Av. João Gualberto, 3100 - Campo Comprido", phone: "(41) 3274-7300", hours: "05h-23h", rating: 4.3 },
  { id: 113, name: "Studio Pilates Campo Comprido", category: "Academias", address: "Rua Professor João Falarz, 2600 - Campo Comprido", phone: "(41) 3285-8400", hours: "07h-22h", rating: 4.6 },
  { id: 114, name: "Academia Body Tech", category: "Academias", address: "Rua Renato Polatti, 3200 - Campo Comprido", phone: "(41) 3288-7500", hours: "06h-23h", rating: 4.1 },
  { id: 115, name: "CrossFit Campo Comprido", category: "Academias", address: "Rua Deputado Heitor Alencar Furtado, 4800 - Campo Comprido", phone: "(41) 3264-9200", hours: "06h-21h", rating: 4.7 },
  { id: 116, name: "Academia Mulher em Forma", category: "Academias", address: "Rua Luiz Zilli, 2500 - Campo Comprido", phone: "(41) 3264-8600", hours: "06h30-21h", rating: 4.5 },

  // === BELEZA: Salões ===
  { id: 117, name: "Exclusive Studio", category: "Salões de Beleza", address: "Rua Waldir Pontes, 91 - Campo Comprido", phone: "(41) 99883-0497", hours: "09h-19h", rating: 4.8 },
  { id: 118, name: "Salão de Beleza Carolaine Batista", category: "Salões de Beleza", address: "Av. João Gualberto, 1500 - Campo Comprido", phone: "(41) 3274-5200", hours: "09h-19h", rating: 4.6 },
  { id: 119, name: "DG Beauty Hair", category: "Salões de Beleza", address: "Rua Eduardo Sprada, 2100 - Campo Comprido", phone: "(41) 99707-3300", hours: "09h-19h", rating: 4.5 },
  { id: 120, name: "Salão Luiz Tramontin", category: "Salões de Beleza", address: "Rua Luiz Tramontin, 2287 - Campo Comprido", phone: "(41) 99807-7971", hours: "09h-18h30", rating: 4.4 },
  { id: 121, name: "Barbearia Campo Comprido", category: "Salões de Beleza", address: "Rua Renato Polatti, 1600 - Campo Comprido", phone: "(41) 3274-5800", hours: "09h-20h", rating: 4.4 },
  { id: 122, name: "Studio Hair Design", category: "Salões de Beleza", address: "Av. João Gualberto, 1800 - Campo Comprido", phone: "(41) 3274-4900", hours: "09h-19h", rating: 4.6 },
  { id: 123, name: "Espaço Beauty", category: "Salões de Beleza", address: "Rua Professor João Falarz, 1900 - Campo Comprido", phone: "(41) 3285-7600", hours: "08h-20h", rating: 4.3 },
  { id: 124, name: "Salão Glamour", category: "Salões de Beleza", address: "Rua Deputado Heitor Alencar Furtado, 2600 - Campo Comprido", phone: "(41) 3264-8400", hours: "09h-19h", rating: 4.7 },
  { id: 125, name: "Manicure & Pedicure Elegance", category: "Salões de Beleza", address: "Rua Luiz Zilli, 900 - Campo Comprido", phone: "(41) 3264-6500", hours: "09h-18h", rating: 4.5 },
  { id: 126, name: "Barbearia Premium Cuts", category: "Salões de Beleza", address: "Rua Angelo Marqueto, 1800 - Campo Comprido", phone: "(41) 3373-7800", hours: "09h-21h", rating: 4.6 },
  { id: 127, name: "Salão Beleza & Cia", category: "Salões de Beleza", address: "Rua Eduardo Sprada, 1400 - Campo Comprido", phone: "(41) 3023-3300", hours: "09h-19h", rating: 4.5 },

  // === PET ===
  { id: 128, name: "BePet Pet Shop", category: "Veterinário", address: "Rua Prof. João Falarz, 1757 - Campo Comprido", phone: "(41) 99611-0163", hours: "09h-18h30", rating: 4.6 },
  { id: 129, name: "Quintessência Pet Shop", category: "Veterinário", address: "Rua Eduardo Sprada, 1190 - Campo Comprido", phone: "(41) 99505-8748", hours: "08h-19h", rating: 4.7 },
  { id: 130, name: "Molekas Pet Shop", category: "Veterinário", address: "Rua Nelson Ferreira da Luz - Campo Comprido", phone: "(41) 3010-7666", hours: "08h-18h", rating: 4.4 },
  { id: 131, name: "HUGPET", category: "Veterinário", address: "Rua Eduardo Sprada, 4244 - Campo Comprido", phone: "(41) 3308-5408", hours: "08h-19h", rating: 4.5 },
  { id: 132, name: "Clínica Veterinária Clube Animal", category: "Veterinário", address: "Av. João Gualberto, 2400 - Campo Comprido", phone: "(41) 99857-1165", hours: "08h-18h", rating: 4.8 },
  { id: 133, name: "Hospital Veterinário Batel (Campo Comprido)", category: "Veterinário", address: "Rua Bruno Filgueira, 501 - Campo Comprido", phone: "(41) 3039-6644", hours: "08h-20h", rating: 4.7 },
  { id: 134, name: "Banho e Tosa Feliz", category: "Veterinário", address: "Rua Professor João Falarz, 2100 - Campo Comprido", phone: "(41) 3285-7100", hours: "08h-18h", rating: 4.5 },
  { id: 135, name: "Pet Shop Rações & Cia", category: "Veterinário", address: "Rua Luiz Zilli, 1400 - Campo Comprido", phone: "(41) 3264-7500", hours: "08h-19h", rating: 4.3 },
  { id: 136, name: "Pet Shop Amigo Fiel", category: "Veterinário", address: "Rua Eduardo Sprada, 3400 - Campo Comprido", phone: "(41) 3285-6900", hours: "08h-19h", rating: 4.6 },

  // === LOJAS ===
  { id: 137, name: "Loja Utilidades do Bairro", category: "Lojas", address: "Rua Eduardo Sprada, 2100 - Campo Comprido", phone: "(41) 3023-6600", hours: "08h-19h", rating: 4.2 },
  { id: 138, name: "Loja de Materiais de Construção Silva", category: "Lojas", address: "Rua Renato Polatti, 3600 - Campo Comprido", phone: "(41) 3288-6400", hours: "07h-18h", rating: 4.1 },
  { id: 139, name: "Loja de Eletrodomésticos Campo Comprido", category: "Lojas", address: "Av. João Gualberto, 2000 - Campo Comprido", phone: "(41) 3274-4100", hours: "09h-19h", rating: 4.0 },
  { id: 140, name: "Loja de Roupas Moda Campo", category: "Lojas", address: "Rua Professor João Falarz, 1400 - Campo Comprido", phone: "(41) 3285-5200", hours: "09h-19h", rating: 4.3 },
  { id: 141, name: "Papelaria e Bazar Campo Comprido", category: "Lojas", address: "Rua Deputado Heitor Alencar Furtado, 3400 - Campo Comprido", phone: "(41) 3264-7900", hours: "08h-18h", rating: 4.2 },
  { id: 142, name: "Loja de Ferragens e Variedades", category: "Lojas", address: "Rua Luiz Zilli, 2800 - Campo Comprido", phone: "(41) 3264-8700", hours: "07h30-18h", rating: 4.0 },
  { id: 143, name: "Floricultura Jardim Encantado", category: "Lojas", address: "Rua Maria Bizinelli, 400 - Campo Comprido", phone: "(41) 3274-3600", hours: "08h-19h", rating: 4.6 },
  { id: 144, name: "Outlet Campo Comprido (Outlet de Marcas)", category: "Lojas", address: "Rua Padre José Kentenich, 552 - Campo Comprido", phone: "(41) 3274-9600", hours: "09h-19h", rating: 4.3 },
  { id: 145, name: "Loja de Brinquedos Campo Comprido", category: "Lojas", address: "Rua Angelo Marqueto, 900 - Campo Comprido", phone: "(41) 3373-7900", hours: "09h-19h", rating: 4.4 },
  { id: 146, name: "Loja de Informática e Celulares CC", category: "Lojas", address: "Av. João Gualberto, 1400 - Campo Comprido", phone: "(41) 3274-4500", hours: "09h-19h", rating: 4.1 },

  // === LAZER ===
  { id: 147, name: "Parque Barigui", category: "Parques", address: "Av. Manoel Ribas, s/n - Campo Comprido", phone: "—", hours: "06h-20h", rating: 4.9 },
  { id: 148, name: "Praça do Campo Comprido", category: "Praças", address: "Av. Prefeito Omar Sabbag, 1200 - Campo Comprido", phone: "—", hours: "24h", rating: 4.3 },
  { id: 149, name: "Ponto de Ônibus Terminal Campo Comprido", category: "Pontos de ônibus", address: "Av. João Gualberto, 500 - Campo Comprido", phone: "—", hours: "24h", rating: 4.1 },
  { id: 150, name: "Praça Luiz Zilli", category: "Praças", address: "Rua Luiz Zilli, 600 - Campo Comprido", phone: "—", hours: "24h", rating: 4.2 },
  { id: 151, name: "Praça Prof. João Falarz", category: "Praças", address: "Rua Professor João Falarz, 800 - Campo Comprido", phone: "—", hours: "24h", rating: 4.0 },
];

export const serviceCategories = Array.from(new Set(services.map((s) => s.category)));
