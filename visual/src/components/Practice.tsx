import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { SiCodechef, SiHackerrank, SiLeetcode } from 'react-icons/si';
import { ChartColumn } from 'lucide-react';
import { PRACTICE_STATS } from '../constants/data';
import { useTheme } from '../context/ThemeContext';

const difficultyColors = {
  easy: '#36D97F',
  medium: '#F2C94C',
  hard: '#D86A4A',
};

type PracticePlatformRow = {
  id: string;
  name: string;
  challenge: string;
  url: string;
  easy: number;
  medium: number;
  hard: number;
  total: number;
};

type PracticePayload = {
  total: {
    easy: number;
    medium: number;
    hard: number;
    grand: number;
  };
  platforms: PracticePlatformRow[];
};

const API_BASE = (import.meta.env.VITE_VISUAL_API_BASE_URL || '').replace(/\/$/, '');
const PRACTICE_API_PATH = '/api/visual/practice';

const buildApiUrl = (path: string) => `${API_BASE}${path}`;

const normalizeExternalUrl = (url: string) => {
  const value = (url || '').trim();
  if (!value || value === '#' || /^(null|undefined|n\/a)$/i.test(value)) return '#';
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

const isActiveExternalUrl = (url: string) => url !== '#';

const getApiCandidates = (path: string) => {
  const candidates = [buildApiUrl(path), path];
  return [...new Set(candidates.filter(Boolean))];
};

const AnimatedCounter = ({ value }: { value: number }) => (
  <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
    {value}
  </motion.span>
);

const getPlatformMeta = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('hackerrank')) {
    return { icon: SiHackerrank, color: '#36D97F' };
  }
  if (lower.includes('leetcode')) {
    return { icon: SiLeetcode, color: '#F2C94C' };
  }
  if (lower.includes('codechef')) {
    return { icon: SiCodechef, color: '#D0B08B' };
  }
  if (lower.includes('stratascratch')) {
    return { icon: ChartColumn, color: '#88A9C5' };
  }
  return { icon: ChartColumn, color: '#8B9495' };
};

export const Practice = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [dbPractice, setDbPractice] = useState<PracticePayload | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPractice = async () => {
      for (const url of getApiCandidates(PRACTICE_API_PATH)) {
        try {
          const response = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
          if (!response.ok) continue;

          const payload = await response.json();
          if (!mounted) return;

          const platforms = Array.isArray(payload?.platforms)
            ? (payload.platforms as PracticePlatformRow[])
            : [];

          if (
            payload?.total &&
            typeof payload.total.easy === 'number' &&
            typeof payload.total.medium === 'number' &&
            typeof payload.total.hard === 'number' &&
            typeof payload.total.grand === 'number' &&
            platforms.length > 0
          ) {
            setDbPractice({
              total: payload.total,
              platforms,
            });
            return;
          }
        } catch {
          continue;
        }

        if (!mounted) return;
      }

      if (mounted) {
        setDbPractice(null);
      }
    };

    loadPractice();
    return () => {
      mounted = false;
    };
  }, []);

  const practiceRows = useMemo(() => {
    if (dbPractice && dbPractice.platforms.length > 0) {
      return {
        total: dbPractice.total,
        platforms: dbPractice.platforms.map((platform) => ({
          ...platform,
          url: normalizeExternalUrl(platform.url),
          ...getPlatformMeta(platform.name),
        })),
      };
    }

    return {
      total: PRACTICE_STATS.total,
      platforms: PRACTICE_STATS.platforms.map((platform) => ({
        id: `${platform.name}-${platform.challenge}`,
        name: platform.name,
        challenge: platform.challenge,
        url: normalizeExternalUrl(platform.url),
        easy: platform.stats.easy,
        medium: platform.stats.medium,
        hard: platform.stats.hard,
        total: platform.stats.total,
        icon: platform.icon,
        color: platform.color,
      })),
    };
  }, [dbPractice]);

  const totals = practiceRows.total;

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
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.34em] text-accent-gold">
                Problem Solving Summary
              </p>
              <p className="mt-4 text-6xl font-extrabold tracking-tight text-text-primary md:text-7xl">
                <AnimatedCounter value={totals.grand} />
              </p>
              <p className="mt-2 text-sm font-semibold text-text-secondary">Total problems solved</p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-3 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-[0.22em] text-text-muted">
                  <span>Difficulty Distribution</span>
                  <span>{`Easy ${totals.easy} • Medium ${totals.medium} • Hard ${totals.hard}`}</span>
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
                  <div
                    key={item.label}
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: isLight ? 'rgba(24, 28, 27, 0.1)' : 'rgba(255,255,255,0.08)',
                      background: isLight ? 'rgba(24, 28, 27, 0.03)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-text-muted">
                        {item.label}
                      </p>
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
          {practiceRows.platforms.map((platform, index) => (
            <motion.article
              key={`${platform.id}-${platform.challenge}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="glass-card flex h-full flex-col p-5"
            >
              {(() => {
                const linkDisabled = !isActiveExternalUrl(platform.url);

                return (
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                        style={{
                          borderColor: `${platform.color}30`,
                          color: platform.color,
                          background: `${platform.color}12`,
                        }}
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

                    {linkDisabled ? (
                      <span
                        aria-disabled="true"
                        aria-label={`${platform.name} ${platform.challenge} link unavailable`}
                        className="pointer-events-none cursor-default rounded-xl border border-border-subtle bg-app-card/35 p-2.5 text-text-muted/60"
                      >
                        <ExternalLink size={16} />
                      </span>
                    ) : (
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${platform.name} ${platform.challenge} external link`}
                        className="rounded-xl border border-border-subtle bg-app-card/35 p-2.5 text-text-muted transition hover:border-accent-gold hover:text-accent-gold"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Easy', value: platform.easy, color: difficultyColors.easy },
                  { label: 'Medium', value: platform.medium, color: difficultyColors.medium },
                  { label: 'Hard', value: platform.hard, color: difficultyColors.hard },
                  { label: 'Total', value: platform.total, color: isLight ? '#1a2120' : '#F2EDE4' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: isLight ? 'rgba(24, 28, 27, 0.1)' : 'rgba(255,255,255,0.08)',
                      background: isLight ? 'rgba(24, 28, 27, 0.03)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-text-muted">
                      {item.label}
                    </p>
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
