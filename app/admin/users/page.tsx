import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Calendar } from "lucide-react";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        where: { role: "USER" },
        orderBy: { createdAt: "desc" },
        include: {
            orders: {
                where: { status: { not: "DELETED" } }
            },
            _count: {
                select: { orders: true }
            }
        }
    });

    return (
        <div className="min-h-screen bg-white p-8 pt-24">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900">Users Management</h1>
                        <p className="text-stone-500">View and manage customer accounts</p>
                    </div>
                    <Link
                        href="/admin"
                        className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-md transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="shadow-md border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-stone-500">Total Users</CardTitle>
                            <Users className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.length}</div>
                            <p className="text-xs text-muted-foreground">Registered customers</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card className="shadow-lg">
                    <CardHeader className="border-b bg-white">
                        <CardTitle>All Users</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white border-b text-stone-600 text-sm uppercase">
                                    <tr>
                                        <th className="py-4 px-6 text-left">Name</th>
                                        <th className="py-4 px-6 text-left">Email</th>
                                        <th className="py-4 px-6 text-left">Orders</th>
                                        <th className="py-4 px-6 text-left">Joined</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-medium">{user.name || "N/A"}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-stone-600">
                                                    <Mail className="w-4 h-4" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    {user._count.orders} orders
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-stone-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors text-sm"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {users.length === 0 && (
                            <div className="text-center py-12 text-stone-500">
                                No users found.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
