"use client"

// Ten hook jest teraz zastąpiony przez CartProvider i useCart z cart-provider.tsx
// Pozostawiamy go dla kompatybilności wstecznej, ale przekierowujemy do nowego providera

export { useCart } from "@/components/cart-provider"

// export function useCart() {
//   const [cart, setCart] = useState<CartItem[]>([])
//
//   const addToCart = (product: Product) => {
//     setCart((prev) => {
//       const existingItem = prev.find((item) => item.id === product.id)
//
//       if (existingItem) {
//         return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
//       }
//
//       return [...prev, { ...product, quantity: 1 }]
//     })
//   }
//
//   const removeFromCart = (id: string) => {
//     setCart((prev) => prev.filter((item) => item.id !== id))
//   }
//
//   const updateQuantity = (id: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(id)
//       return
//     }
//
//     setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
//   }
//
//   return {
//     cart,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//   }
// }
