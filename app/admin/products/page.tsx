import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProductRow from "@/components/ProductRow";
import { Toaster } from "sonner";

async function checkAuth() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session) redirect('/admin/login');
}

export default async function AdminProducts() {
    await checkAuth();

    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-white p-8">
            <Toaster position="top-center" richColors />
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-4 block">
                        ← Back to Dashboard
                    </Link>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-serif text-foreground">Products</h1>
                        <Link href="/admin/products/new">
                            <Button><Plus className="w-4 h-4 mr-2" /> Add New</Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm text-muted-foreground border-b">
                        <div className="col-span-4">Product Name</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Stock</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {products.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No products found.</div>
                    ) : (
                        products.map((product) => (
                            <ProductRow key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
