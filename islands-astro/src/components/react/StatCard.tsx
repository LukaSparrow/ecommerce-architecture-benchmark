import { Users, Award, Truck, Star, type LucideIcon } from "lucide-react";

// Mapa dla ikon w tej sekcji
const iconMap: { [key: string]: LucideIcon } = {
  Users,
  Award,
  Truck,
  Star,
};

export interface Stat {
  iconName: string; // ZMIANA
  value: string;
  label: string;
}

interface StatCardProps {
  stat: Stat;
}

export default function StatCard({ stat }: StatCardProps) {
  const Icon = iconMap[stat.iconName];

  if (!Icon) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
        <Icon className="h-8 w-8" />
      </div>
      <div>
        <div className="text-4xl font-bold">{stat.value}</div>
        <div className="text-lg opacity-90">{stat.label}</div>
      </div>
    </div>
  );
}
