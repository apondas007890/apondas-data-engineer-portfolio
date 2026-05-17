import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, FolderGit2, Server, Database, BarChart3 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import {
  SiApachekafka,
  SiApachespark,
  SiJson,
  SiMysql,
  SiNestjs,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiR,
  SiSupabase,
} from 'react-icons/si';
import { PROJECTS } from '../constants/data';
import { MediaThumb } from './MediaThumb';
import RichTextRenderer from './RichTextRenderer';
import { useTheme } from '../context/ThemeContext';

type DbProject = {
  id: string;
  title: string;
  image: string;
  images?: string[];
  descriptionHtml: string;
  tech: string[];
  githubUrl: string;
  demoUrl: string;
};

type TechVisual = {
  icon: React.ElementType;
  color: string;
};

const TECH_VISUALS: Record<string, TechVisual> = {
  nestjs: { icon: SiNestjs, color: '#E0234E' },
  postgresql: { icon: SiPostgresql, color: '#336791' },
  postman: { icon: SiPostman, color: '#FF6C37' },
  python: { icon: SiPython, color: '#3776AB' },
  spark: { icon: SiApachespark, color: '#E25A1C' },
  kafka: { icon: SiApachekafka, color: '#EDE8DE' },
  mysql: { icon: SiMysql, color: '#4479A1' },
  r: { icon: SiR, color: '#276DC3' },
  json: { icon: SiJson, color: '#F0DB4F' },
  supabase: { icon: SiSupabase, color: '#3ECF8E' },
  database: { icon: Database, color: '#8B9495' },
  backend: { icon: Server, color: '#8BA7C6' },
  analytics: { icon: BarChart3, color: '#D1B46F' },
};

const normalizeTechKey = (tech: string) => tech.trim().toLowerCase();

const normalizeExternalUrl = (url: string) => {
  const value = (url || '').trim();
  if (!value || value === '#' || /^(null|undefined|n\/a)$/i.test(value)) return '#';
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

export const Projects = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [dbProjects, setDbProjects] = useState<DbProject[] | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/visual/projects', { cache: 'no-store' });
        if (!res.ok) return;
        const payload = await res.json();
        if (!mounted) return;
        const rows = Array.isArray(payload?.projects) ? (payload.projects as DbProject[]) : [];
        setDbProjects(rows.length > 0 ? rows : null);
      } catch {
        setDbProjects(null);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const projectRows = useMemo(() => {
    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map((row) => ({
        key: row.id,
        title: row.title,
        image: row.image || '/projects/customer-shopping-trends.png',
        images: Array.isArray(row.images) ? row.images : row.image ? [row.image] : ['/projects/customer-shopping-trends.png'],
        imageAlt: row.title,
        descriptionHtml: row.descriptionHtml || '',
        tech: Array.isArray(row.tech) ? row.tech : [],
        githubUrl: normalizeExternalUrl(row.githubUrl || '#'),
        demoUrl: normalizeExternalUrl(row.demoUrl || '#'),
      }));
    }

    return PROJECTS.map((project) => ({
      key: project.title,
      title: project.title,
      image: project.image,
      images: project.image ? [project.image] : [],
      imageAlt: project.imageAlt,
      visual: project.visual,
      descriptionHtml: `<p>${project.description}</p>`,
      tech: project.tech,
      githubUrl: normalizeExternalUrl(project.githubUrl),
      demoUrl: normalizeExternalUrl(project.demoUrl),
    }));
  }, [dbProjects]);

  return (
    <section id="projects" className="section-padding">
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Projects</h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {projectRows.map((project, index) => {
            const codeDisabled = project.githubUrl === '#';
            const demoDisabled = project.demoUrl === '#';

            return (
              <motion.article
                key={project.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
                className="glass-card group flex h-full flex-col overflow-hidden"
              >
                <div className="relative">
                  <div className="relative h-[230px] overflow-hidden border-b border-border-subtle bg-app-bg/55">
                    <MediaThumb
                      src={project.image}
                      images={project.images}
                      alt={project.imageAlt}
                      icon={FolderGit2}
                      label={project.title}
                      className="h-full w-full"
                      iconClassName="text-accent-gold"
                      imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />

                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: isLight ? 'rgba(248, 241, 229, 0.16)' : 'rgba(4, 6, 6, 0.2)' }}
                    />
                    <div
                      className="absolute inset-0 opacity-45 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: isLight
                          ? 'linear-gradient(to top, rgba(248,241,229,0.92), rgba(248,241,229,0.42), transparent)'
                          : 'linear-gradient(to top, rgba(4,6,6,0.88), rgba(4,6,6,0.42), transparent)',
                      }}
                    />

                    <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 translate-y-3 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {project.githubUrl !== '#' ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} GitHub repository`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-text-primary backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold hover:text-accent-gold"
                          style={{
                            borderColor: isLight ? 'rgba(24, 28, 27, 0.12)' : 'rgba(255,255,255,0.12)',
                            background: isLight ? 'rgba(255, 250, 242, 0.94)' : 'rgba(9, 12, 13, 0.84)',
                            boxShadow: isLight
                              ? '0 10px 24px rgba(38,31,20,0.12)'
                              : '0 10px 24px rgba(0,0,0,0.28)',
                          }}
                        >
                          <FaGithub size={15} />
                        </a>
                      ) : null}

                      {project.demoUrl !== '#' ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} live demo`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-text-primary backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold hover:text-accent-gold"
                          style={{
                            borderColor: isLight ? 'rgba(24, 28, 27, 0.12)' : 'rgba(255,255,255,0.12)',
                            background: isLight ? 'rgba(255, 250, 242, 0.94)' : 'rgba(9, 12, 13, 0.84)',
                            boxShadow: isLight
                              ? '0 10px 24px rgba(38,31,20,0.12)'
                              : '0 10px 24px rgba(0,0,0,0.28)',
                          }}
                        >
                          <ExternalLink size={15} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-xl font-bold leading-8 text-text-primary">{project.title}</h3>
                  <RichTextRenderer
                    content={project.descriptionHtml}
                    className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary"
                  />

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {project.tech.map((tech) => (
                      (() => {
                        const visual = TECH_VISUALS[normalizeTechKey(tech)];
                        const Icon = visual?.icon;

                        return (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.01em] text-text-secondary"
                            style={{
                              borderColor: isLight ? 'rgba(24, 28, 27, 0.1)' : 'rgba(255,255,255,0.08)',
                              background: isLight ? 'rgba(24, 28, 27, 0.035)' : 'rgba(255,255,255,0.03)',
                            }}
                          >
                            {Icon ? <Icon size={14} style={{ color: visual.color }} /> : null}
                            <span>{tech}</span>
                          </span>
                        );
                      })()
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
