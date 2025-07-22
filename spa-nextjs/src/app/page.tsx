"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { ProductsPage } from "@/components/products-page"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<"landing" | "products">("landing")

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />

      {currentPage === "landing" && <LandingPage onShopNow={() => setCurrentPage("products")} />}
      {currentPage === "products" && <ProductsPage />}
    </div>
  )
}
