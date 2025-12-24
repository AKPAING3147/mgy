"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ImageSliderProps {
    images: string[];
    productName: string;
}

export default function ImageSlider({ images, productName }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter out empty strings just in case
    const validImages = images.filter(img => img && img.length > 0);

    if (validImages.length === 0) {
        return (
            <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400">
                No Image
            </div>
        );
    }

    const nextSlide = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    return (
        <div className="w-full h-full relative group">
            <img
                src={validImages[currentIndex]}
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {validImages.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                        <ChevronLeft className="w-5 h-5 text-stone-800" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                        <ChevronRight className="w-5 h-5 text-stone-800" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {validImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-4" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
