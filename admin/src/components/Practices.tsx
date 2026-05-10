import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  ExternalLink, 
  CheckCircle2, 
  Trophy, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  X,
  TrendingUp,
  Award,
  Zap,
  Activity,
  Flame,
  Layout,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentAdminProfile } from '@/src/lib/supabase/admin-data';
import {
  deletePracticeChallenge,
  deletePracticePlatform,
  listPracticePlatforms,
  upsertPracticeChallenge,
  upsertPracticePlatform,
} from '@/src/lib/supabase/phase3-data';

interface DifficultyStats {
  easy: number;
  medium: number;
  hard: number;
}

interface ProblemSet {
  id: string;
  name: string;
  url: string;
  stats: DifficultyStats;
}

interface Platform {
  id: string;
  name: string;
  problemSets: ProblemSet[];
}

const SQL_ICON_DATA_URI =
  "https://api.iconify.design/mdi:database-search.svg?color=%235ebcff";
const STRATASCRATCH_ICON_DATA_URI =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='22' fill='none'/%3E%3Cpath d='M10 78c10 0 15-8 21-17 7-11 14-23 29-23s22 12 29 23c6 9 11 17 21 17' fill='none' stroke='%23555b61' stroke-width='11' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M10 90c10 0 15-8 21-17 7-11 14-23 29-23s22 12 29 23c6 9 11 17 21 17' fill='none' stroke='%230db6b2' stroke-width='11' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

const PRACTICE_BRAND_MAP: Array<{ match: RegExp; slug?: string; color?: string; src?: string }> = [
  { match: /hackerrank/i, slug: "hackerrank", color: "00EA64" },
  { match: /leetcode/i, slug: "leetcode", color: "FFA116" },
  { match: /codechef|codeshef/i, slug: "codechef", color: "5B4638" },
  { match: /stratascratch/i, src: STRATASCRATCH_ICON_DATA_URI },
  { match: /\bsql\b/i, src: SQL_ICON_DATA_URI },
];

function resolvePracticeBrand(name: string) {
  return PRACTICE_BRAND_MAP.find((b) => b.match.test(name)) ?? null;
}

function simpleIconUrl(slug: string, color: string) {
  return `https://cdn.simpleicons.org/${slug}/${color}`;
}

function practiceIconSrc(name: string) {
  const brand = resolvePracticeBrand(name);
  if (!brand) return null;
  if (brand.src) return brand.src;
  if (brand.slug && brand.color) return simpleIconUrl(brand.slug, brand.color);
  return null;
}

const INITIAL_PLATFORMS: Platform[] = [
  {
    id: '1',
    name: 'HackerRank',
    problemSets: [
      {
        id: 'hr-1',
        name: 'SQL Challenge',
        url: 'https://www.hackerrank.com/domains/sql',
        stats: { easy: 100, medium: 50, hard: 25 }
      }
    ]
  },
  {
    id: '2',
    name: 'LeetCode',
    problemSets: [
      {
        id: 'lc-1',
        name: 'SQL Challenge',
        url: 'https://leetcode.com/studyplan/top-sql-50/',
        stats: { easy: 50, medium: 25, hard: 3 }
      },
      {
        id: 'lc-2',
        name: 'SQL 50',
        url: 'https://leetcode.com/studyplan/sql-50/',
        stats: { easy: 50, medium: 25, hard: 3 }
      }
    ]
  },
  {
    id: '3',
    name: 'CodeChef',
    problemSets: [
      {
        id: 'cc-1',
        name: 'SQL Challenge',
        url: 'https://www.codechef.com/practice',
        stats: { easy: 79, medium: 27, hard: 20 }
      }
    ]
  },
  {
    id: '4',
    name: 'StrataScratch',
    problemSets: [
      {
        id: 'ss-1',
        name: 'SQL Challenge 20',
        url: 'https://www.stratascratch.com/',
        stats: { easy: 50, medium: 22, hard: 10 }
      }
    ]
  }
];

