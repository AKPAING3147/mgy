"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string;
    minQuantity?: number;
    stock?: number;
}

export default function ProductDetail({ product }: { product: Product }) {
    const router = useRouter();
    const { t } = useLanguage();
    const [currentImage, setCurrentImage] = useState(0);
    const minQty = product.minQuantity || 1;
    const [quantity, setQuantity] = useState(minQty);
    const [notes, setNotes] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);

    let images: string[] = [];
    try {
        images = JSON.parse(product.images);
    } catch (e) {
        images = [product.images];
    }
    const validImages = images.filter(img => img && img.length > 0);

    useEffect(() => {
        // Check if product is in favorites
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(product.id));
    }, [product.id]);

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const newFavorites = isFavorite
            ? favorites.filter((id: string) => id !== product.id)
            : [...favorites, product.id];
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);
    };

    const handleOrder = () => {
        const cartItem = {
            product,
            quantity,
            notes,
            customization: { notes },
            totalPrice: product.price * quantity
        };
        localStorage.setItem("cart", JSON.stringify([cartItem]));
        router.push("/checkout");
    };

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    const stock = product.stock ?? 0;
    const isOutOfStock = stock <= 0;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                <Link href="/" className="text-muted-foreground hover:text-primary mb-6 inline-block no-underline hover:underline transition-all">
                    ← {t("common_back")}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-xl border border-border">
                            {validImages.length > 0 ? (
                                <>
                                    <img
                                        src={validImages[currentImage]}
                                        alt={product.name}
                                        className={`w-full h-full object-cover ${isOutOfStock ? "grayscale opacity-80" : ""}`}
                                    />
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <span className="bg-red-600 text-white px-6 py-2 rounded-full text-xl font-bold uppercase tracking-widest shadow-lg transform -rotate-12 border-2 border-white">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}

                                    {validImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-stone-100">
                                    <span className="text-stone-400">No Image</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {validImages.length > 1 && (
                            <div className="flex gap-3 justify-center overflow-x-auto pb-2">
                                {validImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentImage ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div className="flex justify-between items-start">
                            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold uppercase shadow-sm">
                                {product.category}
                            </span>
                            {stock > 0 && stock < 10 && (
                                <span className="text-orange-500 font-bold text-sm animate-pulse">
                                    Only {stock} left in stock!
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">{product.name}</h1>

                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-baseline gap-2 pb-6 border-b border-border">
                            <span className="text-5xl font-bold text-primary">${product.price}</span>
                            <span className="text-muted-foreground text-lg">{t("products_per_card")}</span>
                        </div>

                        {/* Order Form */}
                        <div className={`space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm ${isOutOfStock ? "opacity-75 grayscale" : ""}`}>
                            <h3 className="text-xl font-bold mb-4">Start Your Order</h3>

                            <div className="flex items-center gap-6">
                                <div className="space-y-1">
                                    <label className="font-semibold block text-lg">Quantity:</label>
                                    {minQty > 1 && (
                                        <span className="text-xs text-red-500 font-medium">
                                            Minimum order: {minQty}
                                        </span>
                                    )}
                                </div>
                                <Input
                                    type="number"
                                    min={minQty}
                                    max={stock > 0 ? stock : undefined}
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || minQty;
                                        if (stock > 0 && val > stock) {
                                            toast.error(`Only ${stock} items available`);
                                            setQuantity(stock);
                                        } else {
                                            setQuantity(val);
                                        }
                                    }}
                                    disabled={isOutOfStock}
                                    className="w-32 text-center text-lg font-bold h-12"
                                />
                            </div>

                            <div>
                                <label className="font-semibold block mb-3 text-lg">Order Notes (Optional):</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any special requests..."
                                    disabled={isOutOfStock}
                                    className="w-full p-4 border border-input rounded-xl min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                                />
                            </div>

                            {/* Total */}
                            <div className="bg-muted/50 p-5 rounded-xl border border-border">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-semibold">Total:</span>
                                    <span className="text-3xl font-bold text-primary">
                                        ${(product.price * quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-2">
                                <Button
                                    onClick={handleOrder}
                                    disabled={isOutOfStock}
                                    className={`flex-1 h-14 text-lg gap-2 shadow-lg transition-all ${isOutOfStock
                                        ? "bg-stone-300 cursor-not-allowed hover:bg-stone-300"
                                        : "bg-primary hover:bg-primary/90 hover:shadow-xl"}`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {isOutOfStock ? "Out of Stock" : "Order Now"}
                                </Button>
                                <Button
                                    onClick={toggleFavorite}
                                    variant="outline"
                                    className={`h-14 px-6 border-2 ${isFavorite ? "bg-red-50 border-red-200" : "hover:bg-stone-50"}`}
                                >
                                    <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-stone-400"}`} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
