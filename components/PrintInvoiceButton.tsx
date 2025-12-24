"use client";

import { Printer } from "lucide-react";
import { motion } from "framer-motion";

export default function PrintInvoiceButton() {
    return (
        <motion.button
            onClick={() => window.print()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg hover:shadow-xl transition-all min-w-[180px] sm:min-w-[200px]"
        >
            <Printer className="w-5 h-5" />
            Print Invoice
        </motion.button>
    );
}

