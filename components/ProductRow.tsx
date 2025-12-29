"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock?: number;
}

export default function ProductRow({ product }: { product: Product }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);

        try {
            const res = await fetch(`/api/products?id=${product.id}`, {
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
        <div className="grid grid-cols-12 gap-4 p-4 border-b items-center hover:bg-stone-50 transition-colors">
            <div className="col-span-4 font-medium text-stone-900">
                {product.name}
            </div>
            <div className="col-span-2 text-sm text-stone-500">
                {product.category}
            </div>
            <div className="col-span-2 font-mono text-sm text-stone-900">
                ${product.price.toFixed(2)}
            </div>
            <div className={`col-span-2 font-mono text-sm font-bold ${(product.stock ?? 0) <= 0 ? "text-red-500" : "text-green-600"}`}>
                {product.stock ?? 0}
            </div>
            <div className="col-span-2 text-right">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 shadow-sm hover:shadow-md transition-all bg-red-600 hover:bg-red-700"
                            disabled={deleting}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600">Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-2">
                                <p>Are you sure you want to delete <strong>{product.name}</strong>?</p>
                                <p className="text-stone-600 bg-amber-50 p-2 rounded text-xs border border-amber-200">
                                    ⚠️ <strong>Note:</strong> Products with existing orders cannot be deleted to preserve order history. Only products with zero orders can be removed.
                                </p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
