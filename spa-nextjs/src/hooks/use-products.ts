"use client"

import { useState, useEffect } from "react"
import type { Product, FilterOptions } from "@/types/product"
import { mockProducts } from "@/data/mock-products"

export function useProducts(searchQuery: string, filters: FilterOptions) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        // Simulate API delay for benchmarking
        await new Promise((resolve) => setTimeout(resolve, 500))

        let filteredProducts = [...mockProducts]

        // Apply search filter
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }

        // Apply category filter
        if (filters.category) {
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
        filteredProducts.sort((a, b) => {
          switch (filters.sortBy) {
            case "price-low":
              return a.price - b.price
            case "price-high":
              return b.price - a.price
            case "rating":
              return b.rating - a.rating
            case "newest":
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            default:
              return a.name.localeCompare(b.name)
          }
        })

        setProducts(filteredProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchQuery, filters])

  return { products, loading, error }
}
