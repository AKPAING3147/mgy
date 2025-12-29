# AI-Powered Template Generation with Google Gemini

## Overview
Admins can now use Google Gemini AI to automatically generate professional wedding invitation templates based on simple descriptions. No more manual configuration - just describe what you want and let AI do the work!

## Features

### 🤖 AI Template Generator
- **Powered by Google Gemini Pro**
- Generates complete template configurations
- Auto-fills all form fields
- Creates unique, professional designs
- Understands natural language descriptions

## Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Configure Environment

Add to your `.env` file:
```bash
GEMINI_API_KEY="your-api-key-here"
```

### 3. Install Dependencies (Already Done)
```bash
npm install @google/generative-ai
```

## How to Use

### Admin Workflow

1. **Go to Create Template Page**
   - Navigate to `/admin/products/new`

2. **Click "AI Generate" Button**
   - Purple button in the top-right of the card

3. **Fill AI Prompt Form**
   - **Theme/Style Keywords**: e.g., "rustic", "elegant", "vintage"
   - **Additional Style Notes**: e.g., "gold accents, floral patterns"
   - **Occasion**: Wedding, Engagement, Anniversary, or Vow Renewal

4. **Generate!**
   - Click "Generate Template"
   - Wait for AI magic (usually 2-5 seconds)

5. **Review & Adjust**
   - AI fills in ALL fields automatically
   - Review the generated content
   - Make any adjustments needed
   - See live preview

6. **Create Template**
   - Submit the form to save

## What AI Generates

The AI creates:

1. **Template Name**
   - Creative, descriptive name
   - Example: "Rustic Garden Wedding with Wildflower Accents"

2. **Description**
   - 2-3 sentence description
   - Professional marketing copy
   - Example: "A charming rustic design perfect for garden weddings..."

3. **Layout Type**
   - Chooses from: Classic, Modern, Romantic, Minimal
   - Based on your theme description

4. **Color Scheme**
   - Selects from: Rose Gold, Classic, Romantic, Elegant, Garden
   - Matches your style preferences

5. **Font Style**
   - Picks from: Elegant Serif, Modern Sans, Romantic Script, Classic Times
   - Complements the overall design

6. **Border Style**
   - Decides on: Decorative, Simple, Floral, or None
   - Fits the theme aesthetic

7. **Icon Style**
   - Chooses: Heart, Rings, Flower, or None
   - Appropriate for the occasion

8. **Pricing**
   - Suggests price between $3-$15
   - Based on design complexity

9. **Minimum Quantity**
   - Recommends: 25, 50, or 100
   - Industry standard quantities

## Example Prompts

### Example 1: Rustic Wedding
**Theme:** "rustic garden"
**Style:** "wildflowers, earthy tones, natural wood accents"
**Result:** Beautiful rustic template with garden colors and floral borders

### Example 2: Elegant Formal
**Theme:** "elegant formal luxury"
**Style:** "gold and white, sophisticated, timeless"
**Result:** Classic elegant template with rose-gold scheme

### Example 3: Beach Wedding
**Theme:** "beach destination wedding"
**Style:** "turquoise and sand colors, ocean themed, casual elegance"
**Result:** Modern romantic template with appropriate styling

### Example 4: Vintage Romance
**Theme:** "vintage romantic"
**Style:** "lace patterns, antique feel, soft pastels"
**Result:** Romantic template with decorative borders

## AI Modal Interface

### Fields

1. **Theme / Style Keywords** (Text Input)
   - Main theme description
   - Keywords work best
   - Examples: "bohemian", "classic", "modern minimalist"

2. **Additional Style Notes** (Text Area)
   - More detailed preferences
   - Specific design elements
   - Color preferences, patterns, etc.

3. **Occasion** (Dropdown)
   - Wedding
   - Engagement
   - Anniversary
   - Vow Renewal

### Buttons

- **Generate Template** - Calls Gemini API
- **Cancel** - Closes modal without generating

## Technical Details

### API Endpoint

