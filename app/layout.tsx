import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FreeGames - En İyi Oyun İndirimleri",
  description: "Tüm dijital platformlardaki en iyi oyun indirimlerini keşfedin. Steam, Epic Games Store, GOG ve daha fazlası.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
} 