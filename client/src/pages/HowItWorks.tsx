
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShoppingCart, Package, CheckCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function HowItWorks() {
  const [, setLocation] = useLocation();

  const steps = [
    {
      icon: ShoppingCart,
      title: "1. Navegue pelo Marketplace",
      description: "Explore nossa vasta seleção de itens de jogos, contas, skins, armas e muito mais. Use os filtros para encontrar exatamente o que procura.",
    },
    {
      icon: Shield,
      title: "2. Compre com Segurança",
      description: "Todas as transações são protegidas pelo nosso sistema de escrow. Seu dinheiro fica seguro até confirmar o recebimento do item.",
    },
    {
      icon: Package,
      title: "3. Venda seus Itens",
      description: "Cadastre-se como vendedor e liste seus itens em minutos. Defina seu preço e alcance milhares de compradores interessados.",
    },
    {
      icon: CheckCircle,
      title: "4. Confirmação e Entrega",
      description: "Após receber o item, confirme a transação. O pagamento é liberado automaticamente para o vendedor de forma segura.",
    },
  ];

  return (
    <div className="min-h-screen bg-background dark">
      <div className="container px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Home
        </Button>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="font-heading font-bold text-4xl md:text-5xl">
              Como Funciona
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprar e vender itens de jogos nunca foi tão fácil e seguro. Veja como funciona o processo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Sistema de Escrow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Nosso sistema de escrow garante que tanto compradores quanto vendedores estejam protegidos durante toda a transação.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>O pagamento fica retido até a confirmação da entrega</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Proteção contra fraudes para ambas as partes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Suporte dedicado em caso de problemas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Transações 100% rastreáveis e transparentes</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center space-y-4 pt-8">
            <h2 className="font-heading font-bold text-3xl">
              Pronto para começar?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Junte-se a milhares de jogadores que já compram e vendem com segurança no Sword Shop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => setLocation("/cadastro")}
                data-testid="button-register"
              >
                Criar Conta Grátis
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/produtos")}
                data-testid="button-browse"
              >
                Ver Produtos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
