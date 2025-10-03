import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatsCard from "@/components/admin/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ShoppingBag, TrendingUp, AlertCircle } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const stats = [
    { title: "Total de Usuários", value: "0", icon: Users, testId: "users" },
    { title: "Produtos Ativos", value: "0", icon: ShoppingBag, testId: "products" },
    { title: "Transações Hoje", value: "0", icon: TrendingUp, testId: "transactions" },
    { title: "Pendências", value: "0", icon: AlertCircle, testId: "pending" },
  ];

  // TODO: Remove mock data when implementing real backend
  const recentActivity = [
    { id: 1, user: "Sistema", action: "Plataforma iniciada", time: "Agora" },
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Ação</TableHead>
                          <TableHead>Quando</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentActivity.map((activity) => (
                          <TableRow key={activity.id} data-testid={`row-activity-${activity.id}`}>
                            <TableCell data-testid={`text-user-${activity.id}`}>{activity.user}</TableCell>
                            <TableCell data-testid={`text-action-${activity.id}`}>{activity.action}</TableCell>
                            <TableCell data-testid={`text-time-${activity.id}`}>{activity.time}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="text-pending-title">Ações Pendentes</CardTitle>
                    <CardDescription data-testid="text-pending-description">
                      Itens que precisam de sua atenção
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="text-no-pending">
                        Nenhuma ação pendente no momento
                      </p>
                    </div>
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
