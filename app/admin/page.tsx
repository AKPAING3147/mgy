import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DollarSign,
    ShoppingCart,
    Users,
    TrendingUp,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    LogOut
} from "lucide-react";
import Link from "next/link";

async function logout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}

async function checkAuth() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        redirect('/admin/login');
    }

    return true;
}

export default async function AdminDashboard() {
    await checkAuth();

    const [orders, products, users, stats] = await Promise.all([
        prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { items: { include: { product: true } }, user: true }
        }),
        prisma.product.findMany(),
        prisma.user.findMany({ where: { role: 'USER' } }),
        prisma.order.groupBy({
            by: ['status'],
            _count: { id: true }
        })
    ]);

    const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.status === 'PAYMENT_REVIEW').length;
    const approvedOrders = orders.filter(o => o.status === 'APPROVED').length;

    // Calculate weekly revenue (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyOrders = orders.filter(o => new Date(o.createdAt) > weekAgo);
    const weeklyRevenue = weeklyOrders.reduce((acc, o) => acc + o.totalAmount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-background">
            {/* Header */}
            <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-stone-900">Admin Dashboard</h1>
                        <p className="text-sm text-stone-600">Eternity Invites Management</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products">
                            <Button variant="outline" className="gap-2">
                                <Package className="w-4 h-4" />
                                Manage Products
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="gap-2">
                                View Site
                            </Button>
                        </Link>
                        <form action={logout}>
                            <Button variant="destructive" className="gap-2">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-600">Total Revenue</CardTitle>
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-stone-900">${totalRevenue.toFixed(2)}</div>
                            <p className="text-xs text-stone-500 mt-2">
                                <span className="text-green-600 font-semibold">+${weeklyRevenue.toFixed(2)}</span> this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-600">Total Orders</CardTitle>
                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-stone-900">{orders.length}</div>
                            <p className="text-xs text-stone-500 mt-2">
                                <span className="text-blue-600 font-semibold">{weeklyOrders.length}</span> this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-600">Pending Review</CardTitle>
                            <Clock className="w-5 h-5 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-stone-900">{pendingOrders}</div>
                            <p className="text-xs text-stone-500 mt-2">Awaiting payment verification</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-600">Total Customers</CardTitle>
                            <Users className="w-5 h-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-stone-900">{users.length}</div>
                            <p className="text-xs text-stone-500 mt-2">Registered users</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders Table */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-serif">Recent Orders</CardTitle>
                        <CardDescription>Latest order submissions and payment status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-stone-50">
                                        <th className="text-left p-4 text-sm font-semibold text-stone-700">Order ID</th>
                                        <th className="text-left p-4 text-sm font-semibold text-stone-700">Customer</th>
                                        <th className="text-left p-4 text-sm font-semibold text-stone-700">Amount</th>
                                        <th className="text-left p-4 text-sm font-semibold text-stone-700">Status</th>
                                        <th className="text-left p-4 text-sm font-semibold text-stone-700">Payment</th>
                                        <th className="text-left p-4 text-sm font-semibold text-stone-700">Date</th>
                                        <th className="text-right p-4 text-sm font-semibold text-stone-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-b hover:bg-amber-50/30 transition-colors">
                                            <td className="p-4">
                                                <span className="font-mono text-xs text-stone-600 bg-stone-100 px-2 py-1 rounded">
                                                    {order.id.substring(0, 8)}...
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-stone-900">{order.fullName}</div>
                                                <div className="text-xs text-stone-500">{order.email}</div>
                                            </td>
                                            <td className="p-4 font-mono font-semibold text-green-700">
                                                ${order.totalAmount.toFixed(2)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'PAYMENT_REVIEW' ? 'bg-amber-100 text-amber-800' :
                                                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-stone-100 text-stone-800'
                                                    }`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {order.paymentSlipUrl ? (
                                                    <a
                                                        href={order.paymentSlipUrl}
                                                        target="_blank"
                                                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        View Slip
                                                    </a>
                                                ) : (
                                                    <span className="text-stone-400 text-sm flex items-center gap-1">
                                                        <XCircle className="w-4 h-4" />
                                                        No slip
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-stone-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <Button size="sm" variant="outline">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif">Product Catalog</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-amber-600 mb-2">{products.length}</div>
                            <p className="text-sm text-stone-600">Active invitation designs</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif">Approved Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-green-600 mb-2">{approvedOrders}</div>
                            <p className="text-sm text-stone-600">Ready for processing</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif">Average Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                ${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
                            </div>
                            <p className="text-sm text-stone-600">Per customer transaction</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
