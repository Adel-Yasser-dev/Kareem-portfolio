"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Check,
  Copy,
} from "lucide-react";
import type { SanitySiteSettings } from "@/sanity/queries";

interface NavbarProps {
  settings?: SanitySiteSettings | null;
}

export function Navbar({ settings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const islandRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);

  const brandMark = settings?.brandMark || "K";
  const shortName = settings?.shortName || settings?.fullName || "Kareem";
  const roleBadge = settings?.roleBadge || "Lead UI/UX Designer";
  const navbarBio =
    settings?.navbarBio ||
    "Mansoura CS graduate with Google UX certification. Merging engineering logic with human-centered product craft.";
  const availableForWork = settings?.availableForWork ?? true;
  const availabilityText = settings?.availabilityText || "Available for work";
  const email = settings?.email || "contact@kareem.dev";
  const location = settings?.location || "Cairo, Egypt";
  const timezone = settings?.timezone || "GMT+3 (Available worldwide)";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 40);

      if (isExpanded) {
        setIsExpanded(false);
      }

      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY.current + 8) {
          setHidden(true);
        } else if (currentScrollY < lastScrollY.current - 8) {
          setHidden(false);
        }
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 55) {
        setHidden(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const scrollToSection = (id: string) => {
    setIsExpanded(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 h-10 z-40 pointer-events-auto"
        onMouseEnter={() => setHidden(false)}
        aria-hidden="true"
      />

      <header
        data-cursor-light="true"
        className={`fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none select-none transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${
          hidden && !isExpanded
            ? "-translate-y-28 opacity-0 scale-90 pointer-events-none"
            : "translate-y-0 opacity-100 scale-100"
        }`}
      >
        <div
          ref={islandRef}
          data-cursor-light="true"
          style={{ borderRadius: "28px" }}
          className={`pointer-events-auto rounded-[28px] transition-[width,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#0B0D17]/95 dark-glass backdrop-blur-2xl border border-white/12 shadow-[0_22px_55px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,255,255,0.08)_inset] text-white py-2 px-3 sm:px-4 will-change-[width] ${
            isExpanded
              ? "w-[min(680px,calc(100vw-24px))] ring-1 ring-white/15"
              : `w-[min(580px,calc(100vw-24px))] ${
                  scrolled ? "shadow-2xl shadow-black/50" : "hover:scale-[1.01]"
                }`
          }`}
        >
          <div className="h-10 flex items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={() => scrollToSection("top")}
              className="group flex items-center text-left cursor-pointer focus:outline-none shrink-0 pl-1 sm:pl-1.5"
              title="Back to top"
            >
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-white/90 transition-colors">
                {brandMark}
                <span className="text-[#3D5AFE]">.</span>
              </span>
            </button>

            <nav
              className={`hidden md:flex items-center gap-1 text-xs font-medium text-white/70 transition-all duration-300 ${
                isExpanded
                  ? "opacity-0 pointer-events-none max-w-0 overflow-hidden"
                  : "opacity-100 max-w-[420px]"
              }`}
            >
              <button
                onClick={() => scrollToSection("about")}
                className="px-2.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="px-2.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("work")}
                className="px-2.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
              >
                Journey
              </button>
              <button
                onClick={() => scrollToSection("tools")}
                className="px-2.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
              >
                Tools
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="px-2.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
              >
                Reviews
              </button>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              {availableForWork && (
                <div
                  className={`relative group/status flex items-center transition-all duration-300 ${
                    isExpanded
                      ? "opacity-0 pointer-events-none max-w-0 p-0 border-transparent overflow-hidden"
                      : "opacity-100 max-w-[60px]"
                  }`}
                >
                  <div
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition-all cursor-pointer"
                    aria-label={availabilityText}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                  </div>

                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-[#0B0D17]/95 dark-glass backdrop-blur-xl border border-white/12 text-white text-[11px] font-medium tracking-tight whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.5)] pointer-events-none opacity-0 group-hover/status:opacity-100 -translate-y-1 group-hover/status:translate-y-0 transition-all duration-200 z-50 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/90">{availabilityText}</span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#0B0D17] border-l border-t border-white/12" />
                  </div>
                </div>
              )}

              <button
                onClick={() => scrollToSection("contact")}
                className="shrink-0 h-7 sm:h-8 px-3 sm:px-3.5 rounded-full bg-[#3D5AFE] text-white hover:bg-[#2F49E8] active:scale-95 transition-all text-xs font-semibold flex items-center gap-1 shadow-sm shadow-[#3D5AFE]/30 cursor-pointer"
              >
                <span>Say Hello</span>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-label={
                  isExpanded
                    ? "Collapse Dynamic Island"
                    : "Expand Dynamic Island"
                }
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all flex items-center justify-center text-white/80 hover:text-white cursor-pointer ${
                  isExpanded ? "bg-white/20 text-white" : ""
                }`}
                title={isExpanded ? "Collapse Island" : "Expand Island"}
              >
                <div
                  className={`transition-transform duration-400 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${isExpanded ? "rotate-180" : ""}`}
                >
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </button>
            </div>
          </div>

          <div
            className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 pointer-events-none"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-1 pt-3 pb-1 mt-2.5 border-t border-white/10 flex flex-col gap-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[18px] bg-white/[0.04] border border-white/8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm sm:text-base text-white">
                        {shortName}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#3D5AFE]/20 text-[#7C8FFF] border border-[#3D5AFE]/30">
                        {roleBadge}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 max-w-md leading-relaxed">
                      {navbarBio}
                    </p>
                  </div>

                  {availableForWork && (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {availabilityText}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="group flex flex-col text-left p-3 rounded-[16px] bg-white/[0.03] hover:bg-white/[0.08] border border-white/6 hover:border-white/15 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D5AFE] group-hover:text-white transition-colors">
                      01 • Intro
                    </span>
                    <span className="font-display font-semibold text-sm text-white mt-0.5">
                      Hero &amp; Philosophy
                    </span>
                    <span className="text-[11px] text-white/50 mt-0.5">
                      Interactive crowd &amp; mission
                    </span>
                  </button>

                  <button
                    onClick={() => scrollToSection("work")}
                    className="group flex flex-col text-left p-3 rounded-[16px] bg-white/[0.03] hover:bg-white/[0.08] border border-white/6 hover:border-white/15 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D5AFE] group-hover:text-white transition-colors">
                      02 • Journey
                    </span>
                    <span className="font-display font-semibold text-sm text-white mt-0.5">
                      Career Milestones
                    </span>
                    <span className="text-[11px] text-white/50 mt-0.5">
                      Interactive timeline
                    </span>
                  </button>

                  <button
                    onClick={() => scrollToSection("projects")}
                    className="group flex flex-col text-left p-3 rounded-[16px] bg-white/[0.03] hover:bg-white/[0.08] border border-white/6 hover:border-white/15 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D5AFE] group-hover:text-white transition-colors">
                      03 • Projects
                    </span>
                    <span className="font-display font-semibold text-sm text-white mt-0.5">
                      Selected Works
                    </span>
                    <span className="text-[11px] text-white/50 mt-0.5">
                      SaaS &amp; app case studies
                    </span>
                  </button>

                  <button
                    onClick={() => scrollToSection("tools")}
                    className="group flex flex-col text-left p-3 rounded-[16px] bg-white/[0.03] hover:bg-white/[0.08] border border-white/6 hover:border-white/15 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D5AFE] group-hover:text-white transition-colors">
                      04 • Tools
                    </span>
                    <span className="font-display font-semibold text-sm text-white mt-0.5">
                      Design &amp; Product Tools
                    </span>
                    <span className="text-[11px] text-white/50 mt-0.5">
                      Figma, XD, Miro &amp; more
                    </span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-white/8 text-xs text-white/60">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-white/70">
                      <MapPin className="w-3.5 h-3.5 text-[#3D5AFE]" />
                      <span>{location}</span>
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="flex items-center gap-1.5 text-white/70">
                      <Clock className="w-3.5 h-3.5 text-[#3D5AFE]" />
                      <span>{timezone}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleCopyEmail}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
                      title="Copy email address"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#3D5AFE] hover:bg-[#2F49E8] text-white text-xs font-medium transition-all shadow-xs active:scale-95"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Open Mail</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
