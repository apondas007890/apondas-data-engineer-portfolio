"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

type TechIcon = {
  label: string;
  slug: string;
  color: string;
  fallbackSlug?: string;
  src?: string;
};

type RoutePoint = {
  x: number;
  y: number;
  edge: string;
};

type IconMotionConfig = {
  start: RoutePoint;
  mid: { x: number; y: number };
  end: RoutePoint;
  duration: number;
  delay: number;
  opacity: number;
  rotateStart: number;
  rotateEnd: number;
  driftX: number;
  driftY: number;
  pulseScale: number;
  driftDurX: number;
  driftDurY: number;
  pulseDur: number;
};

const GRAMEENPHONE_ICON_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <g fill="#35A8E0">
      <ellipse cx="30" cy="62" rx="23" ry="13" transform="rotate(-34 30 62)"/>
      <ellipse cx="60" cy="27" rx="23" ry="13" transform="rotate(-16 60 27)"/>
      <ellipse cx="76" cy="72" rx="23" ry="13" transform="rotate(64 76 72)"/>
    </g>
  </svg>`
)}`;

const TECH_ICONS: TechIcon[] = [
  {
    label: "Google",
    slug: "google",
    color: "#4285F4",
    src: "https://www.vectorlogo.zone/logos/google/google-icon.svg",
  },
  { label: "Amazon", slug: "amazon", color: "#FF9900" },
  { label: "Microsoft", slug: "microsoft", color: "#5E5E5E" },
  { label: "Meta", slug: "meta", color: "#0866FF" },
  { label: "Apple", slug: "apple", color: "#A2AAAD" },
  { label: "Samsung", slug: "samsung", color: "#1428A0" },
  { label: "Mercedes-Benz", slug: "mercedes", color: "#FFFFFF", fallbackSlug: "bmw" },
  { label: "BMW", slug: "bmw", color: "#0066B1" },
  { label: "NVIDIA", slug: "nvidia", color: "#76B900" },
  { label: "Tesla", slug: "tesla", color: "#E82127" },
  { label: "Netflix", slug: "netflix", color: "#E50914" },
  { label: "OpenAI", slug: "openai", color: "#10A37F" },
  { label: "Anthropic", slug: "anthropic", color: "#D97706", fallbackSlug: "openai" },
  { label: "Gemini", slug: "googlegemini", color: "#8AB4F8", fallbackSlug: "google" },
  { label: "Grok", slug: "xai", color: "#D9D9D9", fallbackSlug: "x" },
  { label: "X", slug: "x", color: "#FFFFFF" },
  { label: "GitHub", slug: "github", color: "#F0F6FC" },
  { label: "Vercel", slug: "vercel", color: "#FFFFFF" },
  { label: "Docker", slug: "docker", color: "#2496ED" },
  { label: "Kubernetes", slug: "kubernetes", color: "#326CE5" },
  { label: "Terraform", slug: "terraform", color: "#844FBA" },
  { label: "Git", slug: "git", color: "#F05032" },
  { label: "Jenkins", slug: "jenkins", color: "#D24939" },
  { label: "Linux", slug: "linux", color: "#FCC624" },
  { label: "Windows", slug: "windows", color: "#0078D6" },
  { label: "Chrome", slug: "googlechrome", color: "#4285F4" },
  { label: "AWS", slug: "amazonwebservices", color: "#FF9900" },
  { label: "Amazon S3", slug: "amazons3", color: "#569A31" },
  { label: "Lambda", slug: "awslambda", color: "#FF9900" },
  { label: "Amazon Redshift", slug: "amazonredshift", color: "#E25A24" },
  { label: "GCP", slug: "googlecloud", color: "#4285F4" },
  { label: "BigQuery", slug: "googlebigquery", color: "#669DF6", fallbackSlug: "googlecloud" },
  { label: "Vertex AI", slug: "googlevertexai", color: "#4285F4", fallbackSlug: "googlecloud" },
  { label: "Azure", slug: "microsoftazure", color: "#0078D4" },
  { label: "Power BI", slug: "powerbi", color: "#F2C811" },
  { label: "Excel", slug: "microsoftexcel", color: "#217346" },
  { label: "Python", slug: "python", color: "#3776AB" },
  { label: "TypeScript", slug: "typescript", color: "#3178C6" },
  { label: "JavaScript", slug: "javascript", color: "#F7DF1E" },
  { label: "Node.js", slug: "nodedotjs", color: "#339933" },
  { label: "React", slug: "react", color: "#61DAFB" },
  { label: "Next.js", slug: "nextdotjs", color: "#FFFFFF" },
  { label: "PostgreSQL", slug: "postgresql", color: "#336791" },
  { label: "MySQL", slug: "mysql", color: "#4479A1" },
  { label: "SQL Server", slug: "microsoftsqlserver", color: "#CC2927" },
  { label: "MongoDB", slug: "mongodb", color: "#47A248" },
  { label: "Redis", slug: "redis", color: "#DC382D" },
  { label: "Snowflake", slug: "snowflake", color: "#29B5E8" },
  { label: "Databricks", slug: "databricks", color: "#FF3621" },
  { label: "Apache Spark", slug: "apachespark", color: "#E25A24" },
  { label: "Apache Airflow", slug: "apacheairflow", color: "#017CEE" },
  { label: "Apache Kafka", slug: "apachekafka", color: "#ffffff" },
  { label: "Supabase", slug: "supabase", color: "#3ECF8E" },
  { label: "Slack", slug: "slack", color: "#4A154B" },
  { label: "Notion", slug: "notion", color: "#FFFFFF" },
  { label: "Figma", slug: "figma", color: "#F24E1E" },
  { label: "Postman", slug: "postman", color: "#FF6C37" },
  { label: "Discord", slug: "discord", color: "#5865F2" },
  { label: "Grameenphone", slug: "grameenphone", color: "#35A8E0", src: GRAMEENPHONE_ICON_SVG, fallbackSlug: "google" },
  { label: "bKash", slug: "bkash", color: "#E2136E", fallbackSlug: "stripe" },
  { label: "Robi", slug: "robi", color: "#E60000", fallbackSlug: "vodafone" },
  { label: "Banglalink", slug: "banglalink", color: "#FF6A00", fallbackSlug: "orange" },
  { label: "Walton", slug: "walton", color: "#003DA5", fallbackSlug: "samsung" },
  { label: "BRAC", slug: "brac", color: "#0077C8", fallbackSlug: "microsoft" },
  { label: "Chevron", slug: "chevron", color: "#1F4EAA" },
  { label: "Shell", slug: "shell", color: "#FFD500" },
  { label: "BP", slug: "bp", color: "#7CB342" },
  { label: "TotalEnergies", slug: "totalenergies", color: "#E30613", fallbackSlug: "shell" },
  { label: "Siemens Energy", slug: "siemens", color: "#00A0A9" },
  { label: "GE", slug: "generalelectric", color: "#0870D8", fallbackSlug: "siemens" },
];

