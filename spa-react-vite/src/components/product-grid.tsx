"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ProductsPerPage } from "./products-per-page";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);

  // Load saved preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("productsPerPage");
    if (saved) {
      const numValue = Number.parseInt(saved);
      if (numValue >= 1 && numValue <= 200) {
        setProductsPerPage(numValue);
      }
    }
  }, []);

  // Reset to first page when products per page changes
  const handleProductsPerPageChange = (newValue: number) => {
    setProductsPerPage(newValue);
    setCurrentPage(1);
  };

  // Reset to first page when products change (e.g., after filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-
          {Math.min(startIndex + productsPerPage, products.length)} of{" "}
          {products.length} products
        </p>

        <ProductsPerPage
          value={productsPerPage}
          onChange={handleProductsPerPageChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
