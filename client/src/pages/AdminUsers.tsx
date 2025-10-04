import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isSeller: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Usuário excluído com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full dark">
          <AdminSidebar />
        
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b bg-card/50" data-testid="header-admin">
              <div className="flex items-center gap-4">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <h1 className="text-2xl font-heading font-bold" data-testid="text-page-title">Gerenciar Usuários</h1>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-users-title">Todos os Usuários</CardTitle>
                  <CardDescription data-testid="text-users-description">
                    Lista de todos os usuários registrados na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Carregando...</p>
                    </div>
                  ) : users && users.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>E-mail</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Cadastro</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                            <TableCell data-testid={`text-name-${user.id}`}>{user.name}</TableCell>
                            <TableCell data-testid={`text-email-${user.id}`} className="text-muted-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell data-testid={`badges-${user.id}`}>
                              <div className="flex gap-2">
                                {user.isAdmin && (
                                  <Badge variant="default" data-testid={`badge-admin-${user.id}`}>
                                    Admin
                                  </Badge>
                                )}
                                {user.isSeller && (
                                  <Badge variant="secondary" data-testid={`badge-seller-${user.id}`}>
                                    Vendedor
                                  </Badge>
                                )}
                                {!user.isAdmin && !user.isSeller && (
                                  <Badge variant="outline" data-testid={`badge-user-${user.id}`}>
                                    Usuário
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell data-testid={`text-created-${user.id}`} className="text-muted-foreground">
                              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: ptBR })}
                            </TableCell>
                            <TableCell>
                              {!user.isAdmin && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    if (confirm(`Tem certeza que deseja excluir ${user.name}?`)) {
                                      deleteMutation.mutate(user.id);
                                    }
                                  }}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="text-no-users">
                        Nenhum usuário encontrado
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
