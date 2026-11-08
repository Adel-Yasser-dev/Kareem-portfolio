"use client";

import { ArrowUp, Mail } from "lucide-react";
import type { SanitySiteSettings, SanitySocialLink } from "@/sanity/queries";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Journey", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Tools", href: "#tools" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const DEFAULT_SOCIAL_LINKS: SanitySocialLink[] = [
  { label: "Behance", href: "https://www.behance.net" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
];

interface FooterProps {
  settings?: SanitySiteSettings | null;
}

export function Footer({ settings }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shortName = settings?.shortName || "Kareem";
  const tagline =
    settings?.footerTagline || "UI/UX & Product Designer • Cairo, Egypt";
  const copyrightName =
    settings?.copyrightText || settings?.fullName || "Kareem Yasser Ebaid";
  const availableForWork = settings?.availableForWork ?? true;
  const availabilityText =
    settings?.availabilityText || "Available for remote opportunities";
  const email = settings?.email || "contact@kareem.dev";
  const socialLinks =
    settings?.socialLinks && settings.socialLinks.length > 0
      ? settings.socialLinks
      : DEFAULT_SOCIAL_LINKS;

  return (
    <footer className="w-full bg-[#F3F5FB] border-t border-[#E2E6F0] px-6 sm:px-12 lg:px-20 py-12 text-[#15172B]">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              onClick={scrollToTop}
              className="font-display font-extrabold text-xl tracking-tight text-[#15172B] cursor-pointer text-left"
            >
              {shortName}
              <span className="text-[#3D5AFE]">.</span>
            </button>
            <span className="hidden sm:inline-block text-[#E2E6F0]">|</span>
            <p className="text-sm text-[#5A607F]">{tagline}</p>
          </div>

          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-[#5A607F]"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#3D5AFE] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-semibold text-[#15172B] hover:text-[#3D5AFE] transition-colors cursor-pointer group"
          >
            <span>Back to top</span>
            <span className="w-8 h-8 rounded-full bg-white border border-[#E2E6F0] group-hover:border-[#3D5AFE] flex items-center justify-center transition-all shadow-2xs">
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>

        <div className="h-px w-full bg-[#E2E6F0]" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#5A607F]">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              &copy; 2026 {copyrightName}. All rights reserved.
            </span>
            {availableForWork && (
              <>
                <span className="hidden sm:inline-block text-[#DCE2EE]">•</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {availabilityText}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-5 font-medium">
            {socialLinks.map((item, idx) => (
              <a
                key={item._key || item.label || idx}
                href={item.href || "#"}
                target={item.href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href?.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="hover:text-[#15172B] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 text-[#3D5AFE] hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{email}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
