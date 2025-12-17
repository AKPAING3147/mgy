import { prisma } from "@/lib/prisma";
import ProductCustomizer from "@/components/ProductCustomizer";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const product = await prisma.product.findUnique({
        where: { id: params.id }
    });

    if (!product) notFound();

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />
            <div className="container mx-auto pt-32 px-4">
                <div className="mb-8">
                    <a href="/collections" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Back to Collections</a>
                </div>
                <ProductCustomizer product={product} />
            </div>
        </div>
    );
}
