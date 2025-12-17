"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

function Label({ className, children, ...props }: any) {
    return <label className={`text-sm font-semibold leading-none text-stone-700 ${className}`} {...props}>{children}</label>
}

export default function ProductCustomizer({ product }: { product: any }) {
    const router = useRouter();
    const [form, setForm] = useState({
        brideName: "",
        groomName: "",
        date: "",
        venue: "",
        quantity: 100,
    });

    let images: string[] = [];
    try {
        images = JSON.parse(product.images);
    } catch (e) { images = [product.images]; }

    const handleAddToCart = () => {
        const cartItem = {
            product,
            customization: form,
            quantity: form.quantity,
            totalPrice: product.price * form.quantity
        };
        localStorage.setItem("cart", JSON.stringify([cartItem]));
        router.push("/checkout");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
            {/* Enhanced Live Preview */}
            <div className="lg:sticky lg:top-32">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h2 className="text-sm font-serif uppercase tracking-[0.25em] text-stone-600">Live Preview</h2>
                    </div>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">Real-Time</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Decorative shadow/glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/20 via-rose-200/20 to-amber-200/20 rounded-lg blur-2xl opacity-60" />

                    {/* Main card preview */}
                    <div className="relative shadow-2xl overflow-hidden bg-white aspect-[3/4] border-[12px] border-white ring-2 ring-stone-200/50">
                        <img src={images[0]} alt="Preview" className="w-full h-full object-cover opacity-[0.15]" />

                        {/* Elegant Overlay Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-gradient-to-b from-transparent via-white/5 to-transparent">

                            {/* Decorative top */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="mb-8"
                            >
                                <div className="flex items-center gap-2 text-amber-600">
                                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400"></div>
                                    <Heart className="w-5 h-5 fill-current" />
                                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400"></div>
                                </div>
                            </motion.div>

                            {/* Names */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={form.brideName + form.groomName}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-5 mb-10"
                                >
                                    <div className="font-serif text-5xl md:text-6xl text-stone-900 tracking-tight leading-none">
                                        {form.brideName || <span className="text-stone-400 italic">Bride</span>}
                                    </div>
                                    <div className="font-serif italic text-4xl text-amber-600">&</div>
                                    <div className="font-serif text-5xl md:text-6xl text-stone-900 tracking-tight leading-none">
                                        {form.groomName || <span className="text-stone-400 italic">Groom</span>}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Date section */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={form.date}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-t-2 border-b-2 border-stone-400 py-5 w-4/5 mb-8"
                                >
                                    <div className="text-stone-800 font-semibold uppercase tracking-[0.25em] text-sm">
                                        {form.date || <span className="text-stone-400">Save the Date</span>}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Venue */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={form.venue}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-stone-700 font-light text-base uppercase tracking-wide"
                                >
                                    {form.venue || <span className="text-stone-400">Venue Location</span>}
                                </motion.div>
                            </AnimatePresence>

                            {/* Decorative bottom */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="mt-10"
                            >
                                <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Enhanced Customization Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8 p-10 bg-gradient-to-br from-white to-amber-50/30 shadow-2xl rounded-2xl border border-stone-200/50 relative overflow-hidden"
            >
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-100/30 to-transparent rounded-full blur-3xl -z-0" />

                <div className="relative z-10">
                    {/* Product Header */}
                    <div className="border-b-2 border-stone-200 pb-8 mb-8">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h1 className="text-4xl font-serif mb-3 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">{product.name}</h1>
                                <p className="text-stone-600 leading-relaxed">{product.description}</p>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-serif text-amber-600">${product.price.toFixed(2)}</p>
                            <span className="text-stone-500 font-light">per card</span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-7">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label>Bride's Name</Label>
                                <Input
                                    placeholder="Sarah"
                                    value={form.brideName}
                                    onChange={(e) => setForm({ ...form, brideName: e.target.value })}
                                    className="h-12 bg-white border-stone-300 focus:border-amber-400 focus:ring-amber-400/20 transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label>Groom's Name</Label>
                                <Input
                                    placeholder="Michael"
                                    value={form.groomName}
                                    onChange={(e) => setForm({ ...form, groomName: e.target.value })}
                                    className="h-12 bg-white border-stone-300 focus:border-amber-400 focus:ring-amber-400/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Wedding Date</Label>
                            <Input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="h-12 bg-white border-stone-300 focus:border-amber-400 focus:ring-amber-400/20"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Venue Address</Label>
                            <Input
                                placeholder="The Grand Plaza, New York"
                                value={form.venue}
                                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                                className="h-12 bg-white border-stone-300 focus:border-amber-400 focus:ring-amber-400/20"
                            />
                        </div>

                        {/* Quantity & Total */}
                        <div className="pt-8 border-t-2 border-stone-200 space-y-6">
                            <div className="flex justify-between items-center">
                                <Label className="text-base">Quantity</Label>
                                <Input
                                    type="number"
                                    min="10"
                                    className="w-28 h-12 text-center text-lg font-semibold bg-white border-stone-300"
                                    value={form.quantity}
                                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 10 })}
                                />
                            </div>

                            <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-6 rounded-xl border-2 border-amber-200/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-serif text-stone-700">Total Amount</span>
                                    <div className="text-right">
                                        <div className="text-3xl font-serif text-amber-600">${(product.price * form.quantity).toFixed(2)}</div>
                                        <div className="text-xs text-stone-500">{form.quantity} cards @ ${product.price}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            size="lg"
                            className="w-full h-16 text-lg font-light tracking-wide mt-8 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 rounded-xl"
                            onClick={handleAddToCart}
                        >
                            Proceed to Checkout
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
