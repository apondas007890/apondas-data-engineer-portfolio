import React from 'react';
import { Workflow } from 'lucide-react';
import { MediaThumb } from './MediaThumb';

type MiniProjectVisualProps = {
  image: string;
  imageAlt: string;
  visual: string;
};

export function MiniProjectVisual({ image, imageAlt, visual }: MiniProjectVisualProps) {
  return (
    <div className="relative overflow-hidden border-b border-border-subtle bg-app-bg/25 p-4">
      <div className="absolute right-4 top-4 z-10 rounded-full border border-accent-gold/20 bg-app-bg/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-accent-gold backdrop-blur">
        {visual}
      </div>

      <MediaThumb
        src={image}
        alt={imageAlt}
        icon={Workflow}
        label="Project Preview"
        className="h-52 overflow-hidden rounded-[24px] border border-border-subtle bg-app-bg/45"
        iconClassName="text-accent-gold"
        imgClassName="h-full w-full object-cover"
      />
    </div>
  );
}

