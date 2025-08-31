"use client"

import { useState, useEffect } from "react"
import { mockProducts } from "@/data/mock-products"

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100))

        const uniqueCategories = [...new Set(mockProducts.map((product) => product.category))]
        setCategories(uniqueCategories.sort())
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
