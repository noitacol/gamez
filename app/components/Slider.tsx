"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Örnek slider verileri (gerçek API entegrasyonu için değiştirilmeli)
const sliderItems = [
  {
    id: "01846e7e-84f8-7314-94eb-6bff48d886f8",
    title: "The Ship: Single Player",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2400/header.jpg",
    discount: "75%",
    originalPrice: "$8.99",
    currentPrice: "$2.24",
    description: "Ücretsiz hafta sonu fırsatı",
    platform: "Steam"
  },
  {
    id: "018d937f-07fc-72ed-8517-d8e24cb1eb22",
    title: "Europa Universalis IV",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/236850/header.jpg",
    discount: "80%",
    originalPrice: "$39.99",
    currentPrice: "$7.99",
    description: "Tarihi strateji",
    platform: "Epic Games"
  },
  {
    id: "01846e7e-7e96-71fb-bf16-6979fa211638",
    title: "Ghost Master",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/6200/header.jpg",
    discount: "90%",
    originalPrice: "$6.99",
    currentPrice: "$0.69",
    description: "Nostaljik klasik",
    platform: "GOG"
  }
];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Otomatik geçiş için
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sliderItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % sliderItems.length
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentSlide = sliderItems[currentIndex];

  return (
    <div className="relative w-full h-[50vh] overflow-hidden bg-gradient-to-r from-background to-secondary/50 mt-16">
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full opacity-20">
          <Image 
            src={currentSlide.image} 
            alt={currentSlide.title}
            fill
            style={{ objectFit: "cover" }}
            className="blur-sm"
            priority
          />
        </div>
      </div>
      
      <div className="container relative z-10 flex items-center h-full py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 w-full">
          <div className="space-y-6">
            <div className="inline-block bg-accent text-secondary font-bold px-4 py-2 rounded-md mb-2">
              {currentSlide.description}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {currentSlide.title}
            </h2>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-4">
                <div className="bg-primary text-white font-bold px-3 py-1 rounded-md">
                  -{currentSlide.discount}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 line-through text-lg">{currentSlide.originalPrice}</span>
                  <span className="text-white font-bold text-3xl">{currentSlide.currentPrice}</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`py-1 px-3 rounded text-sm font-medium ${
                  currentSlide.platform === 'Steam' ? 'bg-blue-600/80' : 
                  currentSlide.platform === 'Epic Games' ? 'bg-purple-600/80' : 
                  currentSlide.platform === 'GOG' ? 'bg-rose-600/80' : 'bg-gray-600/80'
                }`}>
                  <div className="flex items-center space-x-1">
                    {currentSlide.platform === 'Steam' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5 0-.35 0-1.26-.02-2.5-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                      </svg>
                    )}
                    {currentSlide.platform === 'Epic Games' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.766 12.645l3.119-4.293h3.713v8.572h-3.713l-3.119-4.279zm13.454-4.293h3.015v8.572h-3.015v-8.572zm-6.11 0h3.508v8.572h-3.508v-8.572z"/>
                      </svg>
                    )}
                    <span>{currentSlide.platform}</span>
                  </div>
                </div>
              </div>
            </div>
            <Link 
              href={`/game/${currentSlide.id}`} 
              className="btn btn-primary inline-block px-8 py-3 text-lg rounded-md"
              tabIndex={0}
            >
              Detayları Gör
            </Link>
          </div>
          
          <div className="hidden lg:block relative h-[300px] w-full rounded-lg overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <Image 
              src={currentSlide.image} 
              alt={currentSlide.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
              priority
            />
            
            <div className="absolute top-0 right-0 bg-black/80 py-2 px-4 rounded-bl-lg">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{currentSlide.platform}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Kontroller */}
      <button 
        onClick={handlePrev} 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20 transition-colors"
        aria-label="Önceki"
        tabIndex={0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button 
        onClick={handleNext} 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20 transition-colors"
        aria-label="Sonraki"
        tabIndex={0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
      
      {/* Gösterge Noktaları */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {sliderItems.map((_, index) => (
          <button 
            key={index} 
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-accent' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Slide ${index + 1}`}
            tabIndex={0}
          />
        ))}
      </div>
    </div>
  );
} 