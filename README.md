# 💍 Wedding Invitation E-Commerce Website

A full-stack e-commerce web application for selling **custom wedding invitation cards**, featuring **user customization**, **manual payment via slip upload**, and an **admin dashboard for verification and order management**.

---

## ✨ Features

### 👰 User Side

* Browse wedding invitation card collections
* Categories: Traditional, Modern, Floral, Minimal, Luxury
* Customize invitation details:

  * Bride & Groom names
  * Wedding date & time
  * Venue
  * Language & custom message
  * Quantity, size, paper type
* Live invitation preview
* Add to cart & checkout
* Upload payment slip (bank transfer / mobile banking)
* Track order & payment status

### 🧑‍💼 Admin Side

* Secure admin login
* Dashboard overview (orders & payments)
* Manage products (add / edit / delete)
* View full user customization data
* View & verify uploaded payment slips
* Approve or reject payments with notes
* Update order status (Paid, Processing, Printing, Shipped)

---

## 💳 Payment System

* Manual payment (no payment gateway)
* Users upload **payment slip images** (JPG / PNG)
* Admin verifies payment before order processing

---

## 🛠️ Tech Stack

**Frontend**

* Next.js (App Router)
* Tailwind CSS
* Shadcn UI

**Backend**

* Next.js API Routes
* Prisma ORM

**Database**

* PostgreSQL

**Authentication**

* JWT / NextAuth

**Image Upload**

* Cloudinary / S3 (recommended)

**Deployment**

* Vercel

---

## 📁 Project Structure

```
app/
 ├─ (auth)/
 ├─ (shop)/
 ├─ cart/
 ├─ checkout/
 ├─ payment/
 ├─ orders/
 ├─ admin/
 ├─ api/
 └─ layout.tsx

components/
lib/
prisma/
public/
styles/
```

---

## 🧩 Database Models (Overview)

* **User** – customer & admin roles
* **Order** – order details & customization data
* **Payment** – payment slip & verification status

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
NEXTAUTH_SECRET=your_secret
```

### 4️⃣ Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### 5️⃣ Run the App

```bash
npm run dev
```

---

## 🔐 Admin Access

* Admin users have role `ADMIN`
* Admin routes are protected via middleware

---

## 📦 Deployment

Deploy easily using **Vercel**:

1. Push project to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy 🎉

---

## 🧠 Future Improvements

* Online payment gateway integration
* Email notifications
* Order invoice PDF download
* Multi-language support

---

## 👤 Author

**Aung Kyaw Paing (AKP)**

---

## 📄 License

This project is licensed under the MIT License.
