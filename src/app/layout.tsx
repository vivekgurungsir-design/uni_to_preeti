import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var clean = function() {
                    var els = document.querySelectorAll('[bis_skin_checked]');
                    for (var i = 0; i < els.length; i++) {
                      els[i].removeAttribute('bis_skin_checked');
                    }
                  };
                  clean();
                  var observer = new MutationObserver(clean);
                  observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['bis_skin_checked'] });
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen text-slate-900 antialiased selection:bg-emerald-500 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}

