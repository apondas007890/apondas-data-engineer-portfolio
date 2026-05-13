import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { Code2 } from 'lucide-react';

type RingId = 1 | 2 | 3 | 4 | 5;

type OrbitItemDef = {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  imageSrc?: string;
};

type OrbitItem = OrbitItemDef & {
  ring: RingId;
  baseAngle: number;
  speed: number;
  direction: 1 | -1;
};

type RingConfig = {
  radius: number;
  stroke: string;
  strokeWidth: number;
  durationMs: number;
  direction: 1 | -1;
};

const DATA_ITEMS: OrbitItemDef[] = [
  { id: 'spark', label: 'Apache Spark', icon: 'simple-icons:apachespark', color: '#E25A1C' },
  { id: 'pyspark', label: 'PySpark', icon: 'simple-icons:apachespark', color: '#F07F3D' },
  { id: 'hadoop', label: 'Hadoop', icon: 'simple-icons:apachehadoop', color: '#F9E900' },
  { id: 'kafka', label: 'Apache Kafka', icon: 'simple-icons:apachekafka', color: '#ffffff' },
  { id: 'airflow', label: 'Apache Airflow', icon: 'simple-icons:apacheairflow', color: '#017CEE' },
  { id: 'flink', label: 'Apache Flink', icon: 'simple-icons:apacheflink', color: '#E6526F' },
  { id: 'trino', label: 'Trino', icon: 'simple-icons:trino', color: '#DD00A1' },
  { id: 'duckdb', label: 'DuckDB', icon: 'simple-icons:duckdb', color: '#FFF000' },
  { id: 'clickhouse', label: 'ClickHouse', icon: 'simple-icons:clickhouse', color: '#FFCC01' },
  { id: 'dbt', label: 'dbt', icon: 'simple-icons:dbt', color: '#FF694B' },
  { id: 'prefect', label: 'Prefect', icon: 'simple-icons:prefect', color: '#22C55E' },
  { id: 'databricks', label: 'Databricks', icon: 'simple-icons:databricks', color: '#FF3621' },
  { id: 'snowflake', label: 'Snowflake', icon: 'simple-icons:snowflake', color: '#29B5E8' },
  { id: 'redshift', label: 'Amazon Redshift', icon: 'simple-icons:amazonredshift', color: '#E25A1C' },
  { id: 'bigquery', label: 'BigQuery', icon: 'simple-icons:googlebigquery', color: '#669DF6' },
  { id: 's3', label: 'Amazon S3', icon: 'simple-icons:amazons3', color: '#73C61D' },
  { id: 'airbyte', label: 'Airbyte', icon: 'simple-icons:airbyte', color: '#615EFF' },
  { id: 'nifi', label: 'Apache NiFi', icon: 'simple-icons:apachenifi', color: '#60A5FA' },
];

const CLOUD_ITEMS: OrbitItemDef[] = [
  { id: 'aws', label: 'AWS', icon: 'simple-icons:amazonaws', color: '#FF9900' },
  { id: 'azure', label: 'Microsoft Azure', icon: 'simple-icons:microsoftazure', color: '#0078D4' },
  { id: 'gcp', label: 'Google Cloud', icon: 'simple-icons:googlecloud', color: '#4285F4' },
  { id: 'kubernetes', label: 'Kubernetes', icon: 'devicon:kubernetes', color: '#326CE5' },
  { id: 'docker', label: 'Docker', icon: 'devicon:docker', color: '#2496ED' },
  { id: 'terraform', label: 'Terraform', icon: 'simple-icons:terraform', color: '#7B42BC' },
  { id: 'lambda', label: 'AWS Lambda', icon: 'simple-icons:awslambda', color: '#FF9900' },
  { id: 'linux', label: 'Linux Ubuntu', icon: 'devicon:linux', color: '#FCC624' },
  { id: 'windows', label: 'Windows', icon: 'simple-icons:windows', color: '#0078D6' },
  { id: 'git', label: 'Git', icon: 'simple-icons:git', color: '#F05032' },
  { id: 'github', label: 'GitHub', icon: 'simple-icons:github', color: '#ffffff' },
  {
    id: 'jenkins',
    label: 'Jenkins',
    icon: 'simple-icons:jenkins',
    color: '#D24939',
    imageSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg',
  },
  { id: 'prometheus', label: 'Prometheus', icon: 'simple-icons:prometheus', color: '#E6522C' },
  { id: 'grafana', label: 'Grafana', icon: 'simple-icons:grafana', color: '#F46800' },
  { id: 'helm', label: 'Helm', icon: 'simple-icons:helm', color: '#0F1689' },
];

