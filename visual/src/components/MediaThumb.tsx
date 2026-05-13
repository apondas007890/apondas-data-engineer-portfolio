import React, { useState } from 'react';

export const MediaThumb = ({
  src,
  alt,
  icon: Icon,
  label,
  className = '',
  iconClassName = '',
  imgClassName = '',
}: {
  src?: string;
  alt: string;
  icon: React.ElementType;
  label: string;
  className?: string;
  iconClassName?: string;
  imgClassName?: string;
}) => {
  const [broken, setBroken] = useState(false);
  const showImage = !!src && !broken;

  return (
    <div className={className}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setBroken(true)}
          className={imgClassName}
        />
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
