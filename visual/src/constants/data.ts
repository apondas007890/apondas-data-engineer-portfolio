import {
  SiApacheairflow,
  SiApachehadoop,
  SiApachekafka,
  SiApachespark,
  SiCodechef,
  SiCisco,
  SiDatabricks,
  SiDatacamp,
  SiFastapi,
  SiGit,
  SiGithub,
  SiHackerrank,
  SiLeetcode,
  SiLinux,
  SiNumpy,
  SiPandas,
  SiPostman,
  SiPython,
  SiR,
  SiSqlite,
} from 'react-icons/si';
import { FaGithub, FaLinkedin, FaMicrosoft, FaWindows } from 'react-icons/fa';
import {
  Activity,
  BookOpenText,
  BrainCircuit,
  Building2,
  ChartColumn,
  Cloud,
  Cpu,
  Database,
  FileSpreadsheet,
  FileText,
  FolderGit2,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Mail,
  MapPin,
  MonitorCog,
  Radio,
  ScrollText,
  Server,
  Table2,
  Warehouse,
  Workflow,
} from 'lucide-react';

export const PERSONAL_INFO = {
  name: 'Apon Kumar Das',
  role: 'Data Engineer',
  shortIntro:
    'I build reliable data pipelines, clean analytical datasets, and scalable data systems that turn raw information into trusted insight.',
  aboutText:
    'I am a Computer Science and Engineering graduate from Dhaka, Bangladesh, focused on data engineering, data preparation, SQL analytics, ETL and ELT workflows, warehousing, and lakehouse concepts. I enjoy building structured systems where raw data moves through clean, reliable layers and becomes useful for analysis.',
  aboutQuote:
    'My design inspiration comes from natural systems: flow, structure, clarity, and growth. I apply the same thinking to data pipelines through organized movement, clean transformation, and dependable outputs.',
  location: 'Dhaka, Bangladesh',
  email: 'apondas0070@gmail.com',
  github: 'apondas0070',
  linkedin: 'apondas0090',
};

export const SKILL_GROUPS = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'Python', icon: SiPython, color: '#3776AB' },
      { name: 'SQL', icon: SiSqlite, color: '#9AB2C2' },
      { name: 'R', icon: SiR, color: '#276DC3' },
    ],
  },
  {
    title: 'Big Data Technologies',
    skills: [
      { name: 'Spark', icon: SiApachespark, color: '#E25A1C' },
      { name: 'PySpark', icon: SiApachespark, color: '#F07F3D' },
      { name: 'Spark SQL', icon: Table2, color: '#D9B95F' },
      { name: 'YARN', icon: Layers, color: '#8B9495' },
      { name: 'Hadoop', icon: SiApachehadoop, color: '#E0C35A' },
    ],
  },
  {
    title: 'Streaming Technologies',
    skills: [
      { name: 'Apache Kafka', icon: SiApachekafka, color: '#EDE8DE' },
      { name: 'Spark Streaming', icon: Activity, color: '#36D97F' },
    ],
  },
  {
    title: 'Orchestration',
    skills: [{ name: 'Apache Airflow', icon: SiApacheairflow, color: '#00B4D8' }],
  },
  {
    title: 'Cloud Platforms',
    skills: [
      { name: 'Databricks', icon: SiDatabricks, color: '#FF3621' },
      { name: 'Amazon S3', icon: Cloud, color: '#7AAE48' },
    ],
  },
  {
    title: 'Data Engineering Tools',
    skills: [
      { name: 'Data Modeling', icon: Database, color: '#8B9495' },
      { name: 'ETL and ELT Data Pipelines', icon: Workflow, color: '#D9B95F' },
      { name: 'Pandas', icon: SiPandas, color: '#E2D8FF' },
      { name: 'NumPy', icon: SiNumpy, color: '#4EA4D8' },
    ],
  },
  {
    title: 'Tools and Platforms',
    skills: [
      { name: 'FastAPI', icon: SiFastapi, color: '#05998B' },
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'GitHub', icon: SiGithub, color: '#EDE8DE' },
      { name: 'Postman', icon: SiPostman, color: '#FF6C37' },
      { name: 'VS Code', icon: MonitorCog, color: '#007ACC' },
      { name: 'RStudio', icon: SiR, color: '#75AADB' },
      { name: 'Microsoft Office', icon: FaMicrosoft, color: '#D24C2F' },
      { name: 'Windows', icon: FaWindows, color: '#40A8FF' },
      { name: 'Linux', icon: SiLinux, color: '#F6C54B' },
    ],
  },
];

