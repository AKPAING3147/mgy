"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import InvitationPreview from "./InvitationPreview";

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
                            // Parse template data
                            let templateData: any = null;
                            try {
                                const parsed = JSON.parse(product.images);
                                // Check if it's template data (JSON string) or old image URL
                                if (Array.isArray(parsed)) {
                                    const firstItem = parsed[0];
                                    if (typeof firstItem === 'string' && firstItem.startsWith('{')) {
                                        templateData = JSON.parse(firstItem);
                                    }
                                }
                            } catch (e) {
                                // Not template data
                            }

                            const stock = product.stock ?? 0;
                            const isOutOfStock = stock <= 0;

                            // Sample data for preview
                            const previewData = {
                                brideName: "Jane",
                                groomName: "John",
                                weddingDate: "2025-06-15",
                                weddingTime: "16:00",
                                venue: "Sunset Garden Resort",
                                additionalInfo: "",
                                colorScheme: templateData?.defaultColorScheme || "rose-gold",
                                fontStyle: templateData?.defaultFontStyle || "elegant"
                            };

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-xl overflow-hidden shadow-md border border-stone-100 flex flex-col h-full hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Template Preview */}
                                    <div className="h-[400px] overflow-hidden bg-stone-50 relative p-4">
                                        <Link href={`/product/${product.id}`}>
                                            <div className="h-full transform hover:scale-105 transition-transform duration-300">
                                                <InvitationPreview
                                                    customization={previewData}
                                                    productName={product.name}
                                                />
                                            </div>
                                            {isOutOfStock && (
                                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                                    <span className="bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                        </Link>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-grow bg-white">
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
                                                <span className="text-2xl font-bold text-stone-900">${product.price}</span>
                                                <span className="text-xs text-stone-400 ml-1">/ card</span>
                                            </div>
                                            <Link href={`/product/${product.id}`}>
                                                <button
                                                    disabled={isOutOfStock}
                                                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm ${isOutOfStock
                                                        ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                                                        : "bg-primary text-white hover:bg-primary/90 hover:shadow-md"
                                                        }`}
                                                >
                                                    {isOutOfStock ? "Sold Out" : "Customize"}
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
