import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';

interface SlideshowProps {
  images: string[];
  fallbackIcon?: LucideIcon;
  fallbackClassName?: string;
  autoPlay?: boolean;
  interval?: number;
}

export default function Slideshow({ 
  images, 
  fallbackIcon: FallbackIcon, 
  fallbackClassName,
  autoPlay = true,
  interval = 3000
}: SlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || !images || images.length <= 1) return;
    
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, images, interval]);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-full bg-white/[0.02] flex items-center justify-center ${fallbackClassName}`}>
         {FallbackIcon ? (
           <FallbackIcon className="w-10 h-10 text-brand-indigo/40" />
         ) : (
           <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center">
             <div className="w-6 h-6 border-2 border-white/10 rounded-lg" />
           </div>
         )}
      </div>
    );
  }

  if (images.length === 1) {
    return <img src={images[0]} alt="" className="w-full h-full object-cover" />;
  }

  return (
    <div className="relative w-full h-full group overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
}
