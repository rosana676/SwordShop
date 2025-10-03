import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sword } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function UserLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao fazer login');
        return;
      }

      const user = await response.json();
      console.log('Login successful:', user);
      
      if (user.isAdmin) {
        setLocation('/admin/dashboard');
      } else {
        setLocation('/');
      }
    } catch (error) {
      alert('Erro ao fazer login. Tente novamente.');
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
            <CardTitle className="text-2xl font-heading" data-testid="text-login-title">
              Entrar
            </CardTitle>
            <CardDescription data-testid="text-login-description">
              Entre com sua conta para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                data-testid="button-login"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link href="/cadastro">
                <span className="text-primary hover:underline cursor-pointer" data-testid="link-register">
                  Cadastre-se
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
