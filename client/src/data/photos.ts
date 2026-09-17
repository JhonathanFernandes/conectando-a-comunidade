export const photoUrl = (file: string) => `${import.meta.env.BASE_URL}photos/${file}`;

export const neighborhoodPhotos = [
  {
    src: photoUrl("rua-do-outono.jpg"),
    alt: "Ônibus na canaleta entre árvores coloridas da Rua do Outono",
    caption: "As cores do outono transformam os caminhos do bairro",
    source: "https://www.curitiba.pr.gov.br/noticias/prefeitura-de-curitiba-pede-cuidado-a-populacao-ao-fazer-fotos-na-rua-do-outono/68416",
  },
  {
    src: photoUrl("rua-antonio-macioski.jpg"),
    alt: "Rua Antônio Macioski no Campo Comprido",
    caption: "Um bairro que une natureza e urbanidade",
    source: "https://commons.wikimedia.org/wiki/File:Rua_Ant%C3%B4nio_Macioski,_Campo_Comprido,_Curitiba,_abril_de_2025_(1).jpg",
  },
  {
    src: photoUrl("rua-pedro-zanlorenzi.jpg"),
    alt: "Araucária na Rua Pedro Artur Zanlorenzi no Campo Comprido",
    caption: "Árvores e caminhos que fazem parte da rotina local",
    source: "https://commons.wikimedia.org/wiki/File:Rua_Pedro_Artur_Zanlorenzi,_Campo_Comprido,_Curitiba,_abril_de_2025_(2).jpg",
  },
  {
    src: photoUrl("predios-campo-comprido.jpg"),
    alt: "Edifícios residenciais no Campo Comprido",
    caption: "Onde moradia se encontra com qualidade de vida",
    source: "https://commons.wikimedia.org/wiki/File:Apartment_towers_Curitiba.jpg",
  },
  {
    src: photoUrl("terminal-campo-comprido.jpg"),
    alt: "Terminal Campo Comprido",
    caption: "Mobilidade que conecta o bairro todos os dias",
    source: "https://commons.wikimedia.org/wiki/File:Terminal_Campo_Comprido_Curitiba_Brasil.jpg",
  },
  {
    src: photoUrl("teatro-positivo-fachada.jpg"),
    alt: "Fachada iluminada do Teatro Positivo ao anoitecer",
    caption: "Cultura e encontros ao lado do Campo Comprido",
    source: "https://www.curitiba.pr.gov.br/noticias/espacos-da-universidade-positivo-sao-os-novos-pontos-de-coleta-da-campanha-do-agasalho/64504",
  },
  {
    src: photoUrl("campo-comprido-6.jpg"),
    alt: "Passarela arborizada no Campo Comprido",
    caption: "Áreas verdes que tornam o bairro especial",
    source: "https://commons.wikimedia.org/wiki/File:Campo_Comprido,_Curitiba_-_State_of_Paran%C3%A1,_Brazil_-_panoramio_(6).jpg",
  },
  {
    src: photoUrl("campo-comprido-10.jpg"),
    alt: "Espaço arborizado no Campo Comprido",
    caption: "Parques, árvores e vida comunitária",
    source: "https://commons.wikimedia.org/wiki/File:Campo_Comprido,_Curitiba_-_State_of_Paran%C3%A1,_Brazil_-_panoramio_(10).jpg",
  },
  {
    src: photoUrl("parque-barigui.jpg"),
    alt: "Lago do Parque Barigui ao pôr do sol",
    caption: "A beleza do Campo Comprido ao longo do Barigui",
    source: "https://commons.wikimedia.org/wiki/File:Parque_Barigui_Curitiba.jpg",
  },
];
