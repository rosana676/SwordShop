
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  game: string;
  categoryId: string;
  sellerId: string;
  status: string;
  approvalStatus: string;
  rejectionReason?: string;
  imageUrl?: string;
  createdAt: string;
}

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const approveMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/products/${productId}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: "approved" }),
      });
      if (!response.ok) throw new Error("Erro ao aprovar produto");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produto aprovado com sucesso!" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ productId, reason }: { productId: string; reason: string }) => {
      const response = await fetch(`/api/products/${productId}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: "rejected", rejectionReason: reason }),
      });
      if (!response.ok) throw new Error("Erro ao reprovar produto");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowRejectDialog(false);
      setRejectionReason("");
      toast({ title: "Produto reprovado com sucesso!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao excluir produto");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produto excluído com sucesso!" });
    },
  });

  const getApprovalBadge = (approvalStatus: string) => {
    switch (approvalStatus) {
      case "approved":
        return <Badge variant="default">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive">Reprovado</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">{approvalStatus}</Badge>;
    }
  };

  const pendingProducts = products?.filter(p => p.approvalStatus === "pending") || [];
  const approvedProducts = products?.filter(p => p.approvalStatus === "approved") || [];
  const rejectedProducts = products?.filter(p => p.approvalStatus === "rejected") || [];

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full dark">
          <AdminSidebar />
        
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b bg-card/50">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-heading font-bold">Gerenciar Produtos</h1>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-6 space-y-6">
              {/* Produtos Pendentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Pendentes de Aprovação ({pendingProducts.length})</CardTitle>
                  <CardDescription>
                    Produtos aguardando análise e aprovação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Carregando...</p>
                    </div>
                  ) : pendingProducts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Jogo</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Criado</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{product.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{product.game}</TableCell>
                            <TableCell>R$ {parseFloat(product.price).toFixed(2)}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true, locale: ptBR })}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setShowDetailsDialog(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => approveMutation.mutate(product.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Aprovar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setShowRejectDialog(true);
                                  }}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reprovar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum produto pendente</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Produtos Aprovados */}
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Aprovados ({approvedProducts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {approvedProducts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Jogo</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.title}</TableCell>
                            <TableCell>{product.game}</TableCell>
                            <TableCell>R$ {parseFloat(product.price).toFixed(2)}</TableCell>
                            <TableCell>{getApprovalBadge(product.approvalStatus)}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (confirm("Tem certeza que deseja excluir este produto?")) {
                                    deleteMutation.mutate(product.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum produto aprovado</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Produtos Reprovados */}
              {rejectedProducts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Produtos Reprovados ({rejectedProducts.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Motivo da Reprovação</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rejectedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.title}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {product.rejectionReason || "-"}
                            </TableCell>
                            <TableCell>{getApprovalBadge(product.approvalStatus)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
        </div>
      </SidebarProvider>

      {/* Dialog de Detalhes */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Produto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              {selectedProduct.imageUrl && (
                <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-full rounded-lg" />
              )}
              <div>
                <Label>Título</Label>
                <p className="text-sm">{selectedProduct.title}</p>
              </div>
              <div>
                <Label>Jogo</Label>
                <p className="text-sm">{selectedProduct.game}</p>
              </div>
              <div>
                <Label>Descrição</Label>
                <p className="text-sm">{selectedProduct.description}</p>
              </div>
              <div>
                <Label>Preço</Label>
                <p className="text-sm">R$ {parseFloat(selectedProduct.price).toFixed(2)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Reprovação */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Produto</DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação. Esta mensagem será enviada ao vendedor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Motivo da Reprovação *</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Imagem inadequada, descrição incompleta..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedProduct && rejectionReason) {
                  rejectMutation.mutate({ productId: selectedProduct.id, reason: rejectionReason });
                }
              }}
              disabled={!rejectionReason || rejectMutation.isPending}
            >
              Reprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
