import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { theme, style, occasion } = await request.json();

        // Check if API key exists
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                success: false,
                message: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env file."
            }, { status: 500 });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Create prompt for template generation
        const prompt = `You are a professional wedding invitation designer. Create a unique wedding invitation template design based on these requirements:

Theme: ${theme || "elegant and romantic"}
Style: ${style || "classic"}
Occasion: ${occasion || "wedding"}

Please suggest a complete template design with:
1. A creative template name (be specific and descriptive)
2. A compelling description (2-3 sentences about the design aesthetic)
3. The most suitable layout type from: classic, modern, romantic, minimal
4. The best color scheme from: rose-gold, classic, romantic, elegant, garden
5. The most appropriate font style from: elegant, modern, romantic, classic
6. The best border style from: decorative, simple, floral, none
7. The most suitable icon style from: heart, rings, flower, none
8. Suggested price per card (between $3-$15)
9. Recommended minimum quantity (typical: 25, 50, 100)

Return your response in this exact JSON format (no markdown, just pure JSON):
{
  "name": "template name",
  "description": "template description",
  "layoutType": "value",
  "defaultColorScheme": "value",
  "defaultFontStyle": "value",
  "borderStyle": "value",
  "iconStyle": "value",
  "price": number,
  "minQuantity": number,
  "category": "Wedding"
}`;

        // Generate template
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the response
        let templateData;
        try {
            // Try to extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                templateData = JSON.parse(jsonMatch[0]);
            } else {
                templateData = JSON.parse(text);
            }
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json({
                success: false,
                message: "Failed to parse AI response. Please try again."
            }, { status: 500 });
        }

        // Validate the template data
        const validatedTemplate = {
            name: templateData.name || "AI Generated Template",
            description: templateData.description || "Beautiful AI-generated wedding invitation template",
            layoutType: ["classic", "modern", "romantic", "minimal"].includes(templateData.layoutType)
                ? templateData.layoutType : "classic",
            defaultColorScheme: ["rose-gold", "classic", "romantic", "elegant", "garden"].includes(templateData.defaultColorScheme)
                ? templateData.defaultColorScheme : "rose-gold",
            defaultFontStyle: ["elegant", "modern", "romantic", "classic"].includes(templateData.defaultFontStyle)
                ? templateData.defaultFontStyle : "elegant",
            borderStyle: ["decorative", "simple", "floral", "none"].includes(templateData.borderStyle)
                ? templateData.borderStyle : "decorative",
            iconStyle: ["heart", "rings", "flower", "none"].includes(templateData.iconStyle)
                ? templateData.iconStyle : "heart",
            price: typeof templateData.price === 'number' && templateData.price > 0
                ? templateData.price.toFixed(2) : "5.00",
            minQuantity: typeof templateData.minQuantity === 'number' && templateData.minQuantity > 0
                ? templateData.minQuantity.toString() : "50",
            category: "Wedding"
        };

        return NextResponse.json({
            success: true,
            template: validatedTemplate
        });

    } catch (error: any) {
        console.error("Gemini API error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to generate template"
        }, { status: 500 });
    }
}
