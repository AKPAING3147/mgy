"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Bookmark } from "lucide-react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string;
}

export default function ProductDetail({ product }: { product: Product }) {
    const router = useRouter();
    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(100);
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

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                <Link href="/" className="text-muted-foreground hover:text-primary mb-6 inline-block">
                    ← Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-xl border">
                            {validImages.length > 0 ? (
                                <>
                                    <img
                                        src={validImages[currentImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {validImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
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
                            <div className="flex gap-3 justify-center">
                                {validImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImage ? "border-primary shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold uppercase">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>

                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-primary">${product.price}</span>
                            <span className="text-muted-foreground">per card</span>
                        </div>

                        <hr />

                        {/* Order Form */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="font-semibold w-24">Quantity:</label>
                                <Input
                                    type="number"
                                    min="10"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 10)}
                                    className="w-32 text-center text-lg font-bold"
                                />
                            </div>

                            <div>
                                <label className="font-semibold block mb-2">Order Notes (Optional):</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any special requests or customization details..."
                                    className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
                                />
                            </div>

                            {/* Total */}
                            <div className="bg-secondary/30 p-4 rounded-xl">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-semibold">Total:</span>
                                    <span className="text-3xl font-bold text-primary">
                                        ${(product.price * quantity).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {quantity} cards × ${product.price}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleOrder}
                                    className="flex-1 h-14 text-lg bg-primary hover:bg-primary/90 gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Order Now
                                </Button>
                                <Button
                                    onClick={toggleFavorite}
                                    variant="outline"
                                    className={`h-14 px-6 ${isFavorite ? "bg-primary/10 border-primary" : ""}`}
                                >
                                    <Heart className={`w-6 h-6 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
