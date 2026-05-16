
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, ExternalLink, Code, X, Upload, Globe, Github, Sparkles, AlertCircle, CheckCircle2, Calendar, Database, Layers, Cpu, Server, Terminal, Box, Cloud, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import MultipleImageUpload from './MultipleImageUpload';
import Slideshow from './Slideshow';
import RichTextEditor from './RichTextEditor';
import RichTextRenderer from '@/src/components/ui/RichTextRenderer';
import { getCurrentAdminProfile } from '@/src/lib/supabase/admin-data';
import { deleteProjectWithAssets, listProjects, upsertProjectWithAssets } from '@/src/lib/supabase/phase3-data';
import { isRichTextBlank } from '@/src/lib/rich-text';

const TECH_CONFIG: Record<string, { color: string; icon: any; slug?: string }> = {
  'React': { color: '#61DAFB', icon: Layers, slug: 'react' },
  'D3.js': { color: '#F9A03C', icon: Sparkles, slug: 'd3dotjs' },
  'Framer Motion': { color: '#E91E63', icon: Box, slug: 'framer' },
  'Next.js': { color: '#FFFFFF', icon: Cloud, slug: 'nextdotjs' },
  'AWS': { color: '#FF9900', icon: Server, slug: 'amazonwebservices' },
  'Go': { color: '#00ADD8', icon: Terminal, slug: 'go' },
  'Remix': { color: '#312E81', icon: Sparkles, slug: 'remix' },
  'Stripe': { color: '#635BFF', icon: Database, slug: 'stripe' },
  'Tailwind': { color: '#06B6D4', icon: Box, slug: 'tailwindcss' },
  'Python': { color: '#3776AB', icon: Code, slug: 'python' },
  'Three.js': { color: '#FFFFFF', icon: Box, slug: 'threedotjs' },
  'PyTorch': { color: '#EE4C2C', icon: Cpu, slug: 'pytorch' },
  'Rust': { color: '#FFFFFF', icon: Terminal, slug: 'rust' },
  'Kubernetes': { color: '#326CE5', icon: Server, slug: 'kubernetes' },
  'gRPC': { color: '#244c5a', icon: Terminal },
  'Vue 3': { color: '#4FC08D', icon: Layers, slug: 'vuedotjs' },
  'Canvas': { color: '#E44D26', icon: Sparkles },
  'Supabase': { color: '#3ECF8E', icon: Database, slug: 'supabase' },
  'React Native': { color: '#61DAFB', icon: Layers, slug: 'react' },
  'Node': { color: '#339933', icon: Server, slug: 'nodedotjs' },
  'GraphQL': { color: '#E10098', icon: Database, slug: 'graphql' },
  'C++': { color: '#00599C', icon: Terminal, slug: 'cplusplus' },
  'Redis': { color: '#DC382D', icon: Database, slug: 'redis' },
  'Node.js': { color: '#339933', icon: Server, slug: 'nodedotjs' },
  'MongoDB': { color: '#47A248', icon: Database, slug: 'mongodb' },
  'Oclif': { color: '#3E5C76', icon: Terminal },
  'Shell': { color: '#4EAA25', icon: Terminal, slug: 'gnubash' },
  'Express': { color: '#FFFFFF', icon: Server, slug: 'express' },
  'Caching': { color: '#FFD700', icon: Box },
  'OpenAPI': { color: '#85EA2D', icon: Terminal, slug: 'openapiinitiative' },
  'NestJS': { color: '#E0234E', icon: Server, slug: 'nestjs' },
  'PostgreSQL': { color: '#336791', icon: Database, slug: 'postgresql' },
  'Postman': { color: '#FF6C37', icon: Terminal, slug: 'postman' },
};

const getSimpleIconUrl = (slug?: string, color?: string) => {
  if (!slug) return null;
  const cleanColor = (color || '').replace('#', '');
  return cleanColor
    ? `https://cdn.simpleicons.org/${slug}/${cleanColor}`
    : `https://cdn.simpleicons.org/${slug}`;
};

