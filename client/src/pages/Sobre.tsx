import { photoUrl } from "@/data/photos";
/*
 * Design: Terra Viva — Sobre o Projeto
 */
import { Heart, Target, Eye, Leaf, Users, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";

export default function Sobre() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero com foto */}
      <section className="relative pt-28 lg:pt-36 pb-16 min-h-[320px] lg:min-h-[360px] overflow-hidden">
        <img
          src={photoUrl("ecoville-nova.png")}
          alt="Edifícios residenciais no Campo Comprido"
          className="absolute inset-0 page-hero-image"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 text-center">
          <p className="text-white/70 font-medium text-sm uppercase tracking-widest mb-2">
            Sobre o Projeto
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Conectando a Comunidade do Campo Comprido
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Um projeto feito pela comunidade, para a comunidade. Conectando moradores, serviços e oportunidades do Campo Comprido em um só lugar.
          </p>
        </div>
      </section>

      <WaveDivider color="oklch(0.97 0.015 80)" />

      <section className="py-16 lg:py-20 bg-background">
        <div className="container max-w-4xl">
          {/* Missão e Visão */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Missão</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Facilitar a comunicação entre os moradores do Campo Comprido, promovendo
                a participação cidadã, o fortalecimento do comércio local e a melhoria
                contínua da qualidade de vida no bairro.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">Visão</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ser a referência digital comunitária do Campo Comprido, sendo reconhecida
                como a principal ferramenta de engajamento, transparência e valorização
                do bairro.
              </p>
            </div>
          </div>

          {/* Citação final */}
          <div className="text-center p-8 rounded-xl bg-primary/5 border border-primary/20">
            <Leaf className="w-8 h-8 text-primary mx-auto mb-4" />
            <blockquote className="font-serif text-xl text-foreground italic">
              "O Campo Comprido merece ser ouvido. Cada voz conta na construção de um
              bairro melhor."
            </blockquote>
            <p className="text-sm text-muted-foreground mt-3">&mdash; Equipe Campo Comprido</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
