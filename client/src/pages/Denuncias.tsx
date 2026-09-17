import { photoUrl } from "@/data/photos";
/*
 * Design: Terra Viva — Canal de Denúncias
 * Terracota como cor de ação principal, formulário orgânico
 */
import { useState } from "react";
import { AlertTriangle, MapPin, Send, ChevronDown } from "lucide-react";
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

export default function Denuncias() {
  const { data: publicComplaints, refetch } = trpc.complaint.listPublic.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formNeighborhood, setFormNeighborhood] = useState("Campo Comprido");
  const [formAnonymous, setFormAnonymous] = useState(true);
  const [formName, setFormName] = useState("");

  const reportMutation = trpc.complaint.add.useMutation({
    onSuccess: () => {
      toast.success("Denúncia registrada com sucesso!");
      setShowForm(false);
      setFormCategory("");
      setFormDescription("");
      setFormAddress("");
      setFormName("");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao registrar denúncia. Tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory || !formDescription || !formAddress || (!formAnonymous && !formName.trim())) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    reportMutation.mutate({
      name: formAnonymous ? "Anônimo" : formName.trim(),
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
      <section className="pt-28 lg:pt-36 pb-12 min-h-[320px] lg:min-h-[360px] relative overflow-hidden">
        {/* Impactful background image */}
        <div className="absolute inset-0">
          <img
            src={photoUrl("rua-pedro-zanlorenzi.jpg")}
            alt="Rua Pedro Artur Zanlorenzi no Campo Comprido"
            className="w-full h-full object-cover object-center"
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
                <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">Este relato será público. Não inclua telefone, documentos ou outros dados pessoais na descrição.</p>
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
                {!formAnonymous && <label className="block text-sm font-medium text-foreground">Nome para exibição pública
                  <input value={formName} onChange={(event) => setFormName(event.target.value)} required className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5" />
                </label>}

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

          <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Informe o local no Campo Comprido</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Escreva a rua e um ponto de referência próximo ao problema. Isso ajuda a identificar o local no bairro e encaminhar a denúncia com mais precisão.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-5">Relatos da comunidade</h2>
            {publicComplaints?.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {publicComplaints.map((item) => (
                  <article key={item.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex justify-between gap-3 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{categories.find((category) => category.value === item.type)?.label ?? item.type}</span>
                      <span>{item.status === "resolved" ? "Resolvida" : item.status === "rejected" ? "Encerrada" : "Aberta"}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.address || "Local não informado"}</p>
                    {item.name !== "Anônimo" && <p className="mt-1 text-sm text-muted-foreground">Por {item.name}</p>}
                    <p className="mt-3 whitespace-pre-wrap text-foreground">{item.description}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{item.createdAt.toLocaleDateString("pt-BR")}</p>
                  </article>
                ))}
              </div>
            ) : <p className="text-muted-foreground">Nenhum relato cadastrado ainda.</p>}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
