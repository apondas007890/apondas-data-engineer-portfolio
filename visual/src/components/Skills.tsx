import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { Code2 } from 'lucide-react';
import {
  SiApacheairflow,
  SiApachehadoop,
  SiApachekafka,
  SiApachespark,
  SiDatabricks,
  SiFastapi,
  SiGit,
  SiGithub,
  SiLinux,
  SiNumpy,
  SiPandas,
  SiPostman,
  SiPython,
  SiR,
  SiRstudioide,
} from 'react-icons/si';
import { FaAws, FaMicrosoft, FaWindows } from 'react-icons/fa';
import { MdOutlineManageSearch, MdModelTraining } from 'react-icons/md';
import { SKILL_GROUPS } from '../constants/data';

type DbSkill = {
  id: string;
  name: string;
  iconKey?: string | null;
  logoUrl?: string | null;
};

type DbSkillGroup = {
  id: string;
  title: string;
  skills: DbSkill[];
};

type RenderSkill = {
  id: string;
  name: string;
  normalizedKey: string;
  iconKey: string | null;
  logoUrl: string | null;
  color: string;
  LegacyIcon?: React.ComponentType<{ size?: number }>;
};

const normalizeSkill = (value: string) => value.trim().toLowerCase();

const ICON_KEY_BY_SKILL: Record<string, string> = {
  python: 'devicon:python',
  sql: 'mdi:database-search',
  r: 'devicon:r',
  spark: 'simple-icons:apachespark',
  pyspark: 'simple-icons:apachespark',
  'spark sql': 'simple-icons:apachespark',
  yarn: 'simple-icons:apache',
  hadoop: 'simple-icons:apachehadoop',
  'apache kafka': 'simple-icons:apachekafka',
  'spark streaming': 'simple-icons:apachespark',
  'apache airflow': 'simple-icons:apacheairflow',
  databricks: 'simple-icons:databricks',
  'amazon s3': 'simple-icons:amazons3',
  'data modeling': 'mdi:database-cog',
  'etl/elt data pipelines': 'mdi:source-merge',
  pandas: 'simple-icons:pandas',
  numpy: 'simple-icons:numpy',
  fastapi: 'simple-icons:fastapi',
  git: 'simple-icons:git',
  github: 'simple-icons:github',
  postman: 'simple-icons:postman',
  'vs code': 'simple-icons:visualstudiocode',
  rstudio: 'simple-icons:rstudioide',
  'microsoft office': 'simple-icons:microsoftoffice',
  windows: 'simple-icons:windows',
  linux: 'simple-icons:linux',
};

const COLOR_BY_SKILL: Record<string, string> = {
  python: '#3776AB',
  sql: '#75C9FF',
  r: '#276DC3',
  spark: '#E25A1C',
  pyspark: '#F07F3D',
  'spark sql': '#E25A1C',
  yarn: '#36D7D0',
  hadoop: '#F9E900',
  'apache kafka': '#EDE8DE',
  'spark streaming': '#36D97F',
  'apache airflow': '#00B4D8',
  databricks: '#FF3621',
  'amazon s3': '#73C61D',
  'data modeling': '#8AD6EF',
  'etl/elt data pipelines': '#BDA4F2',
  pandas: '#A78BFA',
  numpy: '#4EA4D8',
  fastapi: '#00C7B7',
  git: '#F05032',
  github: '#EDE8DE',
  postman: '#FF6C37',
  'vs code': '#007ACC',
  rstudio: '#75AADB',
  'microsoft office': '#D24726',
  windows: '#3AA5FF',
  linux: '#F6C54B',
};

const DISPLAY_NAME_BY_SKILL: Record<string, string> = {
  python: 'Python',
  sql: 'SQL',
  r: 'R',
  spark: 'Spark',
  pyspark: 'PySpark',
  'spark sql': 'Spark SQL',
  yarn: 'YARN',
  hadoop: 'Hadoop',
  'apache kafka': 'Apache Kafka',
  'spark straming': 'Spark straming',
  'spark streaming': 'Spark Streaming',
  'apache airflow': 'Apache Airflow',
  databricks: 'Databricks',
  'amazon s3': 'Amazon S3',
  'data modeling': 'Data modeling',
  'etl/elt data pipelines': 'ETL/ELT data Pipelines',
  pandas: 'Pandas',
  numpy: 'NumPy',
  fastapi: 'FastAPI',
  git: 'Git',
  github: 'GitHub',
  postman: 'Postman',
  'vs code': 'VS Code',
  rstudio: 'RStudio',
  'microsoft office': 'Microsoft Office',
  windows: 'Windows',
  linux: 'Linux',
};

