"use client";

import ProfileCard from "@/components/ui/profile-card";
import { CheckCircle2, Globe2, Layers, Sparkles } from "lucide-react";
import type { SanityHighlight, SanitySiteSettings } from "@/sanity/queries";

const ICON_MAP = {
  sparkles: Sparkles,
  layers: Layers,
  globe: Globe2,
  check: CheckCircle2,
} as const;

const DEFAULT_HIGHLIGHTS: SanityHighlight[] = [
  {
    icon: "sparkles",
    label: "4+ Years Experience",
    detail: "Product & UI/UX Design",
  },
  {
    icon: "layers",
    label: "30+ Shipped Projects",
    detail: "SaaS, Healthcare & E-Commerce",
  },
  {
    icon: "globe",
    label: "Global Remote Teams",
    detail: "UAE, Canada & Egypt",
  },
  {
    icon: "check",
    label: "End-to-End Craft",
    detail: "Research, Prototyping & Systems",
  },
];

interface AboutSectionProps {
  settings?: SanitySiteSettings | null;
}

export function AboutSection({ settings }: AboutSectionProps) {
  const email = settings?.email || "contact@kareem.dev";
  const handleContact = () => {
    window.location.href = `mailto:${email}`;
  };

  const card = settings?.profileCard;
  const highlights =
    settings?.aboutHighlights && settings.aboutHighlights.length > 0
      ? settings.aboutHighlights
      : DEFAULT_HIGHLIGHTS;
  const paragraphs = settings?.aboutParagraphs ?? [];

  const eyebrow = settings?.aboutEyebrow || "About Me";
  const headline =
    settings?.aboutHeadline ||
    "Designing clear, structured digital products around real user behavior.";
  const subheadline =
    settings?.aboutSubheadline ||
    "4+ years of UI/UX practice across the UAE, Canada, and Egypt.";

  return (
    <section
      id="about"
      aria-label={`About ${settings?.fullName || "Kareem Yasser Ebaid"}`}
      className="relative w-full py-24 px-6 sm:px-12 lg:px-20 overflow-hidden bg-[#F3F5FB]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Interactive Holographic ProfileCard */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <ProfileCard
              name={card?.name || settings?.fullName || "Kareem Yasser Ebaid"}
              title={
                card?.title || settings?.roleBadge || "UI/UX & Product Designer"
              }
              handle={card?.handle || "kareemebaid"}
              status={
                card?.status ||
                settings?.availabilityText ||
                "Available for remote roles"
              }
              statusColor="#22c55e"
              contactText={card?.contactText || "Get in touch"}
              avatarUrl={card?.avatarUrl || "/kareem-nobg.png"}
              miniAvatarUrl={card?.miniAvatarUrl || "/kareem.jpg"}
              holo={0.65}
              glare={0.4}
              tiltStrength={10}
              parallax={8}
              radius={20}
              enableTilt={true}
              intro={true}
              showUserInfo={true}
              enableMobileTilt={false}
              theme="light"
              backdropColor="#15172B"
              onContactClick={handleContact}
            />
          </div>

          {/* Right Column: Editorial About Narrative & Verified Highlights */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#3D5AFE] font-semibold mb-3">
                {eyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#15172B] tracking-tight text-balance leading-[1.15]">
                {headline}
              </h2>
              <p className="mt-3 text-base sm:text-lg font-medium text-[#3D5AFE]">
                {subheadline}
              </p>
            </div>

            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-base sm:text-lg text-[#5A607F] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="text-base sm:text-lg text-[#5A607F] leading-relaxed">
                  I’m{" "}
                  <span className="text-[#15172B] font-semibold">
                    {settings?.fullName || "Kareem Yasser Ebaid"}
                  </span>
                  , a UI/UX designer focused on turning complex workflows into
                  intuitive interfaces. Over the past four years, I’ve delivered
                  more than 30 projects across healthcare, veterinary SaaS,
                  e-commerce, real estate, and service-based products.
                </p>

                <p className="text-base sm:text-lg text-[#5A607F] leading-relaxed">
                  My process starts with user research, information
                  architecture, and user flows before moving into wireframing,
                  interactive prototyping, and usability testing. Working
                  closely with product managers and developers, I build
                  accessible, user-centered experiences backed by scalable
                  design systems that hold up in production.
                </p>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((item, idx) => {
                const Icon =
                  ICON_MAP[item.icon || "sparkles"] || Sparkles;
                return (
                  <div
                    key={item._key || item.label || idx}
                    className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#E2E6F0] shadow-2xs h-full"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#3D5AFE]/10 text-[#3D5AFE] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold font-display text-[#15172B] truncate">
                        {item.label}
                      </h3>
                      <p className="text-xs text-[#5A607F] mt-0.5 truncate">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
