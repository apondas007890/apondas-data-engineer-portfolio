import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, MapPin, Calendar, Edit2, Trash2, Plus, 
  CheckCircle2, X, ChevronDown, ExternalLink, Briefcase, Trash,
  ChevronLeft, ChevronRight, Upload, ImageIcon, AlertCircle, BookOpen, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RichTextEditor from './RichTextEditor';
import RichTextRenderer from '@/src/components/ui/RichTextRenderer';
import MultipleImageUpload from './MultipleImageUpload';
import Slideshow from './Slideshow';
import { getCurrentAdminProfile } from '@/src/lib/supabase/admin-data';
import { deleteEducationWithMedia, listEducation, upsertEducationWithMedia } from '@/src/lib/supabase/phase2-data';

// Types
interface EducationEntry {
  id: number;
  school: string;
  images?: string[];
  institution_website_url?: string;
  degree: string;
  department: string;
  is_current: boolean;
  is_visible: boolean;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  score_type: string;
  score_value: string;
  description: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = Array.from({ length: 60 }, (_, i) => (new Date().getFullYear() + 10 - i).toString());

const SCORE_TYPES = ['Score type', 'CGPA', 'GPA', 'Percentage', 'Grade', 'Other'];

function isValidUrlInput(value: string) {
  if (!value.trim()) return true;
  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(normalized);
    return Boolean(url.hostname && url.hostname.includes('.'));
  } catch {
    return false;
  }
}

