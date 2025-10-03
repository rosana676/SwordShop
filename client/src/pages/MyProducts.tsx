
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Plus } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  game: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
}

export default function MyProducts() {
  const { user } = useAuth();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { sellerId: user?.id }],
    enabled: !!user,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Ativo</Badge>;
      case "sold":
        return <Badge variant="secondary">Vendido</Badge>;
      case "inactive":
        return <Badge variant="outline">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="font-heading font-bold text-3xl">Meus Produtos</h1>
          </div>
          <Link href="/vender">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {product.game}
                    </Badge>
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(product.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-primary">
                      R$ {parseFloat(product.price).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-heading font-bold text-2xl mb-2">
              Nenhum produto cadastrado
            </h2>
            <p className="text-muted-foreground mb-6">
              Comece a vender criando seu primeiro produto
            </p>
            <Link href="/vender">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Produto
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
