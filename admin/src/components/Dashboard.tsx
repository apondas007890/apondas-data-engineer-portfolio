
import { motion } from 'motion/react';
import { 
  FolderKanban, Award, FileText, Edit2, 
  CheckCircle2, Clock, GraduationCap, Briefcase, Brain, 
  Zap, Activity, Terminal, Shield, Cpu, ChevronRight,
  Database, Layout, Workflow
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { getCurrentAdminProfile, getDashboardCounts, getCurrentAdminDisplayProfile, getDashboardActivity, getExperienceYearsValue, type DashboardActivity } from '@/src/lib/supabase/admin-data';

const QUICK_ACTIONS = [
  { label: 'Refine Identity', id: 'personal', icon: Edit2, description: 'Core bio and metadata' },
  { label: 'Expand Studies', id: 'education', icon: GraduationCap, description: 'Academic history' },
  { label: 'Scale Career', id: 'experience', icon: Briefcase, description: 'Professional roadmap' },
  { label: 'Ship Project', id: 'projects', icon: FolderKanban, description: 'Deploy latest work' },
  { label: 'Audit Skills', id: 'skills', icon: Database, description: 'Stack validation' },
  { label: 'View Assets', id: 'practices', icon: Layout, description: 'Visual components' },
];

interface DashboardProps {
  onSectionChange: (id: string) => void;
}

export default function Dashboard({ onSectionChange }: DashboardProps) {
  const [uptime, setUptime] = useState(0);
  const [adminEmail, setAdminEmail] = useState('loading...');
  const [counts, setCounts] = useState({
    education: 0,
    experience: 0,
    projects: 0,
    certifications: 0,
    practice_platforms: 0,
    skills: 0,
    solved_problems: 0,
  });
  const [displayProfile, setDisplayProfile] = useState({
    name: 'Admin Principal',
    role: 'Portfolio Owner',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300&auto=format&fit=crop',
  });
  const [activity, setActivity] = useState<DashboardActivity[]>([]);
  const [experienceYears, setExperienceYears] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getCurrentAdminProfile();
        setAdminEmail(profile.email || 'admin');
        const nextCounts = await getDashboardCounts(profile.id);
        setCounts(nextCounts);
        const expYears = await getExperienceYearsValue(profile.id);
        setExperienceYears(expYears);
        const nextActivity = await getDashboardActivity(profile.id);
        setActivity(nextActivity);

        const display = await getCurrentAdminDisplayProfile();
        setDisplayProfile({
          name: display.full_name || 'Admin Principal',
          role: display.role_title || 'Portfolio Owner',
          image: display.profile_picture_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300&auto=format&fit=crop',
        });
      } catch {
        setAdminEmail('admin');
      }
    };
    load();
  }, []);

  const getActivityUI = (entry: DashboardActivity) => {
    if (entry.area === 'projects') return { icon: FolderKanban, color: 'bg-brand-indigo', textColor: 'text-brand-indigo' };
    if (entry.area === 'experience') return { icon: Briefcase, color: 'bg-brand-green', textColor: 'text-brand-green' };
    if (entry.area === 'education') return { icon: GraduationCap, color: 'bg-brand-blue', textColor: 'text-brand-blue' };
    return { icon: Award, color: 'bg-brand-gold', textColor: 'text-brand-gold' };
  };

  const stats = [
    { label: 'Solved', value: String(counts.solved_problems).padStart(2, '0'), icon: Brain, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10', trend: 'Problems' },
    { label: 'Experience', value: experienceYears ? String(experienceYears) : '0.0', icon: Briefcase, color: 'text-brand-blue', bg: 'bg-brand-blue/10', trend: 'Timeline' },
    { label: 'Projects', value: String(counts.projects).padStart(2, '0'), icon: FolderKanban, color: 'text-brand-green', bg: 'bg-brand-green/10', trend: 'Rows' },
    { label: 'Certifications', value: String(counts.certifications).padStart(2, '0'), icon: Award, color: 'text-brand-gold', bg: 'bg-brand-gold/10', trend: 'Rows' },
  ];

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[0.16, 1, 0.3, 1]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.6)]" />
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.4em]">Node: Active_Session</span>
          </div>
          <h2 className="text-6xl font-display font-bold text-white tracking-tighter">Overview</h2>
          <p className="text-gray-500 font-medium max-w-sm leading-relaxed">Centralized telemetry for your architectural projects and professional evolution.</p>
          <p className="text-[11px] text-brand-blue font-mono uppercase tracking-wider">admin: {adminEmail}</p>
        </div>
        
        <div className="flex items-center gap-8 bg-[#161720]/50 border border-white/5 px-8 py-5 rounded-[2.5rem] backdrop-blur-xl">
          <div className="flex flex-col gap-1.5">
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.25em] flex items-center gap-2">
              <Clock className="w-3 h-3 text-brand-indigo" /> Runtime
            </span>
            <span className="text-2xl font-mono font-bold text-white tabular-nums tracking-tight">{formatUptime(uptime)}</span>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.25em] flex items-center gap-2">
              <Activity className="w-3 h-3 text-brand-blue" /> Integrity
            </span>
            <span className="text-2xl font-mono font-bold text-brand-blue tracking-tight">99.9%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label}
            className="group relative bg-[#12131a] border border-white/5 p-6 rounded-[2rem] hover:border-brand-indigo/30 transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl"
          >
            <div className={cn("absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700", stat.bg)} />
            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className={cn("text-[10px] font-black", stat.trend.startsWith('+') ? 'text-brand-green' : 'text-gray-500')}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-mono font-bold text-white tracking-tighter leading-none">{stat.value}</span>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest opacity-40", stat.color)}>
                    {stat.label === 'Experience' ? 'Years' : 
                     stat.label === 'Projects' ? 'Units' :
                     stat.label === 'Certifications' ? 'Verified' : 'Solved'}
                  </span>
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] bg-brand-indigo/20 w-0 group-hover:w-full transition-all duration-700" />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-display font-bold text-white tracking-tight">System Logs</h3>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[9px] font-mono text-gray-500 uppercase">Live Feed</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-black text-brand-blue uppercase tracking-widest hover:bg-white/[0.05] transition-all">
              <Terminal className="w-3.5 h-3.5" /> Full Audit
            </button>
          </div>
          <div className="bg-[#12131a]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
            {(activity.length ? activity : [
              { title: 'No recent activity yet', time: 'just now', kind: 'live', area: 'projects' as const }
            ]).map((update, idx) => {
              const ui = getActivityUI(update);
              const IconComp = ui.icon;
              return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className={cn(
                  "flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group border-b border-white/[0.02] last:border-0",
                )}
              >
                <div className="flex items-center gap-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500", ui.color + "/10")}>
                    <IconComp className={cn("w-5 h-5", ui.textColor)} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[15px] font-bold text-white group-hover:text-brand-indigo transition-colors">{update.title}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{update.time}</span>
                      <div className="w-1 h-1 bg-white/10 rounded-full" />
                      <span className={cn("text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md", update.kind === 'success' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-gold/10 text-brand-gold')}>
                        {update.kind === 'success' ? 'Success' : 'Live'}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </motion.div>
            )})}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-display font-bold text-white tracking-tight">Focus Node</h3>
            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <Workflow className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#12131a] to-[#0a0b10] border border-white/5 p-8 rounded-[3rem] flex flex-col items-center text-center relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-indigo/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-brand-indigo/20 mb-8 shadow-2xl relative z-10 p-1 bg-white/[0.02]"
            >
              <img 
                src={displayProfile.image} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-[inherit]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="space-y-4 relative z-10 w-full">
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-white tracking-tight">{displayProfile.name}</h4>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-indigo rounded-full animate-pulse" />
                  <p className="text-[10px] text-brand-indigo font-black uppercase tracking-[0.3em]">{displayProfile.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
                  <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Authorization</span>
                  <span className="text-xs font-mono font-bold text-white">LOCKED</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
                  <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Access Tier</span>
                  <span className="text-xs font-mono font-bold text-white">SYSTEM</span>
                </div>
              </div>
              <button 
                onClick={() => onSectionChange('personal')}
                className="w-full py-4 mt-2 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 group-hover:border-brand-indigo/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Enter Workspace</span>
                <ChevronRight className="w-4 h-4 text-brand-indigo" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6">
        <div className="flex items-center gap-3 px-2">
          <h3 className="text-xl font-display font-bold text-white tracking-tight">System Operations</h3>
          <div className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[9px] font-mono text-gray-500 uppercase">Interactive Nodes</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {QUICK_ACTIONS.map((action, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => onSectionChange(action.id)}
              className="group relative bg-[#12131a] border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 hover:bg-white/[0.02] hover:border-white/20 transition-all duration-500 shadow-xl overflow-hidden"
            >
              <div className="absolute inset-x-0 -top-10 h-20 bg-brand-indigo/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-brand-indigo/30 transition-all duration-500">
                <action.icon className="w-6 h-6 text-gray-500 group-hover:text-brand-indigo transition-colors" />
              </div>
              <div className="relative z-10 text-center space-y-1">
                <span className="block text-[11px] font-black text-white group-hover:text-brand-indigo transition-colors uppercase tracking-[0.1em]">{action.label}</span>
                <span className="block text-[8px] font-medium text-gray-600 group-hover:text-gray-400 transition-colors uppercase tracking-widest">{action.description}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
