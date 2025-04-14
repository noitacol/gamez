"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary py-8 mt-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-white mb-2">Oyun İndirimleri</h2>
            <p className="text-gray-400 max-w-md">
              IsThereAnyDeal API kullanılarak oluşturulmuş, en iyi oyun indirimlerini bulmanızı sağlayan bir platform.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-medium text-white mb-2">Bağlantılar</h3>
            <Link 
              href="/" 
              className="text-gray-400 hover:text-accent transition-colors" 
              tabIndex={0}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/shops" 
              className="text-gray-400 hover:text-accent transition-colors" 
              tabIndex={0}
            >
              Mağazalar
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Oyun İndirimleri. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center">
            <span className="text-gray-400 text-sm">
              Veriler <a 
                href="https://isthereanydeal.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
                tabIndex={0}
              >
                IsThereAnyDeal
              </a> tarafından sağlanmaktadır.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
} 