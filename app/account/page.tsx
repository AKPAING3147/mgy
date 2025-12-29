
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/security";
import Link from "next/link";
import { LogOut, Package, User as UserIcon, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
            orders: {
                orderBy: { createdAt: "desc" },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });

    return user;
}

export default async function AccountPage() {
    const user = await getUser();

    if (!user) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar / User Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                                <UserIcon className="w-10 h-10 text-stone-400" />
                            </div>
                            <h1 className="font-serif text-xl font-bold text-stone-900 mb-1">{user.name || "Valued Customer"}</h1>
                            <p className="text-stone-500 text-sm mb-6">{user.email}</p>

                            <div className="w-full border-t border-stone-100 pt-4 mt-2">
                                <form action={async () => {
                                    "use server";
                                    const cookieStore = await cookies();
                                    cookieStore.delete("auth_token");
                                    redirect("/");
                                }}>
                                    <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 gap-2">
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Main Content / Orders */}
                    <div className="lg:col-span-3">
                        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                            <Package className="w-6 h-6" />
                            Order History
                        </h2>

                        {user.orders.length === 0 ? (
                            <div className="bg-white p-12 rounded-xl shadow-sm border border-stone-100 text-center">
                                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-8 h-8 text-stone-300" />
                                </div>
                                <h3 className="text-lg font-medium text-stone-900 mb-2">No orders yet</h3>
                                <p className="text-stone-500 mb-6">You haven't placed any orders yet. Start exploring our collection!</p>
                                <Link href="/collections">
                                    <Button>Browse Collections</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {user.orders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                                        <div className="p-4 bg-stone-50 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                                <div>
                                                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Order ID</p>
                                                    <p className="text-sm font-medium font-mono text-stone-900">#{order.id.slice(-8)}</p>
                                                </div>
                                                <div className="hidden sm:block w-px h-8 bg-stone-200" />
                                                <div>
                                                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Date</p>
                                                    <p className="text-sm text-stone-700 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="hidden sm:block w-px h-8 bg-stone-200" />
                                                <div>
                                                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Status</p>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${order.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'PRINTING' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-stone-100 text-stone-800'
                                                        }`}>
                                                        {order.status.replace(/_/g, " ")}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total</p>
                                                <p className="text-lg font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-6">
                                            <div className="space-y-4">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex gap-4 items-start">
                                                        <div className="w-16 h-16 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            {/* Try to parse first image with better error handling */}
                                                            {(() => {
                                                                try {
                                                                    const imgs = JSON.parse(item.product.images);
                                                                    const imgSrc = Array.isArray(imgs) ? imgs[0] : item.product.images;
                                                                    if (imgSrc) {
                                                                        return (
                                                                            <img
                                                                                src={imgSrc}
                                                                                alt={item.product.name}
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => {
                                                                                    (e.target as HTMLImageElement).src = '/placeholder.png';
                                                                                }}
                                                                            />
                                                                        );
                                                                    }
                                                                } catch {
                                                                    // Fallback to string URL if JSON parse fails
                                                                    if (item.product.images) {
                                                                        return (
                                                                            <img
                                                                                src={item.product.images}
                                                                                alt={item.product.name}
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => {
                                                                                    (e.target as HTMLImageElement).src = '/placeholder.png';
                                                                                }}
                                                                            />
                                                                        );
                                                                    }
                                                                }
                                                                // No image available
                                                                return (
                                                                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                                        <Package className="w-6 h-6" />
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-stone-900 truncate">{item.product.name}</h4>
                                                            <p className="text-sm text-stone-500 mb-1">{item.product.category} • Qty: {item.quantity}</p>
                                                            {/* Parse customization basic info if possible */}
                                                            {(() => {
                                                                try {
                                                                    const cust = JSON.parse(item.customization);
                                                                    return (
                                                                        <div className="text-xs text-stone-500 bg-stone-50 p-2 rounded inline-block">
                                                                            {cust.brideName} & {cust.groomName}
                                                                        </div>
                                                                    );
                                                                } catch { return null; }
                                                            })()}
                                                        </div>
                                                        <p className="font-medium text-stone-900">${(item.quantity * item.product.price).toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-stone-100 flex justify-between items-center">
                                                <div className="text-sm text-stone-500 flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="truncate max-w-[200px] sm:max-w-xs">{order.address}</span>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/track-order?orderId=${order.id}`}>
                                                        Track Status
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
