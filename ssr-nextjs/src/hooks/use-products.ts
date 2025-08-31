"use client"

import { useState, useEffect } from "react"
import { searchProducts } from "@/lib/database"
import type { Product, FilterOptions } from "@/types/product"

export function useProducts(searchQuery: string, filters: FilterOptions) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await searchProducts(
          searchQuery,
          filters.category,
          filters.priceRange[0],
          filters.priceRange[1],
          filters.inStock,
          filters.sortBy,
          1000, // Get all products for client-side pagination
          0,
        )

        setProducts(result.products)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchQuery, filters])

  return { products, loading, error }
}
