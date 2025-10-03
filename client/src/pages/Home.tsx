import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import { Gamepad2, Sword, Trophy, Gem, Shield, Coins } from "lucide-react";

export default function Home() {
  const categories = [
    { icon: Gamepad2, name: "Contas", count: 1250 },
    { icon: Sword, name: "Armas & Skins", count: 3420 },
    { icon: Trophy, name: "Boosting", count: 890 },
    { icon: Gem, name: "Itens Raros", count: 2100 },
    { icon: Shield, name: "Escudos", count: 670 },
    { icon: Coins, name: "Moedas", count: 5300 },
  ];

  const products = [
    {
      id: "1",
      title: "Conta Level 120 - Todos os Personagens Desbloqueados",
      game: "Valorant",
      price: 450.00,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
      seller: { name: "GamerPro", verified: true },
      status: "available" as const,
    },
    {
      id: "2",
      title: "Skin Dragão Lendária - Edição Limitada",
      game: "CS:GO",
      price: 1200.00,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop",
      seller: { name: "SkinMaster", verified: true },
      status: "in_escrow" as const,
    },
    {
      id: "3",
      title: "10.000 V-Bucks + Battle Pass Completo",
      game: "Fortnite",
      price: 85.00,
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=225&fit=crop",
      seller: { name: "FastSeller", verified: false },
      status: "available" as const,
    },
    {
      id: "4",
      title: "Conta GC Global Elite - 5 Anos Veterano",
      game: "CS:GO",
      price: 890.00,
      image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=225&fit=crop",
      seller: { name: "ProTrader", verified: true },
      status: "available" as const,
    },
    {
      id: "5",
      title: "Conjunto Completo Armadura Diamante Encantada",
      game: "Minecraft",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=400&h=225&fit=crop",
      seller: { name: "MineCraft99", verified: false },
      status: "sold" as const,
    },
    {
      id: "6",
      title: "Boost Platina para Diamante - Rápido e Seguro",
      game: "League of Legends",
      price: 350.00,
      image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=225&fit=crop",
      seller: { name: "BoostKing", verified: true },
      status: "available" as const,
    },
    {
      id: "7",
      title: "Pacote 50.000 FIFA Points",
      game: "FIFA 24",
      price: 280.00,
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=225&fit=crop",
      seller: { name: "FIFAStore", verified: true },
      status: "in_escrow" as const,
    },
    {
      id: "8",
      title: "Espada Lendária Nível 100 + Set Completo",
      game: "Genshin Impact",
      price: 650.00,
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=225&fit=crop",
      seller: { name: "GenshinPro", verified: true },
      status: "available" as const,
    },
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-3xl" data-testid="text-products-title">
              Itens em Destaque
            </h2>
            <a href="#" className="text-primary hover:underline text-sm font-medium" data-testid="link-view-all">
              Ver todos
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
