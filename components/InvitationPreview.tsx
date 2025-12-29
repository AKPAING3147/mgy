"use client";

import { Heart, MapPin, Calendar, Clock } from "lucide-react";

interface CustomizationData {
    brideName: string;
    groomName: string;
    weddingDate: string;
    weddingTime: string;
    venue: string;
    additionalInfo: string;
    colorScheme: string;
    fontStyle: string;
}

interface InvitationPreviewProps {
    customization: CustomizationData;
    productName: string;
}

export default function InvitationPreview({ customization, productName }: InvitationPreviewProps) {
    const { brideName, groomName, weddingDate, weddingTime, venue, additionalInfo, colorScheme, fontStyle } = customization;

    // Color scheme configurations
    const colorThemes = {
        "rose-gold": {
            bg: "bg-gradient-to-br from-rose-100 via-amber-50 to-rose-100",
            border: "border-rose-300",
            text: "text-rose-900",
            accent: "text-amber-600",
            decorative: "text-rose-400"
        },
        "classic": {
            bg: "bg-gradient-to-br from-stone-50 via-white to-stone-50",
            border: "border-stone-300",
            text: "text-stone-900",
            accent: "text-stone-700",
            decorative: "text-stone-400"
        },
        "romantic": {
            bg: "bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100",
            border: "border-pink-300",
            text: "text-pink-900",
            accent: "text-rose-600",
            decorative: "text-pink-400"
        },
        "elegant": {
            bg: "bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100",
            border: "border-blue-400",
            text: "text-blue-900",
            accent: "text-slate-700",
            decorative: "text-blue-400"
        },
        "garden": {
            bg: "bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-100",
            border: "border-emerald-300",
            text: "text-emerald-900",
            accent: "text-teal-700",
            decorative: "text-emerald-400"
        }
    };

    // Font style configurations
    const fontClasses = {
        elegant: "font-serif",
        modern: "font-sans",
        romantic: "font-serif italic",
        classic: "font-serif"
    };

    const theme = colorThemes[colorScheme as keyof typeof colorThemes] || colorThemes["rose-gold"];
    const fontClass = fontClasses[fontStyle as keyof typeof fontClasses] || fontClasses.elegant;

    // Format date
    const formattedDate = weddingDate
        ? new Date(weddingDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "Select a date";

    return (
        <div className={`aspect-[3/4] ${theme.bg} ${theme.border} border-4 rounded-lg shadow-xl p-8 flex flex-col justify-between relative overflow-hidden`}>
            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 right-4 flex justify-between opacity-30">
                <div className={`w-16 h-16 border-t-2 border-l-2 ${theme.border}`}></div>
                <div className={`w-16 h-16 border-t-2 border-r-2 ${theme.border}`}></div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-30">
                <div className={`w-16 h-16 border-b-2 border-l-2 ${theme.border}`}></div>
                <div className={`w-16 h-16 border-b-2 border-r-2 ${theme.border}`}></div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
                {/* Header */}
                <div className={`${theme.decorative} mb-8`}>
                    <Heart className="w-12 h-12 mx-auto fill-current" />
                </div>

                {/* Names */}
                <div className={`${fontClass} ${theme.text} mb-6`}>
                    <p className={`text-4xl font-bold mb-2 ${theme.accent}`}>
                        {brideName || "Bride"} & {groomName || "Groom"}
                    </p>
                    <p className="text-sm uppercase tracking-widest">
                        Request the honor of your presence
                    </p>
                </div>

                {/* Date & Time */}
                <div className={`${theme.text} space-y-3 mb-6`}>
                    <div className="flex items-center justify-center gap-2">
                        <Calendar className={`w-5 h-5 ${theme.accent}`} />
                        <p className="text-lg font-medium">{formattedDate}</p>
                    </div>
                    {weddingTime && (
                        <div className="flex items-center justify-center gap-2">
                            <Clock className={`w-5 h-5 ${theme.accent}`} />
                            <p className="text-lg font-medium">
                                {new Date(`2000-01-01T${weddingTime}`).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Venue */}
                <div className={`${theme.text} mb-6`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <MapPin className={`w-5 h-5 ${theme.accent}`} />
                        <p className="font-semibold text-lg">Venue</p>
                    </div>
                    <p className={`${fontClass} text-base ${theme.accent}`}>
                        {venue || "Your beautiful venue"}
                    </p>
                </div>

                {/* Additional Info */}
                {additionalInfo && (
                    <div className={`${theme.text} text-sm max-w-sm mt-4 border-t ${theme.border} pt-4`}>
                        <p className="italic">{additionalInfo}</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className={`text-center ${theme.text} text-xs opacity-60 z-10`}>
                <p>{productName}</p>
            </div>
        </div>
    );
}
