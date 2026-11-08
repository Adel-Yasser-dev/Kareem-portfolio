"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { Wrench } from "lucide-react";
import type { SanitySiteSettings, SanityToolItem } from "@/sanity/queries";

export type ToolItem = {
  name: string;
  role: string;
  specialty: string;
  pill: string;
  icon: string;
  brandColor: string;
  anim: {
    start: number;
    end: number;
    xDesktop: number;
    yDesktop: number;
    rotateZ: number;
    rotateY: number;
    rotateX: number;
    scaleStart: number;
  };
};

const ANIM_PRESETS: ToolItem["anim"][] = [
  {
    start: 0.05,
    end: 0.65,
    xDesktop: -85,
    yDesktop: -50,
    rotateZ: -16,
    rotateY: 22,
    rotateX: 14,
    scaleStart: 0.82,
  },
  {
    start: 0.1,
    end: 0.7,
    xDesktop: -30,
    yDesktop: -65,
    rotateZ: 12,
    rotateY: 10,
    rotateX: 18,
    scaleStart: 0.86,
  },
  {
    start: 0.15,
    end: 0.74,
    xDesktop: 30,
    yDesktop: -60,
    rotateZ: -14,
    rotateY: -10,
    rotateX: 18,
    scaleStart: 0.86,
  },
  {
    start: 0.2,
    end: 0.78,
    xDesktop: 85,
    yDesktop: -45,
    rotateZ: 18,
    rotateY: -22,
    rotateX: 14,
    scaleStart: 0.82,
  },
  {
    start: 0.12,
    end: 0.72,
    xDesktop: -80,
    yDesktop: 50,
    rotateZ: 15,
    rotateY: 20,
    rotateX: -14,
    scaleStart: 0.84,
  },
  {
    start: 0.17,
    end: 0.76,
    xDesktop: -25,
    yDesktop: 65,
    rotateZ: -10,
    rotateY: 8,
    rotateX: -18,
    scaleStart: 0.87,
  },
  {
    start: 0.22,
    end: 0.8,
    xDesktop: 25,
    yDesktop: 60,
    rotateZ: 12,
    rotateY: -8,
    rotateX: -18,
    scaleStart: 0.87,
  },
  {
    start: 0.26,
    end: 0.85,
    xDesktop: 80,
    yDesktop: 45,
    rotateZ: -15,
    rotateY: -20,
    rotateX: -14,
    scaleStart: 0.84,
  },
];

export const DESIGN_TOOLS: ToolItem[] = [
  {
    name: "Figma",
    role: "Design Systems & UI",
    specialty: "Tokens, auto-layout & interactive prototyping",
    pill: "Primary Hub",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
    brandColor: "#F24E1E",
    anim: ANIM_PRESETS[0],
  },
  {
    name: "Adobe XD",
    role: "Interaction Craft",
    specialty: "Vector graphics & micro-interactions",
    pill: "Vector Hub",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/xd/xd-plain.svg",
    brandColor: "#FF61F6",
    anim: ANIM_PRESETS[1],
  },
  {
    name: "Illustrator",
    role: "Vector & Icon Systems",
    specialty: "Scalable vector icons & bespoke illustrations",
    pill: "Iconography",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-plain.svg",
    brandColor: "#FF9A00",
    anim: ANIM_PRESETS[2],
  },
  {
    name: "Photoshop",
    role: "Visual & Raster Craft",
    specialty: "Image retouching, textures & visual polish",
    pill: "Raster Craft",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg",
    brandColor: "#31A8FF",
    anim: ANIM_PRESETS[3],
  },
  {
    name: "Miro",
    role: "Journey Maps & Discovery",
    specialty: "User flows, empathy maps & collaborative workshops",
    pill: "Discovery Hub",
    icon: "https://cdn.simpleicons.org/miro/050038",
    brandColor: "#FFD02F",
    anim: ANIM_PRESETS[4],
  },
  {
    name: "Canva",
    role: "Visual Communication",
    specialty: "Executive pitch decks & marketing media",
    pill: "Presentations",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg",
    brandColor: "#00C4CC",
    anim: ANIM_PRESETS[5],
  },
  {
    name: "Jira",
    role: "Agile & Dev Handoff",
    specialty: "Sprint alignment & design QA tracking",
    pill: "Agile Delivery",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg",
    brandColor: "#0052CC",
    anim: ANIM_PRESETS[6],
  },
  {
    name: "Notion",
    role: "Product Strategy & Docs",
    specialty: "PRDs, user research & token documentation",
    pill: "Research Hub",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/notion/notion-original.svg",
    brandColor: "#000000",
    anim: ANIM_PRESETS[7],
  },
];

type IndividualCardProps = {
  tool: ToolItem;
  index: number;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
};

