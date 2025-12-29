import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ChatBot from "@/components/ChatBot";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MGY OFFSET | Premium Printing Services",
  description: "High-quality custom printing for all your business and personal needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased selection:bg-primary/30",
        playfair.variable,
        lato.variable
      )}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <ChatBot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



