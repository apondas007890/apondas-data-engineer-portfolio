import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Award, ExternalLink, FileText } from 'lucide-react';
import { SiCisco, SiDatabricks, SiDatacamp } from 'react-icons/si';
import { CERTIFICATIONS } from '../constants/data';
import RichTextRenderer from './RichTextRenderer';

type DbCertification = {
  id: string;
  title: string;
  issuer: string;
  descriptionHtml: string;
  verifyUrl: string;
  pdfUrl: string;
  issuerLogoUrl: string;
  status: string;
};

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

type CertificationRow = {
  key: string;
  title: string;
  issuer: string;
  pdf: string;
  verifyUrl: string;
  status: string;
  color: string;
  descriptionHtml: string;
  issuerLogoUrl: string;
  icon?: IconComponent;
  issuerKey?: 'datacamp' | 'cisco' | 'databricks' | 'grameenphone' | null;
};

const API_BASE = (import.meta.env.VITE_VISUAL_API_BASE_URL || '').replace(/\/$/, '');
const CERTIFICATIONS_API_PATH = '/api/visual/certifications';

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

const ISSUER_VISUALS = {
  datacamp: {
    icon: SiDatacamp as IconComponent,
    color: '#03EF62',
  },
  cisco: {
    icon: SiCisco as IconComponent,
    color: '#1BA0D7',
  },
  databricks: {
    icon: SiDatabricks as IconComponent,
    color: '#FF3621',
  },
} as const;

function resolveIssuerKey(issuer: string): Exclude<CertificationRow['issuerKey'], 'grameenphone'> {
  const normalized = issuer.trim().toLowerCase();
  if (normalized.includes('datacamp')) return 'datacamp';
  if (normalized.includes('cisco')) return 'cisco';
  if (normalized.includes('databricks')) return 'databricks';
  return null;
}

export const Certifications = () => {
  const [dbCertifications, setDbCertifications] = useState<DbCertification[] | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCertifications = async () => {
      for (const url of getApiCandidates(CERTIFICATIONS_API_PATH)) {
        try {
          const response = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
          if (!response.ok) continue;

          const payload = await response.json();
          if (!mounted) return;

          const rows = Array.isArray(payload?.certifications) ? (payload.certifications as DbCertification[]) : [];
          setDbCertifications(rows.length > 0 ? rows : null);
          return;
        } catch {
          continue;
        }
      }

      if (mounted) {
        setDbCertifications(null);
      }
    };

    loadCertifications();
    return () => {
      mounted = false;
    };
  }, []);

  const certificationRows = useMemo(() => {
    if (dbCertifications && dbCertifications.length > 0) {
      return dbCertifications.map((cert): CertificationRow => ({
        issuerKey: resolveIssuerKey(cert.issuer),
        key: cert.id,
        title: cert.title,
        issuer: cert.issuer,
        pdf: normalizeExternalUrl(cert.pdfUrl || '#'),
        verifyUrl: normalizeExternalUrl(cert.verifyUrl || '#'),
        status: cert.status,
        color: '#d1b46f',
        descriptionHtml: cert.descriptionHtml,
        issuerLogoUrl: cert.issuerLogoUrl,
      }));
    }

    return CERTIFICATIONS.map((cert): CertificationRow => ({
      issuerKey: resolveIssuerKey(cert.issuer),
      key: cert.title,
      title: cert.title,
      issuer: cert.issuer,
      pdf: normalizeExternalUrl(cert.pdf),
      verifyUrl: normalizeExternalUrl(cert.verifyUrl),
      status: cert.status,
      color: cert.color,
      descriptionHtml: '',
      issuerLogoUrl: '',
      icon: cert.icon,
    }));
  }, [dbCertifications]);

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
          {certificationRows.map((cert, index) => {
            const issuerVisual = cert.issuerKey ? ISSUER_VISUALS[cert.issuerKey] : null;
            const color = issuerVisual?.color ?? cert.color;
            const verifyDisabled = !isActiveExternalUrl(cert.verifyUrl);
            const pdfDisabled = !isActiveExternalUrl(cert.pdf);
            const IssuerIcon = issuerVisual?.icon ?? cert.icon ?? Award;

            return (
              <motion.article
                key={cert.key}
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
                      {cert.issuerLogoUrl ? (
                        <img src={cert.issuerLogoUrl} alt={cert.issuer} className="h-8 w-8 object-contain" loading="lazy" />
                      ) : (
                        <IssuerIcon size={24} />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {pdfDisabled ? (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-app-card/35 px-3 py-2 text-sm font-bold text-text-muted/65">
                          <FileText size={16} />
                          <span>View PDF</span>
                        </span>
                      ) : (
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
                      )}

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
                  {cert.descriptionHtml ? (
                    <RichTextRenderer
                      content={cert.descriptionHtml}
                      className="mt-4 text-sm leading-relaxed text-text-secondary"
                    />
                  ) : null}
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
