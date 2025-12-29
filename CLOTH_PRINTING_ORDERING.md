# Cloth Printing Service - Customer Ordering System

## Overview
Customers can now order custom cloth printing (t-shirts, hoodies, etc.) through the same ordering system as wedding invitations. The system automatically detects the product type and shows the appropriate customization form.

## How It Works

### For Admins: Creating Cloth Printing Products

1. **Go to** `/admin/products/new`

2. **Fill in product details:**
   - **Name:** e.g., "Custom T-Shirt Printing"
   - **Description:** e.g., "High-quality custom printed t-shirts"
   - **Category:** Select "Cloth Printing" (or type text containing "cloth", "shirt", or "garment")
   - **Price:** e.g., $15.00
   - **Min Quantity:** e.g., 10
   - **Stock:** e.g., 999

3. **The system will:**
   - Detect it's a cloth printing product (based on category)
   - Show appropriate template options
   - Save the product

### For Customers: Ordering Cloth Printing

1. **Browse Products**
   - See product grid with live previews
   - Click on cloth printing product

2. **Customize Garment**
   The customization form includes:
   
   **Garment Type:**
   - T-Shirt
   - Hoodie
   - Polo Shirt
   - Tank Top
   
   **Size Selection:**
   - XS, S, M, L, XL, XXL, XXXL
   - Visual size selector (buttons)
   
   **Color Selection:**
   - White, Black, Navy, Gray
   - Red, Blue, Green
   - Visual color picker with swatches
   
   **Print Design/Text:**
   - Free text input
   - Examples: "MGY OFFSET", "Your Logo Here", etc.
   
   **Print Position:**
   - Front
   - Back  
   - Front & Back (double price)
   
   **Quantity:**
   - Minimum order quantity enforced
   - Stock availability checked

3. **Live Preview**
   - See garment mockup in real-time
   - Shows selected color
   - Displays print text/design
   - Shows garment type (t-shirt shape vs hoodie shape)

4. **Order & Checkout**
   - Click "Order Now"
   - Redirects to checkout
   - All customization details saved

## Product Type Detection

The system automatically detects cloth printing products by checking if the category contains:
- "cloth"
- "shirt"
- "garment"

```typescript
const isClothPrinting = product.category.toLowerCase().includes("cloth") || 
                       product.category.toLowerCase().includes("shirt") ||
                       product.category.toLowerCase().includes("garment");
```

## Customization Data Structure

### Cloth Printing Order Data:
```json
{
  "garmentType": "t-shirt",
  "size": "M",
  "color": "white",
  "printDesign": "MGY OFFSET",
  "printPosition": "front",
  "quantity": 50
}
```

### Wedding Invitation Order Data:
```json
{
  "brideName": "Jane",
  "groomName": "John",
  "weddingDate": "2025-06-15",
  "weddingTime": "16:00",
  "venue": "Sunset Garden Resort",
  "additionalInfo": "",
  "colorScheme": "rose-gold",
  "fontStyle": "elegant"
}
```

## Checkout Integration

Both product types use the same checkout process:

1. Product details
2. Customization data
3. Quantity and pricing
4. Shipping information
5. Payment upload

The checkout page displays customization details appropriately for each product type.

## Live Preview Features

### Cloth Printing Preview
- **Garment Shape:** Visual representation of selected type
- **Color Display:** Shows actual garment color
- **Print Preview:** Displays custom text on garment
- **Position Indicator:** Shows where print will be placed
- **Size Display:** Shows selected size
- **Realistic Mockup:** Professional garment visualization

### Invitation Preview
- **Card Layout:** Shows invitation design
- **Color Scheme:** Applies selected theme
- **Typography:** Shows selected font
- **Content:** Displays all wedding details

## Supported Garment Types

### T-Shirt
- **Shape:** Round collar, short sleeves
- **Sizes:** XS - XXXL
- **Print Areas:** Front, Back, Both

### Hoodie
- **Shape:** Hood, long sleeves, pocket
- **Sizes:** XS - XXXL
- **Print Areas:** Front, Back, Both

