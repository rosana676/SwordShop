import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Shield, CreditCard, Smartphone, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  imageUrl?: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isSeller: boolean;
}

export default function ProductDetail() {
  const [, params] = useRoute("/produto/:id");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState("pix");

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
    enabled: !!params?.id,
  });

  const { data: seller } = useQuery<User>({
    queryKey: [`/api/users/${product?.sellerId}`],
    enabled: !!product?.sellerId,
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest("POST", "/api/transactions", {
        productId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Compra iniciada!",
        description: `Pagamento via ${paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'} em processamento.`,
      });
      setTimeout(() => setLocation("/"), 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao processar compra",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleBuy = () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Você precisa estar logado",
        description: "Faça login para comprar produtos.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (user.id === product?.sellerId) {
      toast({
        title: "Não é possível comprar seu próprio produto",
        variant: "destructive",
      });
      return;
    }

    if (product?.status !== "active" && product?.status !== "available") {
      toast({
        title: "Produto não disponível",
        description: "Este produto não está mais disponível para compra.",
        variant: "destructive",
      });
      return;
    }

    createTransactionMutation.mutate(product.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col dark">
        <Header />
        <main className="flex-1 container px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando produto...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col dark">
        <Header />
        <main className="flex-1 container px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Produto não encontrado</p>
            <Button onClick={() => setLocation("/")} className="mt-4">
              Voltar para Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />

      <main className="flex-1 container px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="p-0">
                <div className="relative aspect-video w-full overflow-hidden bg-muted rounded-t-lg">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="object-cover w-full h-full"
                      data-testid="img-product"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Sem imagem</p>
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4" variant="secondary" data-testid="badge-game">
                    {product.game}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h1 className="font-heading font-bold text-3xl mb-2" data-testid="text-title">
                    {product.title}
                  </h1>
                  <p className="text-2xl font-bold text-primary" data-testid="text-price">
                    R$ {parseFloat(product.price).toFixed(2)}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="font-semibold text-lg mb-2">Descrição</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-description">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" />
                    <AvatarFallback data-testid="text-seller-initial">
                      {seller?.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold" data-testid="text-seller-name">
                        {seller?.name || "Carregando..."}
                      </p>
                      {seller?.isSeller && (
                        <Shield className="w-4 h-4 text-primary" data-testid="icon-verified" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {seller?.isSeller ? "Vendedor verificado" : "Vendedor"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Finalizar Compra</CardTitle>
                <CardDescription>
                  Escolha a forma de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Método de Pagamento</label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger data-testid="select-payment">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          PIX
                        </div>
                      </SelectItem>
                      <SelectItem value="credit_card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Cartão de Crédito
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span data-testid="text-subtotal">R$ {parseFloat(product.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de serviço</span>
                    <span data-testid="text-fee">R$ 0,00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary" data-testid="text-total">
                      R$ {parseFloat(product.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBuy}
                  disabled={createTransactionMutation.isPending || (product.status !== "active" && product.status !== "available")}
                  data-testid="button-buy"
                >
                  {createTransactionMutation.isPending ? "Processando..." : "Comprar Agora"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Transação segura via sistema de escrow
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
