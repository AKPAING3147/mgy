# Cloudinary Setup Guide for MGY OFFSET

## Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/
2. Sign up for a free account
3. After login, go to Dashboard

## Step 2: Get Your Credentials
From the Cloudinary Dashboard, you'll see:
- **Cloud Name**: (e.g., `dxxxxx`)
- **API Key**: (e.g., `123456789012345`)
- **API Secret**: (e.g., `abcdefghijklmnopqrstuvwxyz`)

## Step 3: Add to .env File
Open your `.env` file and add these lines:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

**Example:**
```
CLOUDINARY_CLOUD_NAME=dq1abc2de
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz12
```

## Step 4: Restart the Server
After adding credentials, restart the development server:
```bash
npm run dev
```

## Step 5: Test Upload
1. Go to `/admin/products/new`
2. Upload an image
3. The Cloudinary URL will appear in the input field

## Benefits of Cloudinary:
✅ Images stored in the cloud (not local)
✅ Automatic image optimization
✅ CDN delivery for fast loading
✅ Works in production (Vercel, etc.)
✅ Free tier: 25 credits/month

## Troubleshooting:
- If upload fails, check your credentials
- Make sure all 3 values are set correctly
- Restart the server after adding credentials

## Free Tier Limits:
- 25 credits/month (about 25,000 transformations or 25GB storage)
- Perfect for small to medium websites

---

**Your Cloudinary is ready!** 🎉
