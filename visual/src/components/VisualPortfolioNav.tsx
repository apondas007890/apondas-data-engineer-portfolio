import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { IoLogoWhatsapp } from 'react-icons/io';
import { useActiveSection } from '../hooks/useActiveSection';

const navItems = [
  { label: 'Skills', id: 'skills' },
  { label: 'Experiences', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Resume', id: 'resume' },
  { label: 'Contact', id: 'contact' },
];

const socialItems = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/apondas0090', Icon: FaLinkedin },
  { label: 'WhatsApp', href: 'https://wa.me/8801789879288', Icon: IoLogoWhatsapp },
  { label: 'GitHub', href: 'https://github.com/apondas0070', Icon: FaGithub },
];

const allIds = ['skills', 'experience', 'projects', 'resume'];

function goToSection(sectionId: string) {
  if (sectionId === 'contact') {
    window.open('/visualportfolio/contact', '_blank', 'noopener,noreferrer');
    return;
  }

  const targetPath = `/visualportfolio/${sectionId}`;
  if (window.location.pathname !== targetPath) {
    window.history.pushState({}, '', targetPath);
    window.dispatchEvent(new Event('visual-route-change'));
  }

  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function VisualPortfolioNav() {
  const reduceMotion = useReducedMotion();
  const activeSection = useActiveSection(allIds, 170);

  return (
    <aside className="pointer-events-none fixed bottom-3 left-3 top-3 z-40 hidden w-[92px] sm:block">
      <div className="pointer-events-auto flex h-full w-full flex-col items-center justify-between bg-transparent py-3">
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
          {navItems.map((item, index) => {
            const isContact = item.id === 'contact';
            const active = !isContact && activeSection === item.id;
            const href = isContact ? '/visualportfolio/contact' : `/visualportfolio/${item.id}`;

            return (
              <motion.a
                key={item.id}
                href={href}
                target={isContact ? '_blank' : undefined}
                rel={isContact ? 'noopener noreferrer' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  goToSection(item.id);
                }}
                initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                transition={reduceMotion ? undefined : { duration: 0.24, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-[64px] w-10 items-center justify-center"
              >
                <span
                  className={[
                    'inline-flex w-[170px] justify-center whitespace-nowrap text-[33px] font-semibold leading-none tracking-[0.02em] transition-colors duration-300',
                    active ? 'text-[#00eeff]' : 'text-[rgba(245,245,245,0.72)] hover:text-[#f5f5f5]',
                  ].join(' ')}
                  style={{
                    fontSize: '33px',
                    transform: 'rotate(-90deg) scale(0.5)',
                    transformOrigin: 'center',
                  }}
                >
                  {item.label}
                </span>
              </motion.a>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-5 pb-1">
          <span className="flex items-center gap-[3px] text-[20px] font-semibold text-[rgba(245,245,245,0.5)]">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
          {socialItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="text-[31px] text-[rgba(245,245,245,0.78)] transition-colors duration-300 hover:text-[#f5f5f5]"
              style={{ transform: 'scale(0.72)' }}
            >
              <item.Icon />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
