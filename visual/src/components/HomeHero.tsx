import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { HeroOrbit } from './HeroOrbit';
import { useTheme } from '../context/ThemeContext';

function SunGlyph({ isLight }: { isLight: boolean }) {
  const stroke = isLight ? '#3a3f44' : '#f2f5f7';
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6">
      <circle cx="12" cy="12" r="3.6" fill="none" stroke={stroke} strokeWidth="2.3" />
      <path d="M12 2.8v3.1M12 18.1v3.1M2.8 12h3.1M18.1 12h3.1M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M18.4 5.6l-2.2 2.2M7.8 16.2l-2.2 2.2" fill="none" stroke={stroke} strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

function MoonGlyph({ isLight }: { isLight: boolean }) {
  const fill = isLight ? '#3a3f44' : '#d7dbe0';
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6">
      <path
        fill={fill}
        d="M15.66 3.74a8.67 8.67 0 1 0 4.6 15.87a.86.86 0 0 0-.14-1.57a6.96 6.96 0 0 1-5.73-6.86c0-2.48 1.31-4.72 3.43-5.99a.86.86 0 0 0-.3-1.56a8.65 8.65 0 0 0-1.86.11Z"
      />
    </svg>
  );
}

export function HomeHero() {
  const reduceMotion = useReducedMotion();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const name = 'APON KUMAR DAS';
  const letters = name.split('');

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden px-5 pb-10 pt-20 sm:px-10 lg:px-16 xl:px-20"
    >
      <button
        type="button"
        aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        onClick={toggleTheme}
        className="fixed right-4 top-10 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-transparent bg-transparent shadow-none backdrop-blur-0 transition-none sm:right-6 sm:top-16 sm:h-14 sm:w-14"
      >
        {isLight ? <MoonGlyph isLight={isLight} /> : <SunGlyph isLight={isLight} />}
      </button>

      <HeroOrbit />

      <div className="relative z-10 flex min-h-[calc(100svh-4.5rem)] items-center sm:min-h-[calc(100vh-5rem)]">
        <div className="mx-auto w-full max-w-[22rem] space-y-6 text-center sm:ml-[8vw] sm:mr-0 sm:max-w-[760px] sm:space-y-8 sm:text-left lg:ml-[10vw] xl:ml-[11vw]">
          <div className="space-y-5">
            <div className="relative inline-flex overflow-hidden">
              <p
                aria-label={name}
                className="text-[13px] font-extrabold uppercase tracking-[0.28em] sm:text-[22px] sm:tracking-[0.38em]"
                style={{ color: isLight ? '#a3823d' : '#d6be73' }}
              >
                {letters.map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    className="inline-block"
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            x: -35,
                            y: 6,
                            filter: 'blur(8px)',
                            scale: 0.96,
                          }
                    }
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            filter: 'blur(0px)',
                            scale: 1,
                          }
                    }
                    transition={
                      reduceMotion
                        ? undefined
                        : {
                            duration: 0.45,
                            delay: index * 0.05,
                            ease: [0.22, 1, 0.36, 1],
                          }
                    }
                    style={{
                      minWidth: letter === ' ' ? '0.7em' : undefined,
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </p>

              {!reduceMotion ? (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-[18%] w-[20%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-[rgba(214,190,115,0.28)] to-transparent"
                  initial={{ x: '-120%', opacity: 0 }}
                  animate={{ x: '640%', opacity: [0, 0.6, 0] }}
                  transition={{
                    delay: 0.82,
                    duration: 0.7,
                    ease: 'easeInOut',
                  }}
                />
              ) : null}
            </div>

            <div className="inline-block">
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 0.6,
                        delay: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
                className="whitespace-nowrap font-serif text-[2.15rem] font-bold leading-[0.9] tracking-[-0.04em] text-[#f5f5f5] sm:text-[4.5rem] lg:text-[5.6rem] xl:text-[6.3rem]"
              >
                <span style={{ color: isLight ? '#1b201e' : '#f5f5f5' }}>Data </span>
                <span style={{ color: isLight ? '#008595' : '#00eeff' }}>Engineer</span>
              </motion.h1>
              <div className="relative mt-[0.18em] h-[16px] w-full sm:w-[96%]">
                <motion.div
                  initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                  animate={reduceMotion ? undefined : { scaleX: 1, opacity: 1 }}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 0.9,
                          delay: 1.08,
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                  className="absolute left-0 top-[10px] h-[3px] w-full origin-left rounded-full"
                  style={{
                    background: isLight
                      ? 'linear-gradient(90deg, #b7944b 0%, #008595 58%, #008595 100%)'
                      : 'linear-gradient(90deg, #d6be73 0%, #00eeff 58%, #00eeff 100%)',
                    boxShadow: isLight ? '0 0 10px rgba(0, 133, 149, 0.18)' : '0 0 12px rgba(0, 238, 255, 0.25)',
                    clipPath: 'polygon(0 0, 53.5% 0, 53.5% 100%, 66.5% 100%, 66.5% 0, 100% 0, 100% 100%, 0 100%)',
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
