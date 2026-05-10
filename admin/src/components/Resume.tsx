import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Clock, CheckCircle2, Trash2, ExternalLink, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentAdminProfile } from '@/src/lib/supabase/admin-data';
import { supabase } from '@/src/lib/supabase/client';
import { buildSafeFileName, deleteFile, uploadFile } from '@/src/lib/supabase/storage';

type ResumeRow = {
  id: number;
  admin_id: number;
  title: string;
  file_url: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  is_active: boolean;
  updated_at: string | null;
  uploaded_at: string | null;
};

export default function Resume() {
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [resumeTitle, setResumeTitle] = useState('Main Resume');
  const [adminId, setAdminId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'delete' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedResume = resumes.find((r) => r.id === selectedId) || resumes.find((r) => r.is_active) || resumes[0] || null;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (toast) timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getCurrentAdminProfile();
        setAdminId(profile.id);
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('admin_id', profile.id)
          .is('deleted_at', null)
          .order('updated_at', { ascending: false });
        if (error) throw error;
        const rows = (data || []) as ResumeRow[];
        setResumes(rows);
        if (rows.length) setSelectedId(rows.find((r) => r.is_active)?.id ?? rows[0].id);
      } catch {
        setToast({ message: 'Failed to load resumes.', type: 'delete' });
      }
    };
    load();
  }, []);

  const formatRelativeTime = (date: Date) => {
    const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const refreshResumes = async () => {
    if (!adminId) return;
    const { data } = await supabase
      .from('resumes')
      .select('*')
      .eq('admin_id', adminId)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });
    const rows = (data || []) as ResumeRow[];
    setResumes(rows);
    if (rows.length) setSelectedId(rows.find((r) => r.is_active)?.id ?? rows[0].id);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !adminId) return;
    if (file.type !== 'application/pdf') {
      setToast({ message: 'Only PDF files are allowed.', type: 'delete' });
      return;
    }

    setIsUploading(true);
    const path = `${adminId}/${buildSafeFileName(file.name)}`;
    try {
      const uploaded = await uploadFile('resumes', path, file);
      await supabase.from('resumes').update({ is_active: false }).eq('admin_id', adminId);
      const { error } = await supabase.from('resumes').insert({
        admin_id: adminId,
        title: resumeTitle || file.name.replace(/\.[^.]+$/, ''),
        file_url: uploaded.url,
        file_path: uploaded.path,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        is_active: true,
      });
      if (error) {
        await deleteFile('resumes', uploaded.path);
        throw error;
      }
      await refreshResumes();
      setLastSync(new Date());
      setToast({ message: 'Resume uploaded successfully.', type: 'success' });
    } catch {
      setToast({ message: 'Resume upload failed.', type: 'delete' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedResume) return;
    if (file.type !== 'application/pdf') {
      setToast({ message: 'Only PDF files are allowed.', type: 'delete' });
      return;
    }
    setIsUploading(true);
    const path = `${selectedResume.admin_id}/${buildSafeFileName(file.name)}`;
    try {
      const uploaded = await uploadFile('resumes', path, file);
      const { error } = await supabase.from('resumes').update({
        title: resumeTitle || selectedResume.title,
        file_url: uploaded.url,
        file_path: uploaded.path,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        updated_at: new Date().toISOString(),
      }).eq('id', selectedResume.id);
      if (error) {
        await deleteFile('resumes', uploaded.path);
        throw error;
      }
      await deleteFile('resumes', selectedResume.file_path);
      await refreshResumes();
      setLastSync(new Date());
      setToast({ message: 'Resume replaced successfully.', type: 'success' });
    } catch {
      setToast({ message: 'Resume replace failed.', type: 'delete' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetActive = async (id: number) => {
    if (!adminId) return;
    try {
      await supabase.from('resumes').update({ is_active: false }).eq('admin_id', adminId);
      const { error } = await supabase.from('resumes').update({ is_active: true }).eq('id', id);
      if (error) throw error;
      await refreshResumes();
      setToast({ message: 'Active resume updated.', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update active resume.', type: 'delete' });
    }
  };

  const handleDelete = async () => {
    if (!selectedResume) return;
    try {
      await deleteFile('resumes', selectedResume.file_path);
      const { error } = await supabase.from('resumes').delete().eq('id', selectedResume.id);
      if (error) throw error;
      await refreshResumes();
      setToast({ message: 'Resume deleted successfully.', type: 'delete' });
      setLastSync(new Date());
    } catch {
      setToast({ message: 'Could not delete file from storage. Delete cancelled.', type: 'delete' });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 ease-[0.16, 1, 0.3, 1]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-display font-bold text-white tracking-tight">Resume</h2>
          <p className="text-gray-500 font-medium">Control your public resume and professional tracking.</p>
        </div>
        <input type="file" className="hidden" ref={fileInputRef} onChange={selectedResume ? handleReplace : handleUpload} accept=".pdf" />
      </div>

      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.message + Date.now()}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "fixed top-24 right-8 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg border bg-[#0d0e12]/98 backdrop-blur-md transition-all",
              toast.type === 'delete' ? "border-brand-orange/20" : "border-brand-green/20"
            )}
          >
            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", toast.type === 'delete' ? "bg-brand-orange/10" : "bg-brand-green/10")}>
              <CheckCircle2 className={cn("w-3.5 h-3.5", toast.type === 'delete' ? "text-brand-orange" : "text-brand-green")} />
            </div>
            <span className="text-white font-bold text-xs tracking-tight">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-card border border-white/5 p-4 rounded-2xl">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Resume Title</label>
            <input
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder="Main Resume"
              className="mt-2 w-full bg-[#101216] border border-white/[0.08] rounded-xl py-3 px-4 text-white font-medium placeholder:text-gray-500 focus:outline-none focus:border-brand-indigo/50"
            />
          </div>

          <div className="bg-surface-card border border-white/5 p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-brand-indigo/10 border border-brand-indigo/10">
                <FileText className={cn("w-8 h-8", selectedResume ? "text-brand-indigo" : "text-gray-600")} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedResume?.file_name ?? 'No resume uploaded'}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest bg-white/[0.03] px-3 py-1 rounded-lg border border-white/5">
                    {selectedResume ? `${(selectedResume.file_size / (1024 * 1024)).toFixed(1)} MB` : '0 KB'}
                  </span>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border", selectedResume ? "text-brand-green bg-brand-green/10 border-brand-green/20" : "text-gray-600 bg-white/[0.01] border-white/5")}>
                    {selectedResume ? 'Active' : 'No File'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                onClick={() => selectedResume?.file_url && window.open(selectedResume.file_url, '_blank')}
                className="flex-1 h-11 min-w-[140px] flex items-center justify-center gap-2 bg-brand-indigo text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em]"
                disabled={isUploading || !selectedResume}
              >
                <ExternalLink className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'View Resume'}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 h-11 min-w-[140px] flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                disabled={isUploading}
              >
                <FileUp className="w-4 h-4 text-brand-indigo" />
                {selectedResume ? 'Replace' : 'Upload'}
              </button>
              {selectedResume && (
                <button onClick={handleDelete} className="h-11 px-4 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-surface-card border border-white/5 p-4 rounded-2xl">
            <h4 className="text-sm font-bold text-white mb-3">All Resumes</h4>
            <div className="space-y-2">
              {resumes.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <button onClick={() => setSelectedId(r.id)} className="text-left flex-1">
                    <p className="text-sm text-white font-semibold">{r.title}</p>
                    <p className="text-[11px] text-gray-500">{r.file_name}</p>
                  </button>
                  <button
                    onClick={() => handleSetActive(r.id)}
                    className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider", r.is_active ? "bg-brand-green/20 text-brand-green" : "bg-white/5 text-gray-400")}
                  >
                    {r.is_active ? 'Active' : 'Set Active'}
                  </button>
                </div>
              ))}
              {!resumes.length && <p className="text-xs text-gray-500">No resumes uploaded yet.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-card border border-white/5 p-6 rounded-3xl shadow-2xl relative overflow-hidden h-full">
            <h4 className="text-base font-bold text-white mb-6 tracking-tight flex items-center gap-3">
              <div className="w-1 h-4 bg-brand-indigo rounded-full" />
              Sync Status
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-brand-green animate-ping" />
                  </div>
                  <span className="text-xs font-bold text-gray-300">Live Server</span>
                </div>
                <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.2em]">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-indigo" />
                  <span className="text-xs font-bold text-gray-300">Last Sync</span>
                </div>
                <span className="text-[9px] font-black text-brand-indigo uppercase tracking-[0.2em]">
                  {formatRelativeTime(lastSync)}
                </span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="inline-flex p-2 rounded-xl bg-brand-indigo shadow-lg shadow-brand-indigo/30 mb-2">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic">
                  "Success is not final, failure is not fatal."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

