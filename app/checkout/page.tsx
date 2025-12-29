"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { toast, Toaster } from "sonner";

function Label({ children }: any) { return <label className="block text-sm font-medium mb-1">{children}</label> }

export default function Checkout() {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [shipping, setShipping] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: ""
    });
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const stored = localStorage.getItem("cart");
        if (stored) setCart(JSON.parse(stored));
    }, []);

    const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartItems: cart, shipping })
            });
            const data = await res.json();
            if (data.success) {
                // Save order ID to localStorage
                const savedOrders = JSON.parse(localStorage.getItem("savedOrders") || "[]");
                savedOrders.unshift({ id: data.orderId, savedAt: new Date().toISOString() });
                localStorage.setItem("savedOrders", JSON.stringify(savedOrders));
                localStorage.setItem("lastOrderId", data.orderId);

                localStorage.removeItem("cart");
                toast.success("Order placed successfully!");
                router.push(`/payment/${data.orderId}`);
            } else {
                toast.error("Order failed: " + data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) return null; // Hydration fix
    if (cart.length === 0) return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <h1 className="text-2xl font-serif mb-4">Your cart is empty</h1>
                <Button onClick={() => router.push('/')}>Start Shopping</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background pb-20">
            <Toaster position="top-center" richColors />
            <Navbar />
            <div className="container mx-auto pt-32 px-4 max-w-4xl">
                <h1 className="text-3xl font-serif mb-8 text-center border-b pb-4">Checkout</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-white p-6 rounded-lg shadow-sm border h-fit">
                        <h2 className="text-xl font-medium mb-4 font-serif">Shipping Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Full Name</Label>
                                <Input required value={shipping.fullName} onChange={e => setShipping({ ...shipping, fullName: e.target.value })} placeholder="John Doe" />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input required type="email" value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })} placeholder="john@example.com" />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input required value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} placeholder="+1 234 567 890" />
                            </div>
                            <div>
                                <Label>Delivery Address</Label>
                                <Input required value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} placeholder="123 Street, City" />
                            </div>

                            <div className="md:hidden pt-4">
                                <Button className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90" disabled={loading}>
                                    {loading ? "Processing..." : "Place Order"}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-secondary/10 p-6 rounded-lg h-fit border border-secondary/20">
                        <h2 className="text-xl font-medium mb-4 font-serif">Order Summary</h2>
                        <div className="space-y-4 max-h-96 overflow-auto bg-white p-4 rounded-md shadow-inner">
                            {cart.map((item, i) => (
                                <div key={i} className="border-b pb-4 last:border-0">
                                    <div className="flex justify-between mb-2">
                                        <div className="pr-4">
                                            <div className="font-medium text-stone-900">{item.product.name}</div>
                                            <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                                        </div>
                                        <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                                    </div>

                                    {/* Customization Details */}
                                    {item.customization && (
                                        <div className="bg-secondary/10 p-3 rounded-md mt-2 text-xs space-y-1">
                                            <p className="font-semibold text-stone-700 mb-2">Customization:</p>
                                            {item.customization.brideName && (
                                                <p><span className="font-medium">Bride:</span> {item.customization.brideName}</p>
                                            )}
                                            {item.customization.groomName && (
                                                <p><span className="font-medium">Groom:</span> {item.customization.groomName}</p>
                                            )}
                                            {item.customization.weddingDate && (
                                                <p><span className="font-medium">Date:</span> {new Date(item.customization.weddingDate).toLocaleDateString()}</p>
                                            )}
                                            {item.customization.weddingTime && (
                                                <p><span className="font-medium">Time:</span> {item.customization.weddingTime}</p>
                                            )}
                                            {item.customization.venue && (
                                                <p><span className="font-medium">Venue:</span> {item.customization.venue}</p>
                                            )}
                                            {item.customization.colorScheme && (
                                                <p><span className="font-medium">Color:</span> {item.customization.colorScheme}</p>
                                            )}
                                            {item.customization.fontStyle && (
                                                <p><span className="font-medium">Font:</span> {item.customization.fontStyle}</p>
                                            )}
                                            {item.customization.additionalInfo && (
                                                <p className="italic mt-2 text-stone-600">"{item.customization.additionalInfo}"</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-stone-300 my-4 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">${total.toFixed(2)}</span>
                        </div>

                        <Button className="w-full hidden md:block mt-6 h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg transition-transform hover:-translate-y-1" size="lg" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Processing..." : "Place Order"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