const EDGE_PAD = 88;
const ICON_SIZE = 30;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomEdgePoint(width: number, height: number): RoutePoint {
  const midY = height / 2;
  const choices: Array<() => RoutePoint> = [
    () => ({ x: -EDGE_PAD, y: rand(0, height), edge: "left" }),
    () => ({ x: width + EDGE_PAD, y: rand(0, height), edge: "right" }),
    () => ({ x: rand(0, width), y: -EDGE_PAD, edge: "top" }),
    () => ({ x: rand(0, width), y: height + EDGE_PAD, edge: "bottom" }),
    () => ({ x: -EDGE_PAD, y: -EDGE_PAD, edge: "top-left" }),
    () => ({ x: width + EDGE_PAD, y: -EDGE_PAD, edge: "top-right" }),
    () => ({ x: -EDGE_PAD, y: height + EDGE_PAD, edge: "bottom-left" }),
    () => ({ x: width + EDGE_PAD, y: height + EDGE_PAD, edge: "bottom-right" }),
    () => ({ x: -EDGE_PAD, y: rand(midY * 0.6, midY * 1.4), edge: "mid-left" }),
    () => ({ x: width + EDGE_PAD, y: rand(midY * 0.6, midY * 1.4), edge: "mid-right" }),
  ];
  return choices[Math.floor(Math.random() * choices.length)]();
}

function oppositeEdge(edge: string): string[] {
  if (edge === "left" || edge === "mid-left") return ["right", "mid-right", "top-right", "bottom-right"];
  if (edge === "right" || edge === "mid-right") return ["left", "mid-left", "top-left", "bottom-left"];
  if (edge === "top" || edge === "top-left" || edge === "top-right") return ["bottom", "bottom-left", "bottom-right"];
  if (edge === "bottom" || edge === "bottom-left" || edge === "bottom-right") return ["top", "top-left", "top-right"];
  return ["left", "right", "top", "bottom"];
}

function randomEdgePointFromSet(width: number, height: number, allowed: string[]): RoutePoint {
  const p = randomEdgePoint(width, height);
  if (allowed.includes(p.edge)) return p;
  return randomEdgePointFromSet(width, height, allowed);
}

