"use client";

import { useState, useEffect } from "react";

type DiscountTimerProps = {
  endDate: string | Date;
  className?: string;
  compactView?: boolean;
};

const DiscountTimer = ({ endDate, className = "", compactView = false }: DiscountTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    totalHours: 0, // Toplam saat sayısı (renk için)
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      
      if (difference <= 0) {
        setTimeLeft({ 
          days: 0, 
          hours: 0, 
          minutes: 0, 
          seconds: 0, 
          isExpired: true,
          totalHours: 0 
        });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const totalHours = days * 24 + hours; // Toplam saat sayısı
      
      setTimeLeft({
        days,
        hours,
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
        totalHours
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);
  
  // Sayıyı 2 haneli formatta göster
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  // Kalan zamana göre renk belirle
  const getTimerColor = () => {
    if (timeLeft.totalHours <= 6) { // Son 6 saat
      return "from-red-600 to-red-400";
    } else if (timeLeft.totalHours <= 24) { // Son 24 saat
      return "from-amber-500 to-orange-500";
    } else if (timeLeft.totalHours <= 72) { // Son 3 gün
      return "from-blue-500 to-indigo-500";
    } else {
      return "from-indigo-600 to-purple-600"; // Standart renk
    }
  };

  if (timeLeft.isExpired) {
    return (
      <div className={`text-red-500 font-medium ${className}`} aria-label="İndirim sona erdi">
        İndirim sona erdi!
      </div>
    );
  }

  if (compactView) {
    // Kompakt görünüm - Mobil veya küçük alanlarda
    return (
      <div className={`flex items-center space-x-1 ${className}`} aria-label={`İndirimin bitmesine ${timeLeft.days} gün ${timeLeft.hours} saat ${timeLeft.minutes} dakika kaldı`}>
        <span className={`bg-gradient-to-r ${getTimerColor()} text-white px-2 py-1 rounded text-xs font-medium`}>
          {timeLeft.days > 0 ? `${timeLeft.days}g ${formatNumber(timeLeft.hours)}s` : `${formatNumber(timeLeft.hours)}s:${formatNumber(timeLeft.minutes)}d`}
        </span>
        <span className="text-xs text-gray-400">kaldı</span>
      </div>
    );
  }

  // Standart görünüm
  return (
    <div className={`flex items-center space-x-2 ${className}`} aria-label={`İndirimin bitmesine ${timeLeft.days} gün ${timeLeft.hours} saat ${timeLeft.minutes} dakika ${timeLeft.seconds} saniye kaldı`}>
      <div className="flex items-center space-x-1">
        {timeLeft.days > 0 && (
          <span className={`bg-gradient-to-r ${getTimerColor()} text-white px-2 py-1 rounded text-sm font-medium`}>
            {timeLeft.days}g
          </span>
        )}
        <span className={`bg-gradient-to-r ${getTimerColor()} text-white px-2 py-1 rounded text-sm font-medium`}>
          {formatNumber(timeLeft.hours)}s
        </span>
        <span className="text-white font-bold">:</span>
        <span className={`bg-gradient-to-r ${getTimerColor()} text-white px-2 py-1 rounded text-sm font-medium`}>
          {formatNumber(timeLeft.minutes)}d
        </span>
        <span className="text-white font-bold">:</span>
        <span className={`bg-gradient-to-r ${getTimerColor()} text-white px-2 py-1 rounded text-sm font-medium`}>
          {formatNumber(timeLeft.seconds)}s
        </span>
      </div>
      <span className="text-xs text-gray-400">kaldı</span>
    </div>
  );
};

export default DiscountTimer; 