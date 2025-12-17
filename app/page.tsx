import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import ProductsGrid from "@/components/ProductsGrid";

export default async function Home() {
  // Fetch all products
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header with Business Name */}
      <div className="pt-24 pb-8 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">MGY OFFSET</h1>
          <p className="text-xl text-white/90">Premium Printing Services</p>
        </div>
      </div>

      {/* Products Only */}
      <ProductsGrid products={products} />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">MGY OFFSET</h2>
          <p>© 2024 MGY OFFSET. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
