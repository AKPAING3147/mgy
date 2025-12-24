"use server";

import { prisma } from "@/lib/prisma";

export interface DashboardStats {
    totalRevenue: number;
    ordersCount: number;
    statusDistribution: { name: string; value: number; color: string }[];
    recentSales: { date: string; amount: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
    // 1. Total Revenue (Completed orders only)
    const revenueResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: "COMPLETED" }
    });
    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // 2. Total Orders Count
    const ordersCount = await prisma.order.count({
        where: { status: { not: "DELETED" } }
    });

    // 3. Status Distribution (Pie Chart Data)
    const statusGroups = await prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
        where: { status: { not: "DELETED" } }
    });

    const statusColors: Record<string, string> = {
        PENDING_PAYMENT: "#EAB308", // Yellow
        PAYMENT_REVIEW: "#3B82F6", // Blue
        APPROVED: "#22C55E", // Green
        PRINTING: "#A855F7", // Purple
        SHIPPED: "#F97316", // Orange
        COMPLETED: "#10B981", // Emerald
        CANCELLED: "#EF4444", // Red
    };

    const statusDistribution = statusGroups.map(group => ({
        name: group.status.replace("_", " "),
        value: group._count.status,
        color: statusColors[group.status] || "#9CA3AF"
    }));

    // 4. Recent Sales (Last 7 Days) - Line Chart Data
    // Since we can't easily do date truncation in broad SQL via Prisma,
    // we'll fetch the last 7 days of completed orders and group them in JS.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await prisma.order.findMany({
        where: {
            status: { in: ["COMPLETED", "APPROVED", "PRINTING", "SHIPPED"] }, // Count all confirmed revenue
            createdAt: { gte: sevenDaysAgo }
        },
        select: { createdAt: true, totalAmount: true }
    });

    // Group by Date (YYYY-MM-DD)
    const salesMap = new Map<string, number>();

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        salesMap.set(dateStr, 0);
    }

    recentOrders.forEach(order => {
        const dateStr = order.createdAt.toISOString().split('T')[0];
        if (salesMap.has(dateStr)) {
            salesMap.set(dateStr, (salesMap.get(dateStr) || 0) + order.totalAmount);
        }
    });

    const recentSales = Array.from(salesMap.entries()).map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount
    }));

    return {
        totalRevenue,
        ordersCount,
        statusDistribution,
        recentSales
    };
}
