import { Card } from "../react/ui/card";

export default function CategoryCard({ category }) {
  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
      <a href="/products" className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-sm opacity-90">{category.count}</p>
          </div>
        </div>
      </a>
    </Card>
  );
}
