import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ImageOff } from 'lucide-react';
import { PERSONAL_INFO } from '../constants/data';
import RichTextRenderer from './RichTextRenderer';

type AboutPayload = {
  bioHtml: string | null;
  profilePictureUrl: string | null;
  fullName: string | null;
};

export const About = () => {
  const [about, setAbout] = useState<AboutPayload>({
    bioHtml: null,
    profilePictureUrl: null,
    fullName: null,
  });

  useEffect(() => {
    let mounted = true;

    const loadAbout = async () => {
      try {
        const response = await fetch('/api/visual/about', { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        if (!mounted) return;
        setAbout({
          bioHtml: payload?.about?.bioHtml ? String(payload.about.bioHtml) : null,
          profilePictureUrl: payload?.about?.profilePictureUrl ? String(payload.about.profilePictureUrl) : null,
          fullName: payload?.about?.fullName ? String(payload.about.fullName) : PERSONAL_INFO.name,
        });
      } catch {
        setAbout({
          bioHtml: null,
          profilePictureUrl: null,
          fullName: PERSONAL_INFO.name,
        });
      }
    };

    loadAbout();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="about" className="section-padding">
      <div className="mx-auto grid max-w-[1240px] gap-8 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] xl:items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-sm font-extrabold uppercase tracking-[0.38em] text-accent-gold md:text-[1.00rem]">
              About
            </p>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
              Practical pipeline thinking for analytical systems that need clarity and trust.
            </h2>
          </div>

          {about.bioHtml ? (
            <RichTextRenderer
              content={about.bioHtml}
              className="about-bio text-text-secondary"
            />
          ) : (
            <div className="about-bio space-y-5 text-text-secondary">
              <p>{PERSONAL_INFO.aboutText}</p>
              <p>{PERSONAL_INFO.aboutQuote}</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="group relative overflow-hidden rounded-[2rem] border border-border-subtle bg-app-card/45 shadow-[0_26px_80px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,190,115,0.12),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_36%)] opacity-80" />
            {about.profilePictureUrl ? (
              <div className="relative aspect-[0.9/1] min-h-[460px] overflow-hidden">
                <img
                  src={about.profilePictureUrl}
                  alt={about.fullName ? `${about.fullName} portrait` : 'Profile portrait'}
                  className="h-full w-full object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,14,0.02),rgba(10,14,14,0.18)_70%,rgba(10,14,14,0.44))]" />
              </div>
            ) : (
              <div className="relative flex aspect-[0.9/1] min-h-[460px] items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01)),radial-gradient(circle_at_top,rgba(214,190,115,0.09),transparent_55%)]">
                <div className="flex flex-col items-center gap-4 text-center">
                  <span className="flex h-18 w-18 items-center justify-center rounded-full border border-border-subtle bg-app-card/55 text-accent-gold/90">
                    <ImageOff className="h-8 w-8" />
                  </span>
                  <p className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted">
                    Image unavailable
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
