import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../constants/data';
import { DataEngineeringFocusPanel } from './DataEngineeringFocusPanel';

export const About = () => {
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
            <p className="text-[10px] font-extrabold uppercase tracking-[0.38em] text-accent-gold">About</p>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
              Practical pipeline thinking for analytical systems that need clarity and trust.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-text-secondary">
            <p>{PERSONAL_INFO.aboutText}</p>
            <p>{PERSONAL_INFO.aboutQuote}</p>
          </div>

          <div className="rounded-3xl border border-border-subtle bg-app-card/35 p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-text-muted">Core Direction</p>
            <p className="mt-3 text-lg font-semibold leading-8 text-text-primary">
              Structured movement, clean transformation, and dependable outputs.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <DataEngineeringFocusPanel />
        </motion.div>
      </div>
    </section>
  );
};
