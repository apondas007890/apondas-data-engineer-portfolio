
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Plus, Edit2, Trash2, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { getCurrentAdminProfile } from '@/src/lib/supabase/admin-data';
import {
  deleteSkillCategoryWithSkills,
  deleteSkill,
  listSkillCategories,
  upsertSkill,
  upsertSkillCategory,
} from '@/src/lib/supabase/phase3-data';
import { ConfirmDeleteDialog } from '@/src/components/admin/ConfirmDeleteDialog';

interface Skill {
  id: number;
  name: string;
  categoryId: number;
  category: string;
  iconKey?: string | null;
  logoUrl?: string | null;
  sortOrder?: number | null;
  createdAt?: string | null;
}

interface SkillCategoryGroup {
  id: number;
  name: string;
  sortOrder: number;
  createdAt?: string | null;
  skills: Skill[];
}

const SKILL_ICON_MAP: Record<string, { icon: string; color?: string }> = {
  python: { icon: 'logos:python' },
  sql: { icon: 'mdi:database-search', color: '#4E8CCF' },
  r: { icon: 'logos:r-lang' },
  rstudio: { icon: 'devicon:rstudio' },
  'c++': { icon: 'logos:c-plusplus' },
  postgresql: { icon: 'logos:postgresql' },
  mysql: { icon: 'logos:mysql' },
  oracle: { icon: 'logos:oracle' },
  ssms: { icon: 'simple-icons:microsoftsqlserver', color: '#CC2927' },
  'sql server': { icon: 'simple-icons:microsoftsqlserver', color: '#CC2927' },
  spark: { icon: 'simple-icons:apachespark', color: '#E25A1C' },
  pyspark: { icon: 'simple-icons:apachespark', color: '#E25A1C' },
  'spark sql': { icon: 'simple-icons:apachespark', color: '#E25A1C' },
  'spark streaming': { icon: 'simple-icons:apachespark', color: '#E25A1C' },
  'spark straming': { icon: 'simple-icons:apachespark', color: '#E25A1C' },
  'apache spark': { icon: 'simple-icons:apachespark', color: '#E25A1C' },
  'apache airflow': { icon: 'simple-icons:apacheairflow', color: '#00C7D4' },
  airflow: { icon: 'simple-icons:apacheairflow', color: '#00C7D4' },
  'apache kafka': { icon: 'simple-icons:apachekafka', color: '#F5F5F5' },
  kafka: { icon: 'simple-icons:apachekafka', color: '#F5F5F5' },
  hadoop: { icon: 'simple-icons:apachehadoop', color: '#66CCFF' },
  yarn: { icon: 'simple-icons:apachehadoop', color: '#66CCFF' },
  snowflake: { icon: 'simple-icons:snowflake', color: '#29B5E8' },
  databricks: { icon: 'simple-icons:databricks', color: '#FF3621' },
  figma: { icon: 'logos:figma' },
  'vs code': { icon: 'logos:visual-studio-code' },
  'visual studio code': { icon: 'logos:visual-studio-code' },
  postman: { icon: 'logos:postman-icon' },
  fastapi: { icon: 'logos:fastapi-icon' },
  git: { icon: 'logos:git-icon' },
  github: { icon: 'logos:github-icon' },
  windows: { icon: 'simple-icons:windows', color: '#0078D6' },
  linux: { icon: 'logos:linux-tux' },
  'microsoft office': { icon: 'simple-icons:microsoftoffice', color: '#D83B01' },
  'ms office': { icon: 'simple-icons:microsoftoffice', color: '#D83B01' },
  s3: { icon: 'simple-icons:amazons3', color: '#569A31' },
  'amazon s3': { icon: 'simple-icons:amazons3', color: '#569A31' },
  pandas: { icon: 'logos:pandas-icon' },
  numpy: { icon: 'simple-icons:numpy', color: '#4DABCF' },
  'data modeling': { icon: 'mdi:database-cog', color: '#6EA8FE' },
  'etl/elt data pipeline': { icon: 'mdi:source-merge', color: '#9B8CFF' },
  'etl elt data pipeline': { icon: 'mdi:source-merge', color: '#9B8CFF' },
};

