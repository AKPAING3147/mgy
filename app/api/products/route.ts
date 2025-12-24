import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema, parseAndValidate, idSchema, stripHtml } from "@/lib/validation";

// Note: Admin authentication is handled by middleware
// All POST/DELETE requests to this route require valid admin session

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate input with Zod schema
        const validation = await parseAndValidate(createProductSchema, body);
        if (!validation.success) {
            console.log(`[SECURITY] Product creation validation failed: ${validation.errors.join(', ')}`);
            return NextResponse.json({
                success: false,
                message: "Invalid product data",
                errors: validation.errors
            }, { status: 400 });
        }

        const { name, description, price, category, images, imageUrl, minQuantity, stock } = validation.data;

        // Support both old (imageUrl) and new (images array) formats
        let imageList: string[] = [];
        if (images && Array.isArray(images)) {
            imageList = images;
        } else if (imageUrl) {
            imageList = [imageUrl];
        }

        // Validate we have at least one image
        if (imageList.length === 0) {
            return NextResponse.json({
                success: false,
                message: "At least one image is required"
            }, { status: 400 });
        }

        // Sanitize text inputs
        const sanitizedName = stripHtml(name);
        const sanitizedDescription = stripHtml(description);
        const sanitizedCategory = stripHtml(category);

        const product = await prisma.product.create({
            data: {
                name: sanitizedName,
                description: sanitizedDescription,
                price: typeof price === 'number' ? price : parseFloat(String(price)),
                category: sanitizedCategory,
                images: JSON.stringify(imageList),
                minQuantity: typeof minQuantity === 'number' ? minQuantity : parseInt(String(minQuantity)) || 1,
                stock: typeof stock === 'number' ? stock : parseInt(String(stock)) || 0,
                status: "ACTIVE"
            }
        });

        console.log(`[ADMIN] Product created: ${product.id} - ${sanitizedName}`);

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("[ERROR] Create product error:", error);
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create product"
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // Validate ID
        const idValidation = idSchema.safeParse(id);
        if (!idValidation.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid product ID"
            }, { status: 400 });
        }

        const validId = idValidation.data;

        // Check for active orders (not COMPLETED or DELETED)
        const activeOrderItems = await prisma.orderItem.findFirst({
            where: {
                productId: validId,
                order: {
                    status: {
                        notIn: ["COMPLETED", "DELETED"]
                    }
                }
            }
        });

        if (activeOrderItems) {
            return NextResponse.json({
                success: false,
                message: "Cannot delete product with active orders"
            }, { status: 400 });
        }

        // Soft Delete
        await prisma.product.update({
            where: { id: validId },
            data: { status: "ARCHIVED" }
        });

        console.log(`[ADMIN] Product archived: ${validId}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ERROR] Delete product error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete product"
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { status: "ACTIVE" },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error("[ERROR] Fetch products error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch products"
        }, { status: 500 });
    }
}