function nextConfig(width: number, height: number, previousEdge?: string): IconMotionConfig {
  let start = randomEdgePoint(width, height);
  while (previousEdge && start.edge === previousEdge) {
    start = randomEdgePoint(width, height);
  }

  const allowedEnds = oppositeEdge(start.edge);
  let end = randomEdgePointFromSet(width, height, allowedEnds);
  const mid = {
    x: rand(width * 0.08, width * 0.92),
    y: rand(height * 0.08, height * 0.92),
  };

  return {
    start,
    mid,
    end,
    duration: rand(18, 38),
    delay: 0,
    opacity: rand(0.86, 1),
    rotateStart: rand(-26, 26),
    rotateEnd: rand(-20, 20),
    driftX: rand(-8, 8),
    driftY: rand(-8, 8),
    pulseScale: rand(1.04, 1.1),
    driftDurX: rand(7, 11),
    driftDurY: rand(8, 12),
    pulseDur: rand(5, 8),
  };
}

type FloatingIconItemProps = {
  icon: TechIcon;
  viewport: { w: number; h: number };
  index: number;
};

function FloatingIconItem({ icon, viewport, index }: FloatingIconItemProps) {
  const [cfg, setCfg] = useState<IconMotionConfig>(() => nextConfig(viewport.w, viewport.h));
  const [src, setSrc] = useState<string>(() =>
    icon.src ?? `https://cdn.simpleicons.org/${icon.slug}/${icon.color.replace("#", "")}`
  );
  const [fallbackStep, setFallbackStep] = useState(0);

  useEffect(() => {
    setCfg(nextConfig(viewport.w, viewport.h));
    setSrc(icon.src ?? `https://cdn.simpleicons.org/${icon.slug}/${icon.color.replace("#", "")}`);
    setFallbackStep(0);
  }, [viewport.w, viewport.h]);

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        zIndex: 0,
        left: 0,
        top: 0,
      }}
      initial={{
        x: cfg.start.x,
        y: cfg.start.y,
        opacity: cfg.opacity,
        rotate: cfg.rotateStart,
        scale: 1,
      }}
      animate={{
        x: [cfg.start.x, cfg.mid.x, cfg.end.x],
        y: [cfg.start.y, cfg.mid.y, cfg.end.y],
        opacity: cfg.opacity,
        rotate: cfg.rotateEnd,
      }}
      transition={{
        duration: cfg.duration,
        delay: 0,
        ease: "easeInOut",
        times: [0, 0.55, 1],
      }}
      onAnimationComplete={() => {
        setCfg(nextConfig(viewport.w, viewport.h, cfg.end.edge));
      }}
    >
      <motion.img
        src={src}
        alt=""
        width={ICON_SIZE}
        height={ICON_SIZE}
        draggable={false}
        className="select-none pointer-events-none"
        animate={{
          x: [0, cfg.driftX, -cfg.driftX * 0.7, 0],
          y: [0, -cfg.driftY, cfg.driftY * 0.75, 0],
          scale: [1, cfg.pulseScale, 1],
          opacity: [0.88, 1, 0.88],
        }}
        transition={{
          x: { duration: cfg.driftDurX, repeat: Infinity, ease: "easeInOut" },
          y: { duration: cfg.driftDurY, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: cfg.pulseDur, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: cfg.pulseDur, repeat: Infinity, ease: "easeInOut" },
        }}
        onError={() => {
          if (fallbackStep === 0) {
            setFallbackStep(1);
            const nextSlug = icon.fallbackSlug ?? icon.slug;
            setSrc(`https://cdn.simpleicons.org/${nextSlug}/ffffff`);
            return;
          }
          if (fallbackStep === 1) {
            setFallbackStep(2);
            const initials = icon.label.slice(0, 2).toUpperCase();
            const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><rect width='30' height='30' rx='8' fill='#101626'/><text x='15' y='20' text-anchor='middle' font-size='11' font-family='Segoe UI,Arial' fill='#ffffff'>${initials}</text></svg>`;
            setSrc(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
          }
        }}
        style={{
          filter: `brightness(1.7) contrast(1.3) saturate(1.35) drop-shadow(0 0 16px ${icon.color})`,
          background: "rgba(22,28,44,0.8)",
          borderRadius: "8px",
          padding: "3px",
          willChange: "transform, opacity",
        }}
      />
    </motion.div>
  );
}

export function FloatingTechIcons() {
  const [mounted, setMounted] = useState(false);
  const [viewport, setViewport] = useState({ w: 1920, h: 1080 });

  useEffect(() => {
    setMounted(true);
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const iconCountTarget = viewport.w < 768 ? 18 : viewport.w < 1280 ? 26 : 34;
  const items = useMemo(() => {
    const copy = [...TECH_ICONS];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    const uniqueByLabel = Array.from(new Map(copy.map((it) => [it.label, it])).values());
    const iconCount = Math.min(iconCountTarget, uniqueByLabel.length);
    return uniqueByLabel.slice(0, iconCount);
  }, [iconCountTarget]);

  if (!mounted) {
    return <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {items.map((icon, i) => (
        <FloatingIconItem key={`${icon.slug}-${i}`} icon={icon} viewport={viewport} index={i} />
      ))}
    </div>
  );
}