export const EXPERIENCE = [
  {
    title: 'IT Intern',
    company: 'Tap2Deal',
    location: 'Narayanganj, Bangladesh',
    duration: 'June 2025 – September 2025',
    image: '/images/tap2deal.png',
    imageAlt: 'Tap2Deal company logo',
    websiteUrl: '#',
    tags: ['Manual Testing', 'Documentation', 'Excel', 'Website Updates', 'Data Accuracy', 'Laravel Basics'],
    description: [
      'Performed manual testing and maintained test cases, issues, and related documentation.',
      'Updated product information in Excel and the company website, supporting data accuracy.',
      'Learned Laravel fundamentals and built a simple blog website for practice.',
    ],
  },
];

export const PROJECTS = [
  {
    title: 'Customer Shopping Trends - Data Preparation and Analysis',
    image: '/projects/customer-shopping-trends.png',
    imageAlt: 'Customer shopping trends project preview',
    visual: 'Raw Dataset → Cleaning → Analytics',
    description:
      'Cleaned and prepared a structured shopping trends dataset by handling missing values, duplicates, filtering, data type conversion, normalization, and outlier detection. Used descriptive statistics to summarize key patterns and prepare the dataset for analysis.',
    outcome: 'Prepared analysis-ready data with improved quality and consistency.',
    tech: ['R', 'RStudio', 'Data Cleaning', 'Descriptive Statistics'],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    title: 'Data Warehouse - CRM and ERP CSV Integration',
    image: '/projects/datawarehouse.png',
    imageAlt: 'CRM and ERP warehouse project preview',
    visual: 'CSV Sources → SQL Server → Warehouse',
    description:
      'Built a SQL Server data warehouse by importing CRM and ERP CSV datasets through staged layers. Applied a Medallion Architecture approach with Bronze, Silver, and Gold layers for raw storage, cleansing, transformation, and analytics.',
    outcome: 'Created structured analytical layers for business-style reporting queries.',
    tech: ['SQL Server', 'SSMS', 'SQL', 'Warehouse', 'Medallion'],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    title: 'Local Data Lakehouse Pipeline',
    image: '/projects/data-lakehouse.png',
    imageAlt: 'Local data lakehouse project preview',
    visual: 'CSV and JSON → Spark → Lakehouse',
    description:
      'Designed a local lakehouse-style pipeline using Python and Apache Spark to process large CSV and JSON datasets. Organized raw and transformed layers and explored Kafka-style streaming concepts.',
    outcome: 'Simulated scalable local batch processing and layered data organization.',
    tech: ['Python', 'Spark', 'Kafka', 'CSV', 'JSON', 'Lakehouse'],
    githubUrl: '#',
    demoUrl: '#',
  },
];

export const EDUCATION = [
  {
    degree: 'B.Sc. in Computer Science and Engineering',
    institution: 'American International University-Bangladesh',
    year: '2021-2025',
    result: 'CGPA: 3.82',
    image: '/images/aiub.png',
    imageAlt: 'American International University-Bangladesh logo',
    websiteUrl: '#',
    description:
      'Built core grounding in algorithms, databases, software engineering, and applied computing with growing focus on data systems.',
    icon: GraduationCap,
  },
  {
    degree: 'Higher Secondary Certificate',
    institution: 'Govt Kadam Rasul College',
    year: '2020',
    result: 'GPA: 4.25',
    image: '/images/kadam-rasul-college.png',
    imageAlt: 'Govt Kadam Rasul College logo',
    websiteUrl: '#',
    description:
      'Completed science-stream coursework with emphasis on mathematics, physics, and structured analytical problem solving.',
    icon: BookOpenText,
  },
  {
    degree: 'Secondary School Certificate',
    institution: 'Narayanganj High School and College',
    year: '2018',
    result: 'GPA: 4.00',
    image: '/images/narayanganj-high-school.png',
    imageAlt: 'Narayanganj High School and College logo',
    websiteUrl: '#',
    description:
      'Established a strong academic base through science studies and disciplined coursework across technical subjects.',
    icon: ScrollText,
  },
];

