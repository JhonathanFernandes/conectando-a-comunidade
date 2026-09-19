export const photoUrl = (file: string) => `${import.meta.env.BASE_URL}photos/${file}`;

export const neighborhoodPhotos = [
  {
    src: photoUrl("rua-do-outono-nova.png"),
    alt: "Ônibus na canaleta entre árvores coloridas da Rua do Outono",
    caption: "As cores do outono transformam os caminhos do bairro",
  },
  {
    src: photoUrl("rua antonio-nova.png"),
    alt: "Rua Antônio Macioski no Campo Comprido",
    caption: "Um bairro que une natureza e urbanidade",
  },
  {
    src: photoUrl("ecoville-nova.png"),
    alt: "Vista urbana arborizada do Ecoville em Curitiba",
    caption: "Árvores e caminhos que fazem parte da rotina local",
  },
  {
    src: photoUrl("predios-novo.png"),
    alt: "Edifícios residenciais no Campo Comprido",
    caption: "Onde moradia se encontra com qualidade de vida",
  },
  {
    src: photoUrl("termina-novo.png"),
    alt: "Terminal Campo Comprido",
    caption: "Mobilidade que conecta o bairro todos os dias",
  },
  {
    src: photoUrl("teatro-positivo-nova.png"),
    alt: "Fachada iluminada do Teatro Positivo ao anoitecer",
    caption: "Cultura e encontros ao lado do Campo Comprido",
    source: "#",
  },
  {
    src: photoUrl("campo-comprido-6.jpg"),
    alt: "Passarela arborizada no Campo Comprido",
    caption: "Áreas verdes que tornam o bairro especial",
    source: "https://commons.wikimedia.org/wiki/File:Campo_Comprido,_Curitiba_-_State_of_Paran%C3%A1,_Brazil_-_panoramio_(6).jpg",
  },
  {
    src: photoUrl("jardim-botanico-nova.png"),
    alt: "Estufa e jardins geométricos do Jardim Botânico de Curitiba",
    caption: "Parques, árvores e vida comunitária",
  },
  {
    src: photoUrl("parque-barigui-nova.png"),
    alt: "Lago do Parque Barigui ao pôr do sol",
    caption: "A beleza do Campo Comprido ao longo do Barigui",
  },
];
