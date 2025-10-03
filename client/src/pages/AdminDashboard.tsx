import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatsCard from "@/components/admin/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, ShoppingBag, TrendingUp, AlertCircle } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Statistics {
  totalUsers: number;
  totalProducts: number;
  todayTransactions: number;
  pendingReports: number;
  activeProducts: number;
  totalSellers: number;
}

interface ActivityLog {
  id: string;
  userId: string | null;
  action: string;
  details: string | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const { data: statistics, isLoading: statsLoading } = useQuery<Statistics>({
    queryKey: ["/api/admin/statistics"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/admin/activity"],
  });

  const stats = [
    { 
      title: "Total de Usuários", 
      value: statsLoading ? "..." : String(statistics?.totalUsers || 0), 
      icon: Users, 
      testId: "users" 
    },
    { 
      title: "Produtos Ativos", 
      value: statsLoading ? "..." : String(statistics?.activeProducts || 0), 
      icon: ShoppingBag, 
      testId: "products" 
    },
    { 
      title: "Transações Hoje", 
      value: statsLoading ? "..." : String(statistics?.todayTransactions || 0), 
      icon: TrendingUp, 
      testId: "transactions" 
    },
    { 
      title: "Pendências", 
      value: statsLoading ? "..." : String(statistics?.pendingReports || 0), 
      icon: AlertCircle, 
      testId: "pending" 
    },
  ];

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full dark">
          <AdminSidebar />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-card/50" data-testid="header-admin">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-heading font-bold" data-testid="text-page-title">Dashboard</h1>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <StatsCard key={stat.title} {...stat} />
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="text-activity-title">Atividade Recente</CardTitle>
                    <CardDescription data-testid="text-activity-description">
                      Últimas ações no sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activitiesLoading ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Carregando...</p>
                      </div>
                    ) : activities && activities.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ação</TableHead>
                            <TableHead>Detalhes</TableHead>
                            <TableHead>Quando</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activities.map((activity) => (
                            <TableRow key={activity.id} data-testid={`row-activity-${activity.id}`}>
                              <TableCell data-testid={`text-action-${activity.id}`}>{activity.action}</TableCell>
                              <TableCell data-testid={`text-details-${activity.id}`} className="text-muted-foreground">
                                {activity.details || "-"}
                              </TableCell>
                              <TableCell data-testid={`text-time-${activity.id}`} className="text-muted-foreground">
                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: ptBR })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground" data-testid="text-no-activity">
                          Nenhuma atividade registrada
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="text-pending-title">Resumo</CardTitle>
                    <CardDescription data-testid="text-pending-description">
                      Informações adicionais do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {statsLoading ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Carregando...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                          <span className="text-sm font-medium">Total de Vendedores</span>
                          <span className="text-sm font-bold" data-testid="text-total-sellers">
                            {statistics?.totalSellers || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                          <span className="text-sm font-medium">Total de Produtos</span>
                          <span className="text-sm font-bold" data-testid="text-total-products">
                            {statistics?.totalProducts || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                          <span className="text-sm font-medium">Denúncias Pendentes</span>
                          <span className="text-sm font-bold" data-testid="text-pending-reports">
                            {statistics?.pendingReports || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
