"use client";

import { motion } from "framer-motion";
import { Printer, PenTool, Truck, Palette } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ServicesSection() {
    const { t } = useLanguage();

    const services = [
        {
            icon: <Printer className="w-8 h-8" />,
            title: t("service_offset_title"),
            description: t("service_offset_desc"),
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: <PenTool className="w-8 h-8" />,
            title: t("service_design_title"),
            description: t("service_design_desc"),
            color: "bg-purple-50 text-purple-600"
        },
        {
            icon: <Palette className="w-8 h-8" />,
            title: t("service_finish_title"),
            description: t("service_finish_desc"),
            color: "bg-amber-50 text-amber-600"
        },
        {
            icon: <Truck className="w-8 h-8" />,
            title: t("service_delivery_title"),
            description: t("service_delivery_desc"),
            color: "bg-green-50 text-green-600"
        }
    ];

    return (
        <section className="py-20 bg-stone-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif text-4xl md:text-5xl mb-4 text-stone-900">
                        {t("services_title")}
                    </h2>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-primary/30"></div>
                        <div className="w-2 h-2 rounded-full bg-primary/50" />
                        <div className="h-px w-12 bg-primary/30"></div>
                    </div>
                    <p className="text-stone-600 max-w-2xl mx-auto">
                        {t("services_desc")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-stone-100/50"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${service.color}`}>
                                {service.icon}
                            </div>
                            <h3 className="font-serif text-xl text-stone-900 mb-3">
                                {service.title}
                            </h3>
                            <p className="text-stone-500 text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
