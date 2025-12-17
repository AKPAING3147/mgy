import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cartItems, shipping } = body;

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
        }

        // Calculate total
        const totalAmount = cartItems.reduce((acc: number, item: any) => acc + item.totalPrice, 0);

        // Find or Create User by email
        let user = await prisma.user.findUnique({ where: { email: shipping.email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: shipping.email,
                    password: "$2a$10$GuestPasswordHashPlaceholder", // Placeholder
                    name: shipping.fullName,
                    role: "USER"
                }
            });
        }

        // Create Order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount,
                fullName: shipping.fullName,
                email: shipping.email,
                phone: shipping.phone,
                address: shipping.address,
                items: {
                    create: cartItems.map((item: any) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        customization: JSON.stringify(item.customization)
                    }))
                }
            }
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Order creation failed" }, { status: 500 });
    }
}
