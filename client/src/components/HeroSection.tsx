import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    console.log('Buscando:', { searchTerm, category });
  };

  return (
    <div className="relative w-full h-[60vh] bg-gradient-to-br from-red-950/50 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJ2Mmgtdi0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="font-heading font-bold text-5xl md:text-7xl text-white mb-4 tracking-tight" data-testid="text-hero-title">
          Sword Shop
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl" data-testid="text-hero-subtitle">
          Compre e Venda Itens de Jogos com Segurança
        </p>
        
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48 h-12 bg-card/80 backdrop-blur-sm border-card-border" data-testid="select-category">
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
              placeholder="Buscar itens, jogos..."
              className="pl-10 h-12 text-base bg-card/80 backdrop-blur-sm border-card-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-hero-search"
            />
          </div>
          <Button size="lg" className="h-12 px-8" onClick={handleSearch} data-testid="button-search">
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
}
