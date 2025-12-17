# Multi-Language Support Guide

## 🌍 **Supported Languages:**

Your application now supports **3 languages**:

1. **🇺🇸 English (en)** - Default
2. **🇹🇭 Thai (th)** - ไทย  
3. **🇲🇲 Burmese (my)** - မြန်မာ

---

## 🎯 **How to Switch Languages:**

### **For Customers:**

1. **Look for the Globe Icon** 🌐 in the top-right corner of the Navbar
2. **Click on the language dropdown**
3. **Select your preferred language**:
   - 🇺🇸 English
   - 🇹🇭 ไทย
   - 🇲🇲 မြန်မာ
4. **Language changes instantly!**

### **For Admins:**

- Same language switcher appears in:
  - Admin Dashboard header
  - All admin pages
  - Product management
  - Order management

---

## ✨ **What Gets Translated:**

### **Customer Side:**
✅ Navbar (Home, Collections, Track Order, Contact, Sign In)
✅ Hero Section (Tagline, Description, CTA Button)
✅ Product Listings (Title, Subtitle, "Customize" button, "per card")
✅ Features Section (Titles & Descriptions)
✅ Footer
✅ Product Customizer (Form labels, buttons)
✅ Empty States

### **Admin Side:**
✅ Dashboard titles
✅ Statistics cards (Total Revenue, Orders, etc.)
✅ Order table headers
✅ Action buttons (View Details, Delete, Logout)
✅ Form labels
✅ Success/Error messages

---

## 🔧 **How It Works:**

### **1. Language Storage:**
- Selected language saved in **localStorage**
- Persists across page refreshes
- Each user  can have their own preference

### **2. Translation Keys:**
- All text uses translation keys
- Example: `t("nav_home")` → "Home" / "หน้าแรก" / "ပင်မစာမျက်နှာ"

### **3. Real-Time Switching:**
- No page reload needed
- Changes apply instantly
- Smooth user experience

---

## 📝 **Translation Coverage:**

| Section | English | Thai | Burmese |
|---------|---------|------|---------|
| Navigation | ✅ | ✅ | ✅ |
| Hero | ✅ | ✅ | ✅ |
| Products | ✅ | ✅ | ✅ |
| Features | ✅ | ✅ | ✅ |
| Admin Dashboard | ✅ | ✅ | ✅ |
| Forms | ✅ | ✅ | ✅ |
| Common | ✅ | ✅ | ✅ |

---

## 🛠️ **For Developers:**

### **Adding New Translations:**

1. Open `lib/translations.ts`
2. Add new key to all three languages:

```typescript
export const translations = {
  en: {
    my_new_key: "English Text",
    // ...
  },
  th: {
    my_new_key: "ข้อความภาษาไทย",
    // ...
  },
  my: {
    my_new_key: "မြန်မာစာသား",
    // ...
  }
};
```

3. Use in components:

```typescript
const { t } = useLanguage();
<p>{t("my_new_key")}</p>
```

### **Using in Components:**

```typescript
"use client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t("nav_home")}</h1>
      <p>Current: {language}</p>
    </div>
  );
}
```

---

## 🎨 **Language Switcher Features:**

- **Dropdown Menu** with flags
- **Current language highlighted**
- **Accessible** on all pages
- **Mobile responsive**
- **Smooth animations**

---

## 📱 **Mobile Experience:**

- Language switcher **shows flag only** on small screens
- Full text on larger screens
- Dropdown works perfectly on touch devices

---

## 🌟 **Example Translations:**

| Key | 🇺🇸 English | 🇹🇭 Thai | 🇲🇲 Burmese |
|-----|------------|----------|-------------|
| `nav_home` | Home | หน้าแรก | ပင်မစာမျက်နှာ |
| `nav_collections` | Collections | คอลเลกชั่น | စုစည်းမှုများ |
| `hero_cta` | Explore Collections | สำรวจคอลเลกชั่น | စုစည်းမှုကြည့်ရှုရန် |
| `products_customize` | Customize | ปรับแต่ง | စိတ်ကြိုက်ပြင်ဆင်ရန် |
| `admin_logout` | Logout | ออกจากระบบ | ထွက်ရန် |

---

## ✅ **Benefits:**

1. **Better User Experience** - Users can read in their native language
2. **Wider Reach** - Appeal to English, Thai, and Burmese speakers
3. **Professional** - Shows attention to detail
4. **SEO Ready** - Can expand to multi-language URLs later
5. **Easy to Extend** - Add more languages easily

---

## 🔮 **Future Enhancements:**

- Add more languages (Chinese, Japanese, etc.)
- URL-based language routing (`/en/`, `/th/`, `/my/`)
- Auto-detect browser language
- Admin panel to manage translations
- RTL support for Arabic/Hebrew

---

**Your site is now fully multilingual!** 🎉🌍

Users can switch between English, Thai, and Burmese with one click!
