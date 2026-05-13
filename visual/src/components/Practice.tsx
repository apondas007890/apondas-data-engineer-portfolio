import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Target } from 'lucide-react';
import { PRACTICE_STATS } from '../constants/data';

const difficultyColors = {
  easy: '#36D97F',
  medium: '#F2C94C',
  hard: '#D86A4A',
};

const AnimatedCounter = ({ value }: { value: number }) => (
  <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
    {value}
  </motion.span>
);

export const Practice = () => {
  const totals = PRACTICE_STATS.total;

  return (
    <section id="practice" className="section-padding">
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Practice Dashboard</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card relative mb-10 overflow-hidden p-6 sm:p-8"
        >
          <div className="absolute right-4 top-4 rounded-2xl border border-accent-gold/18 bg-accent-gold/10 p-3 text-accent-gold">
            <Target size={20} />
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.34em] text-accent-gold">Problem Solving Summary</p>
              <p className="mt-4 text-6xl font-extrabold tracking-tight text-text-primary md:text-7xl">
                <AnimatedCounter value={totals.grand} />
              </p>
              <p className="mt-2 text-sm font-semibold text-text-secondary">Total problems solved</p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-3 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-[0.22em] text-text-muted">
                  <span>Difficulty Distribution</span>
                    <span>Easy 329 • Medium 149 • Hard 61</span>
                </div>
                <div className="flex h-4 overflow-hidden rounded-full border border-border-subtle bg-app-bg/60">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(totals.easy / totals.grand) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1 }}
                    style={{ background: difficultyColors.easy }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(totals.medium / totals.grand) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.12 }}
                    style={{ background: difficultyColors.medium }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(totals.hard / totals.grand) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.24 }}
                    style={{ background: difficultyColors.hard }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Easy', value: totals.easy, color: difficultyColors.easy },
                  { label: 'Medium', value: totals.medium, color: difficultyColors.medium },
                  { label: 'Hard', value: totals.hard, color: difficultyColors.hard },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-text-muted">{item.label}</p>
                    </div>
                    <p className="text-2xl font-extrabold tracking-tight" style={{ color: item.color }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PRACTICE_STATS.platforms.map((platform, index) => (
            <motion.article
              key={`${platform.name}-${platform.challenge}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="glass-card flex h-full flex-col p-5"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                    style={{ borderColor: `${platform.color}30`, color: platform.color, background: `${platform.color}12` }}
                  >
                    <platform.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{platform.name}</h3>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-text-muted">
                      {platform.challenge}
                    </p>
                  </div>
                </div>

                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${platform.name} ${platform.challenge} external link`}
                  className="rounded-xl border border-border-subtle bg-app-card/35 p-2.5 text-text-muted transition hover:border-accent-gold hover:text-accent-gold"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Easy', value: platform.stats.easy, color: difficultyColors.easy },
                  { label: 'Medium', value: platform.stats.medium, color: difficultyColors.medium },
                  { label: 'Hard', value: platform.stats.hard, color: difficultyColors.hard },
                  { label: 'Total', value: platform.stats.total, color: '#F2EDE4' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-text-muted">{item.label}</p>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight" style={{ color: item.color }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
