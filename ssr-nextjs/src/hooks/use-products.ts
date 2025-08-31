"use client"

import { useState, useEffect } from "react"
import { mockProducts } from "@/data/mock-products"
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
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        let filteredProducts = [...mockProducts]

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
          )
        }

        // Apply category filter
        if (filters.category && filters.category !== "all") {
          filteredProducts = filteredProducts.filter((product) => product.category === filters.category)
        }

        // Apply price range filter
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
        )

        // Apply stock filter
        if (filters.inStock) {
          filteredProducts = filteredProducts.filter((product) => product.inStock)
        }

        // Apply sorting
        switch (filters.sortBy) {
          case "price-low":
            filteredProducts.sort((a, b) => a.price - b.price)
            break
          case "price-high":
            filteredProducts.sort((a, b) => b.price - a.price)
            break
          case "rating":
            filteredProducts.sort((a, b) => b.rating - a.rating)
            break
          case "newest":
            filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            break
          default:
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        }

        setProducts(filteredProducts)
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
