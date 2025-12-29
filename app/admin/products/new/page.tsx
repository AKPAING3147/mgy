"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Type, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import InvitationPreview from "@/components/InvitationPreview";

export default function NewProductPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "Wedding",
        minQuantity: "50",
        stock: "999",
    });

    // Template Design Configuration
    const [templateDesign, setTemplateDesign] = useState({
        layoutType: "classic",
        defaultColorScheme: "rose-gold",
        defaultFontStyle: "elegant",
        borderStyle: "decorative",
        iconStyle: "heart"
    });

    const [loading, setLoading] = useState(false);

    // AI Generation
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState({
        theme: "",
        style: "",
        occasion: "wedding"
    });

    // Preview customization for demonstration
    const [previewData] = useState({
        brideName: "Jane",
        groomName: "John",
        weddingDate: "2025-06-15",
        weddingTime: "16:00",
        venue: "Sunset Garden Resort",
        additionalInfo: "Reception to follow",
        colorScheme: templateDesign.defaultColorScheme,
        fontStyle: templateDesign.defaultFontStyle
    });

    // AI Template Generation
    const handleAIGenerate = async () => {
        if (!aiPrompt.theme && !aiPrompt.style) {
            toast.error("Please provide at least a theme or style");
            return;
        }

        setAiGenerating(true);
        try {
            const res = await fetch("/api/generate-template", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aiPrompt)
            });

            const data = await res.json();

            if (data.success) {
                // Fill form with AI generated data
                setForm({
                    name: data.template.name,
                    description: data.template.description,
                    price: data.template.price,
                    category: data.template.category,
                    minQuantity: data.template.minQuantity,
                    stock: "999"
                });

                setTemplateDesign({
                    layoutType: data.template.layoutType,
                    defaultColorScheme: data.template.defaultColorScheme,
                    defaultFontStyle: data.template.defaultFontStyle,
                    borderStyle: data.template.borderStyle,
                    iconStyle: data.template.iconStyle
                });

                setShowAIModal(false);
                toast.success("✨ AI template generated! Review and adjust as needed.");
            } else {
                toast.error(data.message || "Failed to generate template");
            }
        } catch (error) {
            toast.error("Error generating template");
        } finally {
            setAiGenerating(false);
        }
    };

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
            // Create a template design as the "image" data
            const templateData = {
                ...templateDesign,
                templateType: "invitation",
                createdBy: "admin"
            };

            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    minQuantity: parseInt(form.minQuantity) || 50,
                    price: price,
                    stock: parseInt(form.stock) || 999,
                    images: [JSON.stringify(templateData)], // Store template as JSON string
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Invitation template created!");
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

    // Layout types
    const layoutTypes = [
        { value: "classic", label: "Classic", description: "Traditional formal layout" },
        { value: "modern", label: "Modern", description: "Clean contemporary design" },
        { value: "romantic", label: "Romantic", description: "Flowing elegant style" },
        { value: "minimal", label: "Minimal", description: "Simple and refined" }
    ];

    // Color schemes
    const colorSchemes = [
        { value: "rose-gold", label: "Rose Gold" },
        { value: "classic", label: "Classic White" },
        { value: "romantic", label: "Romantic Pink" },
        { value: "elegant", label: "Elegant Navy" },
        { value: "garden", label: "Garden Green" }
    ];

    // Font styles
    const fontStyles = [
        { value: "elegant", label: "Elegant Serif" },
        { value: "modern", label: "Modern Sans" },
        { value: "romantic", label: "Romantic Script" },
        { value: "classic", label: "Classic Times" }
    ];

    // Border styles
    const borderStyles = [
        { value: "decorative", label: "Decorative Corners" },
        { value: "simple", label: "Simple Border" },
        { value: "floral", label: "Floral Frame" },
        { value: "none", label: "No Border" }
    ];

    // Icon styles
    const iconStyles = [
        { value: "heart", label: "Heart" },
        { value: "rings", label: "Wedding Rings" },
        { value: "flower", label: "Flower" },
        { value: "none", label: "No Icon" }
    ];

    return (
        <div className="min-h-screen bg-white py-8">
            <Toaster position="top-center" richColors />
            <div className="container mx-auto px-6 max-w-6xl">
                <Link href="/admin/products" className="text-stone-600 hover:text-primary mb-6 block">
                    ← Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Template Configuration Form */}
                    <Card className="shadow-xl h-fit">
                        <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl">Create Invitation Template</CardTitle>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowAIModal(true)}
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                >
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    AI Generate
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <Type className="w-5 h-5 text-primary" />
                                        Template Information
                                    </h3>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Template Name *</label>
                                        <Input
                                            required
                                            placeholder="Classic Rose Gold Wedding Invitation"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Description *</label>
                                        <Textarea
                                            required
                                            placeholder="Beautiful template perfect for elegant weddings..."
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className="min-h-[80px]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Category *</label>
                                            <Input
                                                required
                                                value={form.category}
                                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                                className="h-11"
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
                                                className="h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Min Quantity *</label>
                                            <Input
                                                type="number"
                                                min="1"
                                                required
                                                value={form.minQuantity}
                                                onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Stock</label>
                                            <Input
                                                type="number"
                                                min="0"
                                                required
                                                value={form.stock}
                                                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                                className="h-11"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Template Design */}
                                <div className="space-y-4 border-t pt-4">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <Palette className="w-5 h-5 text-primary" />
                                        Template Design
                                    </h3>

                                    {/* Layout Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Layout Type</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {layoutTypes.map((layout) => (
                                                <button
                                                    key={layout.value}
                                                    type="button"
                                                    onClick={() => setTemplateDesign({ ...templateDesign, layoutType: layout.value })}
                                                    className={`p-3 rounded-lg border-2 text-left transition-all ${templateDesign.layoutType === layout.value
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border hover:border-primary/50"
                                                        }`}
                                                >
                                                    <p className="font-medium text-sm">{layout.label}</p>
                                                    <p className="text-xs text-muted-foreground">{layout.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Default Color Scheme */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Default Color Scheme</label>
                                        <select
                                            value={templateDesign.defaultColorScheme}
                                            onChange={(e) => setTemplateDesign({ ...templateDesign, defaultColorScheme: e.target.value })}
                                            className="w-full p-3 border border-input rounded-lg"
                                        >
                                            {colorSchemes.map((scheme) => (
                                                <option key={scheme.value} value={scheme.value}>{scheme.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Default Font Style */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Default Font Style</label>
                                        <select
                                            value={templateDesign.defaultFontStyle}
                                            onChange={(e) => setTemplateDesign({ ...templateDesign, defaultFontStyle: e.target.value })}
                                            className="w-full p-3 border border-input rounded-lg"
                                        >
                                            {fontStyles.map((font) => (
                                                <option key={font.value} value={font.value}>{font.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Border Style */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Border Style</label>
                                        <select
                                            value={templateDesign.borderStyle}
                                            onChange={(e) => setTemplateDesign({ ...templateDesign, borderStyle: e.target.value })}
                                            className="w-full p-3 border border-input rounded-lg"
                                        >
                                            {borderStyles.map((border) => (
                                                <option key={border.value} value={border.value}>{border.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Icon Style */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Icon Style</label>
                                        <select
                                            value={templateDesign.iconStyle}
                                            onChange={(e) => setTemplateDesign({ ...templateDesign, iconStyle: e.target.value })}
                                            className="w-full p-3 border border-input rounded-lg"
                                        >
                                            {iconStyles.map((icon) => (
                                                <option key={icon.value} value={icon.value}>{icon.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg font-semibold text-white shadow-lg"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating..." : "Create Template"}
                                    </Button>
                                    <Link href="/admin/products">
                                        <Button type="button" variant="outline" className="h-12">Cancel</Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Live Preview */}
                    <Card className="shadow-xl sticky top-8 h-fit">
                        <CardHeader className="bg-stone-100 border-b">
                            <CardTitle className="text-lg">Template Preview</CardTitle>
                            <p className="text-sm text-muted-foreground">How customers will see this template</p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <InvitationPreview
                                customization={{
                                    ...previewData,
                                    colorScheme: templateDesign.defaultColorScheme,
                                    fontStyle: templateDesign.defaultFontStyle
                                }}
                                productName={form.name || "Template Preview"}
                            />
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-900">
                                    <strong>Note:</strong> Customers can customize the names, date, venue, and colors when ordering this template.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* AI Generation Modal */}
            {showAIModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md shadow-2xl">
                        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-6 h-6" />
                                AI Template Generator
                            </CardTitle>
                            <p className="text-sm text-white/90 mt-2">
                                Let AI create a custom wedding invitation template for you
                            </p>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Theme / Style Keywords</label>
                                <Input
                                    placeholder="e.g., rustic, elegant, vintage, modern..."
                                    value={aiPrompt.theme}
                                    onChange={(e) => setAiPrompt({ ...aiPrompt, theme: e.target.value })}
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Describe the overall theme or style you want
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Additional Style Notes</label>
                                <Textarea
                                    placeholder="e.g., gold accents, floral patterns, minimalist design..."
                                    value={aiPrompt.style}
                                    onChange={(e) => setAiPrompt({ ...aiPrompt, style: e.target.value })}
                                    className="min-h-[80px]"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Any specific design elements or preferences
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Occasion</label>
                                <select
                                    value={aiPrompt.occasion}
                                    onChange={(e) => setAiPrompt({ ...aiPrompt, occasion: e.target.value })}
                                    className="w-full p-3 border border-input rounded-lg"
                                >
                                    <option value="wedding">Wedding</option>
                                    <option value="engagement">Engagement</option>
                                    <option value="anniversary">Anniversary</option>
                                    <option value="vow-renewal">Vow Renewal</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={handleAIGenerate}
                                    disabled={aiGenerating}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                                >
                                    {aiGenerating ? (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-4 h-4 mr-2" />
                                            Generate Template
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAIModal(false)}
                                    disabled={aiGenerating}
                                >
                                    Cancel
                                </Button>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                                <p><strong>💡 Tip:</strong> Be specific about the style you want. For example: "elegant gold and white, classic formal style" or "bohemian with wildflowers, earthy tones"</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
