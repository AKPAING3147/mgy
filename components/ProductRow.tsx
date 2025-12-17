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
}

export default function ProductRow({ product }: { product: Product }) {
    const [deleting, setDeleting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Product deleted successfully');
                setOpen(false);
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
        <div className="grid grid-cols-12 gap-4 p-4 border-b items-center hover:bg-muted/5 transition-colors">
            <div className="col-span-4 font-medium">
                {product.name}
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
                {product.category}
            </div>
            <div className="col-span-2 font-mono text-sm font-bold text-primary">
                ${product.price.toFixed(2)}
            </div>
            <div className="col-span-4 text-right">
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="h-8 gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600">Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}"?
                                <br /><br />
                                <span className="font-medium text-red-500">
                                    Note: Products with existing orders cannot be deleted.
                                </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete Product'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
