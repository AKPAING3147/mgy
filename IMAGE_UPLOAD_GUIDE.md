# How to Add Product Images in Admin

## 🎨 Two Ways to Add Images:

### **Option 1: Upload Your Own Image (Recommended)** ⬆️

1. **Go to Admin Products**
   - Login: http://localhost:3000/admin/login
   - Navigate: Admin Dashboard → "Manage Products" → "Add New"

2. **Upload Image**
   - Click the **upload area** (has a cloud icon)
   - Select your image file (PNG, JPG, WEBP)
   - **Preview appears** immediately
   - Image is stored in `/public/products/` folder

3. **Fill Other Details**
   - Product Name
   - Description
   - Price
   - Category

4. **Click "Create Product"**
   - Image uploads first
   - Product is created with uploaded image
   - Redirects to products list

---

### **Option 2: Use External URL** 🔗

1. **Go to Add Product** page
2. **Scroll to image section**
3. **Click "Or" divider**
4. **Paste image URL** in the text field
   - Must be a valid, publicly accessible URL
   - Example: `https://example.com/image.jpg`

5. **Fill other details** and submit

---

## 📸 **Where Images Are Stored:**

### **Uploaded Images:**
- **Location**: `public/products/`
- **URL Format**: `/products/1234567890-yourimage.jpg`
- **Filename**: Timestamped to avoid conflicts

### **External URLs:**
- Stored as-is in database
- Must remain accessible online

---

## 🎯 **Image Requirements:**

- **Formats**: PNG, JPG, JPEG, WEBP
- **Max Size**: 5MB (recommended)
- **Recommended Dimensions**: 800x1000px (4:5 ratio)
- **Aspect Ratio**: Works best with vertical/portrait images

---

## ✨ **Features:**

✅ **Live Preview** - See image before uploading
✅ **Drag & Drop** support
✅ **Remove/Change** image anytime
✅ **Both options** - Upload OR URL
✅ **Auto-saves** to public folder
✅ **Toast notifications** for success/errors

---

## 🔄 **Complete Workflow:**

1. **Login** → `/admin/login`
2. **Products** → Click "Add New"
3. **Upload Image** → Click upload area, select file
4. **Preview** → Image shows instantly
5. **Fill Form** → Name, description, price, category
6. **Submit** → Image uploads → Product created
7. **Homepage** → Product appears automatically!

---

## 🐛 **Troubleshooting:**

**Image not showing?**
- Check if file uploaded successfully (check `public/products/` folder)
- Verify image URL is accessible
- Make sure format is supported (JPG/PNG/WEBP)

**Upload failing?**
- Check file size (max 5MB)
- Ensure good internet connection
- Try a different image format

---

## 📝 **Example:**

**Good Upload:**
- Select: `wedding-card-design.jpg`
- Preview appears
- Click "Create Product"
- ✅ Uploaded to `/products/1702875600000-wedding-card-design.jpg`

**Good URL:**
- Paste: `https://i.imgur.com/abc123.jpg`
- Preview loads
- ✅ Stored as-is

---

**Your images are now easy to manage! Just drag, drop, and create!** 🎉
