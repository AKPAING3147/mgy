import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description, price, category, images, imageUrl } = body;

        if (!name || !description || !price || !category) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }

        // Handle both single imageUrl and array of images
        let imageArray: string[] = [];
        if (images && Array.isArray(images)) {
            imageArray = images.filter((img: string) => img && img.length > 0);
        } else if (imageUrl) {
            imageArray = [imageUrl];
        }

        if (imageArray.length === 0) {
            return NextResponse.json({
                success: false,
                message: "At least one image is required"
            }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                images: JSON.stringify(imageArray)
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
