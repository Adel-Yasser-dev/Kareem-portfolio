"use client";

import { Skiper31 } from "@/components/ui/text-scroll-animation";
import type { SanitySiteSettings, SanityToolItem } from "@/sanity/queries";

interface ToolsSectionProps {
  tools?: SanityToolItem[];
  settings?: SanitySiteSettings | null;
}

export function ToolsSection({ tools = [], settings }: ToolsSectionProps) {
  return (
    <section id="tools" className="relative w-full bg-[#F3F5FB]">
      <div id="tech-stack" className="absolute -top-24" aria-hidden="true" />
      <Skiper31 tools={tools} settings={settings} />
    </section>
  );
}

export { ToolsSection as TechStackSection };
