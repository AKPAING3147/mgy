"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
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
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setImageUrl(""); // Clear URL input if file is selected
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = imageUrl;

            // If user uploaded a file, upload it first
            if (imageFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", imageFile);

                const uploadRes = await fetch("/api/upload-product-image", {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadRes.json();

                if (!uploadData.success) {
                    toast.error("Image upload failed");
                    setLoading(false);
                    setUploading(false);
                    return;
                }

                finalImageUrl = uploadData.url;
                setUploading(false);
            }

            if (!finalImageUrl) {
                toast.error("Please upload an image or provide an image URL");
                setLoading(false);
                return;
            }

            // Create product
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price),
                    imageUrl: finalImageUrl,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Product created successfully!");
                setTimeout(() => {
                    router.push("/admin/products");
                }, 1000);
            } else {
                toast.error(data.message || "Failed to create product");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 py-8">
            <Toaster position="top-center" richColors />
            <div className="container mx-auto px-6 max-w-3xl">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6">
                    ← Back to Products
                </Link>

                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-serif">Add New Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-stone-700">Product Name *</label>
                                <Input
                                    name="name"
                                    required
                                    placeholder="e.g., Elegant Rose Gold Wedding Card"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-stone-700">Description *</label>
                                <Textarea
                                    name="description"
                                    required
                                    placeholder="Describe your product..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-stone-700">Price ($) *</label>
                                    <Input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="5.00"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-stone-700">Category *</label>
                                    <Input
                                        name="category"
                                        required
                                        placeholder="e.g., Floral, Luxury..."
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="space-y-4 p-6 bg-stone-50 rounded-lg border-2 border-dashed border-stone-300">
                                <label className="text-sm font-semibold text-stone-700 block">Product Image *</label>

                                {/* Image Preview */}
                                {(imagePreview || imageUrl) && (
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview || imageUrl}
                                            alt="Preview"
                                            className="w-full max-w-md h-64 object-cover rounded-lg border-4 border-white shadow-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Upload Button */}
                                {!imagePreview && !imageUrl && (
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-stone-400 rounded-lg p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <Upload className="w-12 h-12 mx-auto mb-4 text-stone-400" />
                                            <p className="text-sm font-medium text-stone-700 mb-1">Click to upload image</p>
                                            <p className="text-xs text-stone-500">PNG, JPG, WEBP (max 5MB)</p>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-stone-300"></div>
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-stone-50 px-2 text-stone-500">Or</span>
                                            </div>
                                        </div>

                                        {/* URL Input */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-stone-600">Paste Image URL</label>
                                            <Input
                                                type="url"
                                                placeholder="https://example.com/image.jpg"
                                                value={imageUrl}
                                                onChange={(e) => {
                                                    setImageUrl(e.target.value);
                                                    setImageFile(null);
                                                    setImagePreview("");
                                                }}
                                                className="h-11"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                                    disabled={loading || uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <Upload className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading Image...
                                        </>
                                    ) : loading ? (
                                        "Creating Product..."
                                    ) : (
                                        <>
                                            <ImageIcon className="w-4 h-4 mr-2" />
                                            Create Product
                                        </>
                                    )}
                                </Button>
                                <Link href="/admin/products">
                                    <Button type="button" variant="outline" className="h-12">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
