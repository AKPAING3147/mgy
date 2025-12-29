"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteOrderButtonProps {
    orderId: string;
}

export default function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                // Refresh the page to show updated data
                router.refresh();
                setShowConfirm(false);
            } else {
                console.error("Failed to delete order:", data.error);
                alert("Failed to delete order. Please try again.");
            }
        } catch (error) {
            console.error("Failed to delete order:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isDeleting ? "Deleting..." : "Confirm"}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-md text-sm disabled:opacity-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm flex items-center gap-2 transition-colors"
        >
            <Trash2 className="w-4 h-4" />
            Delete
        </button>
    );
}
