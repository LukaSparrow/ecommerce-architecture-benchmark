import { useState, useEffect } from "react"
import type { Product, FilterOptions } from "../types/product"
import { searchProducts } from "../lib/database"

export function useProducts(searchQuery: string, filters: FilterOptions) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        const result = await searchProducts(
          searchQuery,
          filters.category,
          filters.priceRange[0],
          filters.priceRange[1],
          filters.inStock,
          filters.sortBy,
          1000,
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
