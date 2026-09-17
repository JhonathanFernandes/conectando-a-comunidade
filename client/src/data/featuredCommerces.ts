// Referências editoriais para que o catálogo também seja útil sem MySQL.
// IDs negativos distinguem estas referências dos cadastros aprovados no banco.
import { catalogPlaces } from "./catalogPlaces";

const initialPlaces = [
  {
    id: -1,
    name: "Super Condor Campo Comprido",
    category: "Mercados",
    address: "Rua João Dembinski, 1410, Cidade Industrial, Curitiba",
    phone: "0800 41 6655",
    hours: "Confira o horário na fonte",
    instagram: "",
    description: "Supermercado na região do Campo Comprido.",
    source: "https://institucional.condor.com.br/lojas_/super-condor-campo-comprido/",
  },
  {
    id: -4,
    name: "Farmácia Unimax",
    category: "Farmácias",
    address: "Rua Renato Polatti, 3400, Campo Comprido, Curitiba",
    phone: "",
    hours: "Confira o horário na fonte",
    instagram: "",
    description: "Farmácia no bairro Campo Comprido.",
    source: "https://unimaxfarmacia.webnode.page/contato/",
  },
  {
    id: -5,
    name: "Pet Center Tchucarramany",
    category: "Pet Shops",
    address: "Rua Eduardo Sprada, 4244, Campo Comprido, Curitiba",
    phone: "(41) 3308-5408",
    hours: "Confira o horário na fonte",
    instagram: "",
    description: "Produtos e serviços para animais de estimação.",
    source: "https://www.hugpet.com.br/onde_encontrar/estado/parana",
  },
];

export const featuredCommerces = [
  ...initialPlaces,
  ...catalogPlaces.map(([category, name, address, source, description], index) => ({
    id: -(index + 6),
    name,
    category,
    address,
    phone: "",
    hours: "",
    instagram: "",
    description: description ?? "Local no Campo Comprido ou em bairro próximo. Confira os dados atuais na fonte.",
    source,
  })),
];
