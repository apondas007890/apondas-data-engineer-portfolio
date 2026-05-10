
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Plus, Edit2, Trash2, CheckCircle2, X, ExternalLink, Calendar, FileText, Upload, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { getCurrentAdminProfile } from '@/src/lib/supabase/admin-data';
import { deleteCertification, listCertifications, upsertCertification } from '@/src/lib/supabase/phase4-data';
import { ConfirmDeleteDialog } from '@/src/components/admin/ConfirmDeleteDialog';

interface Certification {
  id: number;
  title: string;
  issuer: string;
  issuer_icon_key?: string | null;
  issuer_logo_url?: string | null;
  issued_date: string | null;
  url?: string;
  pdf_url?: string;
}

const ISSUER_ICON_MAP: Record<string, string> = {
  datacamp: 'simple-icons:datacamp',
  cisco: 'simple-icons:cisco',
  'grameenphone academy': '',
  grameenphone: 'simple-icons:grameenphone',
};

const normalizeIssuer = (value: string) => value.trim().toLowerCase();
const resolveIssuerIconKey = (issuer: string, existing?: string | null) =>
  existing || ISSUER_ICON_MAP[normalizeIssuer(issuer)] || null;
const GP_ACADEMY_FALLBACK_LOGO =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%2322D3EE'/%3E%3C/linearGradient%3E%3ClinearGradient id='g2' x1='1' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%237C3AED'/%3E%3Cstop offset='1' stop-color='%23EC4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='128' height='128' rx='26' fill='none'/%3E%3Cpath d='M22 66 L50 22 L76 22 L48 66 Z' fill='url(%23g1)'/%3E%3Cpath d='M50 66 L78 22 L106 22 L78 66 Z' fill='url(%23g2)' opacity='0.95'/%3E%3Cpath d='M22 66 L50 106 L78 106 L50 66 Z' fill='url(%23g1)' opacity='0.92'/%3E%3Cpath d='M50 66 L78 106 L106 106 L78 66 Z' fill='url(%23g2)' opacity='0.88'/%3E%3C/svg%3E";
const resolveIssuerFallbackLogo = (issuer: string) => {
  const key = normalizeIssuer(issuer);
  if (key.includes("grameenphone academy")) return GP_ACADEMY_FALLBACK_LOGO;
  return null;
};
const resolveIssuerBrandColor = (issuer: string) => {
  const key = normalizeIssuer(issuer);
  if (key.includes('datacamp')) return '#03EF62';
  if (key.includes('cisco')) return '#1BA0D7';
  if (key.includes('grameenphone')) return '#35A8E0';
  return '#FACC15';
};

