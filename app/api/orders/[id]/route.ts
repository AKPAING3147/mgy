import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({
                success: false,
                message: "Order not found"
            }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Fetch order error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch order"
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Update order status to DELETED
        await prisma.order.update({
            where: { id },
            data: { status: "DELETED" }
        });

        return NextResponse.json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete order" },
            { status: 500 }
        );
    }
}
