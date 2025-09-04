import { Button } from "../react/ui/button";
import { ArrowRight, Star } from "lucide-react";

export default function HeroActions() {
  return (
    <div className="space-y-6">
      {/* Przyciski */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="text-lg px-8">
          <a href="/products" className="flex items-center">
            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-lg px-8 bg-transparent"
        >
          Learn More
        </Button>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">4.9/5</span> from
          2,500+ reviews
        </div>
      </div>
    </div>
  );
}
