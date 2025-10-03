import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  name: string;
  count: number;
}

export default function CategoryCard({ icon: Icon, name, count }: CategoryCardProps) {
  return (
    <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 hover:shadow-md" data-testid={`card-category-${name}`}>
      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-base" data-testid={`text-category-name-${name}`}>{name}</h3>
          <p className="text-sm text-muted-foreground" data-testid={`text-category-count-${count}`}>
            {count} itens
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