const DISPLAY_NAME_BY_CATEGORY: Record<string, string> = {
  'programming languages': 'Programming Languages',
  'big data technologies': 'Big Data Technologies',
  'streaming technologies': 'Streaming Technologies',
  orchestration: 'Orchestration',
  'cloud platforms': 'Cloud Platforms',
  'data engineering tools': 'Data Engineering Tools',
  'tools & platforms': 'Tools & Platforms',
};

const SAFE_ICON_KEYS = new Set<string>([
  'devicon:python',
  'mdi:database-search',
  'devicon:r',
  'simple-icons:apachespark',
  'simple-icons:apache',
  'simple-icons:apachehadoop',
  'simple-icons:apachekafka',
  'simple-icons:apacheairflow',
  'simple-icons:databricks',
  'simple-icons:amazons3',
  'mdi:database-cog',
  'mdi:source-merge',
  'mdi:cog-transfer',
  'simple-icons:pandas',
  'simple-icons:numpy',
  'simple-icons:fastapi',
  'simple-icons:git',
  'simple-icons:github',
  'simple-icons:postman',
  'simple-icons:visualstudiocode',
  'simple-icons:rstudioide',
  'simple-icons:microsoftoffice',
  'simple-icons:windows',
  'simple-icons:linux',
  'devicon:postman',
  'devicon:vscode',
]);

const ICON_BY_KEY: Record<string, React.ComponentType<{ size?: number }>> = {
  'devicon:python': SiPython,
  'mdi:database-search': MdOutlineManageSearch,
  'devicon:r': SiR,
  'simple-icons:apachespark': SiApachespark,
  'simple-icons:apache': MdModelTraining,
  'simple-icons:apachehadoop': SiApachehadoop,
  'simple-icons:apachekafka': SiApachekafka,
  'simple-icons:apacheairflow': SiApacheairflow,
  'simple-icons:databricks': SiDatabricks,
  'simple-icons:amazons3': FaAws,
  'simple-icons:pandas': SiPandas,
  'simple-icons:numpy': SiNumpy,
  'simple-icons:fastapi': SiFastapi,
  'simple-icons:git': SiGit,
  'simple-icons:github': SiGithub,
  'simple-icons:postman': SiPostman,
  'simple-icons:visualstudiocode': Code2,
  'simple-icons:rstudioide': SiRstudioide,
  'simple-icons:microsoftoffice': FaMicrosoft,
  'simple-icons:windows': FaWindows,
  'simple-icons:linux': SiLinux,
  'devicon:postman': SiPostman,
  'devicon:vscode': Code2,
};

const FORCE_LOGO_FIRST = new Set<string>(['apache airflow', 'airflow', 'hadoop']);
const ICONIFY_ICON_KEYS = new Set<string>(['mdi:database-cog', 'mdi:source-merge', 'mdi:cog-transfer']);

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
  'microsoft office': 'https://cdn.simpleicons.org/microsoftoffice/D83B01',
  'ms office': 'https://cdn.simpleicons.org/microsoftoffice/D83B01',
};

const getBrandLogoForSkill = (name: string) => {
  const normalized = normalizeSkill(name);
  if (normalized.includes('stratascratch')) return BRAND_LOGO_MAP.stratascratch;
  if (
    normalized === 'spark sql' ||
    normalized === 'spark streaming' ||
    normalized === 'spark straming' ||
    normalized === 'spark' ||
    normalized === 'pyspark' ||
    normalized === 'apache spark'
  ) {
    return BRAND_LOGO_MAP['spark sql'];
  }
  if (normalized === 'sql') return BRAND_LOGO_MAP.sql;
  return BRAND_LOGO_MAP[normalized] ?? null;
};

