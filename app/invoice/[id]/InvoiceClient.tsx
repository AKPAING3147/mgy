"use client";

import { motion } from "framer-motion";
import PrintInvoiceButton from "@/components/PrintInvoiceButton";
import { FileText, Download, Phone, Mail, MapPin, Calendar, Hash } from "lucide-react";

interface OrderItem {
    id: string;
    quantity: number;
    customization: string;
    product: {
        id: string;
        name: string;
        price: number;
        category: string;
        images: string;
        createdAt: string;
    };
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
    items: OrderItem[];
}

export default function InvoiceClient({ order }: { order: Order }) {
    const createdDate = new Date(order.createdAt);

    const handleDownload = async () => {
        const element = document.getElementById('invoice-content');
        if (!element) return;

        const opt = {
            margin: 10,
            filename: `invoice-${order.id}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        try {
            // @ts-ignore
            const html2pdf = (await import('html2pdf.js')).default;
            html2pdf().from(element).set(opt).save();
        } catch (error) {
            console.error("PDF download failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 sm:p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                {/* Invoice Card */}
                <div id="invoice-content" className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border overflow-hidden print:shadow-none print:border-0 print:rounded-none">

                    {/* Header Gradient Bar */}
                    <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent print:hidden" />

                    {/* Main Content */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12">

                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-border">
                            {/* Logo & Invoice Info */}
                            <div className="w-full sm:w-auto">
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src="/logo.jpg"
                                        alt="Logo"
                                        className="h-16 sm:h-20 w-auto object-contain rounded-lg shadow-md"
                                    />
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="h-6 w-6 text-primary" />
                                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                                        INVOICE
                                    </h1>
                                </div>
                                <div className="space-y-1.5 text-muted-foreground text-sm sm:text-base">
                                    <p className="flex items-center gap-2">
                                        <Hash className="h-4 w-4" />
                                        <span>Invoice #: </span>
                                        <span className="font-mono font-semibold text-foreground">
                                            {order.id.slice(0, 8).toUpperCase()}
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Date: </span>
                                        <span className="font-medium text-foreground">
                                            {createdDate.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="text-left sm:text-right w-full sm:w-auto bg-muted/50 rounded-xl p-4 sm:p-5">
                                <h2 className="font-bold text-lg sm:text-xl text-primary mb-2">MGY OFFSET</h2>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>မြို့.ဂုဏ်ရောင်ပုံနှိပ်တိုက်လမ်း၊</p>
                                    <p>မတော်လမ်း၊ မီးပွိုင့် အနီး၊</p>
                                    <p>ဆုံကုန်းရပ်၊တံတားဦးမြို့။</p>
                                    <div className="flex items-center gap-2 mt-3 text-foreground font-medium">
                                        <Phone className="h-4 w-4 text-primary" />
                                        <span>09 797 436 123</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground font-medium">
                                        <Phone className="h-4 w-4 text-primary" />
                                        <span>09 797 436 124</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bill To & Total Section */}
                        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8 sm:mb-12">
                            {/* Bill To */}
                            <div className="flex-1">
                                <h3 className="font-bold text-muted-foreground text-xs uppercase tracking-wider mb-3">
                                    Bill To
                                </h3>
                                <div className="bg-muted/30 rounded-xl p-4">
                                    <p className="font-bold text-lg text-foreground mb-2">{order.fullName}</p>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4 text-primary/70" />
                                            {order.email}
                                        </p>
                                        <p className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4 text-primary/70" />
                                            {order.phone}
                                        </p>
                                        <p className="flex items-start gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4 text-primary/70 mt-0.5 shrink-0" />
                                            <span className="break-words">{order.address}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Amount */}
                            <div className="sm:text-right">
                                <h3 className="font-bold text-muted-foreground text-xs uppercase tracking-wider mb-3">
                                    Total Amount
                                </h3>
                                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 sm:p-5 inline-block sm:text-right">
                                    <p className="text-3xl sm:text-4xl font-bold text-primary">
                                        ${order.totalAmount.toFixed(2)}
                                    </p>
                                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'APPROVED'
                                        ? 'bg-green-500/20 text-green-600'
                                        : 'bg-yellow-500/20 text-yellow-600'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Items Table - Desktop */}
                        <div className="hidden sm:block mb-8 sm:mb-12">
                            <div className="overflow-x-auto rounded-xl border border-border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted/50 text-muted-foreground text-sm uppercase">
                                            <th className="text-left p-4 font-semibold">Item</th>
                                            <th className="text-center p-4 font-semibold">Qty</th>
                                            <th className="text-right p-4 font-semibold">Price</th>
                                            <th className="text-right p-4 font-semibold">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, index) => (
                                            <motion.tr
                                                key={item.id}
                                                className="border-t border-border hover:bg-muted/30 transition-colors"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <td className="p-4">
                                                    <div className="font-medium text-foreground">{item.product.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">{item.product.category}</div>
                                                </td>
                                                <td className="text-center p-4 text-foreground">{item.quantity}</td>
                                                <td className="text-right p-4 text-muted-foreground">${item.product.price.toFixed(2)}</td>
                                                <td className="text-right p-4 font-medium text-foreground">
                                                    ${(item.quantity * item.product.price).toFixed(2)}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Items Cards - Mobile */}
                        <div className="sm:hidden mb-8 space-y-3">
                            <h3 className="font-bold text-muted-foreground text-xs uppercase tracking-wider mb-3">
                                Order Items
                            </h3>
                            {order.items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="bg-muted/30 rounded-xl p-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium text-foreground">{item.product.name}</h4>
                                            <p className="text-xs text-muted-foreground">{item.product.category}</p>
                                        </div>
                                        <span className="font-bold text-primary">
                                            ${(item.quantity * item.product.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Qty: {item.quantity}</span>
                                        <span>${item.product.price.toFixed(2)} each</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="flex justify-end border-t border-border pt-6 sm:pt-8">
                            <div className="w-full sm:w-72 space-y-3">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Tax (0%)</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg sm:text-xl text-foreground border-t border-border pt-3 mt-2">
                                    <span>Total</span>
                                    <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Notes */}
                        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border text-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <p className="text-muted-foreground mb-1 text-sm sm:text-base">
                                    ✨ Thank you for your business! ✨
                                </p>
                                <p className="text-muted-foreground text-xs sm:text-sm">
                                    For inquiries, please contact us at the phone numbers above.
                                </p>
                            </motion.div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center gap-3 print:hidden">
                            <PrintInvoiceButton />
                            <motion.button
                                onClick={handleDownload}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                            >
                                <Download className="h-5 w-5" />
                                Download PDF
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Watermark */}
                <p className="text-center text-muted-foreground text-xs mt-6 print:hidden">
                    MGY OFFSET © {new Date().getFullYear()} • Premium Printing Services
                </p>
            </motion.div>
        </div>
    );
}
