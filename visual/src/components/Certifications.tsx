import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, FileText } from 'lucide-react';
import { CERTIFICATIONS } from '../constants/data';

export const Certifications = () => {
  return (
    <section id="certifications" className="section-padding">
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Certifications</h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATIONS.map((cert, index) => {
            const color = cert.color;
            const IssuerIcon = cert.icon;
            const verifyDisabled = cert.verifyUrl === '#';

            return (
              <motion.article
                key={cert.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="glass-card flex h-full flex-col justify-between p-5"
              >
                <div>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                      style={{ borderColor: `${color}30`, color, background: `${color}12` }}
                    >
                      <IssuerIcon size={24} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={cert.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View PDF for ${cert.title}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-app-card/35 px-3 py-2 text-sm font-bold text-text-primary transition hover:border-accent-gold hover:text-accent-gold"
                      >
                        <FileText size={16} />
                        <span>View PDF</span>
                      </a>

                      {verifyDisabled ? (
                        <span
                          aria-label={`Verify link unavailable for ${cert.title}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-app-card/35 px-3 py-2 text-sm font-bold text-text-muted/65"
                        >
                          <ExternalLink size={16} />
                          <span>Verify</span>
                        </span>
                      ) : (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Verify ${cert.title}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-app-card/35 px-3 py-2 text-sm font-bold text-text-primary transition hover:border-accent-gold hover:text-accent-gold"
                        >
                          <ExternalLink size={16} />
                          <span>Verify</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold leading-7 text-text-primary">{cert.title}</h3>
                  <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color }}>
                    {cert.issuer}
                  </p>
                </div>

                <div className="mt-8 border-t border-border-subtle pt-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-text-muted">{cert.status}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
