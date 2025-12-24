import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InvoiceClient from "./InvoiceClient";

export default async function InvoicePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: { items: { include: { product: true } } }
    });

    if (!order) notFound();

    // Serialize the order data for the client component
    const serializedOrder = {
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map(item => ({
            ...item,
            product: {
                ...item.product,
                createdAt: item.product.createdAt.toISOString(),
            }
        }))
    };

    return <InvoiceClient order={serializedOrder} />;
}
