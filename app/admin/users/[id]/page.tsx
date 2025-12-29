import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { User, Mail, Calendar, Package } from "lucide-react";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";

export default async function UserDetailsPage({ params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            orders: {
                where: { status: { not: "DELETED" } },
                orderBy: { createdAt: "desc" },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        redirect("/admin/users");
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING_PAYMENT": return "bg-yellow-100 text-yellow-800";
            case "PAYMENT_REVIEW": return "bg-blue-100 text-blue-800";
            case "APPROVED": return "bg-green-100 text-green-800";
            case "PRINTING": return "bg-purple-100 text-purple-800";
            case "SHIPPED": return "bg-indigo-100 text-indigo-800";
            case "COMPLETED": return "bg-emerald-100 text-emerald-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-white p-8 pt-24">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900">User Details</h1>
                        <p className="text-stone-500">View user information and manage their orders</p>
                    </div>
                    <Link
                        href="/admin/users"
                        className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-md transition-colors"
                    >
                        ← Back to Users
                    </Link>
                </div>

                {/* User Info Card */}
                <Card className="shadow-lg mb-8">
                    <CardHeader className="border-b bg-white">
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            User Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-stone-500 mb-1">Name</p>
                                <p className="font-medium text-lg">{user.name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-stone-500 mb-1">Email</p>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-stone-400" />
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-stone-500 mb-1">Joined</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-stone-400" />
                                    <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Card */}
                <Card className="shadow-lg">
                    <CardHeader className="border-b bg-white">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Orders ({user.orders.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {user.orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white border-b text-stone-600 text-sm uppercase">
                                        <tr>
                                            <th className="py-4 px-6 text-left">Order ID</th>
                                            <th className="py-4 px-6 text-left">Items</th>
                                            <th className="py-4 px-6 text-left">Amount</th>
                                            <th className="py-4 px-6 text-left">Status</th>
                                            <th className="py-4 px-6 text-left">Date</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {user.orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 font-mono text-sm">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {order.id.slice(0, 8)}...
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm">
                                                        {order.items.map((item, idx) => (
                                                            <div key={item.id} className="text-stone-600">
                                                                {item.product.name} (x{item.quantity})
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 font-medium">
                                                    ${order.totalAmount.toFixed(2)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                        {order.status.replace(/_/g, " ")}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-stone-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <DeleteOrderButton
                                                        orderId={order.id}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-stone-500">
                                <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>This user has no orders yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
