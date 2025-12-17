"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t } = useLanguage();

    const navLinks = [
        { href: "/", label: t("nav_home") },
        { href: "/collections", label: t("nav_collections") },
        { href: "/track-order", label: t("nav_track_order") },
        { href: "/contact", label: t("nav_contact") },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <div>
                        <span className="font-bold text-xl text-primary">MGY</span>
                        <span className="font-bold text-xl text-secondary ml-1">OFFSET</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-stone-600 hover:text-primary transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/track-order" className="relative" title="Favorites & Orders">
                        <Heart className="w-5 h-5 text-stone-600 hover:text-primary transition-colors" />
                    </Link>
                    <LanguageSwitcher />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <LanguageSwitcher />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-stone-600"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2 text-stone-600 hover:text-primary"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
