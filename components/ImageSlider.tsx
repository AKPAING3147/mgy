"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
    images: string[];
    productName: string;
}

export default function ImageSlider({ images, productName }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const validImages = images.filter(img => img && img.length > 0);

    if (validImages.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                <span className="text-stone-400 text-lg">No Image</span>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    return (
        <div className="relative w-full h-full group">
            <img
                src={validImages[currentIndex]}
                alt={`${productName} - Image ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
            />

            {validImages.length > 1 && (
                <>
                    {/* Navigation Arrows */}
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="w-5 h-5 text-stone-800" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="w-5 h-5 text-stone-800" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {validImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); }}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                                        ? "bg-primary w-6"
                                        : "bg-white/70 hover:bg-white"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