const IndividualToolCard = ({
  tool,
  scrollYProgress,
  isMobile,
}: IndividualCardProps) => {
  const { anim } = tool;

  const xOffset = isMobile ? anim.xDesktop * 0.28 : anim.xDesktop;
  const yOffset = isMobile ? anim.yDesktop * 0.35 : anim.yDesktop;
  const rotZ = isMobile ? anim.rotateZ * 0.45 : anim.rotateZ;
  const rotY = isMobile ? anim.rotateY * 0.4 : anim.rotateY;
  const rotX = isMobile ? anim.rotateX * 0.4 : anim.rotateX;

  const x = useTransform(scrollYProgress, [anim.start, anim.end], [xOffset, 0]);
  const y = useTransform(scrollYProgress, [anim.start, anim.end], [yOffset, 0]);
  const rotate = useTransform(
    scrollYProgress,
    [anim.start, anim.end],
    [rotZ, 0],
  );
  const rotateY = useTransform(
    scrollYProgress,
    [anim.start, anim.end],
    [rotY, 0],
  );
  const rotateX = useTransform(
    scrollYProgress,
    [anim.start, anim.end],
    [rotX, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [anim.start, anim.end],
    [anim.scaleStart, 1],
  );
  const opacity = useTransform(
    scrollYProgress,
    [anim.start, anim.start + (anim.end - anim.start) * 0.4, anim.end],
    [0.2, 0.75, 1],
  );

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        rotateY,
        rotateX,
        scale,
        opacity,
        transformOrigin: "center center",
      }}
      className="will-change-transform group/card relative flex flex-col items-center w-full"
    >
      <div className="relative w-full h-full flex flex-col items-center text-center p-3.5 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-sm border border-[#E2E6F0] shadow-[0_4px_20px_-4px_rgba(21,23,43,0.06)] hover:shadow-[0_18px_40px_-6px_rgba(61,90,254,0.22)] hover:border-[#3D5AFE]/40 transition-all duration-300 group-hover/card:-translate-y-2.5">
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-[0.08] transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: tool.brandColor }}
        />

        {tool.pill && (
          <div className="mb-2 sm:mb-3 inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-[#F3F5FB] border border-[#E2E6F0] text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#6B7089] group-hover/card:text-[#3D5AFE] group-hover/card:border-[#3D5AFE]/30 transition-colors">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: tool.brandColor }}
            />
            {tool.pill}
          </div>
        )}

        {tool.icon && (
          <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#F8FAFC] border border-[#E2E6F0]/80 p-2.5 mb-2.5 sm:mb-3 group-hover/card:scale-110 group-hover/card:rotate-2 transition-transform duration-300 shrink-0">
            <img
              src={tool.icon}
              alt={`${tool.name} logo`}
              className="w-full h-full object-contain filter drop-shadow-xs"
              loading="lazy"
            />
          </div>
        )}

        <h3 className="font-display text-sm sm:text-base font-bold text-[#15172B] tracking-tight group-hover/card:text-[#3D5AFE] transition-colors">
          {tool.name}
        </h3>

        {tool.role && (
          <p className="text-[11px] sm:text-xs font-semibold text-[#3D5AFE] mt-0.5 leading-tight">
            {tool.role}
          </p>
        )}

        {tool.specialty && (
          <p className="hidden sm:block text-[10px] sm:text-[11px] text-[#6B7089] mt-1.5 leading-relaxed line-clamp-2">
            {tool.specialty}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export const Bracket = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 27 78"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
      />
    </svg>
  );
};

interface Skiper31Props {
  tools?: SanityToolItem[];
  settings?: SanitySiteSettings | null;
}

export const Skiper31 = ({ tools = [], settings }: Skiper31Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "center 48%"],
  });

  const bracketLeftX = useTransform(
    scrollYProgress,
    [0.1, 0.7],
    [isMobile ? 12 : 30, 0],
  );
  const bracketRightX = useTransform(
    scrollYProgress,
    [0.1, 0.7],
    [isMobile ? -12 : -30, 0],
  );
  const bracketScale = useTransform(scrollYProgress, [0.1, 0.7], [0.85, 1]);

  const mappedTools: ToolItem[] =
    tools.length > 0
      ? tools.map((item, idx) => ({
          name: item.name || "",
          role: item.role || "",
          specialty: item.specialty || "",
          pill: item.pill || "",
          icon: item.iconUrl || "",
          brandColor: item.brandColor || "#3D5AFE",
          anim: ANIM_PRESETS[idx % ANIM_PRESETS.length],
        }))
      : DESIGN_TOOLS;

  const eyebrow = settings?.toolsEyebrow || "Core Design & Product Tools";
  const title =
    settings?.toolsTitle || "Tools That Empower Exceptional Product Design.";
  const subtitle =
    settings?.toolsSubtitle ||
    "An integrated toolkit covering every milestone—from user research and wireframing to design token architecture and developer handoff.";
  const bracketText =
    settings?.toolsBracketText ||
    "curated tools for modern product design & handoff";

  return (
    <div
      ref={containerRef}
      className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F3F5FB] overflow-hidden select-none"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[650px] md:w-[850px] h-[380px] bg-[#3D5AFE]/[0.05] blur-[130px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-[0.25em] text-[#3D5AFE] mb-3.5 sm:mb-4 shadow-xs">
          <Wrench className="w-3.5 h-3.5 text-[#3D5AFE] animate-pulse" />
          <span>{eyebrow}</span>
        </div>

        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-[#15172B] max-w-4xl px-2">
          {title}
        </h2>

        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#6B7089] max-w-2xl leading-relaxed px-2">
          {subtitle}
        </p>

        <div className="mt-8 sm:mt-12 mb-8 sm:mb-10 flex items-center justify-center gap-2 sm:gap-4 text-center px-2">
          <motion.div style={{ x: bracketLeftX, scale: bracketScale }}>
            <Bracket className="h-7 sm:h-10 md:h-12 text-[#3D5AFE] shrink-0" />
          </motion.div>
          <span className="font-display text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#15172B]">
            {bracketText}
          </span>
          <motion.div style={{ x: bracketRightX, scale: bracketScale }}>
            <Bracket className="h-7 sm:h-10 md:h-12 scale-x-[-1] text-[#3D5AFE] shrink-0" />
          </motion.div>
        </div>

        <div
          className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 pt-2 pb-6 max-w-5xl"
          style={{ perspective: isMobile ? "700px" : "1200px" }}
        >
          {mappedTools.map((tool, index) => (
            <IndividualToolCard
              key={`${tool.name}-${index}`}
              tool={tool}
              index={index}
              scrollYProgress={scrollYProgress}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { IndividualToolCard as CharacterV3 };
