import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check if product has any orders
        const orderCount = await prisma.orderItem.count({
            where: { productId: id }
        });

        if (orderCount > 0) {
            return NextResponse.json({
                success: false,
                message: `Cannot delete this product. It has ${orderCount} order(s). Products with orders cannot be deleted to preserve order history.`
            }, { status: 400 });
        }

        // Safe to delete
        await prisma.product.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete product"
        }, { status: 500 });
    }
}
