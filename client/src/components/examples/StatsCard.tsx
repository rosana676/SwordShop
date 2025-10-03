import StatsCard from '../admin/StatsCard';
import { Users } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="p-8 bg-background dark">
      <div className="max-w-sm">
        <StatsCard
          title="Total de Usuários"
          value="0"
          icon={Users}
          testId="users"
        />
      </div>
    </div>
  );
}
