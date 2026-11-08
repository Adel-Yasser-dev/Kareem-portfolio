"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import CardSwap, {
  type CardSwapHandle,
  type CardSwapItem,
} from "@/components/ui/card-swap";
import type { SanityProject, SanitySiteSettings } from "@/sanity/queries";

export interface ProjectItem {
  src: string;
  alt: string;
  title?: string;
  category?: string;
  description?: string;
  tags?: string[];
  href?: string;
}

interface PortfolioGalleryProps {
  id?: string;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  archiveButton?: {
    text: string;
    href: string;
  };
  images?: Array<ProjectItem>;
  sanityProjects?: SanityProject[];
  settings?: SanitySiteSettings | null;
  className?: string;
  onImageClick?: (index: number) => void;
  pauseOnHover?: boolean;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    src: "https://cdn.21st.dev/assets/mirror/d7/d7b4f814ea6a53c734011ba07290c57cd90c7fcbbdc6d733c58bb96e1974c35d.jpg",
    alt: "SaaS Dashboard Design",
    title: "SaaS Analytics & Operations Hub",
    category: "Product Design • Design System",
    description:
      "End-to-end enterprise dashboard architecture featuring real-time telemetry, modular widget layouts, and an accessible token-driven UI kit.",
    tags: ["Figma", "Design System", "SaaS", "Data Viz"],
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/06/06a56789c12bfaff3d8ca3cdaf4b6c904afb6dffa29ef229b1710e79efe74605.jpg",
    alt: "E-Commerce Platform",
    title: "Next-Gen Commerce Experience",
    category: "UX Research • Web Application",
    description:
      "High-conversion storefront and frictionless checkout flow designed through iterative usability testing and micro-interaction prototyping.",
    tags: ["E-Commerce", "Prototyping", "Conversion UX"],
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/d9/d9518d4aa10cfcbe33ddac518bdc215a2a8056166d66428ecfd9a9f93a27d77f.jpg",
    alt: "Mobile App Design",
    title: "Fintech Mobile Banking Suite",
    category: "Mobile UI/UX • iOS & Android",
    description:
      "Human-centered personal finance companion empowering users with instant transfers, smart budgeting insights, and biometric security.",
    tags: ["Mobile App", "Fintech", "User Testing"],
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/07/0771aea1a63bf4c0f86a50a671a2a8c0def8d6dfaed9d4059094144dfae128b2.jpg",
    alt: "Web Development",
    title: "AI Workflow Studio",
    category: "AI Product • Interaction Design",
    description:
      "Canvas-based collaborative workspace uniting prompt engineering, multi-agent orchestration, and live preview artifacts.",
    tags: ["AI UX", "Web App", "Interaction Design"],
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/4e/4e73d3917d198eb3f4d198d415a5184f4a41713f5f549675e2ec7682bab28770.jpg",
    alt: "Brand Identity",
    title: "Unified Brand & Digital Flagship",
    category: "Visual Identity • Design Engineering",
    description:
      "Cohesive visual language and interactive web presence crafted with 3D motion, editorial typography, and responsive performance.",
    tags: ["Branding", "Motion UI", "Web Design"],
  },
];

