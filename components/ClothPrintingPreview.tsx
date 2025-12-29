"use client";

import { Shirt, Package } from "lucide-react";

interface ClothPrintingCustomization {
    garmentType: string;
    size: string;
    color: string;
    printDesign: string;
    printPosition: string;
    quantity: number;
}

interface ClothPrintingPreviewProps {
    customization: ClothPrintingCustomization;
    productName: string;
}

export default function ClothPrintingPreview({ customization, productName }: ClothPrintingPreviewProps) {
    const { garmentType, size, color, printDesign, printPosition } = customization;

    // Color themes for garments
    const garmentColors: Record<string, string> = {
        "white": "bg-white border-2 border-stone-300",
        "black": "bg-stone-900",
        "navy": "bg-blue-900",
        "gray": "bg-stone-500",
        "red": "bg-red-600",
        "blue": "bg-blue-600",
        "green": "bg-green-600",
        "yellow": "bg-yellow-400",
        "pink": "bg-pink-400"
    };

    const textColor = ["white", "yellow", "pink"].includes(color) ? "text-stone-900" : "text-white";

    return (
        <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg shadow-xl p-8 flex flex-col items-center justify-center relative overflow-hidden border-2 border-stone-300">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)',
                }}></div>
            </div>

            {/* Garment Preview */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Garment Icon/Shape */}
                <div className={`w-48 h-56 rounded-t-3xl ${garmentColors[color] || garmentColors.white} shadow-2xl relative flex items-center justify-center`}>
                    {/* Collar for t-shirt */}
                    {garmentType === "t-shirt" && (
                        <div className={`absolute -top-4 w-16 h-8 ${garmentColors[color]} rounded-t-full`}></div>
                    )}

                    {/* Hood for hoodie */}
                    {garmentType === "hoodie" && (
                        <div className={`absolute -top-6 w-20 h-10 ${garmentColors[color]} rounded-t-3xl`}></div>
                    )}

                    {/* Print Design Area */}
                    {printDesign && (
                        <div className={`px-6 py-4 text-center ${textColor} font-bold ${printPosition === "front" ? "mt-8" : printPosition === "back" ? "mt-16" : "mt-4"
                            }`}>
                            <div className="text-xs opacity-60 mb-1">
                                {printPosition === "front" ? "FRONT" : printPosition === "back" ? "BACK" : "CENTER"}
                            </div>
                            <div className="text-sm font-bold break-words max-w-[150px]">
                                {printDesign}
                            </div>
                        </div>
                    )}

                    {/* Shirt icon overlay */}
                    {!printDesign && (
                        <Shirt className={`w-20 h-20 ${textColor} opacity-30`} />
                    )}
                </div>

                {/* Sleeves */}
                <div className="flex gap-2 -mt-12">
                    <div className={`w-12 h-24 ${garmentColors[color]} rounded-b-2xl shadow-lg`}></div>
                    <div className="w-24"></div>
                    <div className={`w-12 h-24 ${garmentColors[color]} rounded-b-2xl shadow-lg`}></div>
                </div>
            </div>

            {/* Details */}
            <div className="mt-6 bg-white rounded-lg p-4 shadow-md z-10 w-full">
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <p className="text-stone-500 font-medium">Type</p>
                        <p className="text-stone-900 font-bold capitalize">{garmentType || "Select type"}</p>
                    </div>
                    <div>
                        <p className="text-stone-500 font-medium">Size</p>
                        <p className="text-stone-900 font-bold uppercase">{size || "Select size"}</p>
                    </div>
                    <div>
                        <p className="text-stone-500 font-medium">Color</p>
                        <p className="text-stone-900 font-bold capitalize">{color || "Select color"}</p>
                    </div>
                    <div>
                        <p className="text-stone-500 font-medium">Print</p>
                        <p className="text-stone-900 font-bold capitalize">{printPosition || "Position"}</p>
                    </div>
                </div>
            </div>

            {/* Product Name Footer */}
            <div className="text-center text-stone-600 text-xs mt-4 z-10 opacity-60">
                <p>{productName}</p>
            </div>
        </div>
    );
}