const TAG_SLUG_ALIASES: Record<string, { slug: string; color: string; icon?: any }> = {
  'nestjs': { slug: 'nestjs', color: '#E0234E', icon: Server },
  'postgresql': { slug: 'postgresql', color: '#336791', icon: Database },
  'postman': { slug: 'postman', color: '#FF6C37', icon: Terminal },
  'nodejs': { slug: 'nodedotjs', color: '#339933', icon: Server },
  'node': { slug: 'nodedotjs', color: '#339933', icon: Server },
  'r': { slug: 'r', color: '#276DC3', icon: Database },
  'rstudio': { slug: 'rstudioide', color: '#75AADB', icon: Terminal },
  'webscraper': { slug: 'scrapy', color: '#60A839', icon: Code },
  'webscraping': { slug: 'scrapy', color: '#60A839', icon: Code },
  'nextjs': { slug: 'nextdotjs', color: '#FFFFFF', icon: Cloud },
  'reactnative': { slug: 'react', color: '#61DAFB', icon: Layers },
  'cplusplus': { slug: 'cplusplus', color: '#00599C', icon: Terminal },
};

const normalizeTag = (tag: string) => tag.toLowerCase().replace(/[^a-z0-9]+/g, '');

const resolveTechVisual = (tag: string) => {
  const fromConfig = TECH_CONFIG[tag];
  if (fromConfig) return fromConfig;

  const normalized = normalizeTag(tag);
  const alias = TAG_SLUG_ALIASES[normalized];
  if (alias) {
    return {
      color: alias.color,
      slug: alias.slug,
      icon: alias.icon || Code,
    };
  }

  const autoSlug = tag
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/\.js/g, 'dotjs')
    .replace(/[^a-z0-9]+/g, '');

  return {
    color: '#8fa3bf',
    slug: autoSlug || 'simpleicons',
    icon: Code,
  };
};

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

interface ProjectEntry {
  id: number;
  title: string;
  date: string;
  tags: string[];
  images: string[];
  description: string;
  github_url?: string;
  live_url?: string;
}

