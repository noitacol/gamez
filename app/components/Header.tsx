"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  // Sayfa scroll edildiğinde navbarın görünümünü değiştir
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-secondary/95 backdrop-blur-lg shadow-lg py-2" 
          : "bg-gradient-to-b from-black/80 to-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center group"
          tabIndex={0}
        >
          <div className="bg-primary text-white p-2 rounded-lg transform group-hover:rotate-3 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.29 7 12 12 20.71 7"></polyline>
              <line x1="12" y1="22" x2="12" y2="12"></line>
            </svg>
          </div>
          <span className="text-2xl font-bold ml-2 text-white group-hover:text-accent transition-colors hidden sm:inline">
            Oyun İndirimleri
          </span>
        </Link>
        
        {/* Masaüstü Navigasyon */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-white hover:text-accent transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-accent after:transition-all"
            tabIndex={0}
          >
            Ana Sayfa
          </Link>
          <Link 
            href="/shops" 
            className="text-white hover:text-accent transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-accent after:transition-all"
            tabIndex={0}
          >
            Mağazalar
          </Link>
          <Link 
            href="/popular" 
            className="text-white hover:text-accent transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-accent after:transition-all"
            tabIndex={0}
          >
            Popüler
          </Link>
          <Link 
            href="/discounts" 
            className="text-white hover:text-accent transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-accent after:transition-all"
            tabIndex={0}
          >
            En İyi İndirimler
          </Link>
        </nav>
        
        {/* Masaüstü Arama Formu */}
        <form onSubmit={handleSearch} className="hidden md:flex relative w-64 lg:w-80">
          <input
            type="text"
            placeholder="Oyun ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-4 pr-10 py-2 rounded-full bg-secondary border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            aria-label="Oyun ara"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            aria-label="Ara"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
        
        {/* Mobil Menü Butonu */}
        <button 
          className="md:hidden text-white hover:text-accent focus:outline-none focus:text-accent transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
          tabIndex={0}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobil Menü */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-secondary/95 backdrop-blur-lg shadow-lg mt-2 p-4">
          <nav className="flex flex-col space-y-4 mb-4">
            <Link 
              href="/" 
              className="text-white hover:text-accent transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={0}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/shops" 
              className="text-white hover:text-accent transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={0}
            >
              Mağazalar
            </Link>
            <Link 
              href="/popular" 
              className="text-white hover:text-accent transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={0}
            >
              Popüler
            </Link>
            <Link 
              href="/discounts" 
              className="text-white hover:text-accent transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={0}
            >
              En İyi İndirimler
            </Link>
          </nav>
          
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              placeholder="Oyun ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-4 pr-10 py-2 rounded-full bg-background border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Oyun ara"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Ara"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </header>
  );
} 