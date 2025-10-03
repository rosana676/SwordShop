import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProductCardProps {
  id: string;
  title: string;
  game: string;
  price: number;
  image: string;
  seller: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  status: "available" | "in_escrow" | "sold";
}

export default function ProductCard({ title, game, price, image, seller, status }: ProductCardProps) {
  const statusConfig = {
    available: { label: "Disponível", variant: "default" as const },
    in_escrow: { label: "Em Escrow", variant: "secondary" as const },
    sold: { label: "Vendido", variant: "outline" as const },
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200 hover:shadow-lg group" data-testid={`card-product-${title}`}>
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
          <Badge className="absolute top-2 left-2" variant="secondary" data-testid={`badge-game-${game}`}>
            {game}
          </Badge>
          <Badge 
            className="absolute top-2 right-2" 
            variant={statusConfig[status].variant}
            data-testid={`badge-status-${status}`}
          >
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2" data-testid={`text-title-${title}`}>
          {title}
        </h3>
        
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={seller.avatar} />
            <AvatarFallback>{seller.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground" data-testid={`text-seller-${seller.name}`}>
            {seller.name}
          </span>
          {seller.verified && (
            <Shield className="w-4 h-4 text-primary" data-testid="icon-verified" />
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-2xl font-bold text-primary" data-testid={`text-price-${price}`}>
              R$ {price.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="default" data-testid={`button-buy-${title}`}>
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