const PROGRAMMING_ITEMS: OrbitItemDef[] = [
  { id: 'python', label: 'Python', icon: 'devicon:python', color: '#3776AB' },
  { id: 'sql', label: 'SQL', icon: 'mdi:database-search', color: '#00eeff' },
  { id: 'r', label: 'R', icon: 'devicon:r', color: '#276DC3' },
  { id: 'javascript', label: 'JavaScript', icon: 'simple-icons:javascript', color: '#F7DF1E' },
  { id: 'typescript', label: 'TypeScript', icon: 'simple-icons:typescript', color: '#3178C6' },
  { id: 'go', label: 'Go', icon: 'simple-icons:go', color: '#00ADD8' },
  { id: 'rust', label: 'Rust', icon: 'simple-icons:rust', color: '#F74C00' },
  { id: 'nodejs', label: 'Node.js', icon: 'simple-icons:nodedotjs', color: '#5FA04E' },
  { id: 'nestjs', label: 'NestJS', icon: 'simple-icons:nestjs', color: '#E0234E' },
  { id: 'fastapi', label: 'FastAPI', icon: 'simple-icons:fastapi', color: '#009688' },
  { id: 'postgresql', label: 'PostgreSQL', icon: 'devicon:postgresql', color: '#336791' },
  { id: 'mongodb', label: 'MongoDB', icon: 'simple-icons:mongodb', color: '#47A248' },
  { id: 'redis', label: 'Redis', icon: 'simple-icons:redis', color: '#DC382D' },
  { id: 'prisma', label: 'Prisma', icon: 'simple-icons:prisma', color: '#2D3748' },
];

const ANALYTICS_ITEMS: OrbitItemDef[] = [
  { id: 'powerbi', label: 'Power BI', icon: 'simple-icons:powerbi', color: '#F2C811' },
  { id: 'excel', label: 'Microsoft Excel', icon: 'simple-icons:microsoftexcel', color: '#217346' },
  { id: 'jupyter', label: 'Jupyter', icon: 'simple-icons:jupyter', color: '#F37626' },
  { id: 'anaconda', label: 'Anaconda', icon: 'simple-icons:anaconda', color: '#44A833' },
  { id: 'pandas', label: 'Pandas', icon: 'simple-icons:pandas', color: '#A78BFA' },
  { id: 'numpy', label: 'NumPy', icon: 'simple-icons:numpy', color: '#4EA4D8' },
  { id: 'tensorflow', label: 'TensorFlow', icon: 'simple-icons:tensorflow', color: '#FF6F00' },
  { id: 'pytorch', label: 'PyTorch', icon: 'simple-icons:pytorch', color: '#EE4C2C' },
  { id: 'mlflow', label: 'MLflow', icon: 'simple-icons:mlflow', color: '#0194E2' },
  { id: 'chatgpt', label: 'ChatGPT', icon: 'simple-icons:openai', color: '#10A37F' },
  { id: 'gemini', label: 'Gemini', icon: 'simple-icons:googlegemini', color: '#8E75FF' },
  { id: 'huggingface', label: 'Hugging Face', icon: 'simple-icons:huggingface', color: '#FFD21E' },
];

const COMPANY_ITEMS: OrbitItemDef[] = [
  { id: 'google', label: 'Google', icon: 'simple-icons:google', color: '#4285F4' },
  { id: 'amazon', label: 'Amazon', icon: 'simple-icons:amazon', color: '#FF9900' },
  { id: 'microsoft', label: 'Microsoft', icon: 'simple-icons:microsoft', color: '#5E5E5E' },
  { id: 'apple', label: 'Apple', icon: 'simple-icons:apple', color: '#FFFFFF' },
  { id: 'meta', label: 'Meta', icon: 'simple-icons:meta', color: '#0866FF' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'simple-icons:linkedin', color: '#0A66C2' },
  { id: 'netflix', label: 'Netflix', icon: 'simple-icons:netflix', color: '#E50914' },
  { id: 'spotify', label: 'Spotify', icon: 'simple-icons:spotify', color: '#1DB954' },
  { id: 'shopify', label: 'Shopify', icon: 'simple-icons:shopify', color: '#7AB55C' },
  { id: 'openai', label: 'OpenAI', icon: 'simple-icons:openai', color: '#10A37F' },
  { id: 'nvidia', label: 'NVIDIA', icon: 'simple-icons:nvidia', color: '#76B900' },
  { id: 'discord', label: 'Discord', icon: 'simple-icons:discord', color: '#5865F2' },
];

