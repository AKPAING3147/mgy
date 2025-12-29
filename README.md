# MGY OFFSET - Wedding Invitations & Cloth Printing E-Commerce Platform

A modern, full-stack e-commerce platform for custom wedding invitations and cloth printing services. Built with Next.js, featuring AI-powered template generation, secure payment processing, and comprehensive admin management.

## 🌟 Key Features

### 🛍️ Customer Features
- **Product Browsing** - View wedding invitations and cloth printing products
- **Custom Design Editor** - Real-time customization with live preview
  - Wedding invitations: Bride/Groom names, dates, venue, messages
  - Cloth printing: Choose garment type, size, color, upload designs
- **AI Template Generation** - Powered by Google Gemini AI for automatic design suggestions
- **Shopping Cart** - Add multiple products with different customizations
- **Secure Checkout** - Multiple payment options
  - Payment slip upload
  - Cash on Delivery (COD)
- **Order Tracking** - Real-time order status updates
- **User Accounts** - Save orders, track history, manage profile
- **Multi-language Support** - English and Myanmar (Burmese)

### 🔐 Admin Panel
- **Dashboard Analytics** - Real-time sales, revenue, and order statistics
- **Product Management** - CRUD operations for products
  - Add new wedding invitation templates
  - Add cloth printing products
  - Upload product images
  - Set pricing, stock, minimum quantities
- **Order Management** - Complete order workflow
  - Review payment slips
  - Approve/reject payments
  - Update order status (Pending → Payment Review → Approved → Printing → Shipped → Completed)
  - Delete orders with protection system
- **Customer Management** - View and manage user accounts
- **Template System** - Pre-designed templates for quick product creation
- **Security Features**
  - Rate limiting (login attempts, API requests)
  - JWT authentication
  - Session management
  - Admin-only route protection

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TypeScript
- **Styling**: TailwindCSS 3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **UI Components**: Radix UI, shadcn/ui

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Authentication**: NextAuth.js with JWT (jose)
- **Password Hashing**: bcryptjs

### AI & Services
- **AI**: Google Gemini AI (Template Generation)
- **Image Storage**: Cloudinary (optional)
- **Deployment**: Vercel

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint
- **Package Manager**: npm

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- Google Gemini API key

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AKPAING3147/mgy.git
   cd wedding-invitations
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in the values:

   ```env
   # Database (PostgreSQL required)
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

   # Authentication
   NEXTAUTH_SECRET="your-random-secret-key-minimum-32-characters"
   NEXTAUTH_URL="http://localhost:3000"

   # Google Gemini AI
   GEMINI_API_KEY="your-gemini-api-key"

   # Cloudinary (Optional)
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Generate secrets**
   ```bash
   # Generate NEXTAUTH_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

5. **Set up the database**
   ```bash
   # Run migrations
   npx prisma migrate dev

   # Generate Prisma client
   npx prisma generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**: `http://localhost:3000`

## 🚀 Deployment (Vercel)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Import your repository
5. Configure settings (Next.js auto-detected)

### Step 3: Set Up Production Database

Choose one option:

#### Option A: Vercel Postgres (Recommended)
1. Vercel Dashboard → **Storage** → **Create Database**
2. Select **Postgres**
3. Copy `POSTGRES_PRISMA_URL` from `.env.local` tab
4. Use as `DATABASE_URL` in environment variables

#### Option B: Neon (Free PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Format: `postgresql://user:pass@host/db?sslmode=require`

#### Option C: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a project
3. Settings → Database → Connection String → URI
4. Copy and use as `DATABASE_URL`

### Step 4: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable Name | Value | Required |
|--------------|-------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `NEXTAUTH_SECRET` | Random 32+ character string | ✅ Yes |
| `NEXTAUTH_URL` | Your Vercel URL | ✅ Yes |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ❌ Optional |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ❌ Optional |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ❌ Optional |

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for build completion
3. After successful deployment:
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Go to Settings → Environment Variables
   - Update `NEXTAUTH_URL` to your Vercel URL
   - Redeploy

## 🔑 Admin Account Setup

After deployment, create your first admin account:

