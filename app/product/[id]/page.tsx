import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <ProductDetail product={product} />
        </main>
    );
}
