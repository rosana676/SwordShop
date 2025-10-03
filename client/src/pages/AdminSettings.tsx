import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

export default function AdminSettings() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
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
                <h1 className="text-2xl font-heading font-bold" data-testid="text-page-title">Configurações</h1>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="text-platform-title">Configurações da Plataforma</CardTitle>
                    <CardDescription data-testid="text-platform-description">
                      Gerencie as configurações gerais da plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                        <div>
                          <p className="font-medium">Nome da Plataforma</p>
                          <p className="text-sm text-muted-foreground">Sword Shop</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                        <div>
                          <p className="font-medium">Versão</p>
                          <p className="text-sm text-muted-foreground">1.0.0</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                        <div>
                          <p className="font-medium">Ambiente</p>
                          <p className="text-sm text-muted-foreground">Produção</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle data-testid="text-security-title">Segurança</CardTitle>
                    <CardDescription data-testid="text-security-description">
                      Configurações de segurança e privacidade
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                        <div>
                          <p className="font-medium">Sistema de Escrow</p>
                          <p className="text-sm text-muted-foreground">Ativo e funcionando</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                        <div>
                          <p className="font-medium">Verificação de E-mail</p>
                          <p className="text-sm text-muted-foreground">Desativado</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
