"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export default function NewProductPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        minQuantity: "1",
        stock: "0",
    });
    const [images, setImages] = useState<string[]>(["", "", "", ""]);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // Upload handler
    const handleImageUpload = async (file: File, index: number) => {
        setUploadingIndex(index);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload-product-image", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                const newImages = [...images];
                newImages[index] = data.url;
                setImages(newImages);
                toast.success(`Image ${index + 1} uploaded!`);
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            toast.error("Upload error");
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file, index);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages[index] = "";
        setImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const validImages = images.filter(img => img.length > 0);

        if (validImages.length === 0) {
            toast.error("Please upload at least one image");
            setLoading(false);
            return;
        }

        const price = parseFloat(form.price);
        if (isNaN(price) || price <= 0) {
            toast.error("Please enter a valid positive price");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    minQuantity: parseInt(form.minQuantity) || 1,
                    price: price,
                    stock: parseInt(form.stock) || 0,
                    images: validImages, // Send array of images
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Product created!");
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

    const uploadedCount = images.filter(img => img.length > 0).length;

    return (
        <div className="min-h-screen bg-white py-8">
            <Toaster position="top-center" richColors />
            <div className="container mx-auto px-6 max-w-4xl">
                <Link href="/admin/products" className="text-stone-600 hover:text-primary mb-6 block">
                    ← Back to Products
                </Link>

                <Card className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
                        <CardTitle className="text-2xl">Add New Product</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Product Name *</label>
                                    <Input
                                        required
                                        placeholder="Wedding Invitation Card"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Category *</label>
                                    <Input
                                        required
                                        placeholder="Wedding, Business, etc."
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Description *</label>
                                <Textarea
                                    required
                                    placeholder="Product details..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="min-h-[80px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Price ($) *</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="5.00"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    className="h-11 w-48"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Min Quantity *</label>
                                <Input
                                    type="number"
                                    min="1"
                                    required
                                    placeholder="1"
                                    value={form.minQuantity}
                                    onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                                    className="h-11 w-48"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Stock Quantity</label>
                                <Input
                                    type="number"
                                    min="0"
                                    required
                                    placeholder="0"
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    className="h-11 w-48"
                                />
                            </div>


                            {/* Image Upload Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold">Product Images (up to 4) *</label>
                                    <span className="text-sm text-muted-foreground">
                                        {uploadedCount}/4 uploaded
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative">
                                            {img ? (
                                                <div className="relative h-40 rounded-lg overflow-hidden border-2 border-green-500 shadow-md bg-stone-100">
                                                    <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs px-2 py-1 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Image {idx + 1}
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className={`h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all bg-white ${uploadingIndex === idx
                                                    ? "border-primary bg-primary/10 animate-pulse"
                                                    : "border-stone-300 hover:border-primary hover:bg-primary/5"
                                                    }`}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, idx)}
                                                        className="hidden"
                                                        disabled={uploadingIndex !== null}
                                                    />
                                                    {uploadingIndex === idx ? (
                                                        <div className="text-primary font-medium">Uploading...</div>
                                                    ) : (
                                                        <>
                                                            <Plus className="w-10 h-10 text-stone-400 mb-2" />
                                                            <span className="text-sm text-stone-500 font-medium">Image {idx + 1}</span>
                                                            <span className="text-xs text-stone-400 mt-1">Click to upload</span>
                                                        </>
                                                    )}
                                                </label>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Supported formats: JPG, PNG, WebP. Click inside the box to upload.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg font-semibold text-white shadow-lg"
                                    disabled={loading || uploadedCount === 0}
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
            </div>

        </div>
    );
}