export default function Education() {
  const [entries, setEntries] = useState<EducationEntry[]>([]);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EducationEntry | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'delete' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Sort entries DESC by date (Current items first)
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;
    
    const yearA = parseInt(a.start_year);
    const yearB = parseInt(b.start_year);
    if (yearB !== yearA) return yearB - yearA;
    const monthA = MONTHS.indexOf(a.start_month);
    const monthB = MONTHS.indexOf(b.start_month);
    return monthB - monthA;
  });

  const totalPages = Math.ceil(sortedEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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
        const profile = await getCurrentAdminProfile();
        setAdminId(profile.id);
        const rows = await listEducation(profile.id);
        const mapped: EducationEntry[] = rows.map((r: any) => ({
          id: r.id,
          school: r.school_college || '',
          images: (r.education_media || []).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((m: any) => m.file_url),
          institution_website_url: r.institution_website_url || '',
          degree: r.degree || '',
          department: r.department || '',
          is_current: !!r.currently_studying,
          is_visible: true,
          start_month: r.start_month || '',
          start_year: r.start_year ? String(r.start_year) : '',
          end_month: r.end_month || '',
          end_year: r.end_year ? String(r.end_year) : '',
          score_type: r.score_type || 'Score type',
          score_value: r.score_value || '',
          description: r.description_html || '',
        }));
        setEntries(mapped);
      } catch {
        setToast({ message: 'Failed to load education.', type: 'delete' });
      }
    };
    load();
  }, []);

  // Hide toast immediately on navigation is handled by the fact that this component unmounts
  useEffect(() => {
    return () => setToast(null);
  }, []);

  const toggleVisibility = (id: number) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, is_visible: !e.is_visible } : e));
    setToast({ message: 'Visibility updated successfully.', type: 'success' });
  };

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: EducationEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleSave = async (entry: EducationEntry) => {
    if (!adminId) return;
    try {
      await upsertEducationWithMedia({
        adminId,
        entryId: editingEntry?.id,
        payload: {
          school_college: entry.school,
          institution_website_url: entry.institution_website_url || null,
          degree: entry.degree,
          department: entry.department || null,
          currently_studying: entry.is_current,
          start_month: entry.start_month,
          start_year: entry.start_year ? Number(entry.start_year) : null,
          end_month: entry.is_current ? null : entry.end_month || null,
          end_year: entry.is_current ? null : entry.end_year ? Number(entry.end_year) : null,
          score_type: entry.score_type || null,
          score_value: entry.score_value || null,
          description_html: entry.description || null,
          sort_order: 0,
        },
        images: entry.images || [],
      });
      const rows = await listEducation(adminId);
      const mapped: EducationEntry[] = rows.map((r: any) => ({
        id: r.id,
        school: r.school_college || '',
        images: (r.education_media || []).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((m: any) => m.file_url),
        institution_website_url: r.institution_website_url || '',
        degree: r.degree || '',
        department: r.department || '',
        is_current: !!r.currently_studying,
        is_visible: true,
        start_month: r.start_month || '',
        start_year: r.start_year ? String(r.start_year) : '',
        end_month: r.end_month || '',
        end_year: r.end_year ? String(r.end_year) : '',
        score_type: r.score_type || 'Score type',
        score_value: r.score_value || '',
        description: r.description_html || '',
      }));
      setEntries(mapped);
      setToast({ message: editingEntry ? 'Education updated successfully.' : 'Education added successfully.', type: 'success' });
      setIsModalOpen(false);
    } catch {
      setToast({ message: 'Education save failed.', type: 'delete' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!adminId) return;
    try {
      await deleteEducationWithMedia(id);
      const rows = await listEducation(adminId);
      const mapped: EducationEntry[] = rows.map((r: any) => ({
        id: r.id,
        school: r.school_college || '',
        images: (r.education_media || []).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((m: any) => m.file_url),
        institution_website_url: r.institution_website_url || '',
        degree: r.degree || '',
        department: r.department || '',
        is_current: !!r.currently_studying,
        is_visible: true,
        start_month: r.start_month || '',
        start_year: r.start_year ? String(r.start_year) : '',
        end_month: r.end_month || '',
        end_year: r.end_year ? String(r.end_year) : '',
        score_type: r.score_type || 'Score type',
        score_value: r.score_value || '',
        description: r.description_html || '',
      }));
      setEntries(mapped);
      setToast({ message: 'Education deleted successfully.', type: 'delete' });
      setIsModalOpen(false);
    } catch {
      setToast({ message: 'Could not delete files from storage. Delete cancelled.', type: 'delete' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 ease-[0.16, 1, 0.3, 1]">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.message + Date.now()}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.98 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.23, 1, 0.32, 1] 
            }}
            style={{ transform: 'translate3d(0,0,0)', willChange: "transform, opacity" }}
            className={cn(
              "fixed top-24 right-8 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg border bg-[#0d0e12]/98 backdrop-blur-md transition-all",
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

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Education</h2>
          <p className="text-gray-400 font-medium">Manage your educational background and qualifications.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-brand-indigo hover:translate-y-[-2px] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-brand-indigo/20 active:scale-95 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Add Education
        </button>
      </div>

      <div className="space-y-4">
        {paginatedEntries.length > 0 ? (
          <>
            {paginatedEntries.map((edu, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={edu.id}
            className="bg-[#161720] border border-white/5 p-6 md:p-8 rounded-[2.5rem] hover:border-brand-indigo/30 transition-all group overflow-hidden relative"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Boxy Image Container (Smaller) */}
              <div className="w-full md:w-40 h-40 md:h-40 rounded-3xl bg-brand-indigo/5 border border-white/5 group-hover:border-brand-indigo/20 group-hover:scale-[1.02] transition-all duration-500 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl relative">
                <Slideshow images={edu.images || []} fallbackIcon={GraduationCap} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      {/* Line 1: Degree */}
                      <h4 className="text-2xl font-bold text-white tracking-tight leading-tight group-hover:text-brand-indigo transition-colors">{edu.degree}</h4>
                      
                      {/* Line 2: Institution + Website */}
                      <div className="flex items-center gap-3">
                        <span className="text-brand-blue font-black uppercase text-[11px] tracking-widest">{edu.school}</span>
                        {edu.institution_website_url && (
                          <a 
                            href={edu.institution_website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md transition-all border border-white/5 group/link"
                          >
                            <ExternalLink className="w-3 h-3 text-gray-500 group-hover/link:text-white" />
                            <span className="text-[9px] font-black text-gray-600 group-hover/link:text-white uppercase tracking-tighter">Website</span>
                          </a>
                        )}
                      </div>

                      {/* Line 3: Duration + CGPA */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-3.5 h-3.5 text-brand-indigo/60" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            {edu.start_month} {edu.start_year} — {edu.is_current ? 'Present' : `${edu.end_month} ${edu.end_year}`}
                          </span>
                        </div>
                        {edu.score_value && (
                          <div className="flex items-center gap-2 px-2.5 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-lg">
                            <Award className="w-3.5 h-3.5 text-brand-gold" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                              {edu.score_type !== 'Score type' && edu.score_type !== 'Other' ? `${edu.score_type}: ` : ''}{edu.score_value}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => toggleVisibility(edu.id)}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2 rounded-xl border shrink-0 transition-all duration-500 hover:scale-105 active:scale-95",
                        edu.is_visible 
                          ? "bg-brand-green/10 border-brand-green/20 text-brand-green" 
                          : "bg-red-500/10 border-red-500/20 text-red-500"
                      )}
                    >
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full", 
                        edu.is_visible ? "bg-brand-green animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-red-500"
                      )} />
                      <span className="text-[9px] uppercase tracking-[0.2em] font-black leading-none">
                        {edu.is_visible ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(edu)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(edu.id)}
                        className="p-2.5 rounded-xl bg-red-400/5 border border-red-400/10 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {edu.description && (
                  <div className="pt-4 border-t border-white/5">
                    <RichTextRenderer
                      content={edu.description}
                      className="admin-rich-preview text-[#8fa3bf] text-[14px] leading-relaxed max-w-4xl font-medium opacity-80"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition-all active:scale-95"
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
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        </>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] group hover:border-brand-indigo/30 transition-all">
          <div className="w-20 h-20 rounded-full bg-brand-indigo/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
             <GraduationCap className="w-10 h-10 text-brand-indigo/40 group-hover:text-brand-indigo transition-colors" />
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">No education entries found</p>
        </div>
      )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <EducationModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            onDelete={handleDelete}
            entry={editingEntry}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: EducationEntry) => void;
  onDelete: (id: number) => void;
  entry: EducationEntry | null;
}

function EducationModal({ isOpen, onClose, onSave, onDelete, entry }: ModalProps) {
  const [formData, setFormData] = useState<Partial<EducationEntry>>({
    school: '',
    images: [],
    institution_website_url: '',
    degree: '',
    department: '',
    is_current: false,
    is_visible: true,
    start_month: '',
    start_year: '',
    end_month: '',
    end_year: '',
    score_type: 'Score type',
    score_value: '',
    description: ''
  });

  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    } else {
      setFormData({
        school: '',
        images: [],
        institution_website_url: '',
        degree: '',
        department: '',
        is_current: false,
        is_visible: true,
        start_month: '',
        start_year: '',
        end_month: '',
        end_year: '',
        score_type: 'Score type',
        score_value: '',
        description: ''
      });
    }
    setErrors({});
  }, [entry, isOpen]);

  const validate = (updatedData: Partial<EducationEntry>) => {
    const newErrors: Record<string, string> = { ...errors };
    const d = { ...formData, ...updatedData };
    
    if (updatedData.school !== undefined) {
      newErrors.school = updatedData.school?.trim() ? '' : "Bro... which school did you ghost? 😭";
    }

    if (updatedData.degree !== undefined) {
      newErrors.degree = updatedData.degree?.trim() ? '' : "Don't sell yourself short, what's the degree? 🎓";
    }

    if (updatedData.institution_website_url !== undefined && updatedData.institution_website_url.trim()) {
      if (!isValidUrlInput(updatedData.institution_website_url)) {
        newErrors.website = "That link is broken, bro. Fix it up? 🔗";
      } else {
        newErrors.website = "";
      }
    } else if (updatedData.institution_website_url === "") {
        newErrors.website = "";
    }

    // Start Date Pair
    if (d.start_month && !d.start_year) {
      newErrors.startDate = "Pick the start year too, bro. 📅";
    } else if (!d.start_month && d.start_year) {
      newErrors.startDate = "Pick the start month too, bro. 📅";
    } else if (d.start_month && d.start_year) {
      newErrors.startDate = "";
    } else {
      newErrors.startDate = d.start_month || d.start_year ? newErrors.startDate : "When did this journey start? 👀";
    }

    // End Date Pair
    if (d.is_current) {
      newErrors.endDate = "";
    } else {
      if (d.end_month && !d.end_year) {
        newErrors.endDate = "Pick the end year too, bro. 📅";
      } else if (!d.end_month && d.end_year) {
        newErrors.endDate = "Pick the end month too, bro. 📅";
      } else if (d.end_month && d.end_year) {
        newErrors.endDate = "";
      } else {
        newErrors.endDate = d.end_month || d.end_year ? newErrors.endDate : "Ghosting the end date? Come on... 😭";
      }
    }

    // Logic Check (End >= Start)
    if (!d.is_current && !newErrors.startDate && !newErrors.endDate && d.start_month && d.start_year && d.end_month && d.end_year) {
      const startYear = parseInt(d.start_year);
      const endYear = parseInt(d.end_year);
      const startMonthIdx = MONTHS.indexOf(d.start_month);
      const endMonthIdx = MONTHS.indexOf(d.end_month);

      if (endYear < startYear || (endYear === startYear && endMonthIdx < startMonthIdx)) {
        newErrors.endDate = "End date can't be before start date, time traveler. 🚀";
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (name: string, value: any) => {
    const updatedData = { [name]: value };
    setFormData(prev => ({ ...prev, ...updatedData }));
    validate(updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors = validate({});
    const hasErrors = Object.values(currentErrors).some(err => err !== "");

    if (!hasErrors) {
      onSave(formData as EducationEntry);
    }
  };

  const inputClasses = "w-full bg-[#101216] border border-white/[0.08] rounded-xl py-3.5 px-5 text-white font-medium placeholder:text-gray-500 focus:outline-none focus:border-brand-indigo/50 transition-all";
  const labelClasses = "text-sm font-bold text-[#9ca3af] mb-3 flex items-center tracking-tight";
  const starClasses = "text-brand-orange ml-1.5";

  const schoolDisplay = formData.school || 'Add your education name';
  const truncatedDisplay = schoolDisplay.length > 45 ? schoolDisplay.substring(0, 45) + '...' : schoolDisplay;

  if (typeof window === 'undefined') return null;
  return createPortal((
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 pb-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#20212b] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-[0_32px_128px_-12px_rgba(0,0,0,0.8)] border border-white/5 relative"
      >
        {/* Header */}
        <div className="px-8 py-7 border-b border-white/[0.08] flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight">{entry ? 'Edit Education' : 'Add Education'}</h3>
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-white/5 rounded-full transition-colors group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar scrollbar-hide">
          <form id="education-form" onSubmit={handleSubmit} noValidate className="space-y-10">
            {/* Section Heading with Toggle */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 px-8 transition-all">
              <button 
                type="button"
                onClick={() => setIsSectionOpen(!isSectionOpen)}
                className="w-full flex items-center justify-between group"
              >
                <h4 className="text-[15px] font-bold text-white tracking-tight truncate pr-4 text-left">
                  {entry ? (
                    <span className="opacity-80">
                      {formData.department ? formData.department + ' @ ' : ''}{formData.school}
                    </span>
                  ) : 'Add your education name'}
                </h4>
                <div className="p-1 rounded-md bg-white/5 text-gray-500 group-hover:text-white transition-all">
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-500",
                    isSectionOpen ? "" : "-rotate-90"
                  )} />
                </div>
              </button>
              
              <AnimatePresence>
                {isSectionOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-10 space-y-8">
                      {/* Images */}
                      <div>
                        <MultipleImageUpload 
                          label="Campus Photos / Documents"
                          images={formData.images || []}
                          onChange={(images) => setFormData({ ...formData, images })}
                        />
                      </div>

                      {/* School/College */}
                      <div>
                        <label className={labelClasses}>School/College <span className={starClasses}>*</span></label>
                        <div className="relative group/sel">
                          <input 
                            type="text" 
                            value={formData.school}
                            onChange={(e) => handleChange('school', e.target.value)}
                            placeholder="Which School/College have you studied at?"
                            className={cn(
                              inputClasses, 
                              "pr-20",
                              errors.school ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/5 focus:ring-brand-indigo/20 focus:border-brand-indigo/50"
                            )}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.school && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.school}</motion.p>
                          )}
                          {!errors.school && formData.school && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-brand-green/70 font-bold mt-2 ml-1">Big brains move! 🧠</motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Institution Website */}
                      <div>
                        <label className={labelClasses}>Institution Website Link</label>
                        <input 
                          type="text" 
                          value={formData.institution_website_url}
                          onChange={(e) => handleChange('institution_website_url', e.target.value)}
                          placeholder="https://www.example.edu"
                          className={cn(
                            inputClasses,
                            errors.website ? "border-brand-orange/40" : "border-white/5"
                          )}
                        />
                        <AnimatePresence>
                          {errors.website && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.website}</motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Degree */}
                      <div>
                        <label className={labelClasses}>Degree <span className={starClasses}>*</span></label>
                        <div className="relative group/sel">
                          <input 
                            type="text" 
                            value={formData.degree}
                            onChange={(e) => handleChange('degree', e.target.value)}
                            placeholder="ex: B.E"
                            className={cn(
                              inputClasses, 
                              "pr-20",
                              errors.degree ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/5 focus:ring-brand-indigo/20 focus:border-brand-indigo/50"
                            )}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.degree && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.degree}</motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Department */}
                      <div>
                        <label className={labelClasses}>Department</label>
                        <input 
                          type="text" 
                          value={formData.department}
                          onChange={(e) => handleChange('department', e.target.value)}
                          placeholder="ex: Computer Science and Engineering"
                          className={inputClasses}
                        />
                      </div>

                      {/* Currently Studying Checkbox */}
                      <div 
                        className="flex items-center gap-3 cursor-pointer select-none group/check h-fit"
                        onClick={() => setFormData({...formData, is_current: !formData.is_current})}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                          formData.is_current 
                            ? "bg-brand-indigo/20 border-brand-indigo shadow-[0_0_15px_rgba(80,70,229,0.3)]" 
                            : "bg-[#101216] border-white/10 group-hover/check:border-white/20"
                        )}>
                          <CheckCircle2 className={cn(
                            "w-3.5 h-3.5 text-brand-indigo transition-all duration-300 transform",
                            formData.is_current ? "scale-100 opacity-100" : "scale-50 opacity-0"
                          )} />
                        </div>
                        <span className="text-sm font-bold text-[#8fa3bf] group-hover/check:text-white transition-colors">Currently studying here</span>
                      </div>

                      {/* Starting Date */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                          <label className={labelClasses}>Starting from <span className={starClasses}>*</span></label>
                          <div className="relative group/sel">
                            <select 
                              value={formData.start_month}
                              onChange={(e) => handleChange('start_month', e.target.value)}
                              className={cn(
                                inputClasses, 
                                "appearance-none pr-8 text-xs py-3",
                                errors.startDate ? "border-brand-orange/40" : "border-white/5"
                              )}
                            >
                              <option value="" disabled>month</option>
                              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-transparent mb-3 flex items-center tracking-tight hidden sm:flex">Start Year</label>
                          <div className="relative group/sel">
                            <select 
                              value={formData.start_year}
                              onChange={(e) => handleChange('start_year', e.target.value)}
                              className={cn(
                                inputClasses, 
                                "appearance-none pr-8 text-xs py-3",
                                errors.startDate ? "border-brand-orange/40" : "border-white/5"
                              )}
                            >
                              <option value="" disabled>year</option>
                              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                        </div>
                        {errors.startDate && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="col-span-full text-[11px] text-brand-orange font-bold mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.startDate}</motion.p>}
                      </div>

                      <div className={cn("grid grid-cols-2 gap-x-6 gap-y-4 transition-all duration-500", formData.is_current ? "opacity-20 pointer-events-none grayscale" : "opacity-100")}>
                        <div className="space-y-2">
                          <label className={labelClasses}>Ending in <span className={starClasses}>*</span></label>
                          <div className="relative group/sel">
                            <select 
                              value={formData.end_month}
                              onChange={(e) => handleChange('end_month', e.target.value)}
                              className={cn(
                                inputClasses, 
                                "appearance-none pr-8 text-xs py-3",
                                errors.endDate ? "border-brand-orange/40" : "border-white/5"
                              )}
                            >
                              <option value="" disabled>month</option>
                              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-transparent mb-3 flex items-center tracking-tight hidden sm:flex">End Year</label>
                          <div className="relative group/sel">
                            <select 
                              value={formData.end_year}
                              onChange={(e) => handleChange('end_year', e.target.value)}
                              className={cn(
                                inputClasses, 
                                "appearance-none pr-8 text-xs py-3",
                                errors.endDate ? "border-brand-orange/40" : "border-white/5"
                              )}
                            >
                              <option value="" disabled>year</option>
                              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                        </div>
                        {errors.endDate && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="col-span-full text-[11px] text-brand-orange font-bold mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.endDate}</motion.p>}
                      </div>

                      {/* Score */}
                      <div className="grid grid-cols-2 gap-x-6">
                        <div className="space-y-2">
                          <label className={labelClasses}>Score</label>
                          <div className="relative group/sel">
                            <select 
                              value={formData.score_type}
                              onChange={(e) => setFormData({...formData, score_type: e.target.value})}
                              className={cn(inputClasses, "appearance-none pr-8")}
                            >
                              {SCORE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2 pt-8">
                          <input 
                            type="text" 
                            value={formData.score_value}
                            onChange={(e) => setFormData({...formData, score_value: e.target.value})}
                            placeholder="4.5"
                            className={inputClasses}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className={labelClasses}>Description</label>
                        <RichTextEditor 
                          value={formData.description || ''}
                          onChange={(value) => setFormData({...formData, description: value})}
                          placeholder="Tell us about your achievements or focus areas..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-10 py-8 border-t border-white/[0.08] flex items-center justify-between bg-[#1b1c24]">
          <div className="flex-1">
            {entry ? (
              <button 
                type="button"
                onClick={() => onDelete(entry.id)}
                className="flex items-center gap-2.5 text-white/50 hover:text-red-400 font-bold text-sm transition-all active:scale-95 group/del"
              >
                Delete this entry
              </button>
            ) : (
              <button 
                type="button"
                className="text-brand-indigo font-bold text-sm hover:text-brand-indigo/80 transition-all"
              >
                Add another
              </button>
            )}
          </div>
          
          <button 
            type="submit"
            form="education-form"
            className={cn(
              "px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 bg-brand-indigo text-white hover:opacity-90 active:scale-95 shadow-xl shadow-brand-indigo/20"
            )}
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  ), document.body);
}