const BRAND_IMAGE_MAP: Record<string, string> = {
  airflow: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apacheairflow/apacheairflow-original.svg',
  hadoop: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg',
};

const ALL_DEFS: OrbitItemDef[] = [
  ...DATA_ITEMS,
  ...CLOUD_ITEMS,
  ...PROGRAMMING_ITEMS,
  ...ANALYTICS_ITEMS,
  ...COMPANY_ITEMS,
];

const DESKTOP_RINGS: Record<RingId, RingConfig> = {
  1: { radius: 340, stroke: 'rgba(0,238,255,0.18)', strokeWidth: 1.2, durationMs: 30000, direction: 1 },
  2: { radius: 445, stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1.1, durationMs: 35000, direction: -1 },
  3: { radius: 565, stroke: 'rgba(0,238,255,0.15)', strokeWidth: 1.1, durationMs: 45000, direction: 1 },
  4: { radius: 700, stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1.05, durationMs: 55000, direction: -1 },
  5: { radius: 840, stroke: 'rgba(0,238,255,0.12)', strokeWidth: 1.05, durationMs: 65000, direction: 1 },
};

const TABLET_RINGS: Record<RingId, RingConfig> = {
  1: { radius: 250, stroke: 'rgba(0,238,255,0.18)', strokeWidth: 1.15, durationMs: 28000, direction: 1 },
  2: { radius: 330, stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1.05, durationMs: 34000, direction: -1 },
  3: { radius: 420, stroke: 'rgba(0,238,255,0.14)', strokeWidth: 1.05, durationMs: 42000, direction: 1 },
  4: { radius: 510, stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1, durationMs: 50000, direction: -1 },
  5: { radius: 600, stroke: 'rgba(0,238,255,0.11)', strokeWidth: 1, durationMs: 58000, direction: 1 },
};

const MOBILE_RINGS: Record<RingId, RingConfig> = {
  1: { radius: 165, stroke: 'rgba(0,238,255,0.16)', strokeWidth: 1, durationMs: 25000, direction: 1 },
  2: { radius: 215, stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1, durationMs: 32000, direction: -1 },
  3: { radius: 270, stroke: 'rgba(0,238,255,0.12)', strokeWidth: 1, durationMs: 38000, direction: 1 },
  4: { radius: 325, stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1, durationMs: 46000, direction: -1 },
  5: { radius: 385, stroke: 'rgba(0,238,255,0.1)', strokeWidth: 1, durationMs: 54000, direction: 1 },
};

const TWO_PI = Math.PI * 2;

function getRingConfig(width: number) {
  if (width < 640) return MOBILE_RINGS;
  if (width < 1024) return TABLET_RINGS;
  return DESKTOP_RINGS;
}

function getVisibleCount(width: number) {
  if (width < 640) return 8;
  if (width < 1024) return 16;
  return 30;
}

function getRingDistribution(width: number): number[] {
  if (width < 640) return [2, 2, 2, 1, 1];
  if (width < 1024) return [4, 3, 3, 3, 3];
  return [6, 6, 6, 6, 6];
}

function getOrbitCenter(width: number, height: number) {
  if (width < 640) {
    return { x: width * 1.2, y: height * -0.1 };
  }
  if (width < 1024) {
    return { x: width * 1.12, y: height * -0.12 };
  }
  return { x: width * 1.08, y: height * -0.12 };
}

function speedFromDuration(durationMs: number) {
  return TWO_PI / durationMs;
}

function buildClientItems(width: number, ringConfig: Record<RingId, RingConfig>) {
  const count = getVisibleCount(width);
  const source = ALL_DEFS.slice(0, count);
  const distribution = getRingDistribution(width);
  const result: OrbitItem[] = [];
  let cursor = 0;

  distribution.forEach((ringCount, ringIndex) => {
    const ring = (ringIndex + 1) as RingId;
    const itemsForRing = source.slice(cursor, cursor + ringCount);
    cursor += ringCount;
    if (itemsForRing.length === 0) return;

    const config = ringConfig[ring];
    const baseOffset = Math.random() * TWO_PI;
    const angleStep = TWO_PI / itemsForRing.length;

    itemsForRing.forEach((item, itemIndex) => {
      const baseAngle = baseOffset + itemIndex * angleStep;
      const speedVariation = 1 + (Math.random() * 0.06 - 0.03);

      result.push({
        ...item,
        imageSrc: item.imageSrc ?? BRAND_IMAGE_MAP[item.id],
        ring,
        baseAngle,
        speed: speedFromDuration(config.durationMs) * speedVariation,
        direction: config.direction,
      });
    });
  });

  return result;
}

function useReducedMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return prefersReducedMotion;
}

export function HeroOrbit() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [items, setItems] = useState<OrbitItem[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const pillRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const itemsRef = useRef<OrbitItem[]>([]);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ringConfig = getRingConfig(width);

      setViewport({ width, height });
      setItems(buildClientItems(width, ringConfig));
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (reducedMotion) return;

    const tick = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const { x: liveCenterX, y: liveCenterY } = getOrbitCenter(window.innerWidth, window.innerHeight);
      const liveRingConfig = getRingConfig(window.innerWidth);
      const liveLeftGuard =
        window.innerWidth < 640 ? window.innerWidth * 0.18 : window.innerWidth < 1024 ? window.innerWidth * 0.42 : window.innerWidth * 0.5;

      for (const item of itemsRef.current) {
        const pillNode = pillRefs.current[item.id];
        if (!pillNode) continue;

        const config = liveRingConfig[item.ring];
        const angle = item.baseAngle + elapsed * item.speed * item.direction;
        const x = liveCenterX + config.radius * Math.cos(angle);
        const y = liveCenterY + config.radius * Math.sin(angle);

        let opacity = 1;
        if (x < liveLeftGuard && y > window.innerHeight * 0.12 && y < window.innerHeight * 0.9) {
          opacity = 0;
        } else if (x < liveLeftGuard + 80) {
          opacity = 0.28;
        }

        if (x < -220 || x > window.innerWidth + 220 || y < -180 || y > window.innerHeight + 180) {
          opacity = 0;
        }

        pillNode.style.opacity = String(opacity);
        pillNode.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reducedMotion]);

  const ringConfig = useMemo(() => getRingConfig(viewport.width), [viewport.width]);
  const { x: centerX, y: centerY } = useMemo(
    () => getOrbitCenter(viewport.width, viewport.height),
    [viewport.width, viewport.height],
  );

  const pills = useMemo(() => {
    return items.map((item) => {
      const config = ringConfig[item.ring];
      const x = centerX + config.radius * Math.cos(item.baseAngle);
      const y = centerY + config.radius * Math.sin(item.baseAngle);
      return { ...item, x, y };
    });
  }, [items, ringConfig, centerX, centerY]);

  if (viewport.width === 0 || viewport.height === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
        {(Object.entries(ringConfig) as Array<[string, RingConfig]>).map(([ringKey, config]) => (
          <circle
            key={ringKey}
            cx={centerX}
            cy={centerY}
            r={config.radius}
            stroke={config.stroke}
            strokeWidth={config.strokeWidth}
          />
        ))}
      </svg>

      {pills.map((pill) => (
        <div
          key={pill.id}
          className="pointer-events-auto absolute"
          ref={(node) => {
            pillRefs.current[pill.id] = node;
          }}
          style={{
            left: 0,
            top: 0,
            opacity: reducedMotion ? 1 : 0,
            transform: `translate3d(${pill.x}px, ${pill.y}px, 0) translate(-50%, -50%)`,
            willChange: reducedMotion ? 'auto' : 'transform, opacity',
          }}
        >
          <div className="flex items-center gap-2 rounded-full border border-[rgba(0,238,255,0.22)] bg-[rgba(17,17,17,0.78)] px-3 py-2 backdrop-blur-[10px] transition-transform duration-200 hover:scale-[1.04] hover:border-[rgba(0,238,255,0.34)]">
            <span className="flex h-7 w-7 items-center justify-center">
              {pill.imageSrc ? (
                <img
                  src={pill.imageSrc}
                  alt={pill.label}
                  className="h-[18px] w-[18px] object-contain"
                  loading="lazy"
                  draggable={false}
                />
              ) : pill.icon ? (
                <Icon
                  icon={pill.icon}
                  width={viewport.width < 640 ? 16 : 18}
                  height={viewport.width < 640 ? 16 : 18}
                  style={pill.color ? { color: pill.color } : undefined}
                />
              ) : (
                <Code2 size={16} color="#f5f5f5" />
              )}
            </span>
            <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-[#f5f5f5]">
              {pill.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
