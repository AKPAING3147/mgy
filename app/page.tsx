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

      {/* Hero Banner - Your MGY OFFSET Image */}
      <div className="pt-16">
        <div className="w-full max-w-[1600px] mx-auto bg-stone-100/50">
          <img
            src="/hero-banner.jpg"
            alt="MGY OFFSET - Printing Services"
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* Products */}
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
