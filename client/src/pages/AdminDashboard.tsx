/*
 * Design: Terra Viva — Dashboard Administrativo
 * Abas separadas: Comércios, Denúncias, Sugestões/Reclamações, Telefones, Eventos
 */
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import {
  Shield, LogOut, Store, AlertTriangle, HelpCircle, Phone, Calendar,
  Users, MapPin, Trash2, Eye, Search, Filter, Download, Bell, Clock, MessageCircle, Star
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const statusMap: Record<string, string> = {
  "pending": "Pendente",
  "approved": "Aprovado",
  "rejected": "Rejeitado",
  "resolved": "Resolvido",
};



function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Aprovado": "bg-green-100 text-green-700",
    "Resolvida": "bg-green-100 text-green-700",
    "Pendente": "bg-yellow-100 text-yellow-700",
    "Em análise": "bg-blue-100 text-blue-700",
    "Aberta": "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600 dark:bg-[oklch(0.30_0.02_160)] dark:text-[oklch(0.75_0.02_80)]"}`}>
      {status}
    </span>
  );
}

function AuthenticatedAdminDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("comercios");
  const [searchTerm, setSearchTerm] = useState("");
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAdmin = user?.role === "admin";

  // tRPC queries
  const { data: comerciosData, refetch: refetchComercios } = trpc.commerce.list.useQuery(undefined, { enabled: isAdmin });
  const { data: denunciasData, refetch: refetchDenuncias } = trpc.complaint.list.useQuery(undefined, { enabled: isAdmin });
  const { data: sugestoesData, refetch: refetchSugestoes } = trpc.suggestion.list.useQuery(undefined, { enabled: isAdmin });
  const { data: telefonesData } = trpc.phone.list.useQuery();
  const { data: eventosData } = trpc.event.list.useQuery();
  const { data: muralData, refetch: refetchMural } = trpc.mural.listAll.useQuery(undefined, { enabled: isAdmin });
  const { data: reviewsData, refetch: refetchReviews } = trpc.review.listAll.useQuery({});

  // tRPC mutations
  const deleteMutation = trpc.commerce.delete.useMutation({ onSuccess: () => refetchComercios() });
  const approveMutation = trpc.commerce.updateStatus.useMutation({ onSuccess: () => refetchComercios() });
  const resolveDenunciaMutation = trpc.complaint.updateStatus.useMutation({ onSuccess: () => refetchDenuncias() });
  const deleteDenunciaMutation = trpc.complaint.delete.useMutation({ onSuccess: () => refetchDenuncias() });
  const resolveSugestaoMutation = trpc.suggestion.updateStatus.useMutation({ onSuccess: () => refetchSugestoes() });
  const deleteSugestaoMutation = trpc.suggestion.delete.useMutation({ onSuccess: () => refetchSugestoes() });
  const approveMuralMutation = trpc.mural.updateStatus.useMutation({ onSuccess: () => refetchMural() });
  const rejectMuralMutation = trpc.mural.updateStatus.useMutation({ onSuccess: () => refetchMural() });
  const deleteMuralMutation = trpc.mural.delete.useMutation({ onSuccess: () => refetchMural() });
  const deleteReviewMutation = trpc.review.delete.useMutation({ onSuccess: () => refetchReviews() });

  const tabs = [
    { id: "comercios", label: "Comércios", icon: <Store className="w-4 h-4" />, count: comerciosData?.length ?? 0 },
    { id: "denuncias", label: "Denúncias", icon: <AlertTriangle className="w-4 h-4" />, count: denunciasData?.length ?? 0 },
    { id: "sugestoes", label: "Sugestões/Reclamações", icon: <HelpCircle className="w-4 h-4" />, count: sugestoesData?.length ?? 0 },
    { id: "telefones", label: "Contatos/Termos", icon: <Phone className="w-4 h-4" />, count: telefonesData?.length ?? 0 },
    { id: "eventos", label: "Eventos", icon: <Calendar className="w-4 h-4" />, count: eventosData?.length ?? 0 },
    { id: "mural", label: "Mural", icon: <MessageCircle className="w-4 h-4" />, count: muralData?.length ?? 0 },
    { id: "avaliacoes", label: "Avaliações", icon: <Star className="w-4 h-4" />, count: reviewsData?.length ?? 0 },
  ];

  useEffect(() => {
    if (!loading && user?.role !== "admin") navigate("/admin");
  }, [loading, user, navigate]);

  const handleLogout = () => {
    logout();
    toast.info("Sessão encerrada");
    navigate("/admin");
  };

  if (loading || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[oklch(0.18_0.02_160)]">
      {/* Admin Header */}
      <header className="bg-[oklch(0.25_0.02_160)] text-white shadow-lg dark:bg-[oklch(0.22_0.02_160)]">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5" />
            <span className="font-serif text-base font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs opacity-75 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" /> {tabs.reduce((acc, t) => acc + t.count, 0)} pendências
            </span>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Alternar tema"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchTerm(""); }}
              className={`shrink-0 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all flex items-center gap-2 border-b-2 ${
                activeTab === tab.id
                  ? "border-[oklch(0.72_0.12_40)] text-[oklch(0.72_0.12_40)] bg-card dark:bg-[oklch(0.25_0.02_160)]"
                  : "border-transparent text-muted-foreground hover:text-foreground dark:text-[oklch(0.70_0.02_80)]"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                activeTab === tab.id ? "bg-[oklch(0.72_0.12_40)] text-white" : "bg-muted dark:bg-[oklch(0.30_0.02_160)] text-muted-foreground dark:text-[oklch(0.70_0.02_80)]"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background dark:bg-[oklch(0.25_0.02_160)] dark:text-foreground dark:placeholder:text-[oklch(0.65_0.02_80)] text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
            />
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs px-3 py-2.5 rounded-lg border border-border bg-background dark:bg-[oklch(0.25_0.02_160)] text-foreground hover:bg-muted transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filtrar
          </button>
          <button
            onClick={() => toast.success("Exportação iniciada!")}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2.5 rounded-lg bg-[oklch(0.72_0.12_40)] text-white hover:bg-[oklch(0.65_0.12_40)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="bg-card dark:bg-[oklch(0.22_0.02_160)] rounded-xl border border-border shadow-sm overflow-hidden">
          {/* COMERCIOS */}
          {activeTab === "comercios" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-[oklch(0.28_0.02_160)] border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Segmento</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Rua</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Telefone</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {comerciosData?.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30 dark:hover:bg-[oklch(0.28_0.02_160)] transition-colors">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.address}</td>
                      <td className="px-4 py-3">{item.phone}</td>
                      <td className="px-4 py-3"><StatusBadge status={statusMap[item.status] || item.status} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{item.createdAt?.toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => toast.success(`Visualizando: ${item.name}`)} className="p-1.5 rounded hover:bg-muted" title="Visualizar">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => { approveMutation.mutate({ id: item.id, status: "approved" }); toast.success(`Aprovado: ${item.name}`); }} className="p-1.5 rounded hover:bg-green-50" title="Aprovar">
                            <span className="text-green-600 text-xs font-bold">✓</span>
                          </button>
                          <button onClick={() => { deleteMutation.mutate({ id: item.id }); toast.error(`Removido: ${item.name}`); }} className="p-1.5 rounded hover:bg-red-50" title="Remover">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DENÚNCIAS */}
          {activeTab === "denuncias" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-[oklch(0.28_0.02_160)] border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Local</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Descrição</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {denunciasData?.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30 dark:hover:bg-[oklch(0.28_0.02_160)] transition-colors">
                      <td className="px-4 py-3 font-medium">{item.type}</td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{item.description}</td>
                      <td className="px-4 py-3"><StatusBadge status={statusMap[item.status] || item.status} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{item.createdAt?.toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => toast.success(`Visualizando denúncia: ${item.id}`)} className="p-1.5 rounded hover:bg-muted">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => { resolveDenunciaMutation.mutate({ id: item.id, status: "resolved" }); toast.success(`Resolvida: ${item.id}`); }} className="p-1.5 rounded hover:bg-green-50">
                            <span className="text-green-600 text-xs font-bold">✓</span>
                          </button>
                          <button onClick={() => { deleteDenunciaMutation.mutate({ id: item.id }); toast.error(`Removida: ${item.id}`); }} className="p-1.5 rounded hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SUGESTÕES */}
          {activeTab === "sugestoes" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-[oklch(0.28_0.02_160)] border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Título</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Descrição</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sugestoesData?.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30 dark:hover:bg-[oklch(0.28_0.02_160)] transition-colors">
                      <td className="px-4 py-3 font-medium">{item.type}</td>
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{item.message}</td>
                      <td className="px-4 py-3"><StatusBadge status={statusMap[item.status] || item.status} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{item.createdAt?.toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => toast.success(`Visualizando: ${item.name}`)} className="p-1.5 rounded hover:bg-muted">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => { resolveSugestaoMutation.mutate({ id: item.id, status: "resolved" }); toast.success(`Resolvida: ${item.id}`); }} className="p-1.5 rounded hover:bg-green-50">
                            <span className="text-green-600 text-xs font-bold">✓</span>
                          </button>
                          <button onClick={() => { deleteSugestaoMutation.mutate({ id: item.id }); toast.error(`Removida: ${item.id}`); }} className="p-1.5 rounded hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TELEFONES */}
          {activeTab === "telefones" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-[oklch(0.28_0.02_160)] border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Número</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Categoria</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {telefonesData?.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30 dark:hover:bg-[oklch(0.28_0.02_160)] transition-colors">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">{item.phone}</td>
                      <td className="px-4 py-3">{item.category || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => toast.success(`Editando: ${item.name}`)} className="p-1.5 rounded hover:bg-muted">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => toast.error(`Removido: ${item.name}`)} className="p-1.5 rounded hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* EVENTOS */}
          {activeTab === "eventos" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-[oklch(0.28_0.02_160)] border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Título</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Categoria</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Local</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Inscritos</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {eventosData?.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30 dark:hover:bg-[oklch(0.28_0.02_160)] transition-colors">
                      <td className="px-4 py-3 font-medium">{item.title}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">{item.date || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.location || "-"}</td>
                      <td className="px-4 py-3 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" /> {item.attendees || "0"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => toast.success(`Visualizando: ${item.title}`)} className="p-1.5 rounded hover:bg-muted">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => toast.error(`Removido: ${item.title}`)} className="p-1.5 rounded hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MURAL DA COMUNIDADE */}
          {activeTab === "mural" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-[oklch(0.28_0.02_160)] border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Autor</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Categoria</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Mensagem</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {muralData?.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30 dark:hover:bg-[oklch(0.28_0.02_160)] transition-colors">
                      <td className="px-4 py-3 font-medium">{item.authorName}</td>
                      <td className="px-4 py-3">{item.category || "Geral"}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{item.message}</td>
                      <td className="px-4 py-3"><StatusBadge status={statusMap[item.status] || item.status} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{item.createdAt?.toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {item.status === "pending" && (
                            <>
                              <button onClick={() => { approveMuralMutation.mutate({ id: item.id, status: "approved" }); toast.success("Mural aprovado!"); }} className="p-1.5 rounded hover:bg-green-50" title="Aprovar">
                                <span className="text-green-600 text-xs font-bold">✓</span>
                              </button>
                              <button onClick={() => { rejectMuralMutation.mutate({ id: item.id, status: "rejected" }); toast.error("Rejeitado."); }} className="p-1.5 rounded hover:bg-yellow-50" title="Rejeitar">
                                <span className="text-yellow-600 text-xs font-bold">✗</span>
                              </button>
                            </>
                          )}
                          <button onClick={() => { deleteMuralMutation.mutate({ id: item.id }); toast.error("Removido."); }} className="p-1.5 rounded hover:bg-red-50" title="Remover">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* AVALIAÇÕES COM ESTRELAS */}
          {activeTab === "avaliacoes" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-[oklch(0.28_0.02_160)] border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Autor</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Alvo</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Estrelas</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Comentário</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewsData?.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30 dark:hover:bg-[oklch(0.28_0.02_160)] transition-colors">
                      <td className="px-4 py-3 font-medium">{item.authorName}</td>
                      <td className="px-4 py-3">{item.targetType === "commerce" ? "Comércio" : "Serviço"}</td>
                      <td className="px-4 py-3">{item.targetName}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{item.comment || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.createdAt?.toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => { deleteReviewMutation.mutate({ id: item.id }); toast.error("Avaliação removida."); }} className="p-1.5 rounded hover:bg-red-50" title="Remover">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return import.meta.env.BASE_URL !== "/" ? <StaticAdminRedirect /> : <AuthenticatedAdminDashboard />;
}

function StaticAdminRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => navigate("/admin"), [navigate]);
  return null;
}
