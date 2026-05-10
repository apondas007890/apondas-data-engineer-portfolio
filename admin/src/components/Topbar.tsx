
import { Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { getCurrentAdminDisplayProfile } from '@/src/lib/supabase/admin-data';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    role: 'Portfolio Owner',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&auto=format&fit=crop',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCurrentAdminDisplayProfile();
        setProfile({
          name: data.full_name || 'Admin User',
          role: data.role_title || 'Portfolio Owner',
          image: data.profile_picture_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&auto=format&fit=crop',
        });
      } catch {
        // keep fallback UI
      }
    };
    load();
  }, []);

  return (
    <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-surface-bg/60 backdrop-blur-2xl z-30">
      <div className="flex items-center gap-8">
        <button 
          onClick={onMenuClick}
          className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white md:hidden transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 p-2 pr-4 rounded-2xl group transition-all duration-500">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/5 shadow-2xl group-hover:scale-105 transition-transform duration-500">
            <img 
              src={profile.image} 
              alt="Admin" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col items-start hidden sm:flex">
            <span className="text-sm font-bold text-white leading-none tracking-tight">{profile.name}</span>
            <span className="text-[10px] text-gray-600 font-bold mt-1 uppercase tracking-widest">{profile.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
