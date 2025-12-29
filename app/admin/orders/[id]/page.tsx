import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, X, FileText } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

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
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin');
}

async function rejectPayment(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    await prisma.order.update({
        where: { id: orderId },
        data: { status: "PENDING_PAYMENT", paymentStatus: "REJECTED" }
    });
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin');
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await checkAuth();
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: { include: { product: true } },
            user: true
        }
    });

    if (!order) notFound();

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto px-6">
                <Link href="/admin" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-serif text-2xl">Order Details</CardTitle>
                                <p className="text-sm text-stone-500">ID: {order.id}</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-semibold text-stone-700">Customer Name</label>
                                        <p className="text-stone-900 mt-1">{order.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-stone-700">Email</label>
                                        <p className="text-stone-900 mt-1">{order.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-stone-700">Phone</label>
                                        <p className="text-stone-900 mt-1">{order.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-stone-700">Order Date</label>
                                        <p className="text-stone-900 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-stone-700">Delivery Address</label>
                                    <p className="text-stone-900 mt-1">{order.address}</p>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold mb-4">Order Items</h3>
                                    <div className="space-y-3">
                                        {order.items.map((item: any) => {
                                            const customization = JSON.parse(item.customization);
                                            return (
                                                <div key={item.id} className="bg-white border border-stone-200 p-4 rounded-lg">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="font-medium">{item.product.name}</span>
                                                        <span className="text-stone-600">Qty: {item.quantity}</span>
                                                    </div>

                                                    {/* Product Images Slider/Grid */}
                                                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                                        {(() => {
                                                            try {
                                                                // Try to parse as JSON array first
                                                                const images = JSON.parse(item.product.images);
                                                                if (Array.isArray(images) && images.length > 0) {
                                                                    return images.map((img: string, idx: number) => (
                                                                        <img
                                                                            key={idx}
                                                                            src={img}
                                                                            alt={`${item.product.name} ${idx + 1}`}
                                                                            className="w-16 h-16 object-cover rounded-md border border-stone-200 flex-shrink-0"
                                                                        />
                                                                    ));
                                                                }
                                                            } catch (e) {
                                                                // If JSON parsing fails, treat as single image URL
                                                                console.log('Image parsing error, treating as single URL');
                                                            }

                                                            // Fallback: treat as single string URL
                                                            if (item.product.images && item.product.images.trim()) {
                                                                return (
                                                                    <img
                                                                        src={item.product.images}
                                                                        alt={item.product.name}
                                                                        className="w-16 h-16 object-cover rounded-md border border-stone-200 flex-shrink-0"
                                                                    />
                                                                );
                                                            }

                                                            // No images available
                                                            return (
                                                                <div className="w-16 h-16 bg-stone-100 rounded-md border border-stone-200 flex items-center justify-center flex-shrink-0">
                                                                    <span className="text-xs text-stone-400">No image</span>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>

                                                    {/* Customization Template */}
                                                    {customization && Object.keys(customization).length > 0 && (
                                                        <div className="mt-4 bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border-2 border-amber-200">
                                                            <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                Customer Order Template
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                                {/* Wedding Invitation Fields */}
                                                                {customization.brideName && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                                                        <span className="font-semibold text-stone-700 block mb-1">👰 Bride Name:</span>
                                                                        <span className="text-stone-900 font-medium">{customization.brideName}</span>
                                                                    </div>
                                                                )}
                                                                {customization.groomName && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                                                        <span className="font-semibold text-stone-700 block mb-1">🤵 Groom Name:</span>
                                                                        <span className="text-stone-900 font-medium">{customization.groomName}</span>
                                                                    </div>
                                                                )}
                                                                {customization.weddingDate && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                                                        <span className="font-semibold text-stone-700 block mb-1">📅 Wedding Date:</span>
                                                                        <span className="text-stone-900">{new Date(customization.weddingDate).toLocaleDateString()}</span>
                                                                    </div>
                                                                )}
                                                                {customization.weddingTime && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                                                        <span className="font-semibold text-stone-700 block mb-1">🕐 Time:</span>
                                                                        <span className="text-stone-900">{customization.weddingTime}</span>
                                                                    </div>
                                                                )}
                                                                {customization.venue && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm md:col-span-2">
                                                                        <span className="font-semibold text-stone-700 block mb-1">📍 Venue:</span>
                                                                        <span className="text-stone-900">{customization.venue}</span>
                                                                    </div>
                                                                )}

                                                                {/* Cloth Printing Fields */}
                                                                {customization.garmentType && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                                                        <span className="font-semibold text-stone-700 block mb-1">👕 Garment Type:</span>
                                                                        <span className="text-stone-900">{customization.garmentType}</span>
                                                                    </div>
                                                                )}
                                                                {customization.size && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                                                        <span className="font-semibold text-stone-700 block mb-1">📏 Size:</span>
                                                                        <span className="text-stone-900">{customization.size}</span>
                                                                    </div>
                                                                )}
                                                                {customization.color && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                                                        <span className="font-semibold text-stone-700 block mb-1">🎨 Color:</span>
                                                                        <span className="text-stone-900">{customization.color}</span>
                                                                    </div>
                                                                )}

                                                                {/* Design/Style Fields */}
                                                                {customization.colorScheme && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                                                        <span className="font-semibold text-stone-700 block mb-1">🎨 Color Scheme:</span>
                                                                        <span className="text-stone-900">{customization.colorScheme}</span>
                                                                    </div>
                                                                )}
                                                                {customization.fontStyle && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                                                        <span className="font-semibold text-stone-700 block mb-1">✍️ Font Style:</span>
                                                                        <span className="text-stone-900">{customization.fontStyle}</span>
                                                                    </div>
                                                                )}

                                                                {/* Additional Info */}
                                                                {customization.additionalInfo && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm md:col-span-2">
                                                                        <span className="font-semibold text-stone-700 block mb-1">📝 Additional Info:</span>
                                                                        <p className="text-stone-800 whitespace-pre-wrap italic">{customization.additionalInfo}</p>
                                                                    </div>
                                                                )}
                                                                {customization.notes && (
                                                                    <div className="bg-white p-3 rounded-md shadow-sm md:col-span-2">
                                                                        <span className="font-semibold text-stone-700 block mb-1">💬 Customer Notes:</span>
                                                                        <p className="text-stone-800 whitespace-pre-wrap italic">{customization.notes}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Amount</span>
                                        <span className="text-green-700">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Status Panel */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-stone-700">Order Status</label>
                                    <div className="mt-2">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'PAYMENT_REVIEW' ? 'bg-amber-100 text-amber-800' :
                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-stone-100 text-stone-800'
                                            }`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {order.paymentSlipUrl && (
                                    <div>
                                        <label className="text-sm font-semibold text-stone-700 mb-2 block">Payment Slip</label>
                                        <a
                                            href={order.paymentSlipUrl}
                                            target="_blank"
                                            className="block"
                                        >
                                            <img
                                                src={order.paymentSlipUrl}
                                                alt="Payment Slip"
                                                className="w-full rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            />
                                        </a>
                                        <a
                                            href={order.paymentSlipUrl}
                                            target="_blank"
                                            className="text-blue-600 hover:underline text-sm mt-2 inline-flex items-center gap-1"
                                        >
                                            <FileText className="w-4 h-4" />
                                            View Full Size
                                        </a>
                                    </div>
                                )}

                                {order.status === 'PAYMENT_REVIEW' && (
                                    <div className="space-y-2 pt-4 border-t">
                                        <p className="text-sm text-stone-600 mb-3">Review the payment slip and take action:</p>
                                        <form action={approvePayment}>
                                            <input type="hidden" name="orderId" value={order.id} />
                                            <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                                                <Check className="w-4 h-4" />
                                                Approve Payment
                                            </Button>
                                        </form>
                                        <form action={rejectPayment}>
                                            <input type="hidden" name="orderId" value={order.id} />
                                            <Button variant="destructive" className="w-full gap-2">
                                                <X className="w-4 h-4" />
                                                Reject Payment
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
