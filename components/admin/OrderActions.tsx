"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Check, Trash2, CheckCircle, Eye, FileText } from "lucide-react";
import Link from "next/link";

interface Order {
    id: string;
    status: string;
    paymentSlipUrl: string | null;
}

interface OrderActionsProps {
    order: Order;
    approveAction: (formData: FormData) => Promise<void>;
    completeAction: (formData: FormData) => Promise<void>;
    deleteAction: (formData: FormData) => Promise<void>;
}

export default function OrderActionsClient({ order, approveAction, completeAction, deleteAction }: OrderActionsProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleApprove = async () => {
        setLoading("approve");
        const formData = new FormData();
        formData.append("orderId", order.id);
        await approveAction(formData);
        setLoading(null);
    };

    const handleComplete = async () => {
        setLoading("complete");
        const formData = new FormData();
        formData.append("orderId", order.id);
        await completeAction(formData);
        setLoading(null);
    };

    const handleDelete = async () => {
        setLoading("delete");
        const formData = new FormData();
        formData.append("orderId", order.id);
        await deleteAction(formData);
        setLoading(null);
    };

    return (
        <div className="flex items-center justify-end gap-2">
            {/* View Payment Slip */}
            {order.paymentSlipUrl && (
                <a href={order.paymentSlipUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <FileText className="w-3 h-3" />
                        Slip
                    </Button>
                </a>
            )}

            {/* View Details */}
            <Link href={`/admin/orders/${order.id}`}>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Eye className="w-3 h-3" />
                    View
                </Button>
            </Link>

            {/* Approve Payment */}
            {order.status === "PAYMENT_REVIEW" && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" className="h-8 gap-1 bg-green-600 hover:bg-green-700">
                            <Check className="w-3 h-3" />
                            Approve
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Approve Payment?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will approve the payment and move the order to "APPROVED" status.
                                Please verify the payment slip before approving.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleApprove}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={loading === "approve"}
                            >
                                {loading === "approve" ? "Approving..." : "Approve Payment"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* Mark Complete */}
            {order.status === "APPROVED" && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle className="w-3 h-3" />
                            Complete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Mark as Completed?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will mark the order as "COMPLETED".
                                Make sure the order has been fulfilled and delivered to the customer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleComplete}
                                className="bg-emerald-600 hover:bg-emerald-700"
                                disabled={loading === "complete"}
                            >
                                {loading === "complete" ? "Completing..." : "Mark Complete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* Delete Order - Only for completed orders */}
            {order.status === "COMPLETED" && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="h-8 gap-1">
                            <Trash2 className="w-3 h-3" />
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600">Delete Order?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the order
                                and all associated data from the database.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={loading === "delete"}
                            >
                                {loading === "delete" ? "Deleting..." : "Delete Order"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
