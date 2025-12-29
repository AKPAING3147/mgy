"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import InvitationPreview from "@/components/InvitationPreview";

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

interface CustomizationData {
    brideName: string;
    groomName: string;
    weddingDate: string;
    weddingTime: string;
    venue: string;
    additionalInfo: string;
    colorScheme: string;
    fontStyle: string;
}

export default function ProductDetail({ product }: { product: Product }) {
    const router = useRouter();
    const { t } = useLanguage();
    const minQty = product.minQuantity || 1;
    const [quantity, setQuantity] = useState(minQty);
    const [isFavorite, setIsFavorite] = useState(false);

    // Customization fields
    const [customization, setCustomization] = useState<CustomizationData>({
        brideName: "",
        groomName: "",
        weddingDate: "",
        weddingTime: "",
        venue: "",
        additionalInfo: "",
        colorScheme: "rose-gold",
        fontStyle: "elegant"
    });

    useEffect(() => {
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
        // Validate required fields
        if (!customization.brideName || !customization.groomName || !customization.weddingDate || !customization.venue) {
            toast.error("Please fill in all required fields (Bride, Groom, Date, Venue)");
            return;
        }

        const cartItem = {
            product,
            quantity,
            customization,
            totalPrice: product.price * quantity
        };
        localStorage.setItem("cart", JSON.stringify([cartItem]));
        router.push("/checkout");
    };

    const stock = product.stock ?? 0;
    const isOutOfStock = stock <= 0;

    // Color schemes
    const colorSchemes = [
        { value: "rose-gold", label: "Rose Gold", colors: "bg-gradient-to-r from-rose-400 to-amber-300" },
        { value: "classic", label: "Classic White", colors: "bg-gradient-to-r from-stone-100 to-stone-200" },
        { value: "romantic", label: "Romantic Pink", colors: "bg-gradient-to-r from-pink-300 to-rose-400" },
        { value: "elegant", label: "Elegant Navy", colors: "bg-gradient-to-r from-blue-900 to-slate-700" },
        { value: "garden", label: "Garden Green", colors: "bg-gradient-to-r from-emerald-400 to-teal-500" }
    ];

    // Font styles
    const fontStyles = [
        { value: "elegant", label: "Elegant Serif" },
        { value: "modern", label: "Modern Sans" },
        { value: "romantic", label: "Romantic Script" },
        { value: "classic", label: "Classic Times" }
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                <Link href="/" className="text-muted-foreground hover:text-primary mb-6 inline-block no-underline hover:underline transition-all">
                    ← {t("common_back")}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Preview Section */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-2xl border border-border p-8">
                            <div className="flex items-center gap-2 mb-4 text-primary">
                                <Sparkles className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Live Preview</h3>
                            </div>
                            <InvitationPreview
                                customization={customization}
                                productName={product.name}
                            />
                        </div>
                    </div>

                    {/* Customization Form */}
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

                        {/* Customization Form */}
                        <div className={`space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm ${isOutOfStock ? "opacity-75 grayscale" : ""}`}>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Customize Your Invitation
                            </h3>

                            {/* Bride & Groom Names */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold block mb-2 text-sm">Bride's Name *</label>
                                    <Input
                                        value={customization.brideName}
                                        onChange={(e) => setCustomization({ ...customization, brideName: e.target.value })}
                                        placeholder="Jane"
                                        disabled={isOutOfStock}
                                        className="h-11"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-2 text-sm">Groom's Name *</label>
                                    <Input
                                        value={customization.groomName}
                                        onChange={(e) => setCustomization({ ...customization, groomName: e.target.value })}
                                        placeholder="John"
                                        disabled={isOutOfStock}
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            {/* Wedding Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold block mb-2 text-sm">Wedding Date *</label>
                                    <Input
                                        type="date"
                                        value={customization.weddingDate}
                                        onChange={(e) => setCustomization({ ...customization, weddingDate: e.target.value })}
                                        disabled={isOutOfStock}
                                        className="h-11"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-2 text-sm">Wedding Time</label>
                                    <Input
                                        type="time"
                                        value={customization.weddingTime}
                                        onChange={(e) => setCustomization({ ...customization, weddingTime: e.target.value })}
                                        disabled={isOutOfStock}
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            {/* Venue */}
                            <div>
                                <label className="font-semibold block mb-2 text-sm">Venue *</label>
                                <Input
                                    value={customization.venue}
                                    onChange={(e) => setCustomization({ ...customization, venue: e.target.value })}
                                    placeholder="Sunset Garden Resort"
                                    disabled={isOutOfStock}
                                    className="h-11"
                                />
                            </div>

                            {/* Color Scheme */}
                            <div>
                                <label className="font-semibold block mb-3 text-sm">Color Scheme</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {colorSchemes.map((scheme) => (
                                        <button
                                            key={scheme.value}
                                            type="button"
                                            onClick={() => setCustomization({ ...customization, colorScheme: scheme.value })}
                                            disabled={isOutOfStock}
                                            className={`p-3 rounded-lg border-2 transition-all ${customization.colorScheme === scheme.value
                                                    ? "border-primary shadow-lg ring-2 ring-primary/20"
                                                    : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <div className={`h-8 rounded ${scheme.colors} mb-1`}></div>
                                            <p className="text-xs font-medium">{scheme.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Font Style */}
                            <div>
                                <label className="font-semibold block mb-2 text-sm">Font Style</label>
                                <select
                                    value={customization.fontStyle}
                                    onChange={(e) => setCustomization({ ...customization, fontStyle: e.target.value })}
                                    disabled={isOutOfStock}
                                    className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    {fontStyles.map((font) => (
                                        <option key={font.value} value={font.value}>{font.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Additional Info */}
                            <div>
                                <label className="font-semibold block mb-2 text-sm">Additional Information (Optional)</label>
                                <textarea
                                    value={customization.additionalInfo}
                                    onChange={(e) => setCustomization({ ...customization, additionalInfo: e.target.value })}
                                    placeholder="Reception details, dress code, special instructions..."
                                    disabled={isOutOfStock}
                                    className="w-full p-4 border border-input rounded-xl min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                />
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-6">
                                <div className="space-y-1">
                                    <label className="font-semibold block text-sm">Quantity:</label>
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
                                    className="w-32 text-center text-lg font-bold h-11"
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
