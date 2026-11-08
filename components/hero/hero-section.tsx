"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { CrowdCanvas } from "./crowd-canvas";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Mail } from "lucide-react";
import type { SanitySiteSettings } from "@/sanity/queries";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

interface HeroSectionProps {
  settings?: SanitySiteSettings | null;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const headline = settings?.heroHeadline || "Designing for real people.";
  const highlightName =
    settings?.heroHighlightName || settings?.shortName || "Kareem";
  const subtitle =
    settings?.heroSubtitle ||
    "product & UI/UX designer. Every screen starts with the person walking through it.";
  const primaryCtaText = settings?.heroPrimaryCtaText || "Explore Works";
  const primaryCtaTarget = settings?.heroPrimaryCtaTarget || "projects";
  const secondaryCtaText = settings?.heroSecondaryCtaText || "Get in Touch";
  const secondaryCtaHref =
    settings?.heroSecondaryCtaHref ||
    (settings?.email ? `mailto:${settings.email}` : "#contact");

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      if (headlineRef.current)
        gsap.set(headlineRef.current, { autoAlpha: 1, yPercent: 0 });
      if (subtitleRef.current)
        gsap.set(subtitleRef.current, { autoAlpha: 1, yPercent: 0 });
      if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 1, y: 0 });
      gsap.set("#crowd", { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1.15 },
        );
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1.0 },
          "-=0.85",
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { y: 35, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.85 },
          "-=0.7",
        );
      }

      tl.fromTo(
        "#crowd",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1.2, ease: "power2.out" },
        "-=0.7",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [headline, subtitle]);

  const handlePrimaryAction = () => {
    if (primaryCtaTarget.startsWith("http")) {
      window.open(primaryCtaTarget, "_blank", "noopener,noreferrer");
      return;
    }
    const cleanId = primaryCtaTarget.replace(/^#/, "");
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen min-h-160 max-h-270 w-full overflow-hidden bg-[#F3F5FB] text-[#15172B] select-none"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-4 sm:px-8 z-3 pointer-events-auto pt-[18vh] sm:pt-[16vh]">
        <div ref={textRef} className="w-full flex flex-col items-center">
          <div className="overflow-hidden px-4 sm:px-20">
            <h1
              ref={headlineRef}
              className="hero-headline-init font-display text-[clamp(44px,8vw,110px)] leading-[1.1] font-extrabold tracking-[-0.04em] text-[#15172B] m-0"
            >
              {headline}
            </h1>
          </div>

          <div className="overflow-hidden mt-5 sm:mt-6 max-w-2xl">
            <p
              ref={subtitleRef}
              className="hero-subtitle-init text-[clamp(15px,1.6vw,20px)] text-[#6B7089] leading-[1.45] font-normal m-0"
            >
              <span className="text-[#15172B] font-medium">
                {highlightName},{" "}
              </span>
              {subtitle}
            </p>
          </div>

          <div
            ref={ctaRef}
            className="hero-cta-init pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              onClick={handlePrimaryAction}
              className="h-11 px-6 rounded-full bg-[#15172B] text-white hover:bg-[#252843] active:scale-[0.98] transition-all shadow-md hover:shadow-lg font-medium text-sm group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-2 text-[#FFE45C] transition-transform group-hover:rotate-12" />
              {primaryCtaText}
              <ArrowDown className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-y-0.5" />
            </Button>

            <a href={secondaryCtaHref}>
              <Button
                variant="outline"
                className="h-11 px-6 rounded-full bg-white/90 backdrop-blur-md border-[#DCE2EE] text-[#15172B] hover:bg-white hover:border-[#15172B]/30 active:scale-[0.98] transition-all font-medium text-sm shadow-xs cursor-pointer"
              >
                <Mail className="w-4 h-4 mr-2 text-[#6B7089]" />
                {secondaryCtaText}
              </Button>
            </a>
          </div>
        </div>
      </div>

      <CrowdCanvas containerRef={containerRef} textRef={textRef} />
    </section>
  );
}
