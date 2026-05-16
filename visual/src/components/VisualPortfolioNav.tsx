import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { IoLogoWhatsapp } from 'react-icons/io';
import { useActiveSection } from '../hooks/useActiveSection';

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Experiences', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Educations', id: 'education' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Resume', id: 'resume' },
  { label: 'Contact', id: 'contact' },
];

type SidebarProfile = {
  linkedinUrl?: string;
  githubUrl?: string;
  whatsappNumber?: string;
};

const allIds = [
  'home',
  'about',
  'skills',
  'experience',
  'projects',
  'education',
  'certifications',
  'contact',
];

function goToSection(sectionId: string, resumeUrl?: string) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/visualportfolio';
  const onContactPage = /\/visualportfolio\/contact\/?$/.test(pathname);

  if (sectionId === 'home') {
    if (onContactPage) {
      window.location.href = '/visualportfolio/home';
      return;
    }

    const home = document.getElementById('home');

    if (home) {
      home.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (sectionId === 'contact') {
    if (!onContactPage) {
      window.location.href = '/visualportfolio/contact';
    }
    return;
  }

  if (sectionId === 'resume') {
    const url = normalizeExternalUrl(resumeUrl || '#');
    if (url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    return;
  }

  if (onContactPage) {
    window.location.href = `/visualportfolio/${sectionId}`;
    return;
  }

  const section = document.getElementById(sectionId);

  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const normalizeExternalUrl = (url: string) => {
  const value = (url || '').trim();
  if (!value || value === '#' || /^(null|undefined|n\/a)$/i.test(value)) return '#';
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

const normalizeWhatsAppUrl = (value: string) => {
  const clean = (value || '').trim();
  if (!clean || clean === '#') return '#';
  if (/^https?:\/\//i.test(clean)) return clean;
  const digits = clean.replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : '#';
};

export function VisualPortfolioNav() {
  const reduceMotion = useReducedMotion();
  const activeSection = useActiveSection(allIds, 170);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/visualportfolio';
  const onContactPage = /\/visualportfolio\/contact\/?$/.test(pathname);
  const [profile, setProfile] = useState<SidebarProfile | null>(null);
  const [resumeUrl, setResumeUrl] = useState('#');

  useEffect(() => {
    let mounted = true;

    const loadProfileLinks = async () => {
      try {
        const response = await fetch('/api/visual/about', { cache: 'no-store' });
        if (!response.ok) return;

        const payload = await response.json();
        if (!mounted) return;

        setProfile(payload?.about ? (payload.about as SidebarProfile) : null);
      } catch {
        if (mounted) {
          setProfile(null);
        }
      }
    };

    loadProfileLinks();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadResume = async () => {
      try {
        const response = await fetch('/api/visual/resume', { cache: 'no-store' });
        if (!response.ok) return;

        const payload = await response.json();
        if (!mounted) return;

        setResumeUrl(normalizeExternalUrl(payload?.resume?.fileUrl || '#'));
      } catch {
        if (mounted) {
          setResumeUrl('#');
        }
      }
    };

    loadResume();

    return () => {
      mounted = false;
    };
  }, []);

  const socialItems = useMemo(
    () => [
      {
        label: 'LinkedIn',
        href: normalizeExternalUrl(profile?.linkedinUrl || 'linkedin.com/in/apondas0090'),
        Icon: FaLinkedin,
        hoverColor: '#0A66C2',
        hoverBg: 'rgba(10, 102, 194, 0.16)',
      },
      {
        label: 'GitHub',
        href: normalizeExternalUrl(profile?.githubUrl || 'github.com/apondas0070'),
        Icon: FaGithub,
        hoverColor: '#ffffff',
        hoverBg: 'rgba(255, 255, 255, 0.12)',
      },
      {
        label: 'WhatsApp',
        href: normalizeWhatsAppUrl(profile?.whatsappNumber || '8801789879288'),
        Icon: IoLogoWhatsapp,
        hoverColor: '#25D366',
        hoverBg: 'rgba(37, 211, 102, 0.16)',
      },
    ],
    [profile],
  );

  return (
    <aside className="visual-sidebar pointer-events-none hidden sm:flex">
      <div className="visual-sidebar-inner pointer-events-auto">
        <div className="visual-nav-links">
          {navItems.map((item, index) => {
            const active =
              item.id === 'contact' && onContactPage
                ? true
                : item.id === 'home'
                ? activeSection === null || activeSection === 'home'
                : activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => goToSection(item.id, resumeUrl)}
                initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 0.26,
                        delay: index * 0.028,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
                className={`visual-nav-link ${active ? 'active' : ''}`}
                aria-label={item.id === 'resume' ? 'Open resume in new tab' : item.label}
              >
                <span className="visual-nav-link-text">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="visual-social-links">
          {socialItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="visual-social-link"
              style={
                {
                  '--social-hover': item.hoverColor,
                  '--social-hover-bg': item.hoverBg,
                } as React.CSSProperties
              }
            >
              <item.Icon />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
