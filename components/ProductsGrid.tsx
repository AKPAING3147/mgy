"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import ImageSlider from "@/components/ImageSlider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string;
}

// Skeleton Loading Component
function ProductSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-border">
            <Skeleton className="h-64" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>
        </div>
    );
}

export default function ProductsGrid({ products, loading = false }: { products: Product[], loading?: boolean }) {
    const { t } = useLanguage();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("favorites");
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    const toggleFavorite = (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();

        const newFavorites = favorites.includes(productId)
            ? favorites.filter(id => id !== productId)
            : [...favorites, productId];

        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
    };

    // Show skeleton while loading
    if (loading || !mounted) {
        return (
            <section className="py-12 bg-background">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-12">
                        <Skeleton className="h-12 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-background">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                        {t("products_title")}
                    </h2>
                    <p className="text-muted-foreground text-lg">{t("products_subtitle")}</p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md border">
                        <div className="w-20 h-20 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-10 h-10 text-stone-400" />
                        </div>
                        <p className="text-muted-foreground text-lg mb-2">{t("products_empty")}</p>
                        <p className="text-muted-foreground text-sm">{t("products_empty_sub")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product, i) => {
                            let images: string[] = [];
                            try {
                                images = JSON.parse(product.images);
                            } catch (e) {
                                images = [product.images];
                            }

                            const isFavorite = favorites.includes(product.id);

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    viewport={{ once: true }}
                                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-primary/30"
                                >
                                    {/* Image Slider */}
                                    <div className="h-64 relative overflow-hidden">
                                        <ImageSlider images={images} productName={product.name} />

                                        {/* Favorite Button */}
                                        <button
                                            onClick={(e) => toggleFavorite(e, product.id)}
                                            className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all z-10 ${isFavorite
                                                    ? "bg-primary text-white scale-110"
                                                    : "bg-white/90 hover:bg-white text-stone-600 hover:scale-110"
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                                        </button>

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-md">
                                            {product.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 min-h-[40px]">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t">
                                            <div>
                                                <span className="text-2xl font-bold text-primary">${product.price}</span>
                                                <span className="text-muted-foreground text-xs ml-1">/{t("products_per_card")}</span>
                                            </div>

                                            <Link href={`/product/${product.id}`}>
                                                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Order
                                                </Button>
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
