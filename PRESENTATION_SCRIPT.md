# 🎤 Project Presentation Script
## "MGY OFFSET - Wedding Invitation E-Commerce System"
### Presented by: Aung Kyaw Paing

---

## 📌 INTRODUCTION (1-2 minutes)

> "Good morning/afternoon Professor. Today I would like to present my full-stack web development project called **MGY OFFSET** - a Wedding Invitation E-Commerce System."

> "This is a real-world business application designed for a printing company that sells custom wedding invitation cards online."

---

## 🎯 PROBLEM STATEMENT (1 minute)

> "The problem I identified is that traditional printing businesses struggle to sell customized products online. Customers need to:
> - Browse different invitation designs
> - Customize their cards with personal details (names, dates, venues)
> - Make payments through bank transfer
> - And track their order status"

> "For the business owner, they need to:
> - Manage products easily
> - Verify payment slips uploaded by customers
> - Track and update order statuses"

---

## ✅ SOLUTION OVERVIEW (2 minutes)

> "My solution is a full-stack web application with TWO main interfaces:"

### 1. Customer Side:
> - **Product Catalog**: Browse wedding invitation cards by categories (Traditional, Modern, Floral, Minimal, Luxury)
> - **Customization System**: Customers can enter bride & groom names, wedding date, venue, and custom messages
> - **Shopping Cart & Checkout**: Add items to cart and complete orders
> - **Payment Slip Upload**: Upload bank transfer receipts (since this is for Myanmar market, we use manual payment verification)
> - **Order Tracking**: Customers can track their order status with a visual timeline

### 2. Admin Side:
> - **Secure Login**: Protected with JWT authentication and rate limiting
> - **Dashboard**: View total revenue, orders, customers with visual charts
> - **Product Management**: Add, edit, or delete products
> - **Order Management**: View orders, verify payment slips, approve/reject payments
> - **Order Status Updates**: Update status from Pending → Approved → Printing → Shipped → Delivered

---

## 🛠️ TECHNOLOGY STACK (1-2 minutes)

> "For this project, I used modern web technologies:"

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (React Framework with App Router) |
| **Styling** | Tailwind CSS + Shadcn UI Components |
| **Backend** | Next.js API Routes (Server-side) |
| **Database** | SQLite with Prisma ORM |
| **Authentication** | JWT (JSON Web Tokens) with bcrypt password hashing |
| **Image Upload** | Cloudinary (cloud-based image storage) |
| **Animation** | Framer Motion |
| **Charts** | Recharts library |

> "I chose Next.js because it provides both frontend and backend in one framework, making it efficient for full-stack development."

---

## 🗄️ DATABASE DESIGN (1 minute)

> "My database has 4 main models:"

1. **User** - Stores customer and admin accounts
   - Email, password (hashed), name, role (USER/ADMIN)

2. **Product** - Wedding invitation card products
   - Name, description, price, category, images, minimum quantity

3. **Order** - Customer orders
   - Total amount, status, payment slip URL, customer details

4. **OrderItem** - Individual items in an order
   - Links to Product, quantity, customization data (JSON)

---

## 🔐 SECURITY FEATURES (1 minute)

> "Security was a priority in this project. I implemented:"

1. **Password Hashing** - Using bcrypt (passwords are never stored in plain text)
2. **JWT Authentication** - Secure token-based admin sessions
3. **Rate Limiting** - Prevents brute force attacks (5 login attempts per 15 minutes)
4. **Protected Routes** - Middleware checks authentication for all admin pages
5. **Security Headers** - XSS protection, content security policy, etc.
6. **Input Validation** - Using Zod library to validate all user inputs

---

## 🖥️ LIVE DEMO (3-5 minutes)

> "Now let me show you the application..."

### Demo Flow:

1. **Homepage** → Show product catalog
2. **Product Details** → Show customization form
3. **Cart** → Show shopping cart
4. **Checkout** → Complete an order
5. **Order Tracking** → Show visual timeline
6. **Admin Login** → http://localhost:3000/admin/login
   - Email: `admin@eternity.com`
   - Password: `admin123`
7. **Admin Dashboard** → Show statistics and charts
8. **Order Management** → Show payment verification flow
9. **Product Management** → Add a new product

---

## 📊 KEY FEATURES HIGHLIGHT

### 1. Order Timeline Visualization
> "Customers can track their order with a visual progress bar showing: Order Placed → Payment Verified → Printing → Shipped → Delivered"

### 2. Admin Dashboard Charts
> "The admin dashboard includes visual charts showing revenue trends and order status distribution"

### 3. Responsive Design
> "The application is fully responsive and works on mobile, tablet, and desktop devices"

---

## 🚀 DEPLOYMENT

> "The application can be deployed on Vercel for free, connecting to a cloud database like Supabase or Neon for PostgreSQL."

---

## 📈 FUTURE IMPROVEMENTS

> "If I had more time, I would add:"
> - Online payment gateway (KBZPay, WavePay integration)
> - Email/SMS notifications
> - Invoice PDF generation
> - Multi-language support (Myanmar, English)

---

## 🎬 CONCLUSION (30 seconds)

> "In conclusion, this project demonstrates my skills in:
> - Full-stack web development
> - Database design and management
> - User authentication and security
> - API development
> - UI/UX design
> - Real-world business problem solving"

> "Thank you for your attention. I'm happy to answer any questions."

---

## ❓ POSSIBLE QUESTIONS & ANSWERS

**Q: Why did you use manual payment instead of a payment gateway?**
> A: In Myanmar, many customers prefer bank transfer, and payment gateway integration requires business registration. Manual verification is common for small businesses.

**Q: Why SQLite instead of PostgreSQL?**
> A: SQLite is simpler for development and demonstration. In production, we can easily switch to PostgreSQL by just changing the database URL in the environment variables.

**Q: How does the customization work?**
> A: Customization data is stored as a JSON string in the OrderItem table. This allows flexible customization without changing the database schema.

**Q: How do you handle image uploads?**
> A: Images are uploaded to Cloudinary, which returns a secure URL that we store in the database. This keeps our server lightweight and images load faster from CDN.

---

## 📝 QUICK REFERENCE

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Homepage |
| http://localhost:3000/admin/setup | Create admin account |
| http://localhost:3000/admin/login | Admin login |
| http://localhost:3000/admin | Admin dashboard |
| http://localhost:3000/admin/products/new | Add new product |
| http://localhost:3000/track-order | Order tracking |

**Admin Credentials:**
- Email: `admin@eternity.com`
- Password: `admin123`

---

*Good luck with your presentation! 🎉*