export const Skills = () => {
  const [dbGroups, setDbGroups] = useState<DbSkillGroup[] | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSkills = async () => {
      try {
        const response = await fetch('/api/visual/skills', { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        if (!mounted) return;
        const groups = Array.isArray(payload?.groups) ? (payload.groups as DbSkillGroup[]) : [];
        setDbGroups(groups.length > 0 ? groups : null);
      } catch {
        setDbGroups(null);
      }
    };

    loadSkills();
    return () => {
      mounted = false;
    };
  }, []);

  const groups = useMemo((): Array<{ title: string; skills: RenderSkill[] }> => {
    if (dbGroups && dbGroups.length > 0) {
      return dbGroups.map((group) => ({
        title:
          DISPLAY_NAME_BY_CATEGORY[((group.title || 'Uncategorized').trim().toLowerCase())] ||
          (group.title || 'Uncategorized').trim(),
        skills: (group.skills || []).map((skill) => {
          const safeName = (skill?.name || '').trim();
          const key = safeName.toLowerCase();
          const brandLogo = getBrandLogoForSkill(safeName);
          const iconKey =
            key === 'spark sql'
              ? ICON_KEY_BY_SKILL[key] || null
              : key === 'data modeling'
                ? 'mdi:database-cog'
                : key === 'etl/elt data pipelines'
                  ? 'mdi:source-merge'
              : ((skill.iconKey &&
                  SAFE_ICON_KEYS.has(skill.iconKey.trim())
                    ? skill.iconKey.trim()
                    : null) ||
                  ICON_KEY_BY_SKILL[key] ||
                  null);
          return {
            id: skill.id || `${group.id}-${safeName}`,
            name: DISPLAY_NAME_BY_SKILL[key] || safeName || 'Unknown Skill',
            normalizedKey: key,
            iconKey,
            logoUrl: (skill.logoUrl || '').trim() || brandLogo || null,
            color: COLOR_BY_SKILL[key] || '#D1B46F',
          };
        }).filter((skill) => skill.name !== 'Unknown Skill'),
      })).filter((group) => group.skills.length > 0);
    }

    return SKILL_GROUPS.map((group) => ({
      title: group.title,
      skills: group.skills.map((skill) => ({
        id: skill.name,
        name: skill.name,
        normalizedKey: normalizeSkill(skill.name),
        iconKey: null,
        logoUrl: null,
        color: skill.color || '#D1B46F',
        LegacyIcon: skill.icon,
      })),
    }));
  }, [dbGroups]);

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Technical Skills</h2>
        </motion.div>

        <div className="space-y-6">
          {groups.map((group, index) => {
            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border-subtle/70 pb-6 last:border-b-0"
              >
                <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start xl:grid-cols-[390px_minmax(0,1fr)]">
                  <div className="flex min-h-[52px] items-center">
                    <h3 className="whitespace-nowrap leading-none text-base font-extrabold tracking-[0.02em] text-accent-gold sm:text-lg lg:text-[1.18rem] xl:text-[1.28rem]">
                      {group.title}
                    </h3>
                  </div>

                  <div className="flex min-h-[52px] flex-wrap items-center gap-x-8 gap-y-3">
                    {group.skills.map((skill) => (
                      <div key={skill.id} className="flex min-h-[52px] items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ color: skill.color, boxShadow: `0 0 12px ${skill.color}26` }}
                        >
                          {FORCE_LOGO_FIRST.has(skill.normalizedKey) && skill.logoUrl ? (
                            <img
                              src={skill.logoUrl}
                              alt={skill.name}
                              className="h-6 w-6 object-contain"
                              loading="lazy"
                            />
                          ) : skill.iconKey && ICONIFY_ICON_KEYS.has(skill.iconKey) ? (
                            <Icon icon={skill.iconKey === 'mdi:cog-transfer' ? 'mdi:source-merge' : skill.iconKey} width="24" height="24" />
                          ) : skill.iconKey && ICON_BY_KEY[skill.iconKey] ? (
                            React.createElement(ICON_BY_KEY[skill.iconKey], { size: 24 })
                          ) : skill.logoUrl ? (
                            <img
                              src={skill.logoUrl}
                              alt={skill.name}
                              className="h-6 w-6 object-contain"
                              loading="lazy"
                            />
                          ) : skill.LegacyIcon ? (
                            <skill.LegacyIcon size={24} />
                          ) : (
                            <Code2 size={22} />
                          )}
                        </div>
                        <span className="whitespace-nowrap leading-none text-lg font-semibold text-text-primary">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