**Path:** `/api/generate-template/route.ts`
**Method:** POST
**Request Body:**
```json
{
  "theme": "elegant romantic",
  "style": "gold accents, floral patterns",
  "occasion": "wedding"
}
```

**Response:**
```json
{
  "success": true,
  "template": {
    "name": "Elegant Rose Gold Romance",
    "description": "A stunning blend of elegance and romance...",
    "layoutType": "romantic",
    "defaultColorScheme": "rose-gold",
    "defaultFontStyle": "elegant",
    "borderStyle": "floral",
    "iconStyle": "heart",
    "price": "7.50",
    "minQuantity": "50",
    "category": "Wedding"
  }
}
```

### Error Handling

The system handles:
- Missing API key (shows user-friendly error)
- Network errors
- Invalid AI responses
- Malformed JSON
- Missing required fields

All errors show toast notifications to the admin.

### Validation

AI-generated data is validated to ensure:
- Layout type is valid
- Color scheme exists
- Font style is available
- Border style is supported
- Icon style is recognized
- Price is positive number
- Quantity is positive integer

Invalid values fallback to defaults.

## Benefits

### For Admins
- ✅ **Save Time** - No manual configuration
- ✅ **Get Ideas** - AI suggests creative combinations
- ✅ **Professional Copy** - Well-written descriptions
- ✅ **Consistency** - Professionally designed templates
- ✅ **Easy to Use** - Just describe what you want

### For Business
- ✅ **Faster Template Creation** - More products, faster
- ✅ **Better Descriptions** - Professional marketing copy
- ✅ **Consistent Quality** - AI ensures good design choices
- ✅ **Creative Variety** - Unique combinations
- ✅ **Market Testing** - Quickly test different styles

## Tips for Best Results

### 1. Be Specific
❌ Bad: "nice wedding"
✅ Good: "elegant classic wedding with gold accents"

### 2. Mention Colors
❌ Bad: "pretty"
✅ Good: "rose gold and blush pink, romantic"

### 3. Describe the Feel
❌ Bad: "wedding invite"
✅ Good: "bohemian outdoor wedding, relaxed and natural"

### 4. Include Details
❌ Bad: "formal"
✅ Good: "black-tie formal, luxurious, sophisticated with subtle elegance"

### 5. Use Descriptive Words
Great words to use:
- elegant, rustic, modern, vintage
- romantic, classic, minimalist, luxury
- bohemian, tropical, garden, beach
- formal, casual, whimsical, traditional

## Limitations

- Requires Gemini API key (get free at Google AI Studio)
- Needs internet connection
- Takes 2-5 seconds to generate
- AI suggestions may need minor adjustments
- Limited to predefined design options

## Future Enhancements

Potential improvements:
- [ ] Generate multiple variations at once
- [ ] Save AI-generated prompts for reuse
- [ ] Learn from admin's manual adjustments
- [ ] Generate custom color palettes
- [ ] Create template descriptions in multiple languages
- [ ] Suggest complementary template sets
- [ ] A/B testing recommendations

## Troubleshooting

### "Gemini API key not configured"
**Solution:** Add `GEMINI_API_KEY` to your `.env` file

### "Failed to generate template"
**Solutions:**
- Check internet connection
- Verify API key is valid
- Try again (sometimes network hiccup)
- Simplify your prompt

### Generated template seems off
**Solutions:**
- Add more specific details to your prompt
- Manually adjust the generated fields
- Try different wording in your description

### API rate limits
**Solution:** Gemini has generous free tier. If you hit limits, wait a moment or upgrade your plan.

## Cost

- **Free Tier:** 60 requests per minute
- **Pricing:** Free for most use cases
- **Upgrade:** Available if needed for high volume

## Security

- API key stored in environment variables
- Never exposed to client
- Server-side processing only
- Validated before storage

## Success Metrics

Track:
- Number of AI-generated templates created
- Admin time saved
- Template approval rate
- Customer engagement with AI-generated templates

Your wedding invitation business just got a lot smarter! 🎉✨
