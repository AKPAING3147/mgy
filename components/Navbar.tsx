"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { t } = useLanguage();

    const navLinks = [
        { href: "/", label: t("nav_home") },
        { href: "/collections", label: t("nav_collections") },
        { href: "/track-order", label: t("nav_track_order") },
        { href: "/contact", label: t("nav_contact") },
    ];

    // Detect scroll for navbar effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-lg"
                    : "bg-white/80 backdrop-blur-sm shadow-md"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo with animation */}
                    <Link href="/" className="relative group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="transition-all duration-300"
                        >
                            <img
                                src="/logo.jpg"
                                alt="MGY OFFSET"
                                className="h-16 w-auto object-contain transform group-hover:drop-shadow-xl transition-all duration-300"
                            />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative group"
                            >
                                <motion.span
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-sm font-medium text-stone-700 hover:text-primary transition-colors duration-300"
                                >
                                    {link.label}
                                </motion.span>
                                {/* Animated underline */}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-rose-500 group-hover:w-full transition-all duration-300 ease-out"></span>
                            </Link>
                        ))}

                        {/* Language Switcher */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <LanguageSwitcher />
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        <LanguageSwitcher />
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors duration-200"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 space-y-1">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="block py-3 px-4 rounded-lg text-stone-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 hover:text-primary font-medium transition-all duration-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle bottom gradient line */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-30"></div>
        </motion.nav>
    );
}
