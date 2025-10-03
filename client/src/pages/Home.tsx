import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Gamepad2, Sword, Trophy, Gem, Shield, Coins } from "lucide-react";

export default function Home() {
  const categories = [
    { icon: Gamepad2, name: "Contas", count: 0 },
    { icon: Sword, name: "Armas & Skins", count: 0 },
    { icon: Trophy, name: "Boosting", count: 0 },
    { icon: Gem, name: "Itens Raros", count: 0 },
    { icon: Shield, name: "Escudos", count: 0 },
    { icon: Coins, name: "Moedas", count: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col dark">
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
          <div className="text-center space-y-4">
            <h2 className="font-heading font-bold text-3xl" data-testid="text-products-title">
              Nenhum Item Disponível
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-empty-state">
              O marketplace ainda não possui itens cadastrados. Seja o primeiro vendedor!
            </p>
            <Button variant="default" className="mt-4" data-testid="button-start-selling">
              Começar a Vender
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
