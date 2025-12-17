import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description, price, category, imageUrl } = body;

        if (!name || !description || !price || !category || !imageUrl) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                images: JSON.stringify([imageUrl])
            }
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Create product error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to create product"
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch products"
        }, { status: 500 });
    }
}
