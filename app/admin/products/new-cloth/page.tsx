"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import ClothPrintingPreview from "@/components/ClothPrintingPreview";

export default function NewClothProductPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        minQuantity: "10",
        stock: "999",
    });

    const [loading, setLoading] = useState(false);

    // Sample preview data
    const [previewData] = useState({
        garmentType: "t-shirt",
        size: "M",
        color: "white",
        printDesign: "MGY OFFSET",
        printPosition: "front",
        quantity: 50
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const price = parseFloat(form.price);
        if (isNaN(price) || price <= 0) {
            toast.error("Please enter a valid positive price");
            setLoading(false);
            return;
        }

        try {
            // Create a simple template marker for cloth printing
            const clothData = {
                productType: "cloth-printing",
                createdBy: "admin"
            };

            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    category: "Cloth Printing",
                    minQuantity: parseInt(form.minQuantity) || 10,
                    price: price,
                    stock: parseInt(form.stock) || 999,
                    images: [JSON.stringify(clothData)],
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Cloth printing product created!");
                setTimeout(() => router.push("/admin/products"), 1000);
            } else {
                toast.error(data.message || "Failed");
            }
        } catch (error) {
            toast.error("Error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white py-8">
            <Toaster position="top-center" richColors />
            <div className="container mx-auto px-6 max-w-6xl">
                <Link href="/admin/products" className="text-stone-600 hover:text-primary mb-6 block">
                    ← Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Form */}
                    <Card className="shadow-xl h-fit">
                        <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <Shirt className="w-8 h-8" />
                                <CardTitle className="text-2xl">Add Cloth Printing Product</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Product Name *</label>
                                        <Input
                                            required
                                            placeholder="Custom T-Shirt Printing"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="h-11"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Example: "Premium Cotton T-Shirt - Custom Print"
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Description *</label>
                                        <Textarea
                                            required
                                            placeholder="High-quality custom printing on premium garments..."
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className="min-h-[100px]"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Describe the product, materials, and printing quality
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Price ($) *</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                required
                                                placeholder="15.00"
                                                value={form.price}
                                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                                className="h-11"
                                            />
                                            <p className="text-xs text-muted-foreground">Per garment</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Min Quantity *</label>
                                            <Input
                                                type="number"
                                                min="1"
                                                required
                                                placeholder="10"
                                                value={form.minQuantity}
                                                onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                                                className="h-11"
                                            />
                                            <p className="text-xs text-muted-foreground">Minimum order</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Stock Quantity</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            required
                                            placeholder="999"
                                            value={form.stock}
                                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                            className="h-11"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Set to 999 for unlimited
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                                    <h4 className="font-semibold text-sm text-blue-900">📋 Product Features</h4>
                                    <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
                                        <li>Customers can select garment type (T-shirt, Hoodie, Polo, Tank)</li>
                                        <li>Size selection: XS - XXXL</li>
                                        <li>Color options: White, Black, Navy, Gray, Red, Blue, Green</li>
                                        <li>Custom print design/text input</li>
                                        <li>Print position: Front, Back, or Both</li>
                                        <li>Live garment preview with customization</li>
                                    </ul>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 text-lg font-semibold text-white shadow-lg"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating..." : "Create Product"}
                                    </Button>
                                    <Link href="/admin/products">
                                        <Button type="button" variant="outline" className="h-12">Cancel</Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card className="shadow-xl sticky top-8 h-fit">
                        <CardHeader className="bg-stone-100 border-b">
                            <CardTitle className="text-lg">Product Preview</CardTitle>
                            <p className="text-sm text-muted-foreground">How customers will customize this product</p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ClothPrintingPreview
                                customization={previewData}
                                productName={form.name || "Cloth Printing Product"}
                            />
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                <p className="text-xs text-amber-900">
                                    <strong>💡 Note:</strong> Customers will be able to customize the garment type, size, color, print design, and position when ordering this product.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
