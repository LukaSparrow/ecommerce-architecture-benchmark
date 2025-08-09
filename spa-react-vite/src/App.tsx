import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { CartProvider } from "./components/cart-provider";
import { LandingPage } from "./pages/landing-page";
import { ProductsPage } from "./pages/products-page";

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
