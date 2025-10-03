import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  categoryId: string;
  sellerId: string;
  status: string;
  createdAt: string;
}

export default function AdminProducts() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" data-testid="badge-active">Ativo</Badge>;
      case "sold":
        return <Badge variant="secondary" data-testid="badge-sold">Vendido</Badge>;
      case "inactive":
        return <Badge variant="outline" data-testid="badge-inactive">Inativo</Badge>;
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
                <h1 className="text-2xl font-heading font-bold" data-testid="text-page-title">Gerenciar Produtos</h1>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-products-title">Todos os Produtos</CardTitle>
                  <CardDescription data-testid="text-products-description">
                    Lista de todos os produtos cadastrados na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Carregando...</p>
                    </div>
                  ) : products && products.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Criado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                            <TableCell data-testid={`text-title-${product.id}`}>
                              <div>
                                <p className="font-medium">{product.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell data-testid={`text-price-${product.id}`}>
                              R$ {parseFloat(product.price).toFixed(2)}
                            </TableCell>
                            <TableCell data-testid={`badge-status-${product.id}`}>
                              {getStatusBadge(product.status)}
                            </TableCell>
                            <TableCell data-testid={`text-created-${product.id}`} className="text-muted-foreground">
                              {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true, locale: ptBR })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="text-no-products">
                        Nenhum produto encontrado
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
