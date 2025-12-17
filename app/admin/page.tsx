import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Clock, Users, CheckCircle, Truck } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import OrderActionsClient from "@/components/admin/OrderActions";

async function checkAuth() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session) redirect('/admin/login');
}

async function approvePayment(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    await prisma.order.update({
        where: { id: orderId },
        data: { status: "APPROVED", paymentStatus: "VERIFIED" }
    });
    revalidatePath('/admin');
}

async function markComplete(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    await prisma.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" }
    });
    revalidatePath('/admin');
}

async function deleteOrder(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    // Delete order items first, then order
    await prisma.orderItem.deleteMany({ where: { orderId } });
    await prisma.order.delete({ where: { id: orderId } });
    revalidatePath('/admin');
}

async function logout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}

export default async function AdminDashboard() {
    await checkAuth();

    const [orders, stats] = await Promise.all([
        prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: { items: true }
        }),
        {
            totalRevenue: await prisma.order.aggregate({ _sum: { totalAmount: true } }),
            totalOrders: await prisma.order.count(),
            pendingReview: await prisma.order.count({ where: { status: "PAYMENT_REVIEW" } }),
            totalCustomers: await prisma.user.count({ where: { role: "USER" } }),
            completedOrders: await prisma.order.count({ where: { status: "COMPLETED" } }),
        }
    ]);

    return (
        <div className="min-h-screen bg-stone-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 shadow-lg sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-lg">M</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">MGY OFFSET Admin</h1>
                            <p className="text-xs text-white/80">Dashboard</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link href="/admin/products" className="text-sm hover:underline">Products</Link>
                        <Link href="/" className="text-sm hover:underline">View Site</Link>
                        <form action={logout}>
                            <button className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <div className="container mx-auto p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <Card className="bg-white shadow-md border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Total Revenue</p>
                                    <p className="text-2xl font-bold text-green-600">${(stats.totalRevenue._sum.totalAmount || 0).toFixed(0)}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-md border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Total Orders</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                                </div>
                                <Package className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-md border-l-4 border-l-yellow-500">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Pending Review</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</p>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-md border-l-4 border-l-emerald-500">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Completed</p>
                                    <p className="text-2xl font-bold text-emerald-600">{stats.completedOrders}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-md border-l-4 border-l-purple-500">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Customers</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.totalCustomers}</p>
                                </div>
                                <Users className="w-8 h-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Table */}
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-stone-50 to-white border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Orders Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-stone-50 border-b">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-semibold">Order ID</th>
                                        <th className="text-left p-4 text-sm font-semibold">Customer</th>
                                        <th className="text-left p-4 text-sm font-semibold">Amount</th>
                                        <th className="text-left p-4 text-sm font-semibold">Status</th>
                                        <th className="text-left p-4 text-sm font-semibold">Date</th>
                                        <th className="text-right p-4 text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                No orders yet
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id} className="border-b hover:bg-stone-50 transition-colors">
                                                <td className="p-4">
                                                    <code className="text-xs bg-stone-100 px-2 py-1 rounded">{order.id.substring(0, 12)}...</code>
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-medium">{order.fullName}</p>
                                                    <p className="text-xs text-muted-foreground">{order.email}</p>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                            order.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'PAYMENT_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                                                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                                        'bg-stone-100 text-stone-700'
                                                        }`}>
                                                        {order.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    <OrderActionsClient
                                                        order={order}
                                                        approveAction={approvePayment}
                                                        completeAction={markComplete}
                                                        deleteAction={deleteOrder}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
