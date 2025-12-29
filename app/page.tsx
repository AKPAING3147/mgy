import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import ProductsGrid from "@/components/ProductsGrid";
import Link from "next/link";
import { ArrowRight, Heart, Palette, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch featured products
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Title */}
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6 leading-tight animate-fade-in-up">
              Creating Beautiful
              <span className="block bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                Memories Together
              </span>
            </h1>

            {/* Hero Description */}
            <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              From elegant wedding invitations to custom cloth printing, we bring your vision to life with exceptional quality and personalized service
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
              <Link href="/collections">
                <Button size="lg" className="h-14 px-8 text-lg font-medium bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  Explore Collections
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium border-2 border-stone-900 hover:bg-stone-900 hover:text-white transform hover:-translate-y-1 transition-all duration-300">
                  Get Custom Quote
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">1000+</div>
                <div className="text-sm md:text-base text-stone-600">Happy Couples</div>
              </div>
              <div className="text-center border-x border-stone-300">
                <div className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">5000+</div>
                <div className="text-sm md:text-base text-stone-600">Projects Done</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">99%</div>
                <div className="text-sm md:text-base text-stone-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Specialized in creating memorable experiences through premium printing services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Wedding Invitations */}
            <div className="group relative bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-2xl border-2 border-rose-200 hover:border-rose-400 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Wedding Invitations</h3>
              <p className="text-stone-600 mb-6">
                Elegant, customizable designs that capture the essence of your special day
              </p>
              <Link href="/collections" className="inline-flex items-center text-rose-600 font-semibold hover:text-rose-700">
                View Designs <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Cloth Printing */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Printer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Cloth Printing</h3>
              <p className="text-stone-600 mb-6">
                High-quality prints on t-shirts, hoodies, and custom garments
              </p>
              <Link href="/collections" className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Custom Design */}
            <div className="group relative bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Custom Design</h3>
              <p className="text-stone-600 mb-6">
                Personalized designs tailored to your unique style and preferences
              </p>
              <Link href="/contact" className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700">
                Contact Us <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-stone-50 to-amber-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
                Featured Designs
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Explore our latest collection of stunning designs
              </p>
            </div>
            <ProductsGrid products={products} />
            <div className="text-center mt-12">
              <Link href="/collections">
                <Button size="lg" variant="outline" className="h-12 px-8 border-2 border-stone-900 hover:bg-stone-900 hover:text-white">
                  View All Collections
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-16">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">MGY OFFSET</h3>
              <p className="text-stone-400">
                Creating beautiful memories through premium printing services since 2020.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/collections" className="hover:text-amber-400 transition-colors">Collections</Link></li>
                <li><Link href="/track-order" className="hover:text-amber-400 transition-colors">Track Order</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
              <p className="text-stone-400">
                Email: info@mgyoffset.com<br />
                Phone: +95 123 456 789
              </p>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center">
            <p className="text-stone-500">© 2024 MGY OFFSET. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
