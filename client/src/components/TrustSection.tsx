import { Shield, Users, TrendingUp, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TrustSection() {
  const stats = [
    { icon: Users, label: "Usuários Ativos", value: "0", testId: "users" },
    { icon: Shield, label: "Proteção Escrow", value: "100%", testId: "escrow" },
    { icon: TrendingUp, label: "Transações", value: "0", testId: "transactions" },
    { icon: Lock, label: "Segurança", value: "Total", testId: "security" },
  ];

  return (
    <div className="py-12 bg-card/50">
      <div className="container px-4">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-3xl mb-2" data-testid="text-trust-title">
            Compre e Venda com Segurança
          </h2>
          <p className="text-muted-foreground" data-testid="text-trust-description">
            Sistema de escrow que protege compradores e vendedores
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center" data-testid={`card-stat-${stat.testId}`}>
              <CardContent className="p-6 flex flex-col items-center gap-2">
                <stat.icon className="w-8 h-8 text-primary mb-2" />
                <p className="font-heading font-bold text-2xl" data-testid={`text-stat-value-${stat.testId}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground" data-testid={`text-stat-label-${stat.testId}`}>
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
