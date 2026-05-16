import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { VisualPortfolioNav } from './components/VisualPortfolioNav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Certifications } from './components/Certifications';
import { Practice } from './components/Practice';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  const readSectionFromPath = () => {
    if (typeof window === 'undefined') return 'home';
    const parts = window.location.pathname.split('/').filter(Boolean);
    return parts[1] || 'home';
  };

  useEffect(() => {
    const scrollToSection = (sectionId: string) => {
      if (sectionId === 'home') {
        const home = document.getElementById('home');
        if (home) {
          home.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const sectionId = readSectionFromPath();
    requestAnimationFrame(() => scrollToSection(sectionId));
  }, []);

  const currentSection = readSectionFromPath();
  const isContactRoute = currentSection === 'contact';

  return (
    <ThemeProvider>
      <div className="portfolio-grid-bg min-h-screen overflow-x-hidden selection:bg-accent-gold selection:text-app-bg">
        <VisualPortfolioNav />
        <main>
          {isContactRoute ? (
            <Contact standalone />
          ) : (
            <>
              <Hero />
              <div className="sm:pl-[142px] sm:pr-[40px] [&_.section-padding]:!pl-[30px]">
                <About />
                <Skills />
                <Experience />
                <Projects />
                <Education />
                <Certifications />
                <Practice />
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
