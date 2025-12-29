# 📊 Wedding Invitations Card Platform - Project Report

**Date**: December 24, 2025  
**Author**: Aung Kyaw Paing (AKP)  
**Status**: Active Development

---

## 1. Executive Summary

This project is a specialized e-commerce platform dedicated to **Custom Wedding Invitation Cards**. It bridges the gap between traditional invitation ordering and modern digital convenience. The platform offers a seamless experience for couples to customize, order, and track their invitations, while providing administrators with robust tools to manage the business, verify manual payments, and analyze sales performance.

## 2. Technical Architecture

The application is built on a modern, high-performance stack ensuring scalability, SEO optimization, and a premium user experience.

### **Frontend**
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Lucide React
- **Animations**: Framer Motion (for premium feel)
- **Charts**: Recharts (for admin analytics)

### **Backend**
- **Runtime**: Node.js (via Next.js API Routes & Server Actions)
- **Database**: PostgreSQL
- **ORM**: Prisma (Type-safe database access)
- **Authentication**: Custom JWT-based system (using `jose`, `bcryptjs`, `js-cookie`)

### **Infrastructure**
- **Image Storage**: Cloudinary (for product images and payment slips)
- **Hosting**: Vercel (Recommended)

---

## 3. Key Features

### 🛍️ Customer Experience
1.  **Immersive Catalog**: efficient browsing of collections (Traditional, Modern, Floral, Luxury).
2.  **Live Customization**: Real-time preview of changes to bride/groom names, dates, and venue details.
3.  **Manual Payment System**: Users upload payment slips (bank transfer/mobile banking), catering to local payment preferences.
4.  **Order Tracking**:
    -   **Visual Timeline**: A progress bar showing status: *Placed → Verified → Printing → Shipped → Delivered*.
    -   Real-time status updates from the admin.
5.  **Multilingual Support**: Built-in support for multiple languages (English & Burmese) to cater to diverse customer bases.

### 🛡️ Admin Dashboard
1.  **Command Center**: A secure dashboard displaying key metrics:
    -   Total Revenue
    -   Pending Orders
    -   Active Customers
2.  **Data Visualization**:
    -   **Revenue Trend**: Bar charts showing sales over the last 7 days.
    -   **Order Status Distribution**: Pie/Bar charts for quick operational insight.
3.  **Order Management**:
    -   **Payment Verification**: Review uploaded slips and Approve/Reject payments.
    -   **Workflow Control**: Update order statuses (e.g., move from "Paid" to "Printing").
4.  **Product Management**: Full CRUD capabilities for adding new card designs, setting prices, and managing inventory.

---

## 4. Recent Developments & Milestones

The team has successfully implemented several critical features in the recent sprint:

-   **✅ Visual Order Tracking**: Implemented a customer-facing timeline component to transparently show order progress.
-   **✅ Admin Analytics**: Integrated `Recharts` to provide visual sales data and order status breakdowns in the admin dashboard.
-   **✅ Component Fixes**: Resolved hydration and structural issues in the `PostCard` logic and restored Tailwind CSS functionality.
-   **✅ Documentation**: Established comprehensive guides for *Deployment*, *Security*, and *Multilingual Support*.

## 5. Upcoming Roadmap

1.  **Invoice Generation**: Auto-generate PDF invoices using `html2pdf.js` for customers.
2.  **Email Notifications**: Automated emails for undefined order status changes (e.g., "Your order is now printing!").
3.  **Advanced Customization**: Allow users to upload their own photos for specific card designs.
4.  **Security Audit**: Final security review before production deployment (referencing `SECURITY.md`).

---

## 6. Access & Resources

-   **Main Site**: `http://localhost:3000`
-   **Admin Login**: `http://localhost:3000/admin/login`
-   **Setup Guide**: `ADMIN_README.md`
-   **Language Guide**: `MULTILINGUAL_GUIDE.md`

---

