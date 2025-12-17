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
}

export default function ProductsGrid({ products }: { products: Product[] }) {
    const { t } = useLanguage();

    return (
        <section className="py-32 bg-gradient-to-b from-white via-amber-50/20 to-rose-50/20 relative overflow-hidden">
            <div className="absolute top-20 right-10 w-72 h-72 bg-amber-100/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose-100/20 rounded-full blur-3xl" />

            <div className="container px-4 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="font-serif text-5xl md:text-6xl mb-6 bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                        {t("products_title")}
                    </h2>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50"></div>
                        <Heart className="w-5 h-5 text-primary fill-current" />
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50"></div>
                    </div>
                    <p className="text-stone-600 text-lg">{t("products_subtitle")}</p>
                </motion.div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-stone-500 text-lg mb-6">{t("products_empty")}</p>
                        <p className="text-stone-400 text-sm">{t("products_empty_sub")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products.map((product, i) => {
                            let images: string[] = [];
                            try {
                                images = JSON.parse(product.images);
                            } catch (e) {
                                images = [product.images];
                            }

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.15, duration: 0.6 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -8 }}
                                    className="group relative overflow-hidden cursor-pointer shadow-xl hover:shadow-3xl transition-all duration-700 bg-white rounded-lg"
                                >
                                    {/* Image */}
                                    <div className="h-[400px] overflow-hidden relative bg-stone-100">
                                        {images[0] ? (
                                            <img
                                                src={images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                                                <span className="text-stone-400 text-lg font-serif">No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

                                    {/* Content */}
                                    <div className="p-6 bg-white">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.2 + 0.3 }}
                                            viewport={{ once: true }}
                                            className="space-y-3"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="text-amber-600 text-xs uppercase tracking-[0.3em] font-semibold mb-1">
                                                        {product.category}
                                                    </p>
                                                    <h3 className="font-serif text-2xl text-stone-900">{product.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-serif text-primary">${product.price}</p>
                                                    <p className="text-xs text-stone-500">{t("products_per_card")}</p>
                                                </div>
                                            </div>

                                            <p className="text-stone-600 text-sm line-clamp-2">{product.description}</p>

                                            <Link href={`/product/${product.id}`}>
                                                <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-primary hover:gap-3 transition-all duration-300 pt-2 border-t border-stone-200">
                                                    <span className="font-semibold">{t("products_customize")}</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    </div>

                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-amber-500/10 to-transparent transition-opacity duration-700 pointer-events-none" />
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
