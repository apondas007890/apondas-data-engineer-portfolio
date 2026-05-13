import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CalendarRange, Award } from 'lucide-react';
import { EDUCATION } from '../constants/data';
import { MediaThumb } from './MediaThumb';

export const Education = () => {
  const [dbEducation, setDbEducation] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/visual/education', { cache: 'no-store' });
        if (!res.ok) return;
        const payload = await res.json();
        if (!mounted) return;
        const rows = Array.isArray(payload?.educations) ? payload.educations : [];
        setDbEducation(rows.length > 0 ? rows : null);
      } catch {
        setDbEducation(null);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const educationRows = useMemo(() => {
    if (dbEducation && dbEducation.length > 0) {
      return dbEducation.map((row) => ({
        key: row.id,
        degree: row.degree,
        institution: row.institution,
        websiteUrl: row.websiteUrl || '#',
        year: row.year,
        result: row.result,
        descriptionHtml: row.descriptionHtml,
        image: row.images?.[0] || '',
        imageAlt: row.institution || 'Education image',
        icon: Award,
      }));
    }

    return EDUCATION.map((edu) => ({
      key: edu.degree,
      degree: edu.degree,
      institution: edu.institution,
      websiteUrl: edu.websiteUrl,
      year: edu.year,
      result: edu.result,
      descriptionHtml: `<p>${edu.description}</p>`,
      image: edu.image,
      imageAlt: edu.imageAlt,
      icon: edu.icon,
    }));
  }, [dbEducation]);

  return (
    <section id="education" className="section-padding">
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Education</h2>
        </motion.div>

        <div className="grid gap-5">
          {educationRows.map((edu, index) => (
            <motion.article
              key={edu.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="glass-card p-4 sm:p-5"
            >
              <div className="grid gap-5 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-center">
                <MediaThumb
                  src={edu.image}
                  alt={edu.imageAlt || edu.institution}
                  icon={edu.icon || Award}
                  label={edu.institution}
                  className="h-40 overflow-hidden rounded-[30px] border border-border-subtle bg-app-bg/45"
                  iconClassName="text-accent-gold"
                  imgClassName="h-full w-full object-cover"
                />

                <div className="space-y-4 lg:space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-[1.3rem] font-bold leading-tight text-text-primary md:text-[1.6rem]">
                      {edu.degree}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#6FA0D2]">
                        {edu.institution}
                      </p>
                      <a
                        href={edu.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-app-bg/80 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-text-muted transition hover:border-accent-gold/45 hover:bg-accent-gold/10 hover:text-accent-gold"
                      >
                        <ArrowUpRight size={14} />
                        <span>Website</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-app-bg/55 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-text-secondary">
                      <CalendarRange size={14} className="text-[#5E5AAE]" />
                      <span>{edu.year}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl border border-accent-gold/18 bg-accent-gold/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent-gold">
                      <Award size={14} />
                      <span>{edu.result}</span>
                    </div>
                  </div>

                  <div
                    className="experience-description max-w-4xl text-sm leading-relaxed text-text-secondary"
                    dangerouslySetInnerHTML={{ __html: edu.descriptionHtml || '<p>NULL</p>' }}
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
