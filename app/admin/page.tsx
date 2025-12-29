import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePath } from "next/cache";
import OrderActionsClient from "@/components/admin/OrderActions";
import { Package, Users, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import AdminCharts from "@/components/admin/AdminCharts";
import { getDashboardStats } from "@/lib/actions";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminDashboard() {
    const productsCount = await prisma.product.count();
    const ordersCount = await prisma.order.count();
    const usersCount = await prisma.user.count({ where: { role: "USER" } });

    // Calculate revenue from COMPLETED orders
    const revenueResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: "COMPLETED" }
    });
    const revenue = revenueResult._sum.totalAmount || 0;

    // Pending orders count
    const pendingOrders = await prisma.order.count({
        where: { status: { in: ["PENDING_PAYMENT", "PAYMENT_REVIEW"] } }
    });

    const orders = await prisma.order.findMany({
        where: { status: { not: "DELETED" } },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { user: true }
    });

    // Server Actions
    async function approvePayment(formData: FormData) {
        "use server";
        const orderId = formData.get("orderId") as string;
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "APPROVED",
                paymentStatus: "APPROVED"
            }
        });
        revalidatePath("/admin");
    }

    async function markComplete(formData: FormData) {
        "use server";
        const orderId = formData.get("orderId") as string;
        await prisma.order.update({
            where: { id: orderId },
            data: { status: "COMPLETED" }
        });
        revalidatePath("/admin");
    }

    async function deleteOrder(formData: FormData) {
        "use server";
        const orderId = formData.get("orderId") as string;
        // Delete items first
        await prisma.order.update({
            where: { id: orderId },
            data: { status: "DELETED" }
        });
        revalidatePath("/admin");
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING_PAYMENT": return "bg-yellow-100 text-yellow-800";
            case "PAYMENT_REVIEW": return "bg-blue-100 text-blue-800";
            case "APPROVED": return "bg-green-100 text-green-800";
            case "COMPLETED": return "bg-emerald-100 text-emerald-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const stats = await getDashboardStats();

    return (
        <div className="min-h-screen bg-white p-8 pt-24">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900">Admin Dashboard</h1>
                        <p className="text-stone-500">Manage your MGY OFFSET business</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/admin/products/new">
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-md">
                                + Add New Product
                            </Button>
                        </Link>
                        <LogoutButton />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="shadow-md border-l-4 border-l-primary">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">Total Revenue</CardTitle>
                            <DollarSign className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md border-l-4 border-l-secondary">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">Total Orders</CardTitle>
                            <Package className="w-4 h-4 text-secondary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.ordersCount}</div>
                            <p className="text-xs text-muted-foreground">{pendingOrders} pending review</p>
                        </CardContent>
                    </Card>
                    <Link href="/admin/users">
                        <Card className="shadow-md border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-stone-500">Customers</CardTitle>
                                <Users className="w-4 h-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{usersCount}</div>
                                <p className="text-xs text-muted-foreground">Registered accounts</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Card className="shadow-md border-l-4 border-l-stone-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">Products</CardTitle>
                            <CheckCircle className="w-4 h-4 text-stone-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{productsCount}</div>
                            <p className="text-xs text-muted-foreground">Active items</p>
                        </CardContent>
                    </Card>
                </div>

                {/* VISUAL CHARTS */}
                <AdminCharts stats={stats} />

                {/* Recent Orders */}
                <Card className="shadow-lg">
                    <CardHeader className="border-b bg-white">
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white border-b text-stone-600 text-sm uppercase">
                                    <tr>
                                        <th className="py-4 px-6 text-left">Order ID</th>
                                        <th className="py-4 px-6 text-left">Customer</th>
                                        <th className="py-4 px-6 text-left">Amount</th>
                                        <th className="py-4 px-6 text-left">Status</th>
                                        <th className="py-4 px-6 text-left">Date</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium">{order.fullName}</div>
                                                <div className="text-xs text-stone-500">{order.email}</div>
                                            </td>
                                            <td className="py-4 px-6 font-medium">${order.totalAmount.toFixed(2)}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                    {order.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-stone-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <OrderActionsClient
                                                    order={order}
                                                    approveAction={approvePayment}
                                                    completeAction={markComplete}
                                                    deleteAction={deleteOrder}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {orders.length === 0 && (
                            <div className="text-center py-12 text-stone-500">
                                No orders found.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
