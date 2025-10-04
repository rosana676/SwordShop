import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function Products() {
  const searchParams = useSearch();
  const [, setLocation] = useLocation();
  
  const urlParams = new URLSearchParams(searchParams);
  const initialSearch = urlParams.get("search") || "";
  const initialCategory = urlParams.get("category") || "all";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [localSearchInput, setLocalSearchInput] = useState(initialSearch);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", searchTerm, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (category && category !== "all") params.append("categoryId", category);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error("Erro ao buscar produtos");
      return response.json();
    },
  });

  const { data: sellers = {} } = useQuery<Record<string, User>>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Erro ao buscar usuários");
      const users = await response.json();
      return users.reduce((acc: Record<string, User>, user: User) => {
        acc[user.id] = user;
        return acc;
      }, {});
    },
  });

  const handleSearch = () => {
    setSearchTerm(localSearchInput);
    const params = new URLSearchParams();
    if (localSearchInput) params.append("search", localSearchInput);
    if (category && category !== "all") params.append("category", category);
    setLocation(`/produtos?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const params = new URLSearchParams();
    if (localSearchInput) params.append("search", localSearchInput);
    if (value && value !== "all") params.append("category", value);
    setLocation(`/produtos?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-4xl mb-2" data-testid="text-page-title">
            Produtos Disponíveis
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-subtitle">
            Encontre os melhores itens de jogos
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-category-filter">
              <SelectValue placeholder="Todas Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              <SelectItem value="contas">Contas</SelectItem>
              <SelectItem value="armas">Armas & Skins</SelectItem>
              <SelectItem value="boosting">Boosting</SelectItem>
              <SelectItem value="itens">Itens Raros</SelectItem>
              <SelectItem value="escudos">Escudos</SelectItem>
              <SelectItem value="moedas">Moedas</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-10"
              value={localSearchInput}
              onChange={(e) => setLocalSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              data-testid="input-search-products"
            />
          </div>
          
          <Button onClick={handleSearch} data-testid="button-search-products">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-card animate-pulse rounded-lg" data-testid={`skeleton-${i}`} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="font-heading font-bold text-2xl mb-2" data-testid="text-no-results">
              Nenhum produto encontrado
            </h2>
            <p className="text-muted-foreground" data-testid="text-no-results-subtitle">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
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
      </main>
      
      <Footer />
    </div>
  );
}
