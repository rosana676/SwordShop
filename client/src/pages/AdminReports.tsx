import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string | null;
  reportedProductId: string | null;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function AdminReports() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="default" data-testid="badge-pending">Pendente</Badge>;
      case "reviewed":
        return <Badge variant="secondary" data-testid="badge-reviewed">Revisado</Badge>;
      case "resolved":
        return <Badge variant="outline" data-testid="badge-resolved">Resolvido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
                <h1 className="text-2xl font-heading font-bold" data-testid="text-page-title">Gerenciar Denúncias</h1>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-reports-title">Todas as Denúncias</CardTitle>
                  <CardDescription data-testid="text-reports-description">
                    Lista de todas as denúncias recebidas na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Carregando...</p>
                    </div>
                  ) : reports && reports.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Motivo</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.map((report) => (
                          <TableRow key={report.id} data-testid={`row-report-${report.id}`}>
                            <TableCell data-testid={`text-reason-${report.id}`}>
                              <p className="font-medium">{report.reason}</p>
                            </TableCell>
                            <TableCell data-testid={`text-description-${report.id}`} className="text-muted-foreground">
                              <p className="line-clamp-2">{report.description}</p>
                            </TableCell>
                            <TableCell data-testid={`badge-status-${report.id}`}>
                              {getStatusBadge(report.status)}
                            </TableCell>
                            <TableCell data-testid={`text-created-${report.id}`} className="text-muted-foreground">
                              {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: ptBR })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="text-no-reports">
                        Nenhuma denúncia encontrada
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
