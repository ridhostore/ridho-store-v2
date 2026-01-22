import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syncopate } from "next/font/google";
import Script from "next/script";

// --- PERHATIKAN URUTAN IMPORT INI JANGAN DITUKAR ---
import "bootstrap/dist/css/bootstrap.min.css";        // 1. Bootstrap (Paling Atas)
import "bootstrap-icons/font/bootstrap-icons.css";    // 2. Icons
import "animate.css/animate.min.css";                 // 3. Animasi
import "swiper/css";                                  // 4. Slider
import "swiper/css/pagination";                       
import "./globals.css";

// Setup Font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta"
});

const syncopate = Syncopate({ 
  subsets: ["latin"], 
  weight: ["700"], 
  variable: "--font-syncopate" 
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Ridho Store | Premium Digital Branding Solution",
  description: "Panel SMM Termurah dan Terpercaya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* AOS Animation CSS (CDN Backup) */}
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "Jasa Followers & SMM Panel",
              "brand": { "@type": "Brand", "name": "Ridho Store" }
            }),
          }}
        />
      </head>
      
      <body className={`${jakarta.variable} ${syncopate.variable}`} id="top">
        {children}

        {/* --- JS LIBRARIES (Wajib load CDN agar script.js bisa baca) --- */}
        
        {/* 1. Core UI (Bootstrap) */}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
        
        {/* 2. Swiper Slider (PENTING: Ini yang bikin error tadi) */}
        <Script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js" strategy="beforeInteractive" />
        
        {/* 3. Animation Libraries */}
        <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="lazyOnload" />
        <Script src="https://unpkg.com/typed.js@2.0.16/dist/typed.umd.js" strategy="lazyOnload" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js" strategy="lazyOnload" />
        <Script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" strategy="lazyOnload" />
        
        {/* 4. Utilities */}
        <Script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" strategy="lazyOnload" />
        <Script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js" strategy="lazyOnload" />

        {/* 5. LOGIC UTAMA (Load paling akhir) */}
        <Script src="/assets/js/script.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}