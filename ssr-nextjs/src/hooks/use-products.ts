"use client"

import { useState, useEffect } from "react"
import type { Product, FilterOptions } from "@/types/product"

const API_BASE_URL = "http://localhost:3001"

interface ApiResponse {
  products: Product[];
  total: number;
}

export function useProducts(searchQuery: string, filters: FilterOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {

        const params = new URLSearchParams({
          searchQuery: searchQuery,
          category: filters.category,
          priceMin: filters.priceRange[0].toString(),
          priceMax: filters.priceRange[1].toString(),
          inStockOnly: String(filters.inStock),
          sortBy: filters.sortBy,
        });

        const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`, {
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        setProducts(data.products);

      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchQuery, filters]);

  return { products, loading, error };
}