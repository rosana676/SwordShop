import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Shield } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  isSeller: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  status: string;
  approvalStatus: string;
  sellerId: string;
}

export default function AdminSellers() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const sellers = users?.filter(user => user.isSeller) || [];

  const getSellerProducts = (sellerId: string) => {
    return allProducts?.filter(product => product.sellerId === sellerId) || [];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getSellerStats = (sellerId: string) => {
    const products = getSellerProducts(sellerId);
    const activeStatuses = ["active", "available", "in_escrow"];
    const activeProducts = products.filter(p => 
      activeStatuses.includes(p.status) && p.approvalStatus === "approved"
    ).length;
    const totalValue = products
      .filter(p => activeStatuses.includes(p.status) && p.approvalStatus === "approved")
      .reduce((sum, p) => {
        const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
    
    return { totalProducts: products.length, activeProducts, totalValue };
  };

  return (
    <ProtectedRoute>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AdminSidebar />
        
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b bg-card/50" data-testid="header-admin">
              <div className="flex items-center gap-4">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <h1 className="text-2xl font-heading font-bold" data-testid="text-page-title">Gerenciar Vendedores</h1>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-sellers-title">Todos os Vendedores</CardTitle>
                  <CardDescription data-testid="text-sellers-description">
                    Lista de vendedores cadastrados no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Carregando vendedores...</p>
                    </div>
                  ) : sellers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum vendedor encontrado</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendedor</TableHead>
                          <TableHead>E-mail</TableHead>
                          <TableHead>Produtos</TableHead>
                          <TableHead>Ativos</TableHead>
                          <TableHead>Valor Total</TableHead>
                          <TableHead>Cadastro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sellers.map((seller) => {
                          const stats = getSellerStats(seller.id);
                          const sellerProducts = getSellerProducts(seller.id);
                          
                          return (
                            <TableRow key={seller.id} data-testid={`row-seller-${seller.id}`}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src="" />
                                    <AvatarFallback data-testid={`avatar-${seller.name}`}>
                                      {seller.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium" data-testid={`text-seller-name-${seller.id}`}>
                                      {seller.name}
                                    </span>
                                    {seller.isSeller && (
                                      <Shield className="w-4 h-4 text-primary" data-testid={`icon-verified-${seller.id}`} />
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell data-testid={`text-email-${seller.id}`}>
                                {seller.email}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="font-medium" data-testid={`text-total-products-${seller.id}`}>
                                    {stats.totalProducts}
                                  </p>
                                  {sellerProducts.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {sellerProducts.slice(0, 3).map(product => (
                                        <span 
                                          key={product.id} 
                                          className="text-xs text-muted-foreground truncate max-w-[120px]"
                                          title={product.title}
                                          data-testid={`text-product-${product.id}`}
                                        >
                                          {product.title}
                                        </span>
                                      ))}
                                      {sellerProducts.length > 3 && (
                                        <span className="text-xs text-muted-foreground">
                                          +{sellerProducts.length - 3} mais
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="default" data-testid={`badge-active-${seller.id}`}>
                                  {stats.activeProducts}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <p className="font-medium text-primary" data-testid={`text-total-value-${seller.id}`}>
                                  {formatCurrency(stats.totalValue)}
                                </p>
                              </TableCell>
                              <TableCell className="text-muted-foreground" data-testid={`text-created-${seller.id}`}>
                                {new Date(seller.createdAt).toLocaleDateString("pt-BR")}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
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
