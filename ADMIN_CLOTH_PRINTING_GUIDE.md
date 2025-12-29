# Admin Guide: Adding Cloth Printing Products

## Quick Start

### Creating a Cloth Printing Product

1. **Navigate to:** `/admin/products/new-cloth`

2. **Fill in the form:**

   **Product Name:**
   - Example: "Premium Cotton T-Shirt - Custom Print"
   - Example: "Unisex Hoodie - Full Color Printing"
   
   **Description:**
   - Example: "High-quality 100% cotton t-shirts with vibrant full-color custom printing. Perfect for events, teams, businesses, and personal use. Durable print that lasts wash after wash."
   
   **Price:**
   - Per garment price (e.g., $15.00)
   - Suggested range: $10-$30 depending on garment type
   
   **Minimum Quantity:**
   - Typical: 10-25 pieces
   - Bulk orders: 50-100 pieces
   
   **Stock:**
   - Set to 999 for "unlimited"
   - Or set actual stock count

3. **Preview:**
   - See live preview on the right
   - Shows sample garment mockup
   - Customers will see this style of customization

4. **Create:**
   - Click "Create Product"
   - Product automatically set to "Cloth Printing" category
   - Redirects to products list

## Access the Page

### Option 1: Direct URL
Go to: `http://localhost:3000/admin/products/new-cloth`

### Option 2: From Products Page
1. Go to `/admin/products`
2. Look for "Add Cloth Printing" button (if added)
3. Click to create cloth printing product

## What Customers Will See

When customers order your cloth printing product, they get:

### Customization Options:
1. **Garment Type**
   - T-Shirt
   - Hoodie
   - Polo Shirt
   - Tank Top

2. **Size Selection**
   - XS, S, M, L, XL, XXL, XXXL
   - Visual button selector

3. **Color Options**
   - White
   - Black  
   - Navy
   - Gray
   - Red
   - Blue
   - Green

4. **Print Design/Text**
   - Free text input
   - Customer enters what they want printed

5. **Print Position**
   - Front
   - Back
   - Front & Back

6. **Quantity**
   - With your minimum enforced

### Live Preview
- Customers see realistic garment mockup
- Shows their selected color
- Displays their print text
- Shows selected garment type

## Product Examples

### Example 1: Basic T-Shirt
```
Name: "Custom T-Shirt - Screen Print"
Description: "Premium cotton t-shirt with single color screen printing. Great for events and teams."
Price: $12.00
Min Quantity: 25
Stock: 999
```

### Example 2: Premium Hoodie
```
Name: "Premium Hoodie - DTG Full Color"
Description: "Heavy-weight fleece hoodie with full-color direct-to-garment printing. High-quality and durable."
Price: $28.00
Min Quantity: 10
Stock: 500
```

### Example 3: Polo Corporate
```
Name: "Corporate Polo - Embroidered Logo"
Description: "Professional polo shirt perfect for corporate branding. Custom embroidery available."
Price: $22.00
Min Quantity: 20
Stock: 999
```

### Example 4: Tank Top Sports
```
Name: "Athletic Tank Top - Sports Print"
Description: "Moisture-wicking athletic tank top with custom printing. Perfect for gyms and sports teams."
Price: $10.00
Min Quantity: 50
Stock: 999
```

## Pricing Guidelines

### Suggested Pricing:

**T-Shirts:**
- Basic: $10-15
- Premium: $15-20
- Specialty: $20-25

**Hoodies:**
- Standard: $25-30
- Premium: $30-40
- Heavy-weight: $40-50

**Polo Shirts:**
- Standard: $18-25
- Premium: $25-35

**Tank Tops:**
- Basic: $8-12
- Athletic: $12-18

## Minimum Quantities

**Recommended minimums:**
- T-Shirts: 25-50 pieces
- Hoodies: 10-25 pieces
- Polo Shirts: 20-30 pieces
- Specialty items: 10-20 pieces

**Why minimums matter:**
- Setup costs
- Screen printing efficiency
- Bulk material discounts
- Production workflow

## Stock Management

### Setting Stock Levels:

**999 = Unlimited**
- Use for made-to-order items
- Garments you always have available
- Standard colors/sizes

**Actual Count**
- Use for limited inventory
- Special colors
- Seasonal items
- Pre-purchased stock

## Tips for Success

### 1. Clear Descriptions
✅ "100% cotton, pre-shrunk, screen printed"
❌ "T-shirt with printing"

### 2. Specify Details
Include:
- Material (cotton, polyester, blend)
- Weight (oz/sq yard)
- Print method (screen, DTG, vinyl)
- Durability info

### 3. Set Realistic Minimums
- Don't set too low (unprofitable)
- Don't set too high (lose customers)
- Industry standard: 10-50 pieces

### 4. Price Appropriately
Consider:
- Material cost
- Printing cost
- Setup/artwork
- Profit margin
- Market competition

### 5. Update Stock Regularly
- Mark out-of-stock items
- Update when restocking
- Remove discontinued items

## Product Management

### Editing Products
- Go to `/admin/products`
- Products listed with all details
- Edit or delete as needed

### Viewing Orders
- Check `/admin/orders`
- See customer customizations
- Review print requirements

### Customer Customizations
When customers order, you'll see:
- Garment type selected
- Size choice
- Color selection
- Print design/text
- Print position
- Quantity

## Marketing Your Cloth Printing

### Promote Your Service:
- "Now Offering Custom T-Shirt Printing!"
- "Bulk Orders Welcome - Great for Teams & Events"
- "From 10 Pieces - No Maximum"
- "Premium Quality, Fast Turnaround"

### Target Markets:
- **Corporate:** Company uniforms, team shirts
- **Events:** Conferences, festivals, parties
- **Sports:** Team jerseys, fan gear
- **Schools:** Club shirts, class tees
- **Personal:** Custom gifts, special occasions

## Technical Notes

### Category Assignment
- Products automatically set to "Cloth Printing" category
- System detects this and shows cloth customization form
- No manual category entry needed

### Template Storage
- Simple JSON marker stored
- Indicates product type
- Enables correct customer interface

### Integration
- Works with same checkout system
- Same order management
- Same payment process
- Unified admin dashboard

## Quick Reference

**Page URL:** `/admin/products/new-cloth`

**Required Fields:**
- ✅ Product Name
- ✅ Description
- ✅ Price
- ✅ Minimum Quantity

**Optional:**
- Stock (defaults to 999)

**Auto-Set:**
- Category: "Cloth Printing"
- Product Type: Detected automatically

## Next Steps After Creating

1. **Test the Product**
   - View it on customer site
   - Try customizing
   - Check preview works

2. **Set Up Pricing**
   - Consider quantity discounts
   - Update if needed

3. **Monitor Orders**
   - Watch for first orders
   - Review customizations
   - Adjust minimum if needed

4. **Market It**
   - Add to social media
   - Email customers
   - Update website

Your cloth printing products are now ready for customers to order! 🎉👕
