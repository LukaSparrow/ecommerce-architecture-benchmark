import { Card, CardContent } from "./ui/card";
import { Truck, Shield, Headphones, Zap, type LucideIcon } from "lucide-react";

// Mapa, która tłumaczy string na komponent
const iconMap: { [key: string]: LucideIcon } = {
  Truck,
  Shield,
  Headphones,
  Zap,
};

export interface Feature {
  iconName: string; // ZMIANA: Oczekujemy stringa
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  // Wybieramy ikonę z mapy na podstawie nazwy
  const Icon = iconMap[feature.iconName];

  // Jeśli ikona o danej nazwie nie istnieje, nie renderuj nic, aby uniknąć błędu
  if (!Icon) {
    return null;
  }

  return (
    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
      <CardContent className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  );
}
