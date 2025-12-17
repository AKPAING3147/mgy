import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Check if products exist to avoid dupes
        const count = await prisma.product.count();
        if (count > 0) {
            return NextResponse.json({ success: false, message: "Already seeded" });
        }

        await prisma.product.createMany({
            data: [
                {
                    name: "Floral Romance",
                    description: "Elegant floral patterns with gold foil accents on 300gsm cream cardstock.",
                    price: 5.00, // Price per unit
                    category: "Floral",
                    images: JSON.stringify(["https://images.unsplash.com/photo-1595166687042-421712781440?q=80&w=800"]),
                },
                {
                    name: "Modern Minimal",
                    description: "Clean lines and sophisticated typography on textured white paper.",
                    price: 4.50,
                    category: "Minimal",
                    images: JSON.stringify(["https://images.unsplash.com/photo-1628151016002-8616c68d4d73?q=80&w=800"]),
                },
                {
                    name: "Royal Luxury",
                    description: "Deep velvet textures and golden seals for a truly regal announcement.",
                    price: 7.00,
                    category: "Luxury",
                    images: JSON.stringify(["https://images.unsplash.com/photo-1603531641357-1111624b5a26?q=80&w=800"]),
                }
            ]
        });
        return NextResponse.json({ success: true, message: "Seeded" });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) });
    }
}