export default function Practices() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 2;
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'delete' } | null>(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [activePlatformId, setActivePlatformId] = useState<string | null>(null);
  const [editingProblemSet, setEditingProblemSet] = useState<ProblemSet | null>(null);
  const [adminId, setAdminId] = useState<string | number | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (toast) {
      timer = setTimeout(() => setToast(null), 4000);
    }
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const load = async () => {
      try {
        const admin = await getCurrentAdminProfile();
        setAdminId(admin.id);
        const rows = await listPracticePlatforms(admin.id);
        setPlatforms(rows);
      } catch (error) {
        setToast({ message: error instanceof Error ? error.message : 'Failed to load platforms.', type: 'delete' });
      }
    };
    load();
  }, []);

  const toReadableError = (error: unknown, fallback: string) => {
    const message = error instanceof Error ? error.message : fallback;
    const lowered = message.toLowerCase();
    if (lowered.includes("row-level security") || lowered.includes("permission denied")) {
      return "Permission denied. Please log in again.";
    }
    return message;
  };

  const globalTotals = useMemo(() => {
    return platforms.reduce((acc, platform) => {
      platform.problemSets.forEach(set => {
        acc.easy += set.stats.easy;
        acc.medium += set.stats.medium;
        acc.hard += set.stats.hard;
      });
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });
  }, [platforms]);

  const grandTotal = globalTotals.easy + globalTotals.medium + globalTotals.hard;

  const totalPages = Math.ceil(platforms.length / ITEMS_PER_PAGE);
  const paginatedPlatforms = platforms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleAddPlatform = async (name: string) => {
    if (!adminId) return;
    const existing = platforms.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setToast({ message: `Accessing existing ${name} platform. 🏢`, type: 'success' });
      setActivePlatformId(existing.id);
      setEditingProblemSet(null);
      setIsChallengeModalOpen(true);
      setIsPlatformModalOpen(false);
      return;
    }
    try {
      setIsMutating(true);
      const id = await upsertPracticePlatform(adminId, { platform_name: name, sort_order: platforms.length + 1 });
      const rows = await listPracticePlatforms(adminId);
      setPlatforms(rows);
      setToast({ message: "New platform established! 🏗️", type: 'success' });
      setIsPlatformModalOpen(false);
      setActivePlatformId(String(id));
      setEditingProblemSet(null);
      setIsChallengeModalOpen(true);
    } catch (error) {
      console.error("Failed to add platform:", error);
      setToast({ message: toReadableError(error, 'Failed to add platform.'), type: 'delete' });
    } finally {
      setIsMutating(false);
    }
  };

  const handleSaveProblemSet = async (data: Partial<ProblemSet>) => {
    if (!activePlatformId) {
      const debugPlatform = platforms.find((p) => p.id === activePlatformId);
      console.error("Missing platform_id while saving challenge.", { activePlatformId, debugPlatform });
      const msg = 'No platform selected. Please reopen challenge modal.';
      setToast({ message: msg, type: 'delete' });
      return msg;
    }
    if (!adminId) {
      const msg = 'Admin session missing. Please login again.';
      setToast({ message: msg, type: 'delete' });
      return msg;
    }
    try {
      setIsMutating(true);
      if (!activePlatformId?.trim()) {
        console.error("Invalid platform ID payload:", { activePlatformId, editingProblemSet });
        const msg = 'Invalid platform ID. Please refresh and try again.';
        setToast({ message: msg, type: 'delete' });
        return msg;
      }
      await upsertPracticeChallenge(activePlatformId, {
        id: editingProblemSet ? editingProblemSet.id : undefined,
        challenge_title: data.name || '',
        verification_url: data.url || '',
        easy_count: Number(data.stats?.easy || 0),
        medium_count: Number(data.stats?.medium || 0),
        hard_count: Number(data.stats?.hard || 0),
      });
      const rows = await listPracticePlatforms(adminId);
      setPlatforms(rows);
      setToast({
        message: editingProblemSet ? "Updated successfully! ⚡️" : "Challenge added! 🎯",
        type: 'success'
      });
      setIsChallengeModalOpen(false);
      setEditingProblemSet(null);
      setActivePlatformId(null);
      return null;
    } catch (error) {
      console.error("Failed to save challenge:", error, { activePlatformId, editingProblemSet, data });
      const msg = toReadableError(error, 'Failed to save challenge.');
      setToast({ message: msg, type: 'delete' });
      return msg;
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteProblemSet = async (_platformId: string, setId: string) => {
    if (!adminId) return;
    try {
      setIsMutating(true);
      await deletePracticeChallenge(setId);
      const rows = await listPracticePlatforms(adminId);
      setPlatforms(rows);
      setToast({ message: "Removed successfully. 🗑️", type: 'delete' });
    } catch (error) {
      console.error("Failed to delete challenge:", error, { setId });
      setToast({ message: toReadableError(error, 'Failed to delete challenge.'), type: 'delete' });
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeletePlatform = async (platformId: string) => {
    if (!adminId) return;
    try {
      setIsMutating(true);
      await deletePracticePlatform(platformId);
      const rows = await listPracticePlatforms(adminId);
      setPlatforms(rows);
      setToast({ message: "Platform wiped. 🚮", type: 'delete' });
    } catch (error) {
      console.error("Failed to delete platform:", error, { platformId });
      setToast({ message: toReadableError(error, 'Failed to delete platform.'), type: 'delete' });
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 ease-[0.23, 1, 0.32, 1]">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.message + Date.now()}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            style={{ transform: 'translate3d(0,0,0)', transformOrigin: 'right center', willChange: "transform, opacity" }}
            className={cn(
              "fixed top-24 right-8 z-[220] flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg border bg-[#0d0e12]/98 backdrop-blur-md transition-all",
              toast.type === 'delete' ? "border-brand-orange/20" : "border-brand-green/20"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
              toast.type === 'delete' ? "bg-brand-orange/10" : "bg-brand-green/10"
            )}>
              <CheckCircle2 className={cn("w-3.5 h-3.5", toast.type === 'delete' ? "text-brand-orange" : "text-brand-green")} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xs tracking-tight">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Problem Solved</h2>
          <p className="text-gray-500 font-medium text-sm tracking-tight">Challenge analytics per platform platform.</p>
        </div>
        <button 
          disabled={isMutating}
          onClick={() => setIsPlatformModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-brand-indigo/10 hover:bg-brand-indigo/20 border border-brand-indigo/20 text-brand-indigo px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Layout className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          Add Platform
        </button>
      </div>

      {/* Top Summary Bar */}
      <div className="bg-[#161720]/80 border border-white/10 p-8 lg:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center justify-between gap-10 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="flex items-center gap-10 shrink-0 relative z-10">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Grand Total</span>
              <div className="relative">
                <span className="text-6xl font-black text-white leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{grandTotal}</span>
                <div className="absolute -inset-2 bg-brand-indigo/20 blur-2xl rounded-full opacity-50 -z-10" />
              </div>
           </div>
           <div className="h-20 w-px bg-white/10 hidden md:block" />
        </div>

        <div className="flex-1 w-full max-w-2xl space-y-6 relative z-10">
           {(() => {
             const highest = Math.max(globalTotals.easy, globalTotals.medium, globalTotals.hard);
             const target = highest + 50;
             return (
               <>
                 <GlobalSummaryBar 
                   label="Easy" 
                   count={globalTotals.easy} 
                   target={target} 
                   color="bg-brand-green" 
                   textColor="text-brand-green"
                   index={0}
                 />
                 <GlobalSummaryBar 
                   label="Medium" 
                   count={globalTotals.medium} 
                   target={target} 
                   color="bg-brand-orange" 
                   textColor="text-brand-orange"
                   index={1}
                 />
                 <GlobalSummaryBar 
                   label="Hard" 
                   count={globalTotals.hard} 
                   target={target} 
                   color="bg-red-500" 
                   textColor="text-red-400"
                   index={2}
                 />
               </>
             );
           })()}
        </div>
      </div>

      <div className="space-y-6">
        {paginatedPlatforms.map((platform, idx) => (
          <PlatformCard 
            key={platform.id}
            platform={platform}
            index={idx}
            onAddChallenge={() => {
              if (!platform.id) {
                console.error("Platform missing id on Add Challenge:", platform);
                setToast({ message: "Invalid platform ID. Please refresh and try again.", type: 'delete' });
                return;
              }
              setActivePlatformId(platform.id);
              setEditingProblemSet(null);
              setIsChallengeModalOpen(true);
            }}
            onEditChallenge={(set) => {
              setActivePlatformId(platform.id);
              setEditingProblemSet(set);
              setIsChallengeModalOpen(true);
            }}
            onDeleteChallenge={(setId) => handleDeleteProblemSet(platform.id, setId)}
            onDeletePlatform={() => handleDeletePlatform(platform.id)}
          />
        ))}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white disabled:opacity-30 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-11 h-11 rounded-xl font-black text-xs transition-all active:scale-95",
                    currentPage === page 
                      ? "bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20" 
                      : "bg-white/5 text-gray-500 hover:text-white border border-white/10"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white disabled:opacity-30 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isChallengeModalOpen && (
          <ProblemSetModal 
            onClose={() => {
              setIsChallengeModalOpen(false);
              setEditingProblemSet(null);
              setActivePlatformId(null);
            }}
            onSave={handleSaveProblemSet}
            initialData={editingProblemSet || undefined}
            isSavingExternal={isMutating}
          />
        )}
        {isPlatformModalOpen && (
          <AddPlatformModal 
            onClose={() => setIsPlatformModalOpen(false)}
            onSave={handleAddPlatform}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function GlobalSummaryBar({ label, count, target, color, textColor, index = 0 }: { label: string; count: number; target: number; color: string; textColor: string; index?: number }) {
  const percentage = Math.min((count / target) * 100, 100);

  return (
    <div className="space-y-2.5 group/g-bar">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em]">{label}</span>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-black tracking-tight", textColor)}>{count}</span>
          <span className="text-[9px] font-medium text-white/20 tracking-tighter">/ {target}</span>
        </div>
      </div>
      
      <div className="relative h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 shrink-0 group/bar-container backdrop-blur-sm">
        {/* Solved Section (Colored) */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
          className={cn("h-full rounded-full relative group/solved-zone cursor-default shadow-[0_0_15px_rgba(0,0,0,0.5)]", color)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
          {/* Solved Tooltip */}
          <div className="absolute inset-0 opacity-0 group-hover/solved-zone:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
             <span className="text-[8px] font-black text-white uppercase tracking-widest bg-black px-2.5 py-1 rounded-full border border-white/20 shadow-2xl scale-95 group-hover/solved-zone:scale-100 transition-transform">
               Completed: {count}
             </span>
          </div>
        </motion.div>
        
        {/* Target Zone (Uncolored) */}
        <div className="absolute inset-y-0 right-0 z-10 group/target-zone cursor-default" style={{ width: `${100 - percentage}%` }}>
          <div className="absolute inset-0 opacity-0 group-hover/target-zone:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
             <span className="text-[8px] font-black text-white/40 uppercase tracking-widest bg-[#0d0e12] px-2.5 py-1 rounded-full border border-white/10 shadow-2xl scale-95 group-hover/target-zone:scale-100 transition-transform">
                Target: {target}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallStat({ icon, count, color }: { icon: React.ReactNode; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2 group/smstat bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/10 px-3 py-1.5 rounded-xl transition-all shadow-sm">
      <div className="opacity-40 group-hover/smstat:opacity-100 transition-all scale-90 group-hover/smstat:scale-100 group-hover/smstat:rotate-6">
        {icon}
      </div>
      <span className={cn("text-xs font-black tracking-tight", color)}>{count}</span>
    </div>
  );
}

function PlatformCard({ 
  platform, 
  index, 
  onAddChallenge, 
  onEditChallenge, 
  onDeleteChallenge, 
  onDeletePlatform 
}: { 
  platform: Platform; 
  index: number;
  onAddChallenge: () => void;
  onEditChallenge: (set: ProblemSet) => void;
  onDeleteChallenge: (id: string) => void;
  onDeletePlatform: () => void;
}) {
  const platformTotals = platform.problemSets.reduce((acc, set) => ({
    easy: acc.easy + set.stats.easy,
    medium: acc.medium + set.stats.medium,
    hard: acc.hard + set.stats.hard,
    all: acc.all + set.stats.easy + set.stats.medium + set.stats.hard
  }), { easy: 0, medium: 0, hard: 0, all: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#161720]/60 border border-white/5 rounded-[3rem] p-8 lg:p-10 relative overflow-hidden group hover:border-brand-indigo/20 transition-all shadow-2xl backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-indigo/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-[1.5rem] bg-brand-indigo/10 border border-brand-indigo/10 shadow-[0_0_20px_rgba(129,140,248,0.1)] group-hover:scale-105 transition-transform">
            {practiceIconSrc(platform.name) ? (
              <img
                src={practiceIconSrc(platform.name)!}
                alt={platform.name}
                className="w-8 h-8 object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "block";
                }}
              />
            ) : null}
            <Trophy
              className="w-8 h-8 text-brand-indigo"
              style={{ display: practiceIconSrc(platform.name) ? "none" : "block" }}
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">{platform.name}</h3>
              <div className="px-3 py-1 bg-brand-indigo/20 border border-brand-indigo/30 rounded-xl shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none flex items-center gap-2">
                  TOTAL <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-pulse" /> {platformTotals.all}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <SmallStat icon={<Zap className="w-3.5 h-3.5" />} count={platformTotals.easy} color="text-brand-green" />
              <SmallStat icon={<Activity className="w-3.5 h-3.5" />} count={platformTotals.medium} color="text-brand-orange" />
              <SmallStat icon={<Flame className="w-3.5 h-3.5" />} count={platformTotals.hard} color="text-red-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onAddChallenge}
            className="group/add-btn relative flex items-center gap-2 bg-brand-indigo text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-opacity-90 active:scale-95 shadow-[0_10px_30px_rgba(129,140,248,0.2)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover/add-btn:translate-x-full transition-transform duration-1000" />
            <Plus className="w-4 h-4" />
            Add Challenge
          </button>
          <button 
            onClick={onDeletePlatform}
            className="p-3.5 rounded-2xl bg-white/5 text-white/30 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 border border-transparent transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {platform.problemSets.map((set) => (
           <ChallengeEntry 
             key={set.id} 
             set={set} 
             onEdit={() => onEditChallenge(set)}
             onDelete={() => onDeleteChallenge(set.id)}
           />
         ))}
         {platform.problemSets.length === 0 && (
           <div className="py-10 border-2 border-dashed border-white/5 rounded-2xl text-center">
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest opacity-40">Add your first challenge...</p>
           </div>
         )}
      </div>
    </motion.div>
  );
}

function ChallengeEntry({ set, onEdit, onDelete }: { set: ProblemSet; onEdit: () => void; onDelete: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const highestCount = Math.max(set.stats.easy, set.stats.medium, set.stats.hard);
  const target = highestCount + 50;

  return (
    <div className="bg-[#0f1016]/40 border border-white/5 rounded-[2.5rem] p-8 group/entry hover:bg-[#0f1016]/60 hover:border-white/10 transition-all relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/[0.02] to-transparent opacity-0 group-hover/entry:opacity-100 transition-opacity" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
        <div className="flex items-center flex-wrap gap-4">
          <a 
            href={set.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-4 group/link shrink-0"
          >
            <div className="p-3.5 rounded-2xl bg-brand-indigo/10 border border-brand-indigo/10 group-hover/link:bg-brand-indigo/20 group-hover/link:scale-105 transition-all shadow-lg">
              {practiceIconSrc(set.name) ? (
                <img
                  src={practiceIconSrc(set.name)!}
                  alt={set.name}
                  className="w-5 h-5 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = "block";
                  }}
                />
              ) : null}
              <Target
                className="w-5 h-5 text-brand-indigo"
                style={{ display: practiceIconSrc(set.name) ? "none" : "block" }}
              />
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 group-hover/link:text-brand-indigo transition-colors">
              {set.name}
              <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover/link:text-brand-indigo group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
            </h4>
          </a>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all group/toggle border shadow-sm active:scale-95",
              isExpanded 
                ? "bg-brand-indigo text-white border-brand-indigo/50 shadow-brand-indigo/20" 
                : "bg-white/[0.03] border-white/10 text-brand-indigo hover:bg-white/[0.06] hover:border-white/20"
            )}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">
              {isExpanded ? 'Hide Details' : 'View Stats'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 md:opacity-0 group-hover/entry:opacity-100 transition-all translate-x-2 group-hover/entry:translate-x-0">
          <button onClick={onEdit} className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-brand-indigo hover:bg-brand-indigo/10 hover:border-brand-indigo/20 border border-transparent transition-all">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-3 rounded-xl bg-red-500/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-400/20 border border-transparent transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div 
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 overflow-hidden"
          >
            <DifficultyProgress 
              type="easy" 
              count={set.stats.easy} 
              target={target} 
              color="bg-brand-green" 
            />
            <DifficultyProgress 
              type="medium" 
              count={set.stats.medium} 
              target={target} 
              color="bg-brand-orange" 
            />
            <DifficultyProgress 
              type="hard" 
              count={set.stats.hard} 
              target={target} 
              color="bg-red-500" 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap gap-4"
          >
            <SimpleBadge label="Easy" count={set.stats.easy} color="text-brand-green" bg="bg-brand-green/10" icon={<Zap className="w-4 h-4" />} />
            <SimpleBadge label="Medium" count={set.stats.medium} color="text-brand-orange" bg="bg-brand-orange/10" icon={<Activity className="w-4 h-4" />} />
            <SimpleBadge label="Hard" count={set.stats.hard} color="text-red-400" bg="bg-red-500/10" icon={<Flame className="w-4 h-4" />} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SimpleBadge({ label, count, color, bg, icon }: { label: string; count: number; color: string; bg: string; icon: React.ReactNode }) {
  return (
    <div className={cn("px-4 py-3 rounded-2xl flex items-center gap-4 border border-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] group/badge hover:bg-white/[0.03] hover:-translate-y-0.5 transition-all", bg)}>
      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-black/20 group-hover/badge:bg-black/40 transition-colors">
        <div className="opacity-50 group-hover/badge:opacity-100 group-hover/badge:scale-110 transition-all">
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em] leading-none mb-1.5">{label}</span>
        <span className={cn("text-lg font-black tracking-tight leading-none", color)}>{count}</span>
      </div>
    </div>
  );
}

function DifficultyProgress({ type, count, target, color }: { type: 'easy' | 'medium' | 'hard'; count: number; target: number; color: string }) {
  const percentage = Math.min((count / target) * 100, 100);
  const labels = { easy: 'Easy Problems', medium: 'Medium Problems', hard: 'Hard Problems' };
  
  const Icon = {
    easy: Zap,
    medium: Activity,
    hard: Flame
  }[type];

  const iconColor = {
    easy: 'text-brand-green',
    medium: 'text-brand-orange',
    hard: 'text-red-400'
  }[type];

  return (
    <div className="space-y-4 group/bar relative z-10">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 shadow-inner group-hover/bar:bg-white/[0.08] transition-colors">
               <Icon className={cn("w-5 h-5 transition-transform group-hover/bar:scale-110", iconColor)} />
            </div>
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.25em] group-hover/bar:text-white transition-colors">{labels[type]}</span>
         </div>
         <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white tracking-tighter">{count}</span>
            <span className="text-[10px] font-bold text-white/20">/ {target}</span>
         </div>
      </div>
      
      <div className="relative h-2.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 group/bar-container backdrop-blur-sm">
        {/* Solved Section (Colored) */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          className={cn("h-full rounded-full transition-all duration-500 relative group/solved-zone shadow-[0_0_15px_rgba(0,0,0,0.3)]", color)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
          {/* Solved Tooltip */}
          <div className="absolute inset-0 opacity-0 group-hover/solved-zone:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
             <span className="text-[8px] font-black text-white uppercase tracking-widest bg-black px-2.5 py-1 rounded-full border border-white/20 shadow-2xl">
               Solved: {count}
             </span>
          </div>
        </motion.div>
        
        {/* Target Zone (Uncolored) */}
        <div className="absolute inset-y-0 right-0 z-10 group/target-zone" style={{ width: `${100 - percentage}%` }}>
          <div className="absolute inset-0 opacity-0 group-hover/target-zone:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
             <span className="text-[8px] font-black text-white/40 uppercase tracking-widest bg-[#0d0e12] px-2.5 py-1 rounded-full border border-white/10 shadow-2xl">
                Target: {target}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}


function ProblemSetModal({ onClose, onSave, initialData, isSavingExternal = false }: { 
  onClose: () => void; 
  onSave: (data: Partial<ProblemSet>) => Promise<string | null>;
  initialData?: ProblemSet;
  isSavingExternal?: boolean;
}) {
  const [formData, setFormData] = useState<Partial<ProblemSet>>(initialData || {
    name: '',
    url: '',
    stats: { easy: 0, medium: 0, hard: 0 }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const validate = (field: string, value: any) => {
    let error = '';
    if (field === 'name' && !value?.trim()) error = "Name is required, bro! 🏷️";
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const isFormValid = formData.name?.trim() && !Object.values(errors).some(e => e);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#1a1b25] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-indigo" />
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {initialData ? 'Edit Challenge' : 'Confirm Analytics'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!isFormValid || isSaving || isSavingExternal) return;
          setSubmitError('');
          setIsSaving(true);
          const err = await onSave(formData);
          setIsSaving(false);
          if (err) setSubmitError(err);
        }} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-3 text-center">Challenge Title</label>
              <input 
                autoFocus
                value={formData.name}
                onChange={e => { setFormData({ ...formData, name: e.target.value }); validate('name', e.target.value); }}
                className={cn(
                  "w-full bg-[#0d0e12] border rounded-2xl py-4 px-6 text-white font-medium focus:outline-none transition-all text-center",
                  errors.name ? "border-brand-orange/40" : "border-white/[0.08] focus:border-brand-indigo/50"
                )}
                placeholder="e.g. SQL Study Plan"
              />
              {errors.name && <p className="text-[10px] text-brand-orange font-bold mt-2 text-center flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-3 text-center">Verification URL</label>
              <input 
                value={formData.url}
                onChange={e => setFormData({ ...formData, url: e.target.value })}
                className="w-full bg-[#0d0e12] border border-white/[0.08] rounded-2xl py-4 px-6 text-white font-medium focus:outline-none focus:border-brand-indigo/50 transition-all text-center"
                placeholder="https://..."
              />
            </div>

            <div className="pt-4 border-t border-white/5">
               <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-6 text-center">Problem Count Breakdown</label>
               <div className="grid grid-cols-3 gap-4">
                  <StatInput 
                    label="Easy" 
                    value={formData.stats?.easy || 0} 
                    onChange={(v) => setFormData({ ...formData, stats: { ...formData.stats!, easy: v } })} 
                    color="text-brand-green"
                    icon={<Zap className="w-3.5 h-3.5 text-brand-green" />}
                  />
                  <StatInput 
                    label="Medium" 
                    value={formData.stats?.medium || 0} 
                    onChange={(v) => setFormData({ ...formData, stats: { ...formData.stats!, medium: v } })} 
                    color="text-brand-orange"
                    icon={<Activity className="w-3.5 h-3.5 text-brand-orange" />}
                  />
                  <StatInput 
                    label="Hard" 
                    value={formData.stats?.hard || 0} 
                    onChange={(v) => setFormData({ ...formData, stats: { ...formData.stats!, hard: v } })} 
                    color="text-red-500"
                    icon={<Flame className="w-3.5 h-3.5 text-red-400" />}
                  />
               </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button 
              type="submit" 
              disabled={!isFormValid || isSaving || isSavingExternal}
              className={cn(
                "flex-[1.5] py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                isFormValid && !isSaving && !isSavingExternal ? "bg-brand-indigo text-white hover:opacity-90 shadow-xl shadow-brand-indigo/20" : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              {isSaving || isSavingExternal ? 'Saving...' : 'Confirm Update'}
            </button>
          </div>
          {submitError && (
            <p className="text-[11px] text-brand-orange font-bold text-center flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" /> {submitError}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}

function StatInput({ label, value, onChange, color, icon }: { label: string; value: number; onChange: (v: number) => void; color: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className={cn("text-[9px] font-black uppercase tracking-widest", color)}>{label}</span>
      </div>
      <input 
        type="number"
        value={value}
        min="0"
        onChange={e => onChange(parseInt(e.target.value) || 0)}
        className="w-full bg-[#0d0e12] border border-white/[0.08] rounded-xl py-3 px-2 text-white font-black text-center focus:outline-none focus:border-white/10 transition-all"
      />
    </div>
  );
}

function AddPlatformModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string) => void }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Platform name needed! 🏢");
      return;
    }
    onSave(name);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#1a1b25] border border-white/10 rounded-[2rem] shadow-2xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 tracking-tight text-center">Add New Platform</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-3 text-center">Platform Name</label>
            <input 
              autoFocus
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              className={cn(
                "w-full bg-[#0d0e12] border rounded-xl py-4 px-6 text-white font-medium focus:outline-none transition-all text-center",
                error ? "border-brand-orange/40" : "border-white/[0.08] focus:border-brand-indigo/50"
              )}
              placeholder="e.g. Codeforces"
            />
            {error && <p className="text-[10px] text-brand-orange font-bold mt-2 text-center flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button type="submit" className="flex-[1.5] py-4 rounded-xl bg-brand-indigo text-white font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-brand-indigo/20">Establish Platform</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
