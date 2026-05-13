import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { PROJECTS } from '../constants/data';
import { MiniProjectVisual } from './MiniProjectVisual';

const actionClass = (disabled: boolean, primary = false) =>
  [
    'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition-all',
    primary
      ? disabled
        ? 'bg-accent-gold/35 text-app-bg/70 cursor-default'
        : 'bg-accent-gold text-app-bg hover:bg-[#dec486]'
      : disabled
        ? 'border border-border-subtle bg-app-card/40 text-text-muted/70 cursor-default'
        : 'border border-border-subtle bg-app-card/40 text-text-primary hover:border-accent-gold/35 hover:text-accent-gold',
  ].join(' ');

export const Projects = () => {
  const [dbProjects, setDbProjects] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/visual/projects', { cache: 'no-store' });
        if (!res.ok) return;
        const payload = await res.json();
        if (!mounted) return;
        const rows = Array.isArray(payload?.projects) ? payload.projects : [];
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
        imageAlt: row.title,
        visual: 'Live Project',
        descriptionHtml: row.descriptionHtml || '',
        tech: Array.isArray(row.tech) ? row.tech : [],
        githubUrl: row.githubUrl || '#',
        demoUrl: row.demoUrl || '#',
      }));
    }

    return PROJECTS.map((project) => ({
      key: project.title,
      title: project.title,
      image: project.image,
      imageAlt: project.imageAlt,
      visual: project.visual,
      descriptionHtml: `<p>${project.description}</p>`,
      tech: project.tech,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
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
                className="glass-card flex h-full flex-col"
              >
                <MiniProjectVisual image={project.image} imageAlt={project.imageAlt} visual={project.visual} />

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-xl font-bold leading-8 text-text-primary">{project.title}</h3>
                  <div
                    className="experience-description mt-4 flex-1 text-sm leading-relaxed text-text-secondary"
                    dangerouslySetInnerHTML={{ __html: project.descriptionHtml || '<p>NULL</p>' }}
                  />

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    {codeDisabled ? (
                      <span className={actionClass(true)}>
                        <FaGithub size={14} />
                        <span>Code</span>
                      </span>
                    ) : (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={actionClass(false)}>
                        <FaGithub size={14} />
                        <span>Code</span>
                      </a>
                    )}

                    {demoDisabled ? (
                      <span className={actionClass(true, true)}>
                        <ExternalLink size={14} />
                        <span>Live</span>
                      </span>
                    ) : (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={actionClass(false, true)}>
                        <ExternalLink size={14} />
                        <span>Live</span>
                      </a>
                    )}
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
