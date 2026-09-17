import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Search, Shield, Store, MapPin, AlertTriangle, HelpCircle, Calendar, MessageCircle, Star } from "lucide-react";
import { featuredCommerces } from "@/data/featuredCommerces";

const tabs = [
  { id: "comercios", label: "Comércios", icon: Store },
  { id: "denuncias", label: "Denúncias", icon: AlertTriangle },
  { id: "sugestoes", label: "Sugestões", icon: HelpCircle },
  { id: "eventos", label: "Eventos", icon: Calendar },
  { id: "mural", label: "Mural", icon: MessageCircle },
  { id: "avaliacoes", label: "Avaliações", icon: Star },
] as const;

type TabId = typeof tabs[number]["id"];

export default function AdminDemo() {
  const [activeTab, setActiveTab] = useState<TabId>("comercios");
  const [search, setSearch] = useState("");
  const categories = useMemo(() => new Set(featuredCommerces.map((item) => item.category)).size, []);
  const filteredCommerces = featuredCommerces.filter((item) =>
    `${item.name} ${item.category} ${item.address}`.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"))
  );
  const currentTab = tabs.find((tab) => tab.id === activeTab)!;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[oklch(0.25_0.02_160)] text-white shadow-lg">
        <div className="container flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5" />
            <span className="font-serif text-lg font-bold">Painel Administrativo</span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">Prévia</span>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
        </div>
      </header>

      <main className="container py-8 lg:py-12">
        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <h1 className="font-serif text-2xl font-bold text-foreground">Visão geral da comunidade</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Esta é a prévia pública do painel. Ela mostra o catálogo publicado, mas não recebe denúncias, avaliações ou alterações. Essas funções precisam de um servidor com autenticação.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <Store className="mb-3 h-6 w-6 text-primary" />
            <p className="font-serif text-3xl font-bold text-foreground">{featuredCommerces.length}</p>
            <p className="text-sm text-muted-foreground">locais no catálogo público</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <MapPin className="mb-3 h-6 w-6 text-primary" />
            <p className="font-serif text-3xl font-bold text-foreground">{categories}</p>
            <p className="text-sm text-muted-foreground">segmentos de comércio</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 sm:col-span-2 lg:col-span-1">
            <Shield className="mb-3 h-6 w-6 text-primary" />
            <p className="font-serif text-xl font-bold text-foreground">Somente visualização</p>
            <p className="text-sm text-muted-foreground">ações de gestão exigem login no servidor</p>
          </div>
        </div>

        <nav aria-label="Seções do painel" className="mb-6 flex gap-2 overflow-x-auto border-b border-border pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"}`}
              >
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            );
          })}
        </nav>

        {activeTab === "comercios" ? (
          <section aria-label="Catálogo de comércios">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Comércios e serviços</h2>
                <p className="mt-1 text-sm text-muted-foreground">Referências locais exibidas na página Comércio.</p>
              </div>
              <label className="relative block w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <span className="sr-only">Buscar no catálogo</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar local ou segmento" className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-3 text-sm" />
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredCommerces.map((item) => (
                <article key={item.id} className="rounded-xl border border-border bg-card p-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">{item.category}</span>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">{item.name}</h3>
                  <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{item.address}</p>
                </article>
              ))}
            </div>
            {filteredCommerces.length === 0 && <p className="rounded-xl border border-border bg-card p-6 text-muted-foreground">Nenhum local encontrado para esta busca.</p>}
          </section>
        ) : (
          <section className="rounded-xl border border-border bg-card p-8 text-center">
            <currentTab.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h2 className="font-serif text-2xl font-bold text-foreground">{currentTab.label}</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Registros e ações desta seção ficam disponíveis quando o site estiver conectado ao servidor e houver uma sessão de administrador.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
