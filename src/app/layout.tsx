import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "नेपाली युनिकोड र प्रिती फन्ट अनुवादक | Preeti to Unicode & Unicode to Preeti Converter",
  description: "द्रुत र शुद्ध नेपाली युनिकोडबाट प्रिती फन्ट तथा प्रितीबाट युनिकोड रूपान्तरण गर्ने आधुनिक उपकरण। Next.js र Supabase द्वारा संचालित।",
  keywords: [
    "Preeti to Unicode",
    "Unicode to Preeti",
    "Nepali font converter",
    "नेपाली युनिकोड अनुवादक",
    "प्रिती फन्ट",
    "Devanagari converter",
    "Nepali typing cheatsheet",
    "Preeti keyboard",
  ],
  authors: [{ name: "Nepali Unicode Converter Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ne" suppressHydrationWarning>
      <body className="min-h-screen text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

