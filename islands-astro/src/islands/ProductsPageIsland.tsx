"use client";

import { useState } from "react";
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

function ProductsPageContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    priceRange: [0, 1000],
    sortBy: "name",
    inStock: false,
  });

  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { products, loading, error } = useProducts(searchQuery, filters);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Products Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Our Products</h1>
              <p className="text-muted-foreground">
                Discover amazing products at great prices
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <SearchBar onSearch={setSearchQuery} />
              </div>

              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="md:hidden bg-transparent"
                  >
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
            </div>
          </div>

          <div className="mt-4 md:hidden">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
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
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPageIsland() {
  return (
    <CartProvider>
      <ProductsPageContent />
    </CartProvider>
  );
}
