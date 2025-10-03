import { Sword, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60" data-testid="header-main">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
            <Menu className="w-5 h-5" />
          </Button>
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Sword className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold text-xl" data-testid="text-logo">Sword Shop</span>
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#marketplace" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-marketplace">
            Marketplace
          </a>
          <a href="#sell" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-sell">
            Vender
          </a>
          <a href="#how-it-works" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-how-it-works">
            Como Funciona
          </a>
        </nav>
        
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" data-testid="button-login">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button variant="default" size="sm" className="hidden md:inline-flex" data-testid="button-register">
              Cadastrar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
