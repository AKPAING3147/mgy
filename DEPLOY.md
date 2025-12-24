# 🚀 Deploying to Vercel

This guide walks you through deploying your Wedding Invitations app to Vercel.

---

## ✅ Pre-Deployment Checklist

Your app has been updated to be **Vercel-ready**:
- ✅ **Database**: Updated to PostgreSQL (compatible with Vercel Postgres/Neon/Supabase)
- ✅ **Image Uploads**: Uses Cloudinary (cloud storage) instead of local filesystem
- ✅ **Build Script**: Includes Prisma generate for serverless deployment

---

## � Step 1: Set Up Cloudinary (Free)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account
2. From your Cloudinary Dashboard, note down:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## 📋 Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
# Replace with your actual GitHub repo URL
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitations.git
git push -u origin main
```

---

## 📋 Step 3: Deploy on Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your `wedding-invitations` repository from GitHub
4. Vercel will auto-detect it as a Next.js app

---

## 📋 Step 4: Create PostgreSQL Database

**Option A: Vercel Postgres (Easiest)**
1. In your Vercel Project Dashboard, click the **"Storage"** tab
2. Click **"Create Database"** → Select **"Postgres"**
3. Give it a name and click **"Create"**
4. Click **"Connect Project"** - Vercel auto-adds `POSTGRES_URL` to your project

**Option B: Neon.tech (Free Tier)**
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project and database
3. Copy the connection string

**Option C: Supabase (Free Tier)**
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings → Database → Connection string
3. Copy the URI connection string

---

## � Step 5: Configure Environment Variables

In Vercel Project **Settings** → **Environment Variables**, add:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your PostgreSQL connection string from Step 4 | ✅ |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` | ✅ |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | ✅ |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard | ✅ |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard | ✅ |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard | ✅ |

> **Note**: If using Vercel Postgres, it automatically adds `POSTGRES_URL`. You need to also add `DATABASE_URL` with the same value, OR update your Prisma schema to use `POSTGRES_URL`.

---

## 📋 Step 6: Run Database Migration

After your first deployment, you need to push your database schema:

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.production.local

# Push database schema
npx prisma db push
```

**Option B: Using Local Machine**
```bash
# Set DATABASE_URL temporarily with your production DB connection
# Then run:
npx prisma db push
```

---

## 📋 Step 7: Redeploy

If you made changes or ran migrations:
1. Go to your Vercel project dashboard
2. Click **"Deployments"**
3. Click the **"..."** menu on the latest deployment
4. Click **"Redeploy"**

---

## 🔧 Troubleshooting

### Build Failed: "Cannot find module '@prisma/client'"
This should be fixed now. The build script includes `prisma generate`.

### Error: "DATABASE_URL not found"
Make sure you've added `DATABASE_URL` in Vercel Environment Variables.

### Images Not Uploading
1. Verify Cloudinary credentials are correct in Environment Variables
2. Check Cloudinary dashboard for upload logs

### Database Connection Errors
1. Check if your DATABASE_URL is correct
2. For Vercel Postgres: use the `POSTGRES_PRISMA_URL` variable
3. Ensure `?sslmode=require` is at the end of your connection string

---

## 📦 Environment Variables Reference

See `.env.example` for all required variables:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-app.vercel.app"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## 🎉 Done!

Your app should now be live at `https://your-app.vercel.app`!

**Next Steps:**
1. Set up admin account at `/admin/setup` (first time only)
2. Add your products via admin panel
3. Share your store link with customers!
