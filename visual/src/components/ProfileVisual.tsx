import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera } from 'lucide-react';

const HERO_IMAGE_PATH = '/images/apon-portrait.jpg';

export const ProfileVisual = () => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="absolute inset-10 rounded-full bg-accent-gold/10 blur-[90px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10"
      >
        <div className="group relative overflow-hidden rounded-[32px] border border-border-subtle bg-app-card/80 p-3 shadow-[0_28px_70px_rgba(0,0,0,0.28)]">
          <div className="overflow-hidden rounded-[26px] border border-white/8 bg-app-bg/60">
            {!hasError ? (
              <img
                src={HERO_IMAGE_PATH}
                alt="Portrait of Apon Kumar Das"
                onError={() => setHasError(true)}
                className="h-[520px] w-full object-cover grayscale transition duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
              />
            ) : (
              <div className="flex h-[520px] w-full flex-col items-center justify-center bg-gradient-to-b from-app-secondary to-app-bg text-text-muted">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent-gold/20 bg-accent-gold/10 text-accent-gold">
                  <Camera size={30} />
                </div>
                <p className="mt-5 text-lg font-bold text-text-primary">Portrait Preview</p>
                <p className="mt-2 max-w-xs text-center text-sm leading-6">
                  Add your image at <span className="font-semibold text-accent-gold">{HERO_IMAGE_PATH}</span> and it
                  will appear here in black and white, then reveal color on hover.
                </p>
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-8 bottom-8 flex items-center justify-between rounded-2xl border border-white/8 bg-app-bg/70 px-4 py-3 backdrop-blur">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-accent-gold">Portrait Mode</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">Black and white default</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-text-muted">Hover State</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">Full color reveal</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