function formatIssuedDate(issuedDate: string | null | undefined) {
  if (!issuedDate) return null;
  const d = new Date(`${issuedDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return issuedDate;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

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

export default function Certifications() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'delete' } | null>(null);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (toast) {
      timer = setTimeout(() => setToast(null), 4000);
    }
    return () => clearTimeout(timer);
  }, [toast]);

  const loadCertifications = async (targetAdminId: number) => {
    const rows = await listCertifications(targetAdminId);
    const mapped: Certification[] = rows.map((r) => ({
      id: r.id,
      title: r.certification_title,
      issuer: r.issuer,
      issuer_icon_key: resolveIssuerIconKey(r.issuer, r.issuer_icon_key),
      issuer_logo_url: r.issuer_logo_url || null,
      issued_date: r.issued_date || null,
      url: r.verification_url || '',
      pdf_url: r.certificate_pdf_url || '',
    }));
    setCerts(mapped);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const admin = await getCurrentAdminProfile();
        setAdminId(admin.id);
        await loadCertifications(admin.id);
      } catch (error) {
        setToast({ message: error instanceof Error ? error.message : 'Failed to load certifications.', type: 'delete' });
      }
    };
    load();
  }, []);

  const totalPages = Math.ceil(certs.length / ITEMS_PER_PAGE);
  const paginatedCerts = certs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleSave = async (cert: Partial<Certification>, pdfFile?: File | null) => {
    if (!adminId) return;
    try {
      await upsertCertification({
        adminId,
        certId: editingCert?.id,
        payload: {
          certification_title: cert.title?.trim() || '',
          issuer: cert.issuer?.trim() || '',
          issuer_icon_key: resolveIssuerIconKey(cert.issuer?.trim() || '', cert.issuer_icon_key),
          issued_date: cert.issued_date?.trim() || null,
          verification_url: cert.url?.trim() || null,
        },
        pdfFile,
      });
      await loadCertifications(adminId);
      setToast({ message: editingCert ? 'Certification updated successfully.' : 'Certification added successfully.', type: 'success' });
      setIsModalOpen(false);
      setEditingCert(null);
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to save certification.', type: 'delete' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!adminId) return;
    try {
      await deleteCertification(id);
      await loadCertifications(adminId);
      setToast({ message: 'Certification deleted successfully.', type: 'delete' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to delete certification.', type: 'delete' });
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
            style={{ transform: 'translate3d(0,0,0)', transformOrigin: 'right center', willChange: "transform, opacity" }}
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
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Certifications</h2>
          <p className="text-gray-400">Validate your expertise with recognized credentials.</p>
        </div>
        <button 
          onClick={() => { setEditingCert(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-brand-indigo hover:translate-y-[-2px] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-brand-indigo/20 active:scale-95 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Add Certification
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {paginatedCerts.map((cert, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={cert.id}
            className="bg-[#161720] border border-white/5 p-6 md:p-8 rounded-[2.5rem] hover:border-brand-indigo/30 transition-all group relative flex flex-col md:flex-row items-center gap-8 shadow-2xl"
          >
            {/* Boxy Icon/Image Container */}
            <div className="w-full md:w-48 h-48 md:shrink-0 flex items-center justify-center rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group/box">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity duration-700" />
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 group-hover:scale-110 transition-transform duration-500 relative z-10">
                {(cert.issuer_logo_url || resolveIssuerFallbackLogo(cert.issuer)) ? (
                  <img
                    src={cert.issuer_logo_url || resolveIssuerFallbackLogo(cert.issuer) || ''}
                    alt={cert.issuer}
                    className="w-16 h-16 object-contain"
                    loading="lazy"
                  />
                ) : cert.issuer_icon_key ? (
                  <Icon
                    icon={cert.issuer_icon_key}
                    className="w-10 h-10"
                    style={{ color: resolveIssuerBrandColor(cert.issuer) }}
                  />
                ) : (
                  <Award className="w-10 h-10" style={{ color: resolveIssuerBrandColor(cert.issuer) }} />
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-2xl font-bold text-white leading-tight tracking-tight group-hover:text-brand-indigo transition-colors">{cert.title}</h4>
                  <p className="text-brand-blue font-black text-[11px] uppercase tracking-widest">{cert.issuer}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => { setEditingCert(cert); setIsModalOpen(true); }} 
                    className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setPendingDeleteId(cert.id)} 
                    className="p-3 rounded-xl bg-red-400/5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {cert.issued_date && (
                  <div className="flex items-center gap-2.5 text-gray-400">
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <Calendar className="w-3.5 h-3.5 text-brand-indigo" />
                    </div>
                    <span className="text-xs font-bold tracking-wider">Issued: {formatIssuedDate(cert.issued_date)}</span>
                  </div>
                )}
                
                {cert.pdf_url && (
                  <div className="flex items-center gap-2.5 text-brand-indigo">
                    <div className="p-1.5 rounded-lg bg-brand-indigo/10">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Credential Secured</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                {cert.pdf_url && (
                  <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-5 py-2.5 bg-brand-indigo/10 border border-brand-indigo/20 rounded-xl text-[10px] font-black text-brand-indigo hover:bg-brand-indigo/20 transition-all uppercase tracking-[0.2em]">
                    View Certificate
                  </a>
                )}
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white/40 hover:text-white hover:border-white/30 uppercase tracking-[0.2em] transition-all group/link">
                    External Verification <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                  </a>
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
        {isModalOpen && (
          <CertModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            cert={editingCert || undefined}
          />
        )}
      </AnimatePresence>
      <ConfirmDeleteDialog
        open={pendingDeleteId !== null}
        title="Delete certification"
        description="This will remove the certification and related files."
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={async () => {
          if (pendingDeleteId === null) return;
          const id = pendingDeleteId;
          setPendingDeleteId(null);
          await handleDelete(id);
        }}
      />
    </div>
  );
}

function CertModal({ isOpen, onClose, onSave, cert }: { isOpen: boolean; onClose: () => void; onSave: (c: Partial<Certification>, pdfFile?: File | null) => void; cert?: Certification }) {
  const [formData, setFormData] = useState<Partial<Certification>>({
    title: '',
    issuer: '',
    issued_date: '',
    url: '',
    pdf_url: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cert) setFormData(cert);
    else setFormData({ title: '', issuer: '', issued_date: '', url: '', pdf_url: '' });
    setPdfFile(null);
    setPdfName('');
    setErrors({});
  }, [cert, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, pdf: 'Only PDF files are allowed. 📄' }));
        return;
      }
      setIsUploading(true);
      setTimeout(() => {
        setPdfFile(file);
        setPdfName(file.name);
        setFormData(prev => ({ ...prev, pdf_url: 'selected' }));
        setErrors(prev => ({ ...prev, pdf: '' }));
        setIsUploading(false);
      }, 400);
    }
  };

  const validate = (name: string, value: any) => {
    let error = '';
    
    if (name === 'title') {
      if (!value?.trim()) error = "Bro... you worked hard for it, name it! 🏆";
    }

    if (name === 'issuer') {
      if (!value?.trim()) error = "Who gave you this legend status? 🏢";
    }

    if (name === 'issued_date') {
      if (!value?.trim()) error = "Issued date is required. 📅";
    }

    if (name === 'url' && value?.trim()) {
      if (!isValidUrlInput(value)) {
        error = "Broken link! Fix the verification URL? 🔗";
      }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (name: string, value: any) => {
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    validate(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidTitle = validate('title', formData.title);
    const isValidIssuer = validate('issuer', formData.issuer);
    const isValidIssuedDate = validate('issued_date', formData.issued_date);

    if (isValidTitle && isValidIssuer && isValidIssuedDate) {
      onSave(formData, pdfFile);
    }
  };

  if (typeof window === 'undefined') return null;
  return createPortal((
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 pb-6 overflow-y-auto">
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
        className="relative w-full max-w-lg bg-[#20212b] border border-white/10 rounded-[3rem] shadow-2xl p-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <h3 className="text-2xl font-bold text-white mb-10 tracking-tight">{cert ? 'Edit Certification' : 'Add New Certification'}</h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-4">Certification Title</label>
            <input 
              autoFocus
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              className={cn(
                "w-full bg-[#101216] border rounded-2xl py-4 px-6 text-white font-medium focus:outline-none transition-all shadow-inner",
                errors.title ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/[0.08] focus:border-brand-indigo/50"
              )}
              placeholder="e.g. AWS Solutions Architect"
            />
            <AnimatePresence>
              {errors.title && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</motion.p>}
              {!errors.title && formData.title && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-brand-green/70 font-bold mt-2 ml-1">Stacked! 🏅</motion.p>}
            </AnimatePresence>
          </div>

          <div className="p-6 rounded-[2rem] bg-[#101216] border border-white/[0.08] shadow-inner">
             <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-4 text-center">Certificate Document (PDF)</label>
             <div className="flex flex-col items-center gap-4">
                {formData.pdf_url ? (
                  <div className="flex items-center gap-3 w-full p-4 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20">
                     <FileText className="w-5 h-5 text-brand-indigo" />
                     <span className="text-xs font-bold text-white flex-1 truncate">{pdfName || 'certificate_document.pdf'}</span>
                     <button 
                      type="button"
                      onClick={() => {
                        setPdfFile(null);
                        setPdfName('');
                        setFormData({ ...formData, pdf_url: '' });
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-32 flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 border-dashed border-white/10 hover:border-brand-indigo/50 hover:bg-brand-indigo/5 transition-all group disabled:opacity-50"
                  >
                    {isUploading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <Upload className="w-6 h-6 text-brand-indigo" />
                      </motion.div>
                    ) : (
                      <>
                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-brand-indigo/10 transition-colors">
                           <Upload className="w-6 h-6 text-gray-400 group-hover:text-brand-indigo" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-brand-indigo">Upload PDF Certificate</span>
                      </>
                    )}
                  </button>
                )}
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" />
             </div>
             <AnimatePresence>
               {errors.pdf && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.pdf}</motion.p>}
             </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-4">Issuer</label>
              <input 
                value={formData.issuer}
                onChange={e => handleChange('issuer', e.target.value)}
                className={cn(
                  "w-full bg-[#101216] border rounded-2xl py-4 px-6 text-white font-medium focus:outline-none transition-all shadow-inner",
                  errors.issuer ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/[0.08] focus:border-brand-indigo/50"
                )}
                placeholder="e.g. Amazon"
              />
              <AnimatePresence>
                {errors.issuer && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.issuer}</motion.p>}
              </AnimatePresence>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-4">Issued Date</label>
              <input 
                type="date"
                value={formData.issued_date || ''}
                onChange={e => handleChange('issued_date', e.target.value)}
                className={cn(
                  "w-full bg-[#101216] border rounded-2xl py-4 px-6 text-white font-medium focus:outline-none focus:border-brand-indigo/50 transition-all shadow-inner",
                  errors.issued_date ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/[0.08]"
                )}
                placeholder="2025-05-06"
              />
              <AnimatePresence>
                {errors.issued_date && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.issued_date}</motion.p>}
              </AnimatePresence>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-4">Verification URL</label>
            <input 
              value={formData.url}
              onChange={e => handleChange('url', e.target.value)}
              className={cn(
                "w-full bg-[#101216] border rounded-2xl py-4 px-6 text-white font-medium focus:outline-none transition-all shadow-inner",
                errors.url ? "border-brand-orange/40" : "border-white/[0.08] focus:border-brand-indigo/50"
              )}
              placeholder="https://..."
            />
            <AnimatePresence>
              {errors.url && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.url}</motion.p>}
            </AnimatePresence>
          </div>
          <div className="flex gap-4 pt-8">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button type="submit" className="flex-1 py-4 rounded-2xl bg-brand-indigo text-white font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-brand-indigo/20">Save Certification</button>
          </div>
        </form>
      </motion.div>
    </div>
  ), document.body);
}
