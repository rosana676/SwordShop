import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sword } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function UserRegister() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, isAdmin: false }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao cadastrar');
        return;
      }

      alert('Cadastro realizado com sucesso!');
      setLocation('/login');
    } catch (error) {
      alert('Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <Link href="/">
            <div className="inline-flex items-center gap-2 mb-4 hover-elevate cursor-pointer">
              <Sword className="w-8 h-8 text-primary" />
              <span className="font-heading font-bold text-2xl">Sword Shop</span>
            </div>
          </Link>
        </div>
        
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-heading" data-testid="text-register-title">
              Criar Conta
            </CardTitle>
            <CardDescription data-testid="text-register-description">
              Cadastre-se para começar a comprar e vender
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" data-testid="label-name">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  data-testid="input-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" data-testid="label-email">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" data-testid="label-password">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  data-testid="input-password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" data-testid="label-confirm-password">
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  data-testid="input-confirm-password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                data-testid="button-register"
              >
                {loading ? "Cadastrando..." : "Criar Conta"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login">
                <span className="text-primary hover:underline cursor-pointer" data-testid="link-login">
                  Entrar
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
