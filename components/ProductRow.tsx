"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
}

export default function ProductRow({ product }: { product: Product }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${product.name}"?\n\nNote: Products with existing orders cannot be deleted.`)) {
            return;
        }

        setDeleting(true);

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Product deleted successfully');
                window.location.reload();
            } else {
                toast.error(data.message || 'Cannot delete product');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="grid grid-cols-12 gap-4 p-4 border-b items-center hover:bg-muted/5">
            <div className="col-span-4 font-medium">
                {product.name}
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
                {product.category}
            </div>
            <div className="col-span-2 font-mono text-sm">
                ${product.price.toFixed(2)}
            </div>
            <div className="col-span-4 text-right">
                <Button
                    size="sm"
                    variant="destructive"
                    className="h-8"
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleting ? 'Deleting...' : 'Delete'}
                </Button>
            </div>
        </div>
    );
}
