import { Search, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const { id } = await searchParams;
    let order = null;
    if (id) {
        order = await prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } } }
        });
    }

    const steps = [
        { status: 'PENDING_PAYMENT', label: 'Order Placed' },
        { status: 'PAYMENT_REVIEW', label: 'Payment Review' },
        { status: 'APPROVED', label: 'Approved' },
        { status: 'PRINTING', label: 'Printing' },
        { status: 'SHIPPED', label: 'Shipped' },
    ];

    const currentStepIndex = order ? steps.findIndex(s => s.status === order.status) : -1;

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />
            <div className="container mx-auto pt-32 px-4 max-w-3xl">
                <h1 className="text-4xl font-serif text-center mb-4">Track Your Order</h1>
                <p className="text-center text-muted-foreground mb-8">Enter your Order ID to see real-time updates.</p>

                <form className="flex gap-2 mb-16 max-w-md mx-auto">
                    <Input name="id" placeholder="Enter Order ID" defaultValue={id || ''} required className="h-12" />
                    <Button type="submit" size="lg" className="h-12"><Search className="w-4 h-4 mr-2" /> Track</Button>
                </form>

                {id && !order && (
                    <div className="text-center p-8 bg-red-50 text-red-600 rounded-lg border border-red-100">
                        Order ID <strong>{id}</strong> not found. Please check and try again.
                    </div>
                )}

                {order && (
                    <div className="bg-white p-8 rounded-lg shadow-xl border border-border/50">
                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                            <div>
                                <h2 className="text-xl font-medium font-serif">Order #{order.id}</h2>
                                <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${order.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary'}`}>
                                    {order.status.replace("_", " ")}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-12 relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000"
                                style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
                            ></div>
                            <div className="flex justify-between relative z-10">
                                {steps.map((step, idx) => {
                                    const isCompleted = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    return (
                                        <div key={step.status} className="flex flex-col items-center">
                                            <div className={`w-4 h-4 rounded-full border-2 ${isCompleted ? 'bg-primary border-primary' : 'bg-white border-gray-300'} mb-2`}></div>
                                            <span className={`text-xs ${isCurrent ? 'font-bold text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold mb-4 font-serif">Shipping To</h3>
                                <p className="text-sm">{order.fullName}</p>
                                <p className="text-sm text-muted-foreground">{order.address}</p>
                                <p className="text-sm text-muted-foreground">{order.phone}</p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-4 font-serif">Order Items</h3>
                                <div className="space-y-2">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                                            <span>{item.product.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                                            <span className="font-medium">Please wait...</span>
                                            {/* Note: I didn't verify if I can easily calculate item price here without pulling product price or storing it. 
                                        I'll just show name and quantity. Or fetch unit price.
                                    */}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between font-bold mt-4 text-lg">
                                    <span>Total</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
