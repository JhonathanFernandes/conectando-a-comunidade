/*
 * Design: Terra Viva — Telefones Úteis
 */
import { useState } from "react";
import { Phone, Shield, Heart, Building2, GraduationCap, Home, AlertCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";

interface PhoneEntry {
  name: string;
  number: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}

const phones: PhoneEntry[] = [
  { name: "Polícia Militar", number: "190", category: "Segurança", description: "Emergências de segurança pública, ocorrências criminais e situações de risco imediato no bairro.", icon: <Shield className="w-5 h-5" /> },
  { name: "SAMU", number: "192", category: "Saúde", description: "Atendimento de emergência médica com ambulância. Acidentes, mal súbito e urgências de saúde.", icon: <Heart className="w-5 h-5" /> },
  { name: "Corpo de Bombeiros", number: "193", category: "Emergência", description: "Incêndios, resgates, vazamentos de gás e situações de risco com fogo ou desabamento.", icon: <AlertCircle className="w-5 h-5" /> },
  { name: "Guarda Municipal", number: "153", category: "Segurança", description: "Segurança patrimonial, fiscalização urbana e atendimento a ocorrências no bairro Campo Comprido.", icon: <Shield className="w-5 h-5" /> },
  { name: "Defesa Civil", number: "199", category: "Emergência", description: "Deslizamentos, alagamentos, árvores caídas e riscos estruturais na região.", icon: <AlertCircle className="w-5 h-5" /> },
  { name: "Prefeitura de Curitiba", number: "156", category: "Prefeitura", description: "Reclamações, solicitações de serviços públicos, limpeza urbana e iluminação.", icon: <Building2 className="w-5 h-5" /> },
  { name: "UBS Campo Comprido", number: "(41) 3264-0001", category: "Saúde", description: "Atendimento básico de saúde: consultas, vacinação, exames e acompanhamento médico.", icon: <Heart className="w-5 h-5" /> },
  { name: "Hospital São Vicente", number: "(41) 3315-1000", category: "Saúde", description: "Emergência hospitalar e atendimento especializado na região do Campo Comprido.", icon: <Heart className="w-5 h-5" /> },
  { name: "CRAS Campo Comprido", number: "(41) 3264-5000", category: "Assistência", description: "Assistência social, benefícios, programas sociais e apoio à família.", icon: <Home className="w-5 h-5" /> },
  { name: "Escola Municipal Campo Comprido", number: "(41) 3264-5678", category: "Educação", description: "Matrículas, calendário escolar, eventos e informações sobre a educação municipal.", icon: <GraduationCap className="w-5 h-5" /> },
];

const categoryColors: Record<string, string> = {
  "Segurança": "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  "Saúde": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  "Emergência": "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  "Prefeitura": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  "Assistência": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  "Educação": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
};

export default function Telefones() {
  const [selectedPhone, setSelectedPhone] = useState<PhoneEntry | null>(null);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/telefones-hero_18fc03d5.jpg"
            alt="Corredor de ônibus do Campo Comprido"
            className="w-full h-full object-cover" loading="eager"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10">
          <p className="text-white/70 font-medium text-sm uppercase tracking-widest mb-2">
            Telefones Úteis
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Contatos importantes do bairro
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Acesso rápido a todos os números de emergência, saúde, segurança e serviços públicos.
          </p>
        </div>
      </section>

      <WaveDivider color="oklch(0.25 0.02 150)" />

      <section className="py-10 lg:py-14 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {phones.map((phone) => (
              <div
                key={phone.name}
                className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  categoryColors[phone.category] || "bg-muted text-muted-foreground"
                }`}>
                  {phone.icon}
                </div>
                <div className="min-w-0 cursor-pointer flex-1" onClick={() => setSelectedPhone(phone)}>
                  <h3 className="font-medium text-sm text-foreground truncate">{phone.name}</h3>
                  <p className="font-serif text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                    {phone.number}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{phone.description}</p>
                </div>
                <a
                  href={`tel:${phone.number.replace(/[^0-9]/g, "")}`}
                  className="shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={`Ligar para ${phone.name}`}
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>

          {/* Phone detail dialog */}
          <Dialog open={!!selectedPhone} onOpenChange={() => setSelectedPhone(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    categoryColors[selectedPhone?.category || ""] || "bg-muted"
                  }`}>
                    {selectedPhone?.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-lg">{selectedPhone?.name}</DialogTitle>
                    <DialogDescription>{selectedPhone?.category}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{selectedPhone?.description}</p>
                <div className="p-4 rounded-lg bg-primary/10 text-center">
                  <p className="font-serif text-2xl font-bold text-primary">{selectedPhone?.number}</p>
                </div>
                <Button
                  asChild
                  className="w-full"
                  onClick={() => {
                    if (selectedPhone) {
                      window.location.href = `tel:${selectedPhone.number.replace(/[^0-9]/g, "")}`;
                    }
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Ligar agora
                  </span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Emergency notice */}
          <div className="mt-8 p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">
              Em caso de emergência grave, ligue imediatamente para o 190 (Polícia), 192 (SAMU) ou 193 (Bombeiros).
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
