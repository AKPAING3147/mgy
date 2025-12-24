"use client";

import { CheckCircle, Clock, Package, Printer, Truck } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineStep {
    status: string;
    label: string;
    icon: React.ElementType;
}

const steps: TimelineStep[] = [
    { status: "PENDING_PAYMENT", label: "Order Placed", icon: Clock },
    { status: "APPROVED", label: "Payment Verified", icon: CheckCircle },
    { status: "PRINTING", label: "Printing", icon: Printer },
    { status: "SHIPPED", label: "Shipped", icon: Truck },
    { status: "COMPLETED", label: "Delivered", icon: Package },
];

export default function OrderTimeline({ status }: { status: string }) {
    // Determine active index based on status
    const getCurrentStepIndex = (status: string) => {
        switch (status) {
            case "PENDING_PAYMENT":
            case "PAYMENT_REVIEW":
                return 0;
            case "APPROVED":
                return 1;
            case "PRINTING":
                return 2;
            case "SHIPPED":
                return 3;
            case "COMPLETED":
                return 4;
            default:
                return 0;
        }
    };

    const activeIndex = getCurrentStepIndex(status);

    return (
        <div className="w-full py-6">
            <div className="relative flex items-center justify-between w-full">
                {/* Connecting Line - Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>

                {/* Connecting Line - Progress */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0"
                />

                {/* Steps */}
                {steps.map((step, index) => {
                    const isActive = index <= activeIndex;
                    const isCurrent = index === activeIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.status} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                                    w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                    ${isActive
                                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                                        : "bg-white border-gray-200 text-gray-400"}
                                    ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}
                                `}
                            >
                                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className={`
                                    absolute top-14 w-24 text-center text-xs md:text-sm font-medium transition-colors duration-300
                                    ${isActive ? "text-primary font-bold" : "text-muted-foreground"}
                                `}
                            >
                                {step.label}
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {/* Spacing for labels */}
            <div className="h-12"></div>
        </div>
    );
}
