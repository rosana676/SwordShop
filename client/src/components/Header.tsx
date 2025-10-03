
import { Sword, User, Menu, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

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
          <Link href="/vender">
            <a className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-sell">
              Vender
            </a>
          </Link>
          <a href="#how-it-works" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-how-it-works">
            Como Funciona
          </a>
        </nav>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2" data-testid="button-profile">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/meus-produtos">
                    <a className="cursor-pointer flex items-center w-full">
                      <Package className="w-4 h-4 mr-2" />
                      Meus Produtos
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/vender">
                    <a className="cursor-pointer flex items-center w-full">
                      <Sword className="w-4 h-4 mr-2" />
                      Vender
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
