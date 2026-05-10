
import { motion } from 'motion/react';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '../constants';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

function SsmsServerMark() {
  return (
    <div className="infra-server-mark" aria-hidden="true">
      <span className="infra-server-layer">
        <i />
        <b />
      </span>
      <span className="infra-server-layer">
        <i />
        <b />
      </span>
      <span className="infra-server-layer">
        <i />
        <b />
      </span>
      <span className="infra-server-status">
        <span className="infra-server-check" />
      </span>
      <span className="infra-server-tag" aria-hidden="true">
        <svg viewBox="0 0 64 48" className="infra-server-tag-mark">
          <path
            d="M6 38 L20 10 L34 38 L30 45 L20 24 L10 45 Z
               M32 10 H46 C54 10 60 16 60 24 C60 32 54 38 46 38 H36
               M36 10 V46
               M36 24 H50"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

export default function Sidebar({ activeSection, onSectionChange, onLogout, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={cn(
        "bg-surface-bg border-r border-white/5 flex flex-col h-screen sticky top-0 z-50 transition-all duration-500 ease-in-out shrink-0 overflow-x-hidden",
        "fixed md:sticky left-0",
        isOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0 w-72 md:w-24",
      )}>
        {/* Brand */}
        <div className={cn(
          "p-10 pb-12 flex items-center transition-all duration-500",
          isOpen ? "justify-between" : "justify-center"
        )}>
          <div className="flex items-start gap-4">
            <div className="logo-container infra-server-pulse group transition-all duration-500 relative shrink-0 scale-[0.84] origin-left-top">
              <SsmsServerMark />
            </div>
            {isOpen && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500 pt-2 pl-2">
                <span className="text-[16px] font-display font-bold text-brand-gold tracking-[0.06em] leading-none">ADMIN</span>
              </div>
            )}
          </div>
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-white/[0.05] rounded-xl transition-colors hidden md:flex items-center justify-center shrink-0"
          >
            <Menu className="w-5 h-5 text-gray-500 hover:text-white" />
          </button>
        </div>

        {/* Nav Section */}
        <div className="flex-1 px-4 overflow-y-auto overflow-x-hidden space-y-10 custom-scrollbar scrollbar-hide">
          <div>
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 text-[10px] uppercase tracking-[0.3em] text-gray-700 font-bold mb-6 block"
              >
                Management
              </motion.span>
            )}
            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  title={!isOpen ? item.label : undefined}
                  className={cn(
                    "w-full flex items-center transition-all duration-500 group relative overflow-hidden",
                    isOpen ? "gap-4 px-6 py-3.5 rounded-2xl" : "justify-center py-5 rounded-2xl mx-auto px-0",
                    activeSection === item.id 
                      ? "text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/10" 
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
                  )}
                >
                  {activeSection === item.id && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-brand-blue/10 pointer-events-none" 
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-500 relative z-10 shrink-0",
                    activeSection === item.id ? "text-brand-blue scale-110" : "group-hover:text-brand-blue group-hover:scale-110 md:group-hover:scale-125"
                  )} />
                  {isOpen && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "font-bold text-[14px] tracking-wide transition-colors duration-300 relative z-10 whitespace-nowrap",
                        activeSection === item.id ? "text-white" : "text-gray-500 group-hover:text-gray-200"
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={cn(
          "p-4 border-t border-white/5 space-y-2 transition-all duration-500",
          !isOpen && "flex flex-col items-center"
        )}>
          {BOTTOM_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => item.id === 'logout' ? onLogout() : onSectionChange(item.id)}
              title={!isOpen ? item.label : undefined}
              className={cn(
                "w-full flex items-center group transition-all duration-300",
                isOpen ? "gap-4 px-6 py-4 rounded-2xl hover:bg-white/[0.02]" : "justify-center py-5 rounded-2xl hover:bg-white/[0.02]"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300",
                item.id === 'logout' ? "text-gray-600 group-hover:text-red-400 group-hover:rotate-12" : "text-gray-600 group-hover:text-brand-blue"
              )} />
              {isOpen && (
                <span className="text-[14px] font-bold text-gray-500 group-hover:text-gray-200 transition-colors animate-in fade-in duration-500">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
