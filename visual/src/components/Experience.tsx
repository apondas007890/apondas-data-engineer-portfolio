import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Calendar, Building2, MapPin } from 'lucide-react';
import { EXPERIENCE } from '../constants/data';
import { MediaThumb } from './MediaThumb';
import RichTextRenderer from './RichTextRenderer';

type DbExperience = {
  id: string;
  title: string;
  company: string;
  websiteUrl: string;
  location: string;
  duration: string;
  images: string[];
  descriptionHtml: string;
};

export const Experience = () => {
  const [dbExperience, setDbExperience] = useState<DbExperience[] | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadExperience = async () => {
      try {
        const response = await fetch('/api/visual/experience', { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        if (!mounted) return;
        const rows = Array.isArray(payload?.experiences) ? (payload.experiences as DbExperience[]) : [];
        setDbExperience(rows.length > 0 ? rows : null);
      } catch {
        setDbExperience(null);
      }
    };

    loadExperience();
    return () => {
      mounted = false;
    };
  }, []);

  const experienceRows = useMemo(() => {
    if (dbExperience && dbExperience.length > 0) {
      return dbExperience.map((item) => ({
        key: item.id,
        title: item.title,
        company: item.company,
        location: item.location,
        duration: item.duration,
        images: item.images || [],
        image: item.images[0] || '',
        imageAlt: `${item.company} experience image`,
        websiteUrl: item.websiteUrl || '#',
        descriptionHtml: item.descriptionHtml,
      }));
    }

      return EXPERIENCE.map((exp) => ({
      key: `${exp.company}-${exp.title}`,
      title: exp.title,
      company: exp.company,
      location: exp.location,
      duration: exp.duration,
      images: exp.image ? [exp.image] : [],
      image: exp.image,
      imageAlt: exp.imageAlt,
      websiteUrl: exp.websiteUrl,
      descriptionHtml: `<ul>${exp.description.map((line) => `<li>${line}</li>`).join('')}</ul>`,
    }));
  }, [dbExperience]);

  return (
    <section id="experience" className="section-padding">
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-[2rem] font-bold tracking-tight sm:text-3xl md:text-5xl">Experience</h2>
        </motion.div>

        <div className="grid gap-6">
          {experienceRows.map((exp, index) => (
            <motion.article
              key={exp.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="glass-card p-2 sm:p-3"
            >
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
                <MediaThumb
                  src={exp.image}
                  images={exp.images}
                  alt={exp.imageAlt}
                  icon={Building2}
                  label={exp.company}
                  className="h-[180px] overflow-hidden rounded-[22px] border border-border-subtle bg-app-bg/45 sm:h-[230px] sm:rounded-3xl"
                  iconClassName="text-accent-gold"
                  imgClassName="h-full w-full object-cover"
                />

                <div className="space-y-4 pr-0 sm:space-y-5 sm:pr-2">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="text-[1.55rem] font-bold tracking-tight text-accent-indigo sm:text-4xl">{exp.title}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-sky-300 sm:text-sm sm:tracking-[0.14em]">{exp.company}</span>
                        {exp.websiteUrl && exp.websiteUrl !== '#' ? (
                          <a
                            href={exp.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="visual-website-link"
                          >
                            <ArrowUpRight size={9} />
                            <span>Website</span>
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 border-b border-border-subtle pb-4 text-[10px] font-extrabold uppercase tracking-[0.1em] text-text-secondary sm:gap-8 sm:pb-5 sm:text-[11px] sm:tracking-[0.12em]">
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={14} className="text-accent-indigo" />
                        <span>{exp.location}</span>
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{exp.duration}</span>
                      </span>
                    </div>
                  </div>

                  <RichTextRenderer
                    content={exp.descriptionHtml}
                    className="text-[13px] leading-relaxed text-[#93a6c4] sm:text-[14px] md:text-[16px]"
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
