import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function AdminSupport() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const { data: tickets, isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default" data-testid="badge-open">Aberto</Badge>;
      case "in_progress":
        return <Badge variant="secondary" data-testid="badge-progress">Em Andamento</Badge>;
      case "resolved":
        return <Badge variant="outline" data-testid="badge-resolved">Resolvido</Badge>;
      case "closed":
        return <Badge variant="outline" data-testid="badge-closed">Fechado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="default" data-testid="badge-high">Alta</Badge>;
      case "medium":
        return <Badge variant="secondary" data-testid="badge-medium">Média</Badge>;
      case "low":
        return <Badge variant="outline" data-testid="badge-low">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full dark">
          <AdminSidebar />
        
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b bg-card/50" data-testid="header-admin">
              <div className="flex items-center gap-4">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <h1 className="text-2xl font-heading font-bold" data-testid="text-page-title">Gerenciar Suporte</h1>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-tickets-title">Todos os Tickets</CardTitle>
                  <CardDescription data-testid="text-tickets-description">
                    Lista de todos os tickets de suporte abertos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Carregando...</p>
                    </div>
                  ) : tickets && tickets.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assunto</TableHead>
                          <TableHead>Prioridade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Criado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tickets.map((ticket) => (
                          <TableRow key={ticket.id} data-testid={`row-ticket-${ticket.id}`}>
                            <TableCell data-testid={`text-subject-${ticket.id}`}>
                              <div>
                                <p className="font-medium">{ticket.subject}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {ticket.message}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell data-testid={`badge-priority-${ticket.id}`}>
                              {getPriorityBadge(ticket.priority)}
                            </TableCell>
                            <TableCell data-testid={`badge-status-${ticket.id}`}>
                              {getStatusBadge(ticket.status)}
                            </TableCell>
                            <TableCell data-testid={`text-created-${ticket.id}`} className="text-muted-foreground">
                              {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="text-no-tickets">
                        Nenhum ticket encontrado
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
