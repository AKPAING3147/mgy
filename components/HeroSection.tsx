"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50/30 via-rose-50/20 to-background">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent" />

                <motion.div
                    className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-rose-200/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />

                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L32 8 L30 16 L28 8 Z M30 44 L32 52 L30 60 L28 52 Z M0 30 L8 32 L16 30 L8 28 Z M44 30 L52 32 L60 30 L52 28 Z' fill='%23000' fill-opacity='1'/%3E%3C/svg%3E")`
                }} />
            </div>

            <div className="container relative z-10 text-center px-4 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-5xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex justify-center items-center gap-4 mb-10"
                    >
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/60 to-primary"></div>
                        <div className="relative">
                            <Star className="text-primary w-10 h-10 fill-current drop-shadow-2xl" />
                            <motion.div
                                className="absolute inset-0"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="text-amber-300 w-3 h-3 absolute -top-1 -right-1" />
                            </motion.div>
                        </div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent via-primary/60 to-primary"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mb-10"
                    >
                        <p className="text-primary uppercase tracking-[0.5em] text-xs md:text-sm font-bold drop-shadow-sm">
                            Where Romance Meets Artistry
                        </p>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-12"
                    >
                        <div className="font-serif text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-4">
                            <span className="block bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 bg-clip-text text-transparent">
                                Eternity
                            </span>
                        </div>
                        <div className="font-serif italic text-6xl md:text-7xl lg:text-8xl">
                            <span className="bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-2xl">
                                Invites
                            </span>
                        </div>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="mb-14 space-y-2"
                    >
                        <p className="max-w-2xl mx-auto text-2xl md:text-3xl text-stone-700 font-light">
                            Exquisite, handcrafted invitations
                        </p>
                        <p className="max-w-2xl mx-auto text-xl md:text-2xl font-serif italic text-primary/90">
                            that tell your unique love story
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                    >
                        <Link href="/collections">
                            <Button
                                size="lg"
                                className="group relative h-16 px-14 text-lg font-light overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-white shadow-2xl shadow-amber-500/40 rounded-full transition-all duration-500 hover:scale-105"
                            >
                                <span className="relative z-10 tracking-wide flex items-center gap-2">
                                    Explore Collections
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "200%" }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                />
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
            >
                <span className="text-xs uppercase tracking-[0.3em] text-stone-400 font-semibold">Discover</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-6 h-11 border-2 border-stone-300 rounded-full p-1.5 relative"
                >
                    <motion.div
                        className="w-1.5 h-3 bg-gradient-to-b from-primary to-amber-600 rounded-full mx-auto"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
