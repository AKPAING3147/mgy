"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string;
    stock?: number;
}

export default function ProductsGrid({ products }: { products: Product[] }) {
    const { t } = useLanguage();

    return (
        <section className="py-20 bg-white">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif text-4xl md:text-5xl mb-4 text-stone-900">
                        {t("products_title")}
                    </h2>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-primary/30"></div>
                        <Heart className="w-5 h-5 text-primary fill-current" />
                        <div className="h-px w-12 bg-primary/30"></div>
                    </div>
                </motion.div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-stone-500 text-lg">{t("products_empty")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, i) => {
                            let images: string[] = [];
                            try {
                                images = JSON.parse(product.images);
                            } catch (e) {
                                images = [product.images];
                            }

                            const stock = product.stock ?? 0;
                            const isOutOfStock = stock <= 0;

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-xl overflow-hidden shadow-md border border-stone-100 flex flex-col h-full hover:shadow-lg transition-shadow"
                                >
                                    {/* Image - Static, no hover zoom */}
                                    <div className="h-[300px] overflow-hidden bg-stone-100 relative">
                                        <Link href={`/product/${product.id}`}>
                                            {images[0] ? (
                                                <img
                                                    src={images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                    No Image
                                                </div>
                                            )}
                                            {isOutOfStock && (
                                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                                    <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                        </Link>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="mb-auto">
                                            <p className="text-primary text-xs font-bold uppercase tracking-wider mb-2">
                                                {product.category}
                                            </p>
                                            <Link href={`/product/${product.id}`} className="block">
                                                <h3 className="font-serif text-xl text-stone-900 mb-2 hover:text-primary transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-stone-500 text-sm line-clamp-2 mb-4">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                                            <div>
                                                <span className="text-xl font-bold text-stone-900">${product.price}</span>
                                                <span className="text-xs text-stone-400 ml-1">/ unit</span>
                                            </div>
                                            <Link href={`/product/${product.id}`}>
                                                <button
                                                    disabled={isOutOfStock}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isOutOfStock
                                                            ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                                                            : "bg-primary text-white hover:bg-primary/90"
                                                        }`}
                                                >
                                                    {isOutOfStock ? "Sold Out" : "Order Now"}
                                                    {!isOutOfStock && <ArrowRight className="w-4 h-4" />}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
