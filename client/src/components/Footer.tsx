/*
 * Design: Terra Viva — Footer com identidade comunitária
 */
import { Link } from "wouter";
import { MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.25_0.02_160)] text-[oklch(0.85_0.02_80)]">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <span className="font-serif text-lg font-bold text-white">Conectando a Comunidade</span>
                <span className="block text-xs opacity-60">Bairro Campo Comprido</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed opacity-75 max-w-md">
              Este projeto foi desenvolvido como parte da Atividade Extensionista do curso de
              Análise e Desenvolvimento de Sistemas, com o objetivo de aplicar na prática os
              conhecimentos adquiridos ao longo da formação e contribuir com a comunidade do
              Campo Comprido. A iniciativa também está alinhada aos Objetivos de Desenvolvimento
              Sustentável (ODS) propostos pela atividade.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/servicos", label: "Mapa de Serviços" },
                { href: "/comercio", label: "Comércio Local" },
                { href: "/eventos", label: "Eventos" },
                { href: "/denuncias", label: "Canal de Denúncias" },
                { href: "/noticias", label: "Notícias" },
                { href: "/sobre", label: "Sobre o Projeto" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contato</h4>
            <div className="space-y-3 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Campo Comprido, Curitiba - PR</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <span>jhonathanads25@gmail.com</span>
              </div>
              <p className="pt-2 text-xs opacity-50">
                Desenvolvido por JHOW DEV
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-50">
          <p>&copy; {new Date().getFullYear()} Conectando a Comunidade — Bairro Campo Comprido</p>
            <div className="flex gap-4">
            <Link href="/sobre" className="hover:opacity-70">Sobre o Projeto</Link>
            <Link href="/sugestoes" className="hover:opacity-70">Sugestões</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