const INITIAL_PROJECTS: ProjectEntry[] = [
  {
    id: 1,
    title: 'AI Dashboard Experience',
    date: 'January 20, 2024',
    tags: ['React', 'D3.js', 'Framer Motion'],
    images: [
      'https://images.unsplash.com/photo-1551288049-bbda38a1091e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A high-performance analytics dashboard featuring real-time data visualization and interactive components.'
  },
  {
    id: 2,
    title: 'Cloud Infrastructure Tool',
    date: 'February 12, 2024',
    tags: ['Next.js', 'AWS', 'Go'],
    images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Monitoring and management platform for hybrid cloud environments with automated scaling.'
  },
  {
    id: 3,
    title: 'Modern E-Commerce',
    date: 'March 05, 2024',
    tags: ['Remix', 'Stripe', 'Tailwind'],
    images: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Fast, SEO-optimized shopping experience with headless CMS integration and worldwide shipping logic.'
  },
  {
    id: 4,
    title: 'Neural Network Visualizer',
    date: 'March 28, 2024',
    tags: ['Python', 'Three.js', 'PyTorch'],
    images: [
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Educational tool for visualizing the weight distributions and activation layers of transformer models.'
  },
  {
    id: 5,
    title: 'Distributed System Manager',
    date: 'April 10, 2024',
    tags: ['Rust', 'Kubernetes', 'gRPC'],
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Low-latency orchestration engine for managing service discovery across multi-region clusters.'
  },
  {
    id: 6,
    title: 'Creative Studio Platform',
    date: 'April 22, 2024',
    tags: ['Vue 3', 'Canvas', 'Supabase'],
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Collaborative design environment with version control and real-time multiplayer editing features.'
  },
  {
    id: 7,
    title: 'FinTech Mobile Core',
    date: 'May 02, 2024',
    tags: ['React Native', 'Node', 'GraphQL'],
    images: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Secure financial management application with biometric authentication and real-time transaction tracking.'
  },
  {
    id: 8,
    title: 'Cybersecurity Scanner',
    date: 'May 14, 2024',
    tags: ['Go', 'C++', 'Redis'],
    images: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Automated vulnerability detection tool with machine learning powered threat analysis and reporting.'
  },
  {
    id: 9,
    title: 'Internal CLI Tools',
    date: 'May 20, 2024',
    tags: ['Node', 'Oclif', 'Shell'],
    images: [], // No image project 1
    description: 'A suite of command-line tools for automating developer onboarding and local environment setup.'
  },
  {
    id: 10,
    title: 'Legacy API Proxy',
    date: 'May 25, 2024',
    tags: ['Express', 'Caching', 'OpenAPI'],
    images: [], // No image project 2
    description: 'Optimization layer for outdated SOAP services, providing a clean RESTful interface for modern frontends.'
  }
];

export default function Projects() {
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProjectEntry | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'delete' } | null>(null);
  const [adminId, setAdminId] = useState<number | null>(null);

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
        const rows = await listProjects(admin.id);
        setProjects(rows);
      } catch (error) {
        setToast({ message: error instanceof Error ? error.message : 'Failed to load projects.', type: 'delete' });
      }
    };
    load();
  }, []);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleSave = async (entry: Partial<ProjectEntry>) => {
    if (!adminId) return;
    try {
      await upsertProjectWithAssets({
        adminId,
        entryId: editingEntry?.id,
        payload: {
          project_title: entry.title?.trim() || '',
          description_html: entry.description || '',
          github_url: entry.github_url?.trim() || null,
          live_url: entry.live_url?.trim() || null,
        },
        tags: entry.tags || [],
        images: entry.images || [],
      });
      const rows = await listProjects(adminId);
      setProjects(rows);
      setToast({ message: editingEntry ? 'Project updated successfully!' : 'New project added!', type: 'success' });
      setIsModalOpen(false);
      setEditingEntry(null);
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to save project.', type: 'delete' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!adminId) return;
    try {
      await deleteProjectWithAssets(id);
      const rows = await listProjects(adminId);
      setProjects(rows);
      setToast({ message: 'Project deleted successfully.', type: 'delete' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to delete project.', type: 'delete' });
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
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Projects</h2>
          <p className="text-gray-400">Manage your portfolio projects and their details.</p>
        </div>
        <button 
          onClick={() => { setEditingEntry(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-brand-indigo hover:translate-y-[-2px] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-brand-indigo/20 active:scale-95 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Add New Project
        </button>
      </div>

      <div className="space-y-4">
        {paginatedProjects.map((project, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={project.id}
            className="bg-[#161720] border border-white/5 p-6 md:p-8 rounded-[2.5rem] hover:border-brand-indigo/30 transition-all group relative flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/[0.01] via-transparent to-transparent pointer-events-none" />
            
            {/* Boxy Image Container */}
            <div className="w-full md:w-52 h-52 md:h-52 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group/box shrink-0 group-hover:scale-[1.02] transition-transform duration-500 shadow-xl">
              <Slideshow images={project.images} fallbackIcon={Code} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0 flex flex-col justify-center w-full relative z-10 pr-2 md:pr-3">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-4">
                <div className="space-y-4 min-w-0 flex-1">
                  <div className="space-y-1">
                    {/* Line 1: Title */}
                    <h4 className="text-3xl font-bold text-white leading-tight tracking-tight group-hover:text-brand-indigo transition-colors">{project.title}</h4>
                    
                    {/* Line 2: Tech Stack with Real Icons */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 py-2">
                      {project.tags.map(tag => {
                        const config = resolveTechVisual(tag);
                        const Icon = config.icon;
                        const iconUrl = getSimpleIconUrl((config as any).slug, config.color);
                        return (
                          <div 
                            key={tag} 
                            className="flex items-center gap-2 group/tag"
                          >
                            <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 group-hover/tag:border-brand-indigo/30 transition-colors">
                              {iconUrl ? (
                                <img
                                  src={iconUrl}
                                  alt={tag}
                                  className="w-3.5 h-3.5"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://cdn.simpleicons.org/${(config as any).slug || 'simpleicons'}`;
                                  }}
                                />
                              ) : (
                                <Icon
                                  className="w-3.5 h-3.5"
                                  style={{ color: config.color === '#000000' ? '#ffffff' : config.color }}
                                />
                              )}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#8fa3bf] group-hover/tag:text-white transition-colors">
                              {tag}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Line 3: Description */}
                      <div className="pt-2 border-t border-white/5">
                        <RichTextRenderer
                          content={project.description}
                          className="admin-rich-preview text-[#8fa3bf] text-[15px] leading-relaxed max-w-4xl font-medium opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                  </div>
                </div>

                {/* Management Buttons */}
                <div className="flex items-center gap-2 shrink-0 lg:mt-1 mr-1 md:mr-2">
                  <button 
                    onClick={() => { setEditingEntry(project); setIsModalOpen(true); }}
                    className="p-3 rounded-xl bg-white/5 text-white/75 hover:text-white hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-3 rounded-xl bg-red-400/5 text-white/75 hover:text-red-400 hover:bg-red-400/10 transition-all border border-white/10 hover:border-red-400/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons Integrated at Bottom */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                {project.live_url ? (
                  <a 
                    href={project.live_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2.5 px-6 py-2.5 bg-brand-indigo/10 border border-brand-indigo/20 rounded-xl text-[10px] font-black text-brand-indigo hover:bg-brand-indigo/20 transition-all uppercase tracking-[0.2em] group/visit shadow-lg shadow-brand-indigo/5"
                  >
                    <Globe className="w-3.5 h-3.5 group-hover/visit:rotate-12 transition-transform" />
                    Launch Module
                  </a>
                ) : (
                  <button disabled className="flex items-center gap-2.5 px-6 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white/10 uppercase tracking-[0.2em] cursor-not-allowed">
                    <Globe className="w-3.5 h-3.5 opacity-30" />
                    Offline
                  </button>
                )}
                
                {project.github_url ? (
                  <a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2.5 px-6 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white/40 hover:text-white hover:border-white/30 uppercase tracking-[0.2em] transition-all group/gh"
                  >
                    <Github className="w-3.5 h-3.5 group-hover/gh:-translate-y-0.5 transition-transform" />
                    Source Protocol
                  </a>
                ) : (
                   <button disabled className="flex items-center gap-2.5 px-6 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white/10 uppercase tracking-[0.2em] cursor-not-allowed">
                    <Github className="w-3.5 h-3.5 opacity-30" />
                    Private
                  </button>
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

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        entry={editingEntry || undefined}
      />
    </div>
  );
}

function ProjectModal({ isOpen, onClose, onSave, entry }: { isOpen: boolean; onClose: () => void; onSave: (e: Partial<ProjectEntry>) => void; entry?: ProjectEntry }) {
  const [formData, setFormData] = useState<Partial<ProjectEntry>>({
    title: '',
    description: '',
    tags: [],
    images: [],
    github_url: '',
    live_url: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entry) setFormData(entry);
    else setFormData({ title: '', description: '', tags: [], images: [], github_url: '', live_url: '' });
    setErrors({});
  }, [entry, isOpen]);

  const validate = (name: string, value: any) => {
    let error = '';
    
    if (name === 'title') {
      if (!value?.trim()) error = "Bro... your project needs a name! 📛";
    }

    if (name === 'description') {
      if (isRichTextBlank(value)) error = "Don't leave us in the dark, describe it! 💡";
    }

    if (name === 'tags') {
      if (!value || value.length === 0) error = "Drop some tags! What's the stack? 🛠️";
    }

    if (name === 'github_url' && value?.trim()) {
      if (!isValidUrlInput(value)) {
        error = "That GitHub link looks a bit weird, bro. 🐙";
      }
    }

    if (name === 'live_url' && value?.trim()) {
      if (!isValidUrlInput(value)) {
        error = "Broken link! Fix the live URL? 🔗";
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

  const mergePendingTags = () => {
    const pendingTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const mergedTags = pendingTags.length
      ? Array.from(new Set([...(formData.tags || []), ...pendingTags]))
      : (formData.tags || []);

    if (pendingTags.length) {
      setFormData((prev) => ({ ...prev, tags: mergedTags }));
      setTagInput('');
    }

    validate('tags', mergedTags);
    return mergedTags;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const mergedTags = mergePendingTags();
    const isValidTitle = validate('title', formData.title);
    const isValidDesc = validate('description', formData.description);
    const isValidTags = validate('tags', mergedTags);

    if (isValidTitle && isValidDesc && isValidTags) {
      onSave({ ...formData, tags: mergedTags });
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const nextTag = tagInput.trim();
      const nextTags = formData.tags?.includes(nextTag)
        ? (formData.tags || [])
        : [...(formData.tags || []), nextTag];
      setFormData({ ...formData, tags: nextTags });
      validate('tags', nextTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const nextTags = formData.tags?.filter(t => t !== tagToRemove) || [];
    setFormData({ ...formData, tags: nextTags });
    validate('tags', nextTags);
  };

  if (typeof window === 'undefined') return null;
  return createPortal((
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 pb-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-surface-bg border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-surface-bg border-b border-white/5">
              <h3 className="text-xl font-bold text-white tracking-tight">{entry ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              <MultipleImageUpload 
                label="Project Images"
                images={formData.images || []}
                onChange={(images) => setFormData({ ...formData, images })}
              />

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-white/40 block mb-2">Project Title</label>
                  <input 
                    value={formData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className={cn(
                      "w-full bg-white/[0.03] border rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 transition-all",
                      errors.title ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/10 focus:ring-brand-indigo/20 focus:border-brand-indigo/50"
                    )}
                    placeholder="e.g. Portfolio Website"
                  />
                  <AnimatePresence>
                    {errors.title && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</motion.p>}
                    {!errors.title && formData.title && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-brand-green/70 font-bold mt-2 ml-1">Sick title! 🔥</motion.p>}
                  </AnimatePresence>
                </div>

                <div>
                   <label className="text-xs font-black uppercase tracking-widest text-white/40 block mb-2">Tags / Tech Stack</label>
                   <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags?.map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 bg-brand-indigo/10 text-brand-indigo px-2.5 py-1 rounded-lg text-xs font-bold border border-brand-indigo/20">
                          {tag}
                          <button onClick={() => removeTag(tag)}><X className="w-3 h-3 hover:scale-110" /></button>
                        </span>
                      ))}
                   </div>
                   <input 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    onBlur={mergePendingTags}
                    className={cn(
                      "w-full bg-white/[0.03] border rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 transition-all",
                      errors.tags ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/10 focus:ring-brand-indigo/20 focus:border-brand-indigo/50"
                    )}
                    placeholder="Type and press Enter to add tags..."
                  />
                  <AnimatePresence>
                    {errors.tags && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.tags}</motion.p>}
                  </AnimatePresence>
                </div>

                <div>
                   <label className="text-xs font-black uppercase tracking-widest text-white/40 block mb-2">Description</label>
                   <div className={cn(
                     "rounded-xl overflow-hidden border transition-all",
                     errors.description ? "border-brand-orange/40 focus-within:ring-brand-orange/10 shadow-[0_0_15px_rgba(255,138,0,0.05)]" : "border-white/10 shadow-sm"
                   )}>
                      <RichTextEditor 
                        value={formData.description || ''}
                        onChange={val => handleChange('description', val)}
                      />
                   </div>
                   <AnimatePresence>
                    {errors.description && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.description}</motion.p>}
                   </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="text-xs font-black uppercase tracking-widest text-white/40 block mb-2">GitHub URL</label>
                    <input 
                      value={formData.github_url}
                      onChange={e => handleChange('github_url', e.target.value)}
                      className={cn(
                        "w-full bg-white/[0.03] border rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 transition-all font-mono text-sm",
                        errors.github_url ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/10 focus:ring-brand-indigo/20 focus:border-brand-indigo/50"
                      )}
                      placeholder="https://github.com/..."
                    />
                    <AnimatePresence>
                      {errors.github_url && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.github_url}</motion.p>}
                    </AnimatePresence>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-white/40 block mb-2">Live URL</label>
                    <input 
                      value={formData.live_url}
                      onChange={e => handleChange('live_url', e.target.value)}
                      className={cn(
                        "w-full bg-white/[0.03] border rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 transition-all font-mono text-sm",
                        errors.live_url ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/10 focus:ring-brand-indigo/20 focus:border-brand-indigo/50"
                      )}
                      placeholder="https://..."
                    />
                    <AnimatePresence>
                      {errors.live_url && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.live_url}</motion.p>}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-6 bg-surface-bg border-t border-white/5 flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSubmit()}
                className="flex-[2] py-3 rounded-xl bg-brand-indigo text-white font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-brand-indigo/20"
              >
                {entry ? 'Update Project' : 'Save Project'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  ), document.body);
}