const normalizeSkill = (value: string) => value.trim().toLowerCase();
const parseCommaSkills = (value: string) =>
  Array.from(new Set(value.split(',').map((v) => v.trim()).filter(Boolean)));
const getIconMetaForSkill = (name: string) => {
  const normalized = normalizeSkill(name);
  const direct = SKILL_ICON_MAP[normalized];
  if (direct) return direct;

  if (normalized.includes('windows')) return { icon: 'simple-icons:windows', color: '#0078D6' };
  if (normalized.includes('office')) return { icon: 'simple-icons:microsoftoffice', color: '#D83B01' };
  if (normalized.includes('amazon s3') || normalized === 's3' || normalized.includes('aws s3')) {
    return { icon: 'simple-icons:amazons3', color: '#569A31' };
  }
  if (normalized.includes('pandas')) return { icon: 'logos:pandas-icon' };
  if (normalized.includes('numpy')) return { icon: 'simple-icons:numpy', color: '#4DABCF' };
  if (normalized.includes('data modeling') || normalized.includes('datamodeling')) {
    return { icon: 'mdi:database-cog', color: '#6EA8FE' };
  }
  if (normalized.includes('etl') || normalized.includes('pipeline')) {
    return { icon: 'mdi:cog-transfer', color: '#9B8CFF' };
  }
  return null;
};

const BRAND_LOGO_MAP: Record<string, string> = {
  sql: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Cellipse cx='54' cy='30' rx='34' ry='14' fill='%23e8eefc' stroke='%234b3a61' stroke-width='6'/%3E%3Cpath d='M20 30v44c0 8 15 14 34 14s34-6 34-14V30' fill='%23bfd0ef' stroke='%234b3a61' stroke-width='6'/%3E%3Cpath d='M20 52c0 8 15 14 34 14s34-6 34-14' fill='none' stroke='%234b3a61' stroke-width='6'/%3E%3Cpath d='M20 74c0 8 15 14 34 14s34-6 34-14' fill='none' stroke='%234b3a61' stroke-width='6'/%3E%3Crect x='66' y='62' width='48' height='34' rx='9' fill='%23f5e27a' stroke='%234b3a61' stroke-width='6'/%3E%3Cpath d='M79 86c-5 0-9-4-9-9s4-9 9-9h8v6h-8c-2 0-3 1-3 3s1 3 3 3h4c5 0 9 4 9 9s-4 9-9 9h-8v-6h8c2 0 3-1 3-3s-1-3-3-3h-4zM98 68h6v24h-6z' fill='%234b3a61'/%3E%3C/svg%3E",
  stratascratch:
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='22' fill='none'/%3E%3Cpath d='M12 74c10 0 16-8 22-16 7-10 14-20 28-20s21 10 28 20c6 8 12 16 22 16v16c-14 0-21-10-28-20-6-8-12-16-22-16s-16 8-22 16c-7 10-14 20-28 20z' fill='%234d4d4f'/%3E%3Cpath d='M12 90c14 0 21-10 28-20 6-8 12-16 22-16s16 8 22 16c7 10 14 20 28 20V74c-10 0-16-8-22-16-7-10-14-20-28-20S41 48 34 58c-6 8-12 16-22 16z' fill='%2300a7a0'/%3E%3C/svg%3E",
  'apache airflow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apacheairflow/apacheairflow-original.svg',
  airflow: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apacheairflow/apacheairflow-original.svg',
  hadoop: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg',
  spark: 'https://cdn.simpleicons.org/apachespark/E25A1C',
  pyspark: 'https://cdn.simpleicons.org/apachespark/E25A1C',
  'spark sql': 'https://cdn.simpleicons.org/apachespark/E25A1C',
  'spark streaming': 'https://cdn.simpleicons.org/apachespark/E25A1C',
  'spark straming': 'https://cdn.simpleicons.org/apachespark/E25A1C',
  'apache kafka': 'https://cdn.simpleicons.org/apachekafka/FFFFFF',
  kafka: 'https://cdn.simpleicons.org/apachekafka/FFFFFF',
  databricks: 'https://cdn.simpleicons.org/databricks/FF3621',
  rstudio: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rstudio/rstudio-original.svg',
  pandas: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
  numpy: 'https://cdn.simpleicons.org/numpy/4DABCF',
  fastapi: 'https://cdn.simpleicons.org/fastapi/009688',
  git: 'https://cdn.simpleicons.org/git/F05032',
  github: 'https://cdn.simpleicons.org/github/FFFFFF',
  linux: 'https://cdn.simpleicons.org/linux/FCC624',
};