export const CERTIFICATIONS = [
  {
    title: 'IT Essentials',
    issuer: 'Cisco Networking Academy',
    icon: SiCisco,
    image: '',
    pdf: '/certificates/example.pdf',
    verifyUrl: '#',
    status: 'Certificate record',
    color: '#00BCEB',
  },
  {
    title: 'AI and ML Fundamentals',
    issuer: 'Grameenphone Academy',
    icon: Radio,
    image: '',
    pdf: '/certificates/example.pdf',
    verifyUrl: '#',
    status: 'Credential available',
    color: '#21A3D8',
  },
  {
    title: 'SQL Data Engineering',
    issuer: 'DataCamp',
    icon: SiDatacamp,
    image: '',
    pdf: '/certificates/example.pdf',
    verifyUrl: '#',
    status: 'Credential available',
    color: '#03EF62',
  },
  {
    title: 'Python Data Engineering',
    issuer: 'DataCamp',
    icon: SiDatacamp,
    image: '',
    pdf: '/certificates/example.pdf',
    verifyUrl: '#',
    status: 'Credential available',
    color: '#03EF62',
  },
  {
    title: 'Introduction to Databricks',
    issuer: 'DataCamp',
    icon: SiDatabricks,
    image: '',
    pdf: '/certificates/example.pdf',
    verifyUrl: '#',
    status: 'Credential available',
    color: '#FF3621',
  },
];

export const PRACTICE_STATS = {
  total: { easy: 329, medium: 149, hard: 61, grand: 539 },
  platforms: [
    {
      name: 'HackerRank',
      challenge: 'SQL Challenge',
      icon: SiHackerrank,
      color: '#36D97F',
      stats: { easy: 100, medium: 50, hard: 25, total: 175 },
      url: '#',
    },
    {
      name: 'LeetCode',
      challenge: 'SQL Challenge',
      icon: SiLeetcode,
      color: '#F2C94C',
      stats: { easy: 50, medium: 25, hard: 3, total: 78 },
      url: '#',
    },
    {
      name: 'LeetCode',
      challenge: 'SQL 50',
      icon: SiLeetcode,
      color: '#F2C94C',
      stats: { easy: 50, medium: 25, hard: 3, total: 78 },
      url: '#',
    },
    {
      name: 'CodeChef',
      challenge: 'SQL Challenge',
      icon: SiCodechef,
      color: '#D0B08B',
      stats: { easy: 79, medium: 27, hard: 20, total: 126 },
      url: '#',
    },
    {
      name: 'StrataScratch',
      challenge: 'SQL Challenge 20',
      icon: ChartColumn,
      color: '#88A9C5',
      stats: { easy: 50, medium: 22, hard: 10, total: 82 },
      url: '#',
    },
  ],
};

export const ABOUT_FOCUS = [
  {
    title: 'Data Preparation',
    detail: 'cleaning, missing values, duplicates',
    icon: FileText,
    color: '#D9B95F',
  },
  {
    title: 'Warehousing',
    detail: 'SQL Server, modeling, analytics tables',
    icon: Database,
    color: '#8B9495',
  },
  {
    title: 'Lakehouse',
    detail: 'raw storage, curated layers, query-ready data',
    icon: Warehouse,
    color: '#7A9277',
  },
  {
    title: 'Pipeline Thinking',
    detail: 'ingest, process, validate, serve',
    icon: Workflow,
    color: '#D86A4A',
  },
];

export const HERO_FLOW_SOURCES = [
  { label: 'API', icon: Cloud, color: '#D9B95F' },
  { label: 'CSV', icon: FileSpreadsheet, color: '#8B9495' },
  { label: 'Database', icon: Database, color: '#D86A4A' },
  { label: 'Events', icon: Activity, color: '#36D97F' },
  { label: 'Logs', icon: FileText, color: '#B89A7C' },
];

export const FOOTER_NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'practice', label: 'Practice' },
  { id: 'contact', label: 'Contact' },
];

export const CONTACT_ITEMS = [
  {
    label: 'Email',
    val: PERSONAL_INFO.email,
    href: `mailto:${PERSONAL_INFO.email}`,
    icon: Mail,
    color: '#D9B95F',
  },
  {
    label: 'LinkedIn',
    val: 'linkedin.com/in/apondas0090',
    href: `https://linkedin.com/in/${PERSONAL_INFO.linkedin}`,
    icon: FaLinkedin,
    color: '#7DA2C3',
  },
  {
    label: 'GitHub',
    val: 'github.com/apondas0070',
    href: `https://github.com/${PERSONAL_INFO.github}`,
    icon: FaGithub,
    color: '#C9D0D3',
  },
  {
    label: 'Location',
    val: PERSONAL_INFO.location,
    href: null,
    icon: MapPin,
    color: '#D86A4A',
  },
];

export const PLACEHOLDER_ICONS = {
  company: Building2,
  project: FolderGit2,
  institution: GraduationCap,
  certificate: BrainCircuit,
};
