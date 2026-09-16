/*
 * Design: Terra Viva — FAQ
 */
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";

const faqs = [
  {
    question: "Como denunciar um problema no bairro?",
    answer: "Acesse a página de Denúncias, selecione a categoria do problema, descreva com detalhes, informe o endereço e envie. Você pode incluir fotos e vídeos para ajudar na identificação. A denúncia será registrada e você poderá acompanhar o status.",
  },
  {
    question: "Posso denunciar anonimamente?",
    answer: "Sim! Ao preencher o formulário de denúncia, ative a opção 'Denúncia anônima'. Sua identidade não será registrada e a denúncia será processada normalmente.",
  },
  {
    question: "Como divulgar meu comércio na plataforma?",
    answer: "Entre em contato conosco pelo e-mail contato@conectandocomunidade.org.br ou acesse a página de Comércio Local e clique em 'Divulgar meu negócio'. Preencha o formulário com as informações do seu estabelecimento.",
  },
  {
    question: "Como cadastrar um evento?",
    answer: "Os eventos podem ser cadastrados pelos organizadores através do formulário na página de Eventos. Você precisa informar local, data, horário, organizador e uma breve descrição.",
  },
  {
    question: "Quem pode usar a plataforma?",
    answer: "Qualquer pessoa! A plataforma é aberta para moradores, visitantes, comerciantes e qualquer interessado no Campo Comprido. Não é necessário cadastro para navegar.",
  },
  {
    question: "Como acompanho o status de uma denúncia?",
    answer: "Se você forneceu um e-mail ou número de contato ao fazer a denúncia, receberá atualizações por notificação. Os status são: Recebido, Em análise, Encaminhado e Resolvido.",
  },
  {
    question: "O projeto tem parceria com a Prefeitura?",
    answer: "O projeto é uma iniciativa comunitária independente. Mantemos diálogo com a Prefeitura para que as denúncias e sugestões sejam encaminhadas aos órgãos competentes, mas não somos vinculados ao governo municipal.",
  },
  {
    question: "Como avaliar um serviço ou comércio?",
    answer: "Na página do serviço ou comércio desejado, clique no botão 'Avaliar'. Você poderá avaliar critérios como atendimento, limpeza, qualidade e acessibilidade.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 bg-secondary relative">
        <div className="container">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">
            Perguntas Frequentes
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-foreground mb-4">
            Tire suas dúvidas
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Encontre respostas sobre como usar a plataforma, fazer denúncias e participar da comunidade.
          </p>
        </div>
      </section>

      <WaveDivider color="oklch(0.97 0.015 80)" />

      <section className="py-10 lg:py-14 bg-background">
        <div className="container max-w-3xl">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl bg-card border border-border overflow-hidden transition-shadow hover:shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex items-center justify-between w-full p-5 text-left"
                >
                  <span className="font-serif text-base font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