const getBrandLogoForSkill = (name: string) => {
  const normalized = normalizeSkill(name);
  if (normalized.includes('stratascratch')) return BRAND_LOGO_MAP.stratascratch;
  if (normalized === 'sql' || /\bsql\b/.test(normalized)) return BRAND_LOGO_MAP.sql;
  return BRAND_LOGO_MAP[normalized] ?? null;
};

export default function Skills() {
  const [groups, setGroups] = useState<SkillCategoryGroup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'delete' } | null>(null);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [pendingDeleteCategoryId, setPendingDeleteCategoryId] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<SkillCategoryGroup | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (toast) {
      timer = setTimeout(() => setToast(null), 4000);
    }
    return () => clearTimeout(timer);
  }, [toast]);

  const loadSkills = async (targetAdminId: number) => {
    const categories = await listSkillCategories(targetAdminId);
    const nextGroups: SkillCategoryGroup[] = [];
    for (const category of categories) {
      const cName = (category.category_name as string) ?? 'General';
      const cSort = Number(category.sort_order ?? 0);
      const rows = (category.skills as Array<{
        id: number;
        skill_name: string;
        skill_icon_key?: string | null;
        skill_logo_url?: string | null;
        sort_order?: number | null;
        created_at?: string | null;
      }> | null) ?? [];
      const mappedSkills = rows
        .map((skill) => ({
          id: skill.id,
          name: skill.skill_name,
          categoryId: category.id as number,
          category: cName,
          iconKey: skill.skill_icon_key ?? null,
          logoUrl: skill.skill_logo_url ?? null,
          sortOrder: skill.sort_order ?? 0,
          createdAt: skill.created_at ?? null,
        }))
        .sort((a, b) => {
          const bySort = Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0);
          if (bySort !== 0) return bySort;
          return (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
        });

      nextGroups.push({
        id: category.id as number,
        name: cName,
        sortOrder: cSort,
        createdAt: (category.created_at as string | null) ?? null,
        skills: mappedSkills,
      });
    }
    nextGroups.sort((a, b) => {
      const bySort = a.sortOrder - b.sortOrder;
      if (bySort !== 0) return bySort;
      return (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
    });
    setGroups(nextGroups);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const admin = await getCurrentAdminProfile();
        setAdminId(admin.id);
        await loadSkills(admin.id);
      } catch (error) {
        setToast({ message: error instanceof Error ? error.message : 'Failed to load skills.', type: 'delete' });
      }
    };
    load();
  }, []);

  const handleSave = async (skill: Partial<Skill>) => {
    if (!adminId) return;
    try {
      const categories = await listSkillCategories(adminId);
      const existingCategory = categories.find(
        (c) => String(c.category_name).toLowerCase() === String(skill.category).toLowerCase()
      );

      const categoryId = await upsertSkillCategory(adminId, {
        id: existingCategory?.id as number | undefined,
        category_name: (skill.category || '').trim(),
      });

      const categoryRecord = categories.find((c) => c.id === categoryId);
      const categorySkills =
        ((categoryRecord?.skills as Array<{ id: number; skill_name: string; sort_order?: number | null }> | null) ?? []);
      const existingNames = new Set(categorySkills.map((s) => normalizeSkill(s.skill_name)));
      const maxSortOrder = categorySkills.reduce((max, s) => Math.max(max, s.sort_order ?? 0), -1);

      if (editingSkill?.id) {
        const editName = (skill.name || '').trim();
        const duplicate = categorySkills.some(
          (s) => s.id !== editingSkill.id && normalizeSkill(s.skill_name) === normalizeSkill(editName)
        );
        if (duplicate) {
          throw new Error('This skill already exists in this category.');
        }
        await upsertSkill({
          id: editingSkill.id,
          category_id: categoryId,
          skill_name: editName,
          skill_icon_key: getIconMetaForSkill(editName)?.icon ?? null,
        });
      } else {
        const parsedSkills = parseCommaSkills(skill.name || '');
        const uniqueToInsert: string[] = [];
        const seenNow = new Set<string>();
        for (const item of parsedSkills) {
          const key = normalizeSkill(item);
          if (existingNames.has(key) || seenNow.has(key)) continue;
          seenNow.add(key);
          uniqueToInsert.push(item);
        }

        if (uniqueToInsert.length === 0) {
          throw new Error('All provided skills already exist in this category.');
        }

        for (let i = 0; i < uniqueToInsert.length; i += 1) {
          const skillName = uniqueToInsert[i];
          await upsertSkill({
            category_id: categoryId,
            skill_name: skillName,
            skill_icon_key: getIconMetaForSkill(skillName)?.icon ?? null,
            sort_order: maxSortOrder + 1 + i,
          });
        }
      }

      await loadSkills(adminId);
      setToast({
        message: editingSkill ? 'Skill updated successfully.' : 'Skill(s) added successfully.',
        type: 'success',
      });
      setIsModalOpen(false);
      setEditingSkill(null);
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to save skill.', type: 'delete' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!adminId) return;
    try {
      await deleteSkill(id);
      await loadSkills(adminId);
      setToast({ message: 'Skill deleted successfully.', type: 'delete' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to delete skill.', type: 'delete' });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!adminId) return;
    try {
      await deleteSkillCategoryWithSkills(id);
      await loadSkills(adminId);
      setToast({ message: 'Category deleted successfully.', type: 'delete' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to delete category.', type: 'delete' });
    }
  };

  const handleCategoryRename = async (categoryId: number, name: string) => {
    if (!adminId) return;
    try {
      await upsertSkillCategory(adminId, { id: categoryId, category_name: name.trim() });
      await loadSkills(adminId);
      setToast({ message: 'Category updated successfully.', type: 'success' });
      setEditingCategory(null);
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to update category.', type: 'delete' });
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
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Skills</h2>
          <p className="text-gray-400">Master your technical and professional capabilities.</p>
        </div>
        <button 
          onClick={() => { setEditingSkill(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-brand-indigo hover:translate-y-[-2px] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-brand-indigo/20 active:scale-95 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Add New Skill
        </button>
      </div>

      <div className="space-y-6">
        {groups.map((group, groupIdx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIdx * 0.05 }}
            className="bg-[#161720] border border-white/5 rounded-[2rem] p-5 md:p-6"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-base md:text-lg font-bold text-white tracking-tight">{group.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingCategory(group)}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPendingDeleteCategoryId(group.id)}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {group.skills.length === 0 ? (
              <p className="text-sm text-gray-500">No skills in this category yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {group.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-[#101216] border border-white/[0.08] rounded-xl px-3 py-2.5 flex items-center justify-between gap-3 hover:border-brand-indigo/40 transition-all"
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        {getBrandLogoForSkill(skill.name) ? (
                          <img
                            src={getBrandLogoForSkill(skill.name) || ''}
                            alt={skill.name}
                            className="w-[18px] h-[18px] object-contain"
                            style={{ filter: 'brightness(1.18) saturate(1.12)' }}
                          />
                        ) : skill.iconKey ? (
                          <Icon
                            icon={skill.iconKey}
                            className="w-[20px] h-[20px]"
                            style={{
                              color: getIconMetaForSkill(skill.name)?.color,
                              filter: 'brightness(1.35) saturate(1.2) drop-shadow(0 0 4px rgba(255,255,255,0.15))',
                            }}
                          />
                        ) : getIconMetaForSkill(skill.name) ? (
                          <Icon
                            icon={getIconMetaForSkill(skill.name)!.icon}
                            className="w-[20px] h-[20px]"
                            style={{
                              color: getIconMetaForSkill(skill.name)?.color,
                              filter: normalizeSkill(skill.name).includes('pandas')
                                ? 'brightness(1.45) saturate(1.25) drop-shadow(0 0 6px rgba(28,18,98,0.5))'
                                : 'brightness(1.35) saturate(1.2) drop-shadow(0 0 4px rgba(255,255,255,0.15))',
                            }}
                          />
                        ) : skill.logoUrl ? (
                          <img src={skill.logoUrl} alt={skill.name} className="w-[20px] h-[20px] object-contain" />
                        ) : (
                          <Code className="w-[20px] h-[20px] text-brand-indigo" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-white truncate">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => { setEditingSkill(skill); setIsModalOpen(true); }}
                        className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setPendingDeleteId(skill.id)}
                        className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <SkillModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            skill={editingSkill || undefined}
            categories={groups}
          />
        )}
      </AnimatePresence>
      <ConfirmDeleteDialog
        open={pendingDeleteId !== null}
        title="Delete skill"
        description="This will remove the skill and its linked logo file."
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={async () => {
          if (pendingDeleteId === null) return;
          const id = pendingDeleteId;
          setPendingDeleteId(null);
          await handleDelete(id);
        }}
      />
      <ConfirmDeleteDialog
        open={pendingDeleteCategoryId !== null}
        title="Delete category"
        description="This will delete the category, all related skills, and linked skill logos."
        onCancel={() => setPendingDeleteCategoryId(null)}
        onConfirm={async () => {
          if (pendingDeleteCategoryId === null) return;
          const id = pendingDeleteCategoryId;
          setPendingDeleteCategoryId(null);
          await handleDeleteCategory(id);
        }}
      />
      <AnimatePresence>
        {editingCategory && (
          <CategoryModal
            categoryName={editingCategory.name}
            onClose={() => setEditingCategory(null)}
            onSave={(name) => handleCategoryRename(editingCategory.id, name)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SkillModal({
  isOpen,
  onClose,
  onSave,
  skill,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (s: Partial<Skill>) => void;
  skill?: Skill;
  categories: SkillCategoryGroup[];
}) {
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    category: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const isEditMode = Boolean(skill);
  const creatingNewCategory = selectedCategoryId === '__new';

  useEffect(() => {
    if (skill) {
      setFormData({ name: skill.name, category: skill.category });
      setSelectedCategoryId(String(skill.categoryId));
      setNewCategoryName('');
    } else {
      setFormData({ name: '', category: '' });
      setSelectedCategoryId(categories.length ? String(categories[0].id) : '__new');
      setNewCategoryName('');
    }
    setErrors({});
  }, [skill, isOpen, categories]);

  const validate = (updatedData: Partial<Skill>) => {
    const newErrors: Record<string, string> = { ...errors };
    const d = { ...formData, ...updatedData };

    if (updatedData.name !== undefined || Object.keys(updatedData).length === 0) {
      if (!d.name?.trim()) {
        newErrors.name = "Skill name is required, bro! ⚡️";
      } else if (isEditMode && d.name.includes(',')) {
        newErrors.name = "Edit one skill at a time. Use Add Skill to add multiple skills.";
      } else {
        newErrors.name = "";
      }
    }
    if (updatedData.category !== undefined || Object.keys(updatedData).length === 0) {
      const categoryValue = d.category?.trim() || '';
      newErrors.category = categoryValue ? "" : "Select a category or create a new one.";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (name: string, value: string) => {
    const updatedData = { [name]: value };
    setFormData(prev => ({ ...prev, ...updatedData }));
    validate(updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedCategory = creatingNewCategory
      ? newCategoryName.trim()
      : categories.find((c) => String(c.id) === selectedCategoryId)?.name?.trim() || '';
    const submitData: Partial<Skill> = { ...formData, category: resolvedCategory };
    const currentErrors = validate({
      name: submitData.name || '',
      category: submitData.category || '',
    });
    const isValid = submitData.name?.trim() && submitData.category?.trim() && !Object.values(currentErrors).some(err => err !== "");
    
    if (isValid) {
      onSave(submitData);
    }
  };

  const resolvedCategory = creatingNewCategory
    ? newCategoryName.trim()
    : categories.find((c) => String(c.id) === selectedCategoryId)?.name?.trim() || '';
  const hasSkillInput = Boolean(formData.name?.trim());
  const hasCategoryInput = Boolean(resolvedCategory);
  const hasBlockingErrors = Object.values(errors).some(err => err !== "");
  const isFormValid = hasSkillInput && hasCategoryInput && !hasBlockingErrors;

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
        className="relative w-full max-w-md bg-[#20212b] border border-white/10 rounded-[2.5rem] shadow-2xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-8 tracking-tight">{skill ? 'Edit Skill' : 'Add New Skill'}</h3>
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-3">Category <span className="text-brand-orange ml-1 text-xs">*</span></label>
            <select
              autoFocus
              disabled={isEditMode}
              value={selectedCategoryId}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategoryId(value);
                const selectedName = value === '__new'
                  ? newCategoryName
                  : categories.find((c) => String(c.id) === value)?.name || '';
                handleChange('category', selectedName);
              }}
              className={cn(
                "w-full bg-[#101216] border rounded-xl py-4 px-5 text-white font-medium focus:outline-none transition-all",
                isEditMode ? "opacity-80 cursor-not-allowed" : "",
                errors.category ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/[0.08] focus:border-brand-indigo/50"
              )}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
              ))}
              {!isEditMode && <option value="__new">+ Create New Category</option>}
            </select>
            {!isEditMode && creatingNewCategory && (
              <input
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  handleChange('category', e.target.value);
                }}
                className={cn(
                  "mt-3 w-full bg-[#101216] border rounded-xl py-4 px-5 text-white font-medium focus:outline-none transition-all",
                  errors.category ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/[0.08] focus:border-brand-indigo/50"
                )}
                placeholder="e.g. Programming Languages"
              />
            )}
            <AnimatePresence>
              {errors.category && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2.5 ml-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errors.category}</motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block mb-3">
              {isEditMode ? 'Skill Name' : 'Skill Name(s)'} <span className="text-brand-orange ml-1 text-xs">*</span>
            </label>
            <input 
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              className={cn(
                "w-full bg-[#101216] border rounded-xl py-4 px-5 text-white font-medium focus:outline-none transition-all",
                errors.name ? "border-brand-orange/40 focus:ring-brand-orange/10" : "border-white/[0.08] focus:border-brand-indigo/50"
              )}
              placeholder={isEditMode ? "e.g. React" : "e.g. Python, SQL, R"}
            />
            {!isEditMode && !errors.name && (
              <p className="text-[11px] text-[#8fa3bf] font-bold mt-2.5 ml-1">Separate multiple skills with commas.</p>
            )}
            <AnimatePresence>
              {errors.name && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2.5 ml-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errors.name}</motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button 
              type="submit" 
              disabled={!isFormValid}
              className={cn(
                "flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                isFormValid 
                  ? "bg-brand-indigo text-white hover:translate-y-[-1px] shadow-lg shadow-brand-indigo/20 active:translate-y-[0px]"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              {skill ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  ), document.body);
}

function CategoryModal({
  categoryName,
  onClose,
  onSave,
}: {
  categoryName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState(categoryName);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(categoryName);
    setError('');
  }, [categoryName]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    onSave(name);
  };

  if (typeof window === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-20 pb-6 overflow-y-auto">
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
        className="relative w-full max-w-md bg-[#20212b] border border-white/10 rounded-[2rem] shadow-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-5">Edit Category</h3>
        <form onSubmit={submit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            className={cn(
              "w-full bg-[#101216] border rounded-xl py-3 px-4 text-white font-medium focus:outline-none transition-all",
              error ? "border-brand-orange/40" : "border-white/[0.08] focus:border-brand-indigo/50"
            )}
          />
          {error && <p className="text-[11px] text-brand-orange font-bold">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-brand-indigo text-white font-black text-[10px] uppercase tracking-widest">Save Category</button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
}