1. Navigate to `/admin/setup`
2. Fill in the form:
   - **Email**: Your admin email
   - **Password**: Strong password (min 8 characters)
   - **Name**: Your name
3. Click **"Create Admin Account"**
4. Login at `/admin/login`

**Security Note**: The `/admin/setup` route is automatically disabled after first use for security.

## 📁 Project Structure

```
wedding-invitations/
├── app/                          # Next.js App Router
│   ├── admin/                   # Admin panel pages
│   │   ├── login/              # Admin login
│   │   ├── setup/              # Admin setup
│   │   ├── products/           # Product management
│   │   ├── users/              # User management
│   │   └── page.tsx            # Admin dashboard
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── orders/             # Order management
│   │   ├── products/           # Product CRUD
│   │   ├── upload/             # Image upload
│   │   └── generate-template/  # AI template generation
│   ├── auth/                    # User authentication pages
│   ├── checkout/                # Checkout page
│   ├── collections/             # Products listing
│   ├── contact/                 # Contact page
│   ├── product/[id]/           # Product detail page
│   ├── track-order/            # Order tracking
│   └── page.tsx                # Homepage
├── components/                  # React components
│   ├── admin/                  # Admin-specific components
│   ├── ui/                     # Reusable UI components
│   ├── Navbar.tsx              # Navigation bar
│   ├── ProductsGrid.tsx        # Product grid
│   └── ...
├── contexts/                    # React Context providers
│   └── LanguageContext.tsx     # Multi-language support
├── lib/                         # Utility functions
│   ├── prisma.ts               # Prisma client
│   ├── actions.ts              # Server actions
│   └── translations.ts         # Language translations
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/                      # Static assets
│   ├── logo.jpg                # Site logo
│   └── ...
├── middleware.ts                # Next.js middleware (auth, rate limiting)
├── .env                         # Environment variables (not committed)
├── .env.example                 # Environment template
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 📚 Database Schema

### Models

- **User** - Customer and admin accounts
- **Product** - Wedding invitations and cloth printing products
- **Order** - Customer orders with payment and shipping details
- **OrderItem** - Individual items in an order with customization data

### Relationships

```
User (1) ──── (N) Order
Product (1) ──── (N) OrderItem
Order (1) ──── (N) OrderItem
```

## 🌐 Multi-Language Support

The website supports:
- **English** - Default language
- **မြန်မာ (Burmese)** - Myanmar language

### How to Switch Languages
Click the 🌐 icon in the navbar

### Adding New Languages
1. Update `lib/translations.ts`
2. Add translations for all keys
3. Update language switcher component

## 🔒 Security Features

- **Authentication**: JWT-based session management
- **Rate Limiting**: 
  - Login: 5 attempts per 15 minutes
  - API: 100 requests per minute
- **Password Hashing**: bcryptjs with salt rounds
- **Protected Routes**: Middleware-based route protection
- **CSRF Protection**: Built-in Next.js protection
- **Security Headers**: XSS, Clickjacking, MIME-sniffing protection

## 📱 Responsive Design

Fully responsive design optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🐛 Troubleshooting

### Build Failed - Tables Don't Exist

```bash
npx prisma migrate deploy
npx prisma generate
npm run build
```

### Environment Variables Not Set

Check Vercel Dashboard → Settings → Environment Variables

### Admin Can't Login

Go to `/admin/setup` and create a new admin account

### Database Connection Error

Verify `DATABASE_URL` is correct and database is accessible

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Migration Errors

```bash
# Reset migrations (WARNING: Deletes all data)
npx prisma migrate reset

# Apply pending migrations
npx prisma migrate deploy
```

## 📞 Support

- **Website**: [Your Vercel URL]
- **Email**: support@mgyoffset.com
- **GitHub Issues**: [Repository Issues](https://github.com/AKPAING3147/mgy/issues)

## 📄 License

This project is private and proprietary to MGY OFFSET. All rights reserved.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Google for Gemini AI
- All open-source contributors

---

**Built with ❤️ by MGY OFFSET Team**

**Version**: 1.0.0  
**Last Updated**: December 2024
