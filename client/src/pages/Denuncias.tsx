/*
 * Design: Terra Viva — Canal de Denúncias
 * Terracota como cor de ação principal, formulário orgânico
 */
import { useState } from "react";
import { AlertTriangle, MapPin, Upload, Send, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";

const categories = [
  { value: "buraco", label: "Buraco na rua" },
  { value: "iluminacao", label: "Iluminação pública" },
  { value: "lixo", label: "Lixo acumulado" },
  { value: "terreno", label: "Terreno abandonado" },
  { value: "dengue", label: "Foco de dengue" },
  { value: "arvore", label: "Árvore caída" },
  { value: "esgoto", label: "Problema de esgoto" },
  { value: "enchente", label: "Risco de enchente" },
  { value: "vandalismo", label: "Vandalismo" },
  { value: "maus-tratos", label: "Maus-tratos animais" },
  { value: "poluicao", label: "Poluição" },
  { value: "transito", label: "Problema de trânsito" },
  { value: "seguranca", label: "Segurança" },
  { value: "outros", label: "Outros" },
];

const statuses = [
  { status: "recebido", label: "Recebido", bg: "bg-blue-50 border-blue-200 text-blue-700" },
  { status: "em-analise", label: "Em análise", bg: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { status: "encaminhado", label: "Encaminhado", bg: "bg-orange-50 border-orange-200 text-orange-700" },
  { status: "resolvido", label: "Resolvido", bg: "bg-green-50 border-green-200 text-green-700" },
];

const sampleDenuncias = [
  { id: 1, category: "buraco", description: "Buraco grande na Rua São José, próximo ao número 400", address: "Rua São José, 400", date: "15/07/2026", status: "em-analise", anonymous: true },
  { id: 2, category: "iluminacao", description: "Poste apagado há 3 dias na Rua Conselheiro Laurindo", address: "Rua Conselheiro Laurindo, 200", date: "12/07/2026", status: "recebido", anonymous: false },
  { id: 3, category: "lixo", description: "Acúmulo de lixo na esquina da Praça Getúlio Vargas", address: "Praça Getúlio Vargas", date: "10/07/2026", status: "resolvido", anonymous: true },
  { id: 4, category: "dengue", description: "Água parada em terreno baldio na Rua João Gava", address: "Rua João Gava, 350", date: "08/07/2026", status: "encaminhado", anonymous: false },
];

export default function Denuncias() {
  const [showForm, setShowForm] = useState(false);
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formNeighborhood, setFormNeighborhood] = useState("Campo Comprido");
  const [formAnonymous, setFormAnonymous] = useState(true);

  const reportMutation = trpc.complaint.add.useMutation({
    onSuccess: () => {
      toast.success("Denúncia registrada com sucesso! Acompanhe pelo código gerado.");
      setShowForm(false);
      setFormCategory("");
      setFormDescription("");
      setFormAddress("");
    },
    onError: () => {
      toast.error("Erro ao registrar denúncia. Tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory || !formDescription || !formAddress) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    reportMutation.mutate({
      name: formAnonymous ? "Anônimo" : "Morador",
      phone: undefined,
      type: formCategory,
      address: `${formAddress} — ${formNeighborhood}`,
      description: formDescription,
    });
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 relative overflow-hidden">
        {/* Impactful background image */}
        <div className="absolute inset-0">
          <img
            src="/manus-storage/denuncias-hero_5e28ba3a.jpg"
            alt="Problemas de infraestrutura urbana"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        <div className="container relative z-10">
          <p className="text-white/70 font-medium text-sm uppercase tracking-[0.2em] mb-2">
            Canal de Denúncias
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Sua voz transforma o bairro
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Reporte problemas de infraestrutura, segurança e meio ambiente.
            Cada denúncia ajuda a melhorar o Campo Comprido.
          </p>
        </div>
      </section>

      <WaveDivider color="oklch(0.97 0.015 80)" />

      <section className="py-10 lg:py-14 bg-background">
        <div className="container">
          {/* Toggle form */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-3 bg-[oklch(0.72_0.12_40)] text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-[oklch(0.65_0.12_40)] transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[oklch(0.72_0.12_40)]/25"
            >
              <AlertTriangle className="w-5 h-5" />
              {showForm ? "Fechar Formulário" : "Fazer uma Denúncia"}
              <ChevronDown className={`w-5 h-5 transition-transform ${showForm ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div
              className="max-w-2xl mx-auto mb-12 p-6 rounded-xl shadow-lg bg-card border border-border dark:bg-[oklch(0.22_0.01_150)]"
              style={{
                boxShadow: "0 0 0 1px oklch(0.72 0.12 40 / 0.1), 0 4px 16px oklch(0 0 0 / 0.08)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-[oklch(0.72_0.12_40)]" />
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Registrar Denúncia
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Categoria <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                  >
                    <option value="">Selecione a categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Descrição <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={4}
                    placeholder="Descreva o problema em detalhes..."
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Endereço <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="Rua, número..."
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={formNeighborhood}
                      onChange={(e) => setFormNeighborhood(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                    />
                  </div>
                </div>

                {/* Anonymous toggle */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <button
                    type="button"
                    onClick={() => setFormAnonymous(!formAnonymous)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      formAnonymous ? "bg-[oklch(0.72_0.12_40)]" : "bg-border"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-1 ${
                      formAnonymous ? "translate-x-5" : "translate-x-1"
                    }`} />
                  </button>
                  <span className="text-sm text-foreground">
                    {formAnonymous ? "Denúncia anônima" : "Identificação visível"}
                  </span>
                </div>

                {/* Upload area */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-[oklch(0.72_0.12_40)]/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Clique para adicionar foto ou vídeo
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[oklch(0.72_0.12_40)] text-white py-3 rounded-lg font-medium hover:bg-[oklch(0.65_0.12_40)] transition-all hover:scale-[1.01] active:scale-[0.97] shadow-md shadow-[oklch(0.72_0.12_40)]/20"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Enviar Denúncia
                </button>
              </form>
            </div>
          )}

          {/* Denúncias list */}
          <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
            Denúncias Recentes
          </h3>

          <div className="space-y-4">
            {sampleDenuncias.map((d) => {
              const statusObj = statuses.find((s) => s.status === d.status);
              return (
                <div
                  key={d.id}
                  className="p-5 rounded-xl hover:shadow-md transition-shadow bg-card border border-border dark:bg-[oklch(0.22_0.01_150)]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        <AlertTriangle className="w-3 h-3" />
                        {categories.find((c) => c.value === d.category)?.label || d.category}
                      </span>
                      <span className="text-sm text-muted-foreground">{d.date}</span>
                    </div>
                    {statusObj && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusObj.bg}`}>
                        {statusObj.label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground mb-2">{d.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{d.address}</span>
                    {d.anonymous && <span className="text-muted-foreground/60">&mdash; Anônimo</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