### Polo Shirt
- **Shape:** Collar, buttons, short sleeves
- **Sizes:** XS - XXXL
- **Print Areas:** Left chest, Back

### Tank Top
- **Shape:** Sleeveless, athletic cut
- **Sizes:** XS - XXXL
- **Print Areas:** Front, Back

## Color Options

Available garment colors:
- **White** - Classic, versatile
- **Black** - Bold, professional
- **Navy** - Corporate, elegant
- **Gray** - Casual, modern
- **Red** - Vibrant, attention-grabbing
- **Blue** - Calm, trustworthy
- **Green** - Fresh, natural

## Pricing Structure

Cloth printing products can have:
- **Base Price:** Per garment
- **Position Pricing:** Front vs Back vs Both
- **Quantity Discounts:** Minimum order quantities
- **Size Surcharges:** XXL+ sizes (future feature)

## Validation Rules

### Required Fields:
- ✅ Garment Type
- ✅ Size
- ✅ Color
- ✅ Print Design/Text
- ✅ Print Position
- ✅ Quantity

### Constraints:
- Minimum quantity enforced
- Stock availability checked
- Print design cannot be empty

## Admin Quick Start

**Creating your first cloth printing product:**

1. **Product Name:** "Custom T-Shirt - Full Color Print"
2. **Description:** "Premium quality cotton t-shirts with full-color custom printing. Perfect for events, businesses, and personal use."
3. **Category:** "Cloth Printing"
4. **Price:** $12.00
5. **Min Quantity:** 25
6. **Stock:** 999
7. Click "Create Template"

## Customer Quick Start

**Ordering a custom t-shirt:**

1. Browse products → Select cloth printing product
2. Choose garment type: T-Shirt
3. Select size: M
4. Pick color: White
5. Enter design: "MGY OFFSET PRINTING"
6. Choose position: Front
7. Set quantity: 50
8. See live preview
9. Click "Order Now"
10. Complete checkout

## Benefits

### For Customers:
- ✅ **Visual Customization** - See exactly what they're ordering
- ✅ **Easy Selection** - Simple, intuitive interface
- ✅ **Multiple Options** - Wide range of garment types and colors
- ✅ **Instant Preview** - Real-time mockup
- ✅ **Flexible Quantities** - Order what they need

### For Business:
- ✅ **Expanded Services** - Beyond wedding invitations
- ✅ **Same Platform** - No separate system needed
- ✅ **Professional Presentation** - High-quality previews
- ✅ **Order Management** - All orders in one place
- ✅ **Growth Potential** - New revenue stream

## Technical Implementation

### Files Modified/Created:

1. **`components/ClothPrintingPreview.tsx`** (NEW)
   - Garment visualization component
   - Color and type rendering
   - Print design display

2. **`components/ProductDetail.tsx`** (UPDATED)
   - Dual customization forms
   - Product type detection
   - Separate validation logic

3. **`components/ServicesSection.tsx`** (UPDATED)
   - Added cloth printing service card
   - Updated grid layout for 5 services

### Data Flow:

```
Admin creates product (category: "Cloth Printing")
    ↓
Product saved to database
    ↓
Customer browses products
    ↓
Clicks cloth printing product
    ↓
ProductDetail detects type from category
    ↓
Shows cloth customization form
    ↓
Live preview updates
    ↓
Customer places order
    ↓
Customization saved with order
    ↓
Checkout processes order
```

## Future Enhancements

Potential additions:
- [ ] Upload custom logo/image
- [ ] Multiple print positions pricing
- [ ] Size charts with measurements
- [ ] Garment material selection (cotton, polyester, blend)
- [ ] Print technique selection (screen print, DTG, vinyl)
- [ ] Color matching tools
- [ ] Bulk order discounts calculator
- [ ] Design templates library
- [ ] Mockup generator with real photos

## Marketing Ideas

Promote cloth printing service:
- "Now Offering Custom T-Shirt Printing!"
- "From Invitations to Apparel - We Print It All"
- "Bulk Orders Welcome - Contact for Quotes"
- "Perfect for Events, Teams, and Businesses"

Your platform now supports both **wedding invitations** AND **cloth printing** - all in one seamless system! 🎉👕
