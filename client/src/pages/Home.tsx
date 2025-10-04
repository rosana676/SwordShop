import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Gamepad2, Sword, Trophy, Gem, Shield, Coins } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  categoryId: string;
  sellerId: string;
  game: string;
  imageUrl: string | null;
  status: string;
  approvalStatus: string;
  rejectionReason: string | null;
  createdAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isSeller: boolean;
}

export default function Home() {
  const [, setLocation] = useLocation();
  
  const categories = [
    { icon: Gamepad2, name: "Contas", count: 0 },
    { icon: Sword, name: "Armas & Skins", count: 0 },
    { icon: Trophy, name: "Boosting", count: 0 },
    { icon: Gem, name: "Itens Raros", count: 0 },
    { icon: Shield, name: "Escudos", count: 0 },
    { icon: Coins, name: "Moedas", count: 0 },
  ];

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const sellers = allUsers.reduce((acc: Record<string, User>, user: User) => {
    acc[user.id] = user;
    return acc;
  }, {});

  const recentProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        <section className="py-12 container px-4">
          <h2 className="font-heading font-bold text-3xl mb-6 text-center" data-testid="text-categories-title">
            Categorias Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </section>
        
        <TrustSection />
        
        <section className="py-12 container px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-3xl mb-2" data-testid="text-products-title">
                {products.length === 0 ? "Nenhum Item Disponível" : "Produtos Recentes"}
              </h2>
              {products.length > 0 && (
                <p className="text-muted-foreground" data-testid="text-products-subtitle">
                  Confira os últimos produtos adicionados
                </p>
              )}
            </div>
            {products.length > 8 && (
              <Button 
                variant="outline" 
                onClick={() => setLocation("/produtos")}
                data-testid="button-view-all"
              >
                Ver Todos
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 bg-card animate-pulse rounded-lg" data-testid={`skeleton-${i}`} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-empty-state">
                O marketplace ainda não possui itens cadastrados. Seja o primeiro vendedor!
              </p>
              <Button 
                variant="default" 
                className="mt-4"
                onClick={() => setLocation("/vender")}
                data-testid="button-start-selling"
              >
                Começar a Vender
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentProducts.map((product) => {
                const seller = sellers[product.sellerId];
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    game={product.game}
                    price={parseFloat(product.price)}
                    image={product.imageUrl || "https://via.placeholder.com/400x300"}
                    seller={{
                      name: seller?.name || "Vendedor",
                      verified: seller?.isSeller || false,
                    }}
                    status={product.status === "active" ? "available" : product.status === "sold" ? "sold" : "available"}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
