import { ProductsPage } from "@/components/products-page";
import { mockProducts } from "@/data/mock-products";

// Server Component - renderowane na serwerze
export default function ProductsPageRoute() {
  return <ProductsPage initialProducts={mockProducts} />;
}
