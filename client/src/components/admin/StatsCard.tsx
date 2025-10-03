import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  testId: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, testId }: StatsCardProps) {
  return (
    <Card data-testid={`card-stat-${testId}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium" data-testid={`text-stat-title-${testId}`}>
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`text-stat-value-${testId}`}>
          {value}
        </div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`} data-testid={`text-stat-trend-${testId}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% desde último mês
          </p>
        )}
      </CardContent>
    </Card>
  );
}
