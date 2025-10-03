import CategoryCard from '../CategoryCard';
import { Gamepad2 } from 'lucide-react';

export default function CategoryCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="max-w-xs">
        <CategoryCard
          icon={Gamepad2}
          name="Contas"
          count={1250}
        />
      </div>
    </div>
  );
}
