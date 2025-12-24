"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Package, Clock, CheckCircle, Truck, Bookmark, X, Heart, Copy, Check, Printer } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import OrderTimeline from "@/components/OrderTimeline";

interface Order {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    fullName: string;
    paymentStatus: string;
}

interface SavedOrder {
    id: string;
    savedAt: string;
}

export default function TrackOrderPage() {
    const { t } = useLanguage();
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        // Load saved orders from localStorage
        const saved = localStorage.getItem("savedOrders");
        if (saved) {
            setSavedOrders(JSON.parse(saved));
        }
        // Load favorites
        const favs = localStorage.getItem("favorites");
        if (favs) {
            setFavorites(JSON.parse(favs));
        }

        // Check for last order and auto-load it
        const lastOrderId = localStorage.getItem("lastOrderId");
        if (lastOrderId) {
            setOrderId(lastOrderId);
            searchOrderById(lastOrderId);
        } else {
            setInitialLoading(false);
        }
    }, []);

    const searchOrderById = async (id: string) => {
        if (!id.trim()) return;
        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();

            if (data.success) {
                setOrder(data.order);
            } else {
                setError("Order not found");
            }
        } catch (e) {
            setError("Failed to fetch order");
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    const searchOrder = () => searchOrderById(orderId);

    const copyOrderId = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const removeSavedOrder = (id: string) => {
        const newSaved = savedOrders.filter(o => o.id !== id);
        setSavedOrders(newSaved);
        localStorage.setItem("savedOrders", JSON.stringify(newSaved));
        if (id === localStorage.getItem("lastOrderId")) {
            localStorage.removeItem("lastOrderId");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING_PAYMENT": return <Clock className="w-5 h-5" />;
            case "PAYMENT_REVIEW": return <Package className="w-5 h-5" />;
            case "APPROVED": return <CheckCircle className="w-5 h-5" />;
            case "COMPLETED": return <CheckCircle className="w-5 h-5" />;
            case "SHIPPED": return <Truck className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING_PAYMENT": return "text-yellow-600 bg-yellow-100";
            case "PAYMENT_REVIEW": return "text-blue-600 bg-blue-100";
            case "APPROVED": return "text-green-600 bg-green-100";
            case "COMPLETED": return "text-emerald-700 bg-emerald-100";
            case "SHIPPED": return "text-purple-600 bg-purple-100";
            default: return "text-stone-600 bg-stone-100";
        }
    };

    const getStatusText = (status: string) => {
        return status.replace("_", " ");
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-bold text-center mb-2">{t("nav_track_order")}</h1>
                    <p className="text-center text-muted-foreground mb-8">Enter your order ID or view your recent orders below</p>

                    {/* Search Box */}
                    <Card className="mb-8 shadow-lg border-2">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Enter your Order ID"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && searchOrder()}
                                    className="h-12 text-lg border-2"
                                />
                                <Button onClick={searchOrder} disabled={loading} className="h-12 px-6 gap-2 bg-primary">
                                    <Search className="w-5 h-5" />
                                    {loading ? "..." : "Search"}
                                </Button>
                            </div>
                            {error && <p className="text-red-500 mt-3 font-medium">{error}</p>}
                        </CardContent>
                    </Card>

                    {/* Loading Skeleton */}
                    {initialLoading && (
                        <Card className="mb-8">
                            <CardHeader>
                                <Skeleton className="h-6 w-48" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Skeleton className="h-16" />
                                    <Skeleton className="h-16" />
                                    <Skeleton className="h-16" />
                                    <Skeleton className="h-16" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Result */}
                    {order && !initialLoading && (
                        <Card className="mb-8 shadow-lg border-l-4 border-l-primary">
                            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                                <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">Order ID:</span>
                                        <code className="bg-white px-3 py-1 rounded font-mono text-sm">{order.id}</code>
                                        <button
                                            onClick={() => copyOrderId(order.id)}
                                            className="p-2 hover:bg-white rounded-full transition-colors"
                                            title="Copy Order ID"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {getStatusText(order.status)}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {/* Timeline Visualization */}
                                <div className="mb-8 px-2 md:px-8">
                                    <OrderTimeline status={order.status} />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-stone-50 p-4 rounded-lg">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Customer</p>
                                        <p className="font-semibold">{order.fullName}</p>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-lg">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total</p>
                                        <p className="font-bold text-primary text-xl">${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-lg">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Payment</p>
                                        <p className="font-semibold">{order.paymentStatus}</p>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-lg">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Date</p>
                                        <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {(order.paymentStatus === "APPROVED" || order.status === "COMPLETED" || order.status === "SHIPPED") && (
                                    <div className="mt-4 flex justify-end">
                                        <Link href={`/invoice/${order.id}`} target="_blank">
                                            <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white">
                                                <Printer className="w-4 h-4" />
                                                View Invoice
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {order.status === "PENDING_PAYMENT" && (
                                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
                                        <p className="text-yellow-800 font-medium">
                                            📎 Please upload your payment slip to proceed with your order.
                                        </p>
                                        <Link href={`/payment/${order.id}`}>
                                            <Button className="mt-3 bg-yellow-600 hover:bg-yellow-700">Upload Payment Slip →</Button>
                                        </Link>
                                    </div>
                                )}

                                {order.status === "COMPLETED" && (
                                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg mt-6">
                                        <p className="text-emerald-800 font-medium flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5" />
                                            Your order has been completed! Thank you for your purchase.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Saved Orders & Favorites */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Saved Order IDs */}
                        <Card className="shadow-md">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Bookmark className="w-5 h-5 text-primary" />
                                    Your Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {savedOrders.length === 0 ? (
                                    <p className="text-muted-foreground text-sm py-4">Your orders will appear here after placing an order.</p>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-auto">
                                        {savedOrders.map((saved) => (
                                            <div key={saved.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border hover:border-primary transition-colors">
                                                <button
                                                    onClick={() => { setOrderId(saved.id); searchOrderById(saved.id); }}
                                                    className="text-left flex-1 hover:text-primary"
                                                >
                                                    <p className="font-mono text-sm truncate max-w-[200px]">{saved.id}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(saved.savedAt).toLocaleDateString()}
                                                    </p>
                                                </button>
                                                <button
                                                    onClick={() => removeSavedOrder(saved.id)}
                                                    className="p-2 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Favorites */}
                        <Card className="shadow-md">
                            <CardHeader className="bg-gradient-to-r from-secondary/10 to-transparent">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Heart className="w-5 h-5 text-primary fill-primary" />
                                    Favorite Products
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {favorites.length === 0 ? (
                                    <p className="text-muted-foreground text-sm py-4">Click the heart icon on products to save your favorites.</p>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-auto">
                                        {favorites.map((id) => (
                                            <Link key={id} href={`/product/${id}`}>
                                                <div className="p-3 bg-stone-50 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all">
                                                    <p className="font-mono text-sm truncate">{id}</p>
                                                    <p className="text-xs text-primary font-medium mt-1">View Product →</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
