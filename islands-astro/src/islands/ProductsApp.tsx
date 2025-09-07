import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ProductGrid } from "../components/react/ProductGrid";
import { ProductFilters } from "../components/react/ProductFilters";
import { SearchBar } from "../components/react/SearchBar";
import { ShoppingCart } from "../components/react/ShoppingCart";
import { CartProvider, useCart } from "../components/react/CartProvider";
import { Button } from "../components/react/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/react/ui/sheet";
import { ShoppingCartIcon, FilterIcon } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import type { FilterOptions } from "../types/product";

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    priceRange: [0, 1000],
    sortBy: "name",
    inStock: false,
  });

  const [headerActionsNode, setHeaderActionsNode] = useState<Element | null>(
    null
  );
  const [mobileSearchNode, setMobileSearchNode] = useState<Element | null>(
    null
  );
  const [desktopFiltersNode, setDesktopFiltersNode] = useState<Element | null>(
    null
  );

  useEffect(() => {
    setHeaderActionsNode(document.querySelector("#header-actions"));
    setMobileSearchNode(document.querySelector("#mobile-search"));
    setDesktopFiltersNode(document.querySelector("#desktop-filters"));
  }, []);

  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { products, loading, error } = useProducts(searchQuery, filters);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {headerActionsNode &&
        createPortal(
          <>
            <div className="hidden md:block">
              <SearchBar onSearch={setSearchQuery} />
            </div>

            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden bg-transparent">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </SheetContent>
            </Sheet>

            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button className="relative">
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <ShoppingCart
                  cart={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                />
              </SheetContent>
            </Sheet>
          </>,
          headerActionsNode
        )}

      {mobileSearchNode &&
        createPortal(<SearchBar onSearch={setSearchQuery} />, mobileSearchNode)}

      {desktopFiltersNode &&
        createPortal(
          <ProductFilters filters={filters} onFiltersChange={setFilters} />,
          desktopFiltersNode
        )}

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {error && (
        <div className="text-center text-red-500 py-8">
          Error loading products: {error}
        </div>
      )}
      {!loading && !error && (
        <ProductGrid products={products} onAddToCart={addToCart} />
      )}
    </>
  );
}

export default function ProductsApp() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
