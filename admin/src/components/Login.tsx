import { useEffect, useMemo, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, Eye, EyeOff, AlertCircle,
  Shield,
  User, Phone, CalendarDays,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FloatingTechIcons } from './FloatingTechIcons';

interface LoginProps {
  onLogin: () => void;
}

function SsmsServerMark() {
  return (
    <div className="infra-server-mark" aria-hidden="true">
      <span className="infra-server-layer">
        <i />
        <b />
      </span>
      <span className="infra-server-layer">
        <i />
        <b />
      </span>
      <span className="infra-server-layer">
        <i />
        <b />
      </span>
      <span className="infra-server-status">
        <span className="infra-server-check" />
      </span>
      <span className="infra-server-tag" aria-hidden="true">
        <svg viewBox="0 0 64 48" className="infra-server-tag-mark">
          <path
            d="M6 38 L20 10 L34 38 L30 45 L20 24 L10 45 Z
               M32 10 H46 C54 10 60 16 60 24 C60 32 54 38 46 38 H36
               M36 10 V46
               M36 24 H50"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

interface TechLogo {
  label: string;
  slug: string;
  fallbackSlug?: string;
}

const techList = [
  { label: "Apache Spark", slug: "apachespark" },
  { label: "PySpark", slug: "pyspark", fallbackSlug: "apachespark" },
  { label: "Hadoop", slug: "apachehadoop" },
  { label: "Apache Kafka", slug: "apachekafka" },
  { label: "Apache Airflow", slug: "apacheairflow" },
  { label: "Flink", slug: "apacheflink" },
  { label: "Trino", slug: "trino" },
  { label: "DuckDB", slug: "duckdb" },
  { label: "ClickHouse", slug: "clickhouse" },
  { label: "dbt", slug: "dbt" },
  { label: "Prefect", slug: "prefect" },
  { label: "Databricks", slug: "databricks" },
  { label: "Snowflake", slug: "snowflake" },
  { label: "Apache Iceberg", slug: "apacheiceberg", fallbackSlug: "apachespark" },
  { label: "Delta Lake", slug: "deltalake", fallbackSlug: "databricks" },
  { label: "Apache Hudi", slug: "apachehudi", fallbackSlug: "apacheparquet" },
  { label: "Parquet", slug: "apacheparquet", fallbackSlug: "apachespark" },
  { label: "Avro", slug: "apacheavro", fallbackSlug: "apachekafka" },
  { label: "ORC", slug: "apache", fallbackSlug: "apachehadoop" },
  { label: "MinIO", slug: "minio" },
  { label: "Ceph", slug: "ceph" },
  { label: "HDFS", slug: "apachehadoop" },
  { label: "Airbyte", slug: "airbyte" },
  { label: "Meltano", slug: "meltano" },
  { label: "Talend", slug: "talend" },
  { label: "Informatica", slug: "informatica", fallbackSlug: "snowflake" },
  { label: "Starburst", slug: "starburst", fallbackSlug: "trino" },
  { label: "Firebolt", slug: "firebolt", fallbackSlug: "clickhouse" },
  { label: "MotherDuck", slug: "motherduck", fallbackSlug: "duckdb" },
  { label: "Vertica", slug: "vertica", fallbackSlug: "postgresql" },
  { label: "Exasol", slug: "exasol", fallbackSlug: "postgresql" },
  { label: "Teradata", slug: "teradata", fallbackSlug: "oracle" },
  { label: "Kubeflow", slug: "kubeflow", fallbackSlug: "kubernetes" },
  { label: "BentoML", slug: "bentoml", fallbackSlug: "python" },
  { label: "Ray", slug: "ray", fallbackSlug: "python" },
  { label: "DVC", slug: "dvc", fallbackSlug: "git" },
  { label: "Feast", slug: "feast", fallbackSlug: "python" },
  { label: "H2O.ai", slug: "h2o", fallbackSlug: "python" },
  { label: "Dataiku", slug: "dataiku", fallbackSlug: "python" },
  { label: "KNIME", slug: "knime", fallbackSlug: "python" },
  { label: "Redpanda", slug: "redpanda", fallbackSlug: "apachekafka" },
  { label: "Apache Pulsar", slug: "apachepulsar", fallbackSlug: "apachekafka" },
  { label: "NATS", slug: "natsdotio", fallbackSlug: "rabbitmq" },
  { label: "RabbitMQ", slug: "rabbitmq" },
  { label: "Amazon Kinesis", slug: "amazonkinesis", fallbackSlug: "amazonwebservices" },
  { label: "Google Pub/Sub", slug: "googlepubsub", fallbackSlug: "googlecloud" },
  { label: "Neovim", slug: "neovim" },
  { label: "Zed", slug: "zedindustries", fallbackSlug: "visualstudiocode" },
  { label: "Warp", slug: "warp", fallbackSlug: "gnubash" },
  { label: "Linear", slug: "linear" },
  { label: "Obsidian", slug: "obsidian" },
  { label: "Miro", slug: "miro" },
  { label: "Loom", slug: "loom" },
  { label: "Raycast", slug: "raycast" },
  { label: "Prometheus", slug: "prometheus" },
  { label: "Grafana", slug: "grafana" },
  { label: "ELK Stack", slug: "logstash", fallbackSlug: "elastic" },
  { label: "Vault", slug: "vault" },
  { label: "Istio", slug: "istio" },
  { label: "Helm", slug: "helm" },
  { label: "ArgoCD", slug: "argo" },
  { label: "Pulumi", slug: "pulumi" },
  { label: "Amazon Redshift", slug: "amazonredshift" },
  { label: "BigQuery", slug: "bigquery" },
  { label: "MongoDB", slug: "mongodb" },
  { label: "Redis", slug: "redis" },
  { label: "SQLite", slug: "sqlite" },
  { label: "InfluxDB", slug: "influxdb" },
  { label: "Neo4j", slug: "neo4j" },
  { label: "Prometheus", slug: "prometheus" },
  { label: "Grafana", slug: "grafana" },
  { label: "Elasticsearch", slug: "elasticsearch" },
  { label: "Kibana", slug: "kibana" },
  { label: "Tableau", slug: "tableau" },
  { label: "Qlik", slug: "qlik" },
  { label: "Jupyter", slug: "jupyter" },
  { label: "Anaconda", slug: "anaconda" },
  { label: "Apache Cassandra", slug: "apachecassandra", fallbackSlug: "postgresql" },
  { label: "Apache Hive", slug: "apachehive", fallbackSlug: "postgresql" },
  { label: "Apache NiFi", slug: "apachenifi", fallbackSlug: "apacheairflow" },
  { label: "Apache Superset", slug: "apachesuperset", fallbackSlug: "tableau" },
  { label: "Parquet", slug: "apacheparquet", fallbackSlug: "apachespark" },
  { label: "Amazon S3", slug: "amazons3" },
  { label: "AWS", slug: "amazonwebservices" },
  { label: "Azure", slug: "microsoftazure" },
  { label: "GCP", slug: "googlecloud" },
  { label: "Kubernetes", slug: "kubernetes" },
  { label: "Docker", slug: "docker" },
  { label: "Terraform", slug: "terraform" },
  { label: "Lambda", slug: "awslambda" },
  { label: "Power BI", slug: "powerbi" },
  { label: "Microsoft Excel", slug: "microsoftexcel" },
  { label: "Python", slug: "python" },
  { label: "R", slug: "r" },
  { label: "RStudio", slug: "rstudioide", fallbackSlug: "r" },
  { label: "Pandas", slug: "pandas" },
  { label: "NumPy", slug: "numpy" },
  { label: "Scikit-learn", slug: "scikitlearn" },
  { label: "TensorFlow", slug: "tensorflow" },
  { label: "PyTorch", slug: "pytorch" },
  { label: "MLflow", slug: "mlflow" },
  { label: "ChatGPT", slug: "openai" },
  { label: "Gemini", slug: "googlegemini" },
  { label: "Hugging Face", slug: "huggingface" },
  { label: "LangChain", slug: "langchain", fallbackSlug: "openai" },
  { label: "LlamaIndex", slug: "llamaindex", fallbackSlug: "meta" },
  { label: "Google Vertex AI", slug: "googlevertexai", fallbackSlug: "googlecloud" },
  { label: "Weights & Biases", slug: "weightsandbiases" },
  { label: "JavaScript", slug: "javascript" },
  { label: "TypeScript", slug: "typescript" },
  { label: "React", slug: "react" },
  { label: "Next.js", slug: "nextdotjs" },
  { label: "Vue.js", slug: "vuedotjs" },
  { label: "Svelte", slug: "svelte" },
  { label: "Tailwind CSS", slug: "tailwindcss" },
  { label: "Bootstrap", slug: "bootstrap" },
  { label: "Figma", slug: "figma" },
  { label: "Adobe", slug: "adobe" },
  { label: "Vercel", slug: "vercel" },
  { label: "VS Code", slug: "visualstudiocode" },
  { label: "Postman", slug: "postman" },
  { label: "Notion", slug: "notion" },
  { label: "Slack", slug: "slack" },
  { label: "Jira", slug: "jira" },
  { label: "Trello", slug: "trello" },
  { label: "Replit", slug: "replit" },
  { label: "Cursor", slug: "cursor", fallbackSlug: "visualstudiocode" },
  { label: "Linux Ubuntu", slug: "ubuntu" },
  { label: "Windows", slug: "windows" },
  { label: "Chrome", slug: "googlechrome" },
  { label: "Bun", slug: "bun" },
  { label: "Deno", slug: "deno" },
  { label: "Ansible", slug: "ansible" },
  { label: "Arc", slug: "arc", fallbackSlug: "googlechrome" },
  { label: "Go", slug: "go" },
  { label: "Rust", slug: "rust" },
  { label: "Julia", slug: "julia" },
  { label: "C++", slug: "cplusplus" },
  { label: "Node.js", slug: "nodedotjs" },
  { label: "NestJS", slug: "nestjs" },
  { label: "Django", slug: "django" },
  { label: "FastAPI", slug: "fastapi" },
  { label: "Laravel", slug: "laravel" },
  { label: "MySQL", slug: "mysql" },
  { label: "PostgreSQL", slug: "postgresql" },
  { label: "Oracle", slug: "oracle" },
  { label: "SQL Server", slug: "microsoftsqlserver" },
  { label: "Git", slug: "git" },
  { label: "GitHub", slug: "github" },
  { label: "Jenkins", slug: "jenkins" },
  { label: "Prisma", slug: "prisma" },
  { label: "Google", slug: "google" },
  { label: "Meta (Facebook)", slug: "meta" },
  { label: "Amazon", slug: "amazon" },
  { label: "Microsoft", slug: "microsoft" },
  { label: "Apple", slug: "apple" },
  { label: "Netflix", slug: "netflix" },
  { label: "Uber", slug: "uber" },
  { label: "Airbnb", slug: "airbnb" },
  { label: "Spotify", slug: "spotify" },
  { label: "Stripe", slug: "stripe" },
  { label: "Shopify", slug: "shopify" },
  { label: "LinkedIn", slug: "linkedin" },
  { label: "OpenAI", slug: "openai" },
  { label: "Anthropic", slug: "anthropic", fallbackSlug: "openai" },
  { label: "NVIDIA", slug: "nvidia" },
  { label: "Tesla", slug: "tesla" },
  { label: "X (Twitter)", slug: "x" },
  { label: "Discord", slug: "discord" },
] satisfies TechLogo[];

const uniqueTechList = Array.from(
  new Map(techList.map((item) => [item.label.toLowerCase(), item])).values()
);

const ICON_SIZE = 28;

interface FloatingIconProps {
  config: TechLogo;
  index: number;
  x: number;
  y: number;
  depth: number;
}

const getIconUrl = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

const getRandomTravelPoint = () => {
  const isDesktop = typeof window === "undefined" ? true : window.innerWidth >= 1024;
  const insideLoginZone = (x: number, y: number) => isDesktop && x > 62 && y > 8 && y < 92;
  const insideLogoZone = (x: number, y: number) => x < 18 && y < 18;

  let x = 4 + Math.random() * 92;
  let y = 4 + Math.random() * 92;
  let guard = 0;
  while ((insideLoginZone(x, y) || insideLogoZone(x, y)) && guard < 40) {
    x = 4 + Math.random() * 92;
    y = 4 + Math.random() * 92;
    guard++;
  }
  return {
    x: Math.max(2, Math.min(98, x)),
    y: Math.max(2, Math.min(98, y)),
  };
};

const FloatingIcon = ({ config, index, x, y, depth }: FloatingIconProps) => {
  const [iconUrl, setIconUrl] = useState<string>(getIconUrl(config.slug));
  const [usedFallback, setUsedFallback] = useState(false);
  const [target, setTarget] = useState({ x, y });
  const amplitude = 2.2 + depth * 4.2;
  const floatDur = 12 + (index % 8) * 1.2;
  const pulseDur = 3 + (index % 5) * 0.35;
  const rot = 2 + (index % 4);
  const travelDur = 9 + (index % 7) * 1.6 + depth * 2.4;

  useEffect(() => {
    setTarget({ x, y });
  }, [x, y]);

  return (
    <motion.div
      className="floating-icon absolute"
      style={{ 
        width: ICON_SIZE, 
        height: ICON_SIZE,
        perspective: 1000,
        backfaceVisibility: 'hidden',
        willChange: 'transform'
      }}
      initial={{ opacity: 0, scale: 0.72, left: `${target.x}%`, top: `${target.y}%` }}
      animate={{
        left: `${target.x}%`,
        top: `${target.y}%`,
        opacity: [0.88, 1, 0.94, 1, 0.88],
        scale: [0.94, 1.03, 1, 1.02, 0.94],
        x: [0, amplitude, -amplitude * 0.8, 0],
        y: [0, -amplitude * 0.9, amplitude * 0.65, 0],
        rotate: [0, rot, -rot * 0.7, 0],
      }}
      transition={{
        left: { duration: travelDur, ease: "easeInOut" },
        top: { duration: travelDur, ease: "easeInOut" },
        opacity: { duration: pulseDur, repeat: Infinity, ease: "easeInOut", delay: index * 0.05 },
        scale: { duration: pulseDur + 0.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.05 },
        x: { duration: floatDur, repeat: Infinity, ease: "easeInOut", delay: index * 0.05 },
        y: { duration: floatDur + 2.1, repeat: Infinity, ease: "easeInOut", delay: index * 0.05 },
        rotate: { duration: floatDur + 1.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.05 },
      }}
      onAnimationComplete={() => {
        window.setTimeout(() => {
          setTarget(getRandomTravelPoint());
        }, 150 + Math.random() * 1200);
      }}
    >
      <img
        src={iconUrl}
        alt=""
        width={ICON_SIZE}
        height={ICON_SIZE}
        className="floating-icon-glow"
        loading="eager"
        draggable={false}
        onError={() => {
          if (!usedFallback && config.fallbackSlug) {
            setUsedFallback(true);
            setIconUrl(getIconUrl(config.fallbackSlug));
            return;
          }
          // Final safe fallback to avoid broken image icons/text.
          setIconUrl(getIconUrl("simpleicons"));
        }}
      />
    </motion.div>
  );
};

export default function Login({ onLogin }: LoginProps) {
  const shuffledTechList = useMemo(() => {
    const copy = [...uniqueTechList];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  const generatePositions = (count: number) => {
    const isDesktop = typeof window === "undefined" ? true : window.innerWidth >= 1024;
    const insideLoginZone = (x: number, y: number) => isDesktop && x > 63 && y > 7 && y < 93;
    const insideLogoZone = (x: number, y: number) => x < 18 && y < 18;

    return Array.from({ length: count }, (_, i) => {
      let x = 4 + Math.random() * 92;
      let y = 4 + Math.random() * 92;
      let guard = 0;
      while ((insideLoginZone(x, y) || insideLogoZone(x, y)) && guard < 40) {
        x = 4 + Math.random() * 92;
        y = 4 + Math.random() * 92;
        guard++;
      }
      return {
        x: Math.max(2, Math.min(98, x)),
        y: Math.max(2, Math.min(98, y)),
        depth: 0.7 + ((i * 19) % 7) * 0.09,
      };
    });
  };

  const [iconPositions, setIconPositions] = useState(() => generatePositions(shuffledTechList.length));

  const [view, setView] = useState<'login' | 'recovery'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Recovery form state
  const [recoveryData, setRecoveryData] = useState({
    fullName: '',
    phone: '',
    email: '',
    dob: ''
  });

  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    general?: string;
    recoveryName?: string;
    recoveryPhone?: string;
    recoveryEmail?: string;
    recoveryDob?: string;
  }>({});

  const validate = (name?: string, value?: string, currentFormData?: { email?: string; password?: string }) => {
    const newErrors = { ...errors };
    const emailToTest = name === 'email' ? value : (currentFormData?.email ?? email);
    const passwordToTest = name === 'password' ? value : (currentFormData?.password ?? password);
    
    const checkEmail = (val: string) => {
      if (!val) return "Yo, you ghosting the email field? Put something in there, man. 📧";
      if (!/\S+@\S+\.\S+/.test(val)) return "Bro... that email ain't it 😅";
      return undefined;
    };

    const checkPassword = (val: string) => {
      if (!val) return "Security's not an option, bro. Give me the password. 🔒";
      if (val.length < 6) return "Is that a password or a pin code? 6+ characters, do better. 👀";
      return undefined;
    };

    if (name === 'email') {
      newErrors.email = checkEmail(emailToTest || '');
    } else if (name === 'password') {
      newErrors.password = checkPassword(passwordToTest || '');
    } else {
      // Full validation on submit
      newErrors.email = checkEmail(emailToTest || '');
      newErrors.password = checkPassword(passwordToTest || '');
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    validate('email', val);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    validate('password', val);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (email === 'admin@portfolio.com' && password === 'admin123') {
        onLogin();
      } else {
        setErrors({ general: "Denied. Access token mismatch. Try again, bro. 🛡️" });
      }
    }
  };

  const handleRecoverySubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    
    // Field Presence
    if (!recoveryData.fullName.trim()) {
      newErrors.recoveryName = "Identity signature required.";
    }
    
    // Gmail Validation
    if (!recoveryData.email) {
      newErrors.recoveryEmail = "Network address required.";
    } else if (!recoveryData.email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.recoveryEmail = "Only @gmail.com domains authorized.";
    }
    
    // Phone Validation (+880 prefix and 14 chars length like +8801889849377)
    if (!recoveryData.phone || recoveryData.phone === '+880') {
      newErrors.recoveryPhone = "Comms channel required.";
    } else if (!recoveryData.phone.startsWith('+880')) {
      newErrors.recoveryPhone = "International prefix +880 required.";
    } else if (recoveryData.phone.length !== 14) {
      newErrors.recoveryPhone = "Input 14 characters (Ex: +8801889849377).";
    }

    if (!recoveryData.dob) {
      newErrors.recoveryDob = "Origin date required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors and show success
    setErrors({ general: "Nexus override authenticated. Redirecting to login... 📡" });
    
    // Simulate recovery success and redirect
    setTimeout(() => {
      setView('login');
      setRecoveryData({ fullName: '', phone: '', email: '', dob: '' });
      setErrors({});
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-surface-bg overflow-hidden relative font-sans flex items-center justify-end p-6 md:p-12 lg:pr-32">
      {/* Global Tech Floating Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden tech-bg-layer">
        <FloatingTechIcons />
      </div>

      {/* Persistent Left Branding */}
      <div className="fixed top-7 left-7 flex flex-col gap-12 z-30 animate-in fade-in slide-in-from-left duration-1000">
        <div className="flex items-center gap-6">
          <div className="logo-container infra-server-pulse group transition-all duration-500 relative shrink-0">
            <SsmsServerMark />
          </div>
        </div>
      </div>

      {/* Improved Login Card */}
      <motion.div 
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-20"
      >
        <div className="bg-surface-card/85 backdrop-blur-3xl border border-white/10 p-10 sm:p-14 rounded-[3.5rem] shadow-[0_64px_128px_-16px_rgba(0,0,0,0.9)] relative group overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {view === 'login' ? (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-12 relative z-10">
                  <h3 className="text-4xl font-display font-bold text-white mb-3 tracking-tighter">Initialize Link</h3>
                  <p className="text-surface-text/60 font-semibold text-sm leading-relaxed">
                    Access Nexus: <span className="text-brand-gold">admin@portfolio.com</span> <br />
                    Auth Token: <span className="text-brand-blue">admin123</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-7 relative z-10" noValidate>
                  <AnimatePresence mode="wait">
                    {errors.general && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-4 p-5 rounded-3xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-[13px] font-bold"
                      >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{errors.general}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <div>
                      <div className="relative group">
                        <Mail className={cn(
                          "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300",
                          errors.email ? "text-brand-orange" : "text-gray-600 group-focus-within:text-brand-blue"
                        )} />
                        <input 
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          className={cn(
                            "w-full bg-surface-bg/50 border-[1.5px] rounded-[1.75rem] py-5.5 pl-16 pr-6 text-white font-bold placeholder:text-gray-700/30 focus:outline-none transition-all",
                            errors.email ? "border-brand-orange/40" : "border-white/5 focus:border-brand-blue/40 focus:bg-white/[0.02]"
                          )}
                          placeholder="admin@portfolio.com"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-brand-orange text-[11px] font-bold mt-2 ml-4 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" /> {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <div className="relative group">
                        <Lock className={cn(
                          "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300",
                          errors.password ? "text-brand-orange" : "text-gray-600 group-focus-within:text-brand-blue"
                        )} />
                        <input 
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                          className={cn(
                            "w-full bg-surface-bg/50 border-[1.5px] rounded-[1.75rem] py-5.5 pl-16 pr-16 text-white font-bold placeholder:text-gray-700/30 focus:outline-none transition-all",
                            errors.password ? "border-brand-orange/40" : "border-white/5 focus:border-brand-blue/40 focus:bg-white/[0.02]"
                          )}
                          placeholder="••••••••"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {errors.password && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-brand-orange text-[11px] font-bold mt-2 ml-4 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" /> {errors.password}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-brand-indigo text-white font-black py-6 rounded-[2rem] transition-all shadow-[0_20px_40px_-12px_rgba(80,80,133,0.5)] flex items-center justify-center gap-3 relative overflow-hidden group uppercase tracking-[0.3em] text-xs"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      Initialize Link
                    </motion.button>

                    <button 
                      type="button"
                      onClick={() => setView('recovery')}
                      className="text-center text-[10px] font-black text-gray-600 hover:text-brand-blue uppercase tracking-widest transition-colors py-2"
                    >
                      Recover Access
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href = "/";
                      }}
                      className="text-center text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors py-1"
                    >
                      Back to Portfolio
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="recovery-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-12 relative z-10">
                  <h3 className="text-4xl font-display font-bold text-white mb-3 tracking-tighter">Identity Proof</h3>
                  <p className="text-surface-text/60 font-semibold text-sm leading-relaxed">
                    Provide credentials for <span className="text-brand-orange">Nexus Override</span>
                  </p>
                </div>

                <form onSubmit={handleRecoverySubmit} className="space-y-5 relative z-10" noValidate>
                  <AnimatePresence mode="wait">
                    {errors.general && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4 p-5 rounded-3xl bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-[13px] font-bold"
                      >
                        <Shield className="w-5 h-5 shrink-0" />
                        <span>{errors.general}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Full Name */}
                    <div>
                      <div className="relative group">
                        <User className={cn(
                          "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                          errors.recoveryName ? "text-brand-orange" : "text-gray-600 group-focus-within:text-brand-blue"
                        )} />
                        <input 
                          type="text"
                          value={recoveryData.fullName}
                          onChange={(e) => setRecoveryData({ ...recoveryData, fullName: e.target.value })}
                          className={cn(
                            "w-full bg-surface-bg/50 border-[1.5px] rounded-[1.75rem] py-5 pl-16 pr-6 text-white font-bold placeholder:text-gray-700/30 focus:outline-none transition-all font-mono",
                            errors.recoveryName ? "border-brand-orange/40" : "border-white/5 focus:border-brand-blue/40 focus:bg-white/[0.02]"
                          )}
                          placeholder="FULL NAME"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.recoveryName && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-brand-orange text-[10px] font-bold mt-2 ml-4 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.recoveryName}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email */}
                    <div>
                      <div className="relative group">
                        <Mail className={cn(
                          "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                          errors.recoveryEmail ? "text-brand-orange" : "text-gray-600 group-focus-within:text-brand-blue"
                        )} />
                        <input 
                          type="email"
                          value={recoveryData.email}
                          onChange={(e) => setRecoveryData({ ...recoveryData, email: e.target.value })}
                          className={cn(
                            "w-full bg-surface-bg/50 border-[1.5px] rounded-[1.75rem] py-5 pl-16 pr-6 text-white font-bold placeholder:text-gray-700/30 focus:outline-none transition-all font-mono",
                            errors.recoveryEmail ? "border-brand-orange/40" : "border-white/5 focus:border-brand-blue/40 focus:bg-white/[0.02]"
                          )}
                          placeholder="RECOVERY@GMAIL.COM"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.recoveryEmail && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-brand-orange text-[10px] font-bold mt-2 ml-4 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.recoveryEmail}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Phone BD */}
                    <div>
                      <div className="relative group">
                        <Phone className={cn(
                          "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                          errors.recoveryPhone ? "text-brand-orange" : "text-gray-600 group-focus-within:text-brand-blue"
                        )} />
                        <input 
                          type="tel"
                          value={recoveryData.phone}
                          onFocus={() => {
                            if (!recoveryData.phone) {
                              setRecoveryData({ ...recoveryData, phone: '+880' });
                            }
                          }}
                          onBlur={() => {
                            if (recoveryData.phone === '+880') {
                              setRecoveryData({ ...recoveryData, phone: '' });
                            }
                          }}
                          onChange={(e) => setRecoveryData({ ...recoveryData, phone: e.target.value })}
                          className={cn(
                            "w-full bg-surface-bg/50 border-[1.5px] rounded-[1.75rem] py-5 pl-16 pr-6 text-white font-bold placeholder:text-gray-700/30 focus:outline-none transition-all font-mono",
                            errors.recoveryPhone ? "border-brand-orange/40" : "border-white/5 focus:border-brand-blue/40 focus:bg-white/[0.02]"
                          )}
                          placeholder="+8801XXXXXXXXX"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.recoveryPhone && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-brand-orange text-[10px] font-bold mt-2 ml-4 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.recoveryPhone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* DOB */}
                    <div>
                      <div className="relative group">
                        <CalendarDays className={cn(
                          "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                          errors.recoveryDob ? "text-brand-orange" : "text-gray-600 group-focus-within:text-brand-blue"
                        )} />
                        <input 
                          type="date"
                          value={recoveryData.dob}
                          onChange={(e) => setRecoveryData({ ...recoveryData, dob: e.target.value })}
                          onFocus={(e) => {
                            try {
                              if (typeof (e.target as any).showPicker === 'function') {
                                (e.target as any).showPicker();
                              }
                            } catch (err) {}
                          }}
                          className={cn(
                            "w-full bg-surface-bg/50 border-[1.5px] rounded-[1.75rem] py-5 pl-16 pr-6 text-white font-bold placeholder:text-gray-700/30 focus:outline-none transition-all font-mono uppercase appearance-none",
                            errors.recoveryDob ? "border-brand-orange/40" : "border-white/5 focus:border-brand-blue/40 focus:bg-white/[0.02]"
                          )}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.recoveryDob && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-brand-orange text-[10px] font-bold mt-2 ml-4 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.recoveryDob}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mt-6">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-brand-indigo text-white font-black py-6 rounded-[2rem] transition-all shadow-[0_20px_40px_-12px_rgba(80,80,133,0.5)] flex items-center justify-center gap-3 relative overflow-hidden group uppercase tracking-[0.3em] text-xs"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      Request Recover
                    </motion.button>

                    <button 
                      type="button"
                      onClick={() => setView('login')}
                      className="text-center text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors py-2"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-14 flex items-center justify-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity duration-1000">
             <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
             <div className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
             <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
