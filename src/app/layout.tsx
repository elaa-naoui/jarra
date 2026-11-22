import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Smart Jarra — Agriculture Urbaine Intelligente en Tunisie",
  description:
    "Smart Jarra — chaque goutte cultive demain. Plateforme d'irrigation intelligente avec robot mobile, IA, NFC, jarres enterrées et aquaponie.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f4f7f4] text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
