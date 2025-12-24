import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrderSchema, parseAndValidate, stripHtml } from "@/lib/validation";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate and sanitize input
        const validation = await parseAndValidate(createOrderSchema, body);
        if (!validation.success) {
            console.log(`[SECURITY] Order validation failed: ${validation.errors.join(', ')}`);
            return NextResponse.json(
                { success: false, message: "Invalid order data", errors: validation.errors },
                { status: 400 }
            );
        }

        const { cartItems, shipping } = validation.data;

        // Sanitize text inputs
        const sanitizedShipping = {
            fullName: stripHtml(shipping.fullName),
            email: shipping.email.toLowerCase().trim(),
            phone: shipping.phone.replace(/[^\d\s+\-()]/g, ''),
            address: stripHtml(shipping.address),
        };

        // Calculate total securely (verify against stored prices)
        // Execute in transaction to ensure stock integrity
        const order = await prisma.$transaction(async (tx) => {
            let totalAmount = 0;

            for (const item of cartItems) {
                // Verify product exists and price is correct
                const product = await tx.product.findUnique({
                    where: { id: item.product.id }
                });

                if (!product || product.status !== "ACTIVE") {
                    throw new Error(`Product not found or unavailable: ${item.product.id}`);
                }

                // Atomic decrement with stock check
                const updateResult = await tx.product.updateMany({
                    where: {
                        id: product.id,
                        stock: { gte: item.quantity }
                    },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                });

                if (updateResult.count === 0) {
                    throw new Error(`Insufficient stock for ${product.name}. Requesting ${item.quantity}, but stock is likely insufficient.`);
                }

                // Use stored price
                totalAmount += product.price * item.quantity;
            }

            // Find or Create User
            let user = await tx.user.findUnique({ where: { email: sanitizedShipping.email } });
            if (!user) {
                user = await tx.user.create({
                    data: {
                        email: sanitizedShipping.email,
                        password: "$2a$10$GuestPasswordHashPlaceholder",
                        name: sanitizedShipping.fullName,
                        role: "USER"
                    }
                });
            }

            // Create Order
            return await tx.order.create({
                data: {
                    userId: user.id,
                    totalAmount,
                    fullName: sanitizedShipping.fullName,
                    email: sanitizedShipping.email,
                    phone: sanitizedShipping.phone,
                    address: sanitizedShipping.address,
                    items: {
                        create: cartItems.map((item) => ({
                            productId: item.product.id,
                            quantity: item.quantity,
                            customization: JSON.stringify(item.customization || {})
                        }))
                    }
                }
            });
        });

        console.log(`[ORDER] New order created: ${order.id} by ${sanitizedShipping.email}`);

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error("[ERROR] Order creation failed:", error);
        return NextResponse.json(
            { success: false, message: "Order creation failed" },
            { status: 500 }
        );
    }
}

