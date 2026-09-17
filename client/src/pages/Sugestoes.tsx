import { photoUrl } from "@/data/photos";
/*
 * Design: Terra Viva — Sugestões e Reclamações
 */
import { useState } from "react";
import { Lightbulb, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";

const suggestionExamples = [
  "Nova praça no bairro",
  "Ciclovia na Av. Barão do Rio Branco",
  "Faixa de pedestre na Rua São José",
  "Academia ao ar livre no Parque Barigui",
  "Biblioteca comunitária",
  "Mais eventos culturais",
];

const complaintCategories = [
  "Atendimento",
  "Transporte",
  "Saúde",
  "Limpeza",
  "Iluminação",
  "Comércio",
];

export default function Sugestoes() {
  const [activeTab, setActiveTab] = useState<"sugestoes" | "reclamacoes">("sugestoes");
  const [text, setText] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const suggestionMutation = trpc.suggestion.add.useMutation({
    onSuccess: () => {
      toast.success(
        activeTab === "sugestoes"
          ? "Sugestão enviada! Obrigado por contribuir."
          : "Reclamação registrada. Vamos analisar."
      );
      setText("");
      setSelectedCategory("");
    },
    onError: () => {
      toast.error("Erro ao enviar. Tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Escreva sua mensagem antes de enviar.");
      return;
    }
    suggestionMutation.mutate({
      name: "Anônimo",
      email: undefined,
      phone: undefined,
      type: activeTab === "reclamacoes" ? (selectedCategory || "Reclamação") : "Sugestão",
      message: text,
    });
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 min-h-[320px] lg:min-h-[360px] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={photoUrl("rua-antonio-macioski.jpg")}
            alt="Rua Antônio Macioski no Campo Comprido"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10">
          <p className="text-primary-foreground/70 font-medium text-sm uppercase tracking-widest mb-2">
            Participação
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Sugestões e Reclamações
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Compartilhe suas ideias para melhorar o bairro ou relate problemas que precisam de atenção.
          </p>
        </div>
      </section>

      <WaveDivider color="oklch(0.25 0.02 150)" />

      <section className="py-10 lg:py-14 bg-background">
        <div className="container">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-8">
            <button
              onClick={() => setActiveTab("sugestoes")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "sugestoes"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lightbulb className="w-4 h-4" /> Sugestões
            </button>
            <button
              onClick={() => setActiveTab("reclamacoes")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "reclamacoes"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Reclamações
            </button>
          </div>

          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {activeTab === "reclamacoes" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Categoria da Reclamação
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {complaintCategories.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm border text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors ${
                          selectedCategory === cat
                            ? "bg-primary/10 border-primary/50 font-medium"
                            : "border-border"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {activeTab === "sugestoes" ? "Sua Sugestão" : "Sua Reclamação"}
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  placeholder={
                    activeTab === "sugestoes"
                      ? "Ex: Nova praça no bairro, ciclovia..."
                      : "Descreva o problema com atendimento, transporte, limpeza..."
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {activeTab === "sugestoes" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Exemplos de sugestões:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestionExamples.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setText(s)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.97]"
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
