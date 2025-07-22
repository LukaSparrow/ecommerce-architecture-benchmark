export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  inStock: boolean
  createdAt: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface FilterOptions {
  category: string
  priceRange: [number, number]
  sortBy: "name" | "price-low" | "price-high" | "rating" | "newest"
  inStock: boolean
}
