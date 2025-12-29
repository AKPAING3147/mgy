import { prisma } from "@/lib/prisma";
import ProductDetail from "@/components/ProductDetail";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const product = await prisma.product.findUnique({
        where: { id: params.id }
    });

    if (!product) notFound();

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />
            <ProductDetail product={product} />
        </div>
    );
}
