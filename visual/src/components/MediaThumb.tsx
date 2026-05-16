import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export const MediaThumb = ({
  src,
  images,
  alt,
  icon: Icon,
  label,
  className = '',
  iconClassName = '',
  imgClassName = '',
  interval = 3200,
}: {
  src?: string;
  images?: string[];
  alt: string;
  icon: React.ElementType;
  label: string;
  className?: string;
  iconClassName?: string;
  imgClassName?: string;
  interval?: number;
}) => {
  const [brokenImages, setBrokenImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const imagePool = useMemo(() => {
    const sourceImages = Array.isArray(images) && images.length > 0 ? images : src ? [src] : [];
    return [...new Set(sourceImages.map((item) => item?.trim()).filter(Boolean) as string[])];
  }, [images, src]);

  const validImages = useMemo(
    () => imagePool.filter((image) => !brokenImages.includes(image)),
    [brokenImages, imagePool],
  );

  useEffect(() => {
    setBrokenImages([]);
    setIndex(0);
    setDirection(1);
  }, [imagePool.join('|')]);

  useEffect(() => {
    if (index >= validImages.length && validImages.length > 0) {
      setIndex(0);
    }
  }, [index, validImages.length]);

  useEffect(() => {
    if (validImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % validImages.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval, validImages.length]);

  const activeImage = validImages[index] ?? '';
  const showImage = !!activeImage;

  return (
    <div className={className}>
      {showImage ? (
        validImages.length === 1 ? (
          <img
            src={activeImage}
            alt={alt}
            loading="lazy"
            onError={() => setBrokenImages((current) => [...new Set([...current, activeImage])])}
            className={imgClassName}
          />
        ) : (
          <div className="relative h-full w-full overflow-hidden">
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#040606]/30 via-transparent to-white/5 pointer-events-none" />
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={alt}
                loading="lazy"
                onError={() => setBrokenImages((current) => [...new Set([...current, activeImage])])}
                custom={direction}
                initial={{ opacity: 0, x: 26 * direction, scale: 1.08, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, scale: 1.015, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -22 * direction, scale: 0.985, filter: 'blur(3px)' }}
                transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
              />
            </AnimatePresence>
          </div>
        )
      ) : (
        <div className={`flex h-full w-full flex-col items-center justify-center gap-2 ${iconClassName}`}>
          <Icon size={28} />
          <span className="px-3 text-center text-[10px] font-extrabold uppercase tracking-[0.18em]">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};
