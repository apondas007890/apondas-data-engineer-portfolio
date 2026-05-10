import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Personal from './components/Personal';
import Education from './components/Education';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Resume from './components/Resume';
import Skills from './components/Skills';
import Practices from './components/Practices';
import Certifications from './components/Certifications';

interface AppProps {
  onLogout: () => Promise<void> | void;
}

export default function App({ onLogout }: AppProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Simple loading effect to simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    setActiveSection('dashboard');
    setIsSidebarOpen(false);
    await onLogout();
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setActiveSection} />;
      case 'personal':
        return <Personal />;
      case 'education':
        return <Education />;
      case 'experience':
        return <Experience />;
      case 'projects':
        return <Projects />;
      case 'skills':
        return <Skills />;
      case 'practices':
        return <Practices />;
      case 'certifications':
        return <Certifications />;
      case 'resume':
        return <Resume />;
      case 'logout':
        return null;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-gray-500">
               <span className="text-2xl font-display font-medium text-white block mb-2">{activeSection.toUpperCase()}</span>
               <p>This section is currently under development.</p>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 bg-brand-500"
            />
          </div>
          <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Initializing Admin</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-bg text-gray-200">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={(id) => {
          setActiveSection(id);
          if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
          }
        }} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={toggleSidebar} />
        
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