export function PortfolioGallery({
  id = "projects",
  title,
  eyebrow,
  subtitle,
  archiveButton,
  images: customImages,
  sanityProjects = [],
  settings,
  className = "",
  onImageClick,
  pauseOnHover = true,
}: PortfolioGalleryProps) {
  const swapRef = useRef<CardSwapHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const mappedSanityProjects: ProjectItem[] = sanityProjects.map((p) => ({
    src: p.imageUrl || p.externalImageUrl || "",
    alt: p.imageAlt || p.title || "Project",
    title: p.title,
    category: p.category,
    description: p.description,
    tags: p.tags,
    href: p.projectUrl,
  }));

  // Use Sanity projects if added, otherwise fall back to DEFAULT_PROJECTS
  const projects = customImages?.length
    ? customImages
    : mappedSanityProjects.length > 0
      ? mappedSanityProjects
      : DEFAULT_PROJECTS;

  const resolvedEyebrow =
    eyebrow || settings?.projectsEyebrow || "Portfolio Showcase";
  const resolvedTitle =
    title || settings?.projectsTitle || "Selected Projects & Client Work";
  const resolvedSubtitle =
    subtitle ||
    settings?.projectsSubtitle ||
    "Drag or fling the front card, click any card in the stack, or use the controls below to inspect featured case studies.";
  const resolvedButtonText =
    archiveButton?.text || settings?.projectsButtonText || "Explore all work";
  const resolvedButtonHref =
    archiveButton?.href || settings?.projectsButtonHref || "#projects";

  const activeProject = projects[activeIndex] ?? projects[0];

  const swapItems: CardSwapItem[] = projects.map((project, idx) => ({
    title: project.title || project.alt || `Project 0${idx + 1}`,
    image: project.src,
    alt: project.alt,
    icon: <Layers className="w-3.5 h-3.5 text-[#3D5AFE]" />,
  }));

  return (
    <section
      aria-label={resolvedTitle}
      className={`relative w-full py-20 overflow-hidden ${className}`}
      id={id}
    >
      <div id="archives" className="absolute -top-24" aria-hidden="true" />

      <div className="w-full backdrop-blur-md border-y border-[#E2E6F0] shadow-sm overflow-hidden px-6 sm:px-12 lg:px-20 py-14 lg:py-20 flex flex-col gap-10 lg:gap-14">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#3D5AFE] font-semibold mb-3">
            {resolvedEyebrow}
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#15172B] mb-4 text-balance tracking-tight">
            {resolvedTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#5A607F] leading-relaxed">
            {resolvedSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="w-full flex flex-col justify-between space-y-8 z-10">
            {activeProject && (
              <div className="p-6 sm:p-8 rounded-2xl bg-white/90 border border-[#E2E6F0] transition-all duration-300 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#3D5AFE] font-semibold">
                    {activeProject.category ||
                      `Featured Project 0${activeIndex + 1}`}
                  </span>
                  <span className="font-mono text-xs text-[#5A607F]">
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#15172B]">
                    {activeProject.title || activeProject.alt}
                  </h3>
                  {activeProject.href && (
                    <a
                      href={activeProject.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3D5AFE] hover:underline shrink-0"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {activeProject.description && (
                  <p className="text-sm text-[#5A607F] leading-relaxed">
                    {activeProject.description}
                  </p>
                )}

                {activeProject.tags && activeProject.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-white text-[#15172B] border border-[#E2E6F0]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => swapRef.current?.prev()}
                  aria-label="Previous project card"
                  className="w-11 h-11 rounded-full border border-[#E2E6F0] bg-white text-[#15172B] hover:border-[#3D5AFE] hover:text-[#3D5AFE] flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => swapRef.current?.next()}
                  aria-label="Next project card"
                  className="w-11 h-11 rounded-full border border-[#E2E6F0] bg-white text-[#15172B] hover:border-[#3D5AFE] hover:text-[#3D5AFE] flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <Link
                href={activeProject?.href || resolvedButtonHref}
                target={
                  (activeProject?.href || resolvedButtonHref).startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel={
                  (activeProject?.href || resolvedButtonHref).startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="inline-flex items-center gap-2.5 bg-[#15172B] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#3D5AFE] transition-all shadow-md hover:shadow-lg group"
              >
                <span>{resolvedButtonText}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="w-full flex items-center justify-center">
            <div className="w-full h-[420px] sm:h-[520px] lg:h-[600px] flex items-center justify-center">
              <CardSwap
                ref={swapRef}
                items={swapItems}
                width={680}
                height={440}
                cardDistance={60}
                verticalDistance={65}
                depth={90}
                skewAmount={5}
                visibleCards={Math.min(4, Math.max(1, swapItems.length))}
                delay={4000}
                autoplay={swapItems.length > 1}
                pauseOnHover={pauseOnHover}
                draggable={swapItems.length > 1}
                theme="light"
                onChange={(index) => setActiveIndex(index)}
                onCardClick={(index) => {
                  const clicked = projects[index];
                  if (clicked?.href) {
                    window.open(clicked.href, "_blank", "noopener,noreferrer");
                  }
                  onImageClick?.(index);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
