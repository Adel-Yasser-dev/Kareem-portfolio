"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Quote, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SanitySiteSettings, SanityTestimonial } from "@/sanity/queries";

export interface Testimonial {
  id: string | number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface AnimatedTestimonialsProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  testimonials?: Testimonial[];
  sanityTestimonials?: SanityTestimonial[];
  settings?: SanitySiteSettings | null;
  autoRotateInterval?: number;
  trustedCompanies?: string[];
  trustedCompaniesTitle?: string;
  className?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Tariq Al-Mansoor",
    role: "Founder & CEO",
    company: "VetCloud UAE",
    content:
      "Kareem transformed our complex veterinary clinic workflows into a remarkably intuitive SaaS platform. His ability to think like both a computer scientist and a human-centered designer cut our staff onboarding time in half.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "VP of Product",
    company: "MapleHealth (Canada)",
    content:
      "Working with Kareem was effortless. From user research and information architecture to a rock-solid Figma design system, every screen was backed by clear rationale and ready for engineering handoff.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: 3,
    name: "Omar El-Sayed",
    role: "Lead Frontend Engineer",
    company: "CartFlow Commerce",
    content:
      "Rarely do you find a UI/UX designer who understands technical constraints so deeply. Kareem's interactive prototypes, token structure, and edge-case states made building our e-commerce checkout flow a breeze.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: 4,
    name: "Nadia Haddad",
    role: "Product Director",
    company: "PropVista Dubai",
    content:
      "Kareem redesigned our entire real estate discovery experience across web and mobile. Conversion rates jumped within weeks of launch, and our users constantly praise how clean and fast the interface feels.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
  },
];

const DEFAULT_COMPANIES = [
  "Healthcare SaaS",
  "Veterinary Tech",
  "FinTech & Banking",
  "E-Commerce Platforms",
  "Real Estate Portals",
];

export function AnimatedTestimonials({
  title,
  subtitle,
  badgeText,
  testimonials: customTestimonials,
  sanityTestimonials = [],
  settings,
  autoRotateInterval = 6000,
  trustedCompanies: customCompanies,
  trustedCompaniesTitle,
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const mappedSanityTestimonials: Testimonial[] = sanityTestimonials.map(
    (t) => ({
      id: t._id,
      name: t.name || "Client",
      role: t.role || "",
      company: t.company || "",
      content: t.content || "",
      rating: t.rating ?? 5,
      avatar: t.avatarUrl || "",
    }),
  );

  // Use Sanity testimonials if added, otherwise fall back to DEFAULT_TESTIMONIALS
  const testimonials =
    customTestimonials && customTestimonials.length > 0
      ? customTestimonials
      : mappedSanityTestimonials.length > 0
        ? mappedSanityTestimonials
        : DEFAULT_TESTIMONIALS;

  const resolvedBadge =
    badgeText || settings?.testimonialsBadge || "Client Testimonials";
  const resolvedTitle =
    title ||
    settings?.testimonialsTitle ||
    "Trusted by founders, product leaders & engineering teams.";
  const resolvedSubtitle =
    subtitle ||
    settings?.testimonialsSubtitle ||
    "Real feedback from remote teams and clients across the UAE, Canada, and Egypt on shipping scalable, user-centered digital products.";
  const resolvedCompaniesTitle =
    trustedCompaniesTitle ||
    settings?.trustedCompaniesTitle ||
    "DELIVERING IMPACT ACROSS KEY INDUSTRIES & GLOBAL MARKETS";
  const trustedCompanies =
    customCompanies && customCompanies.length > 0
      ? customCompanies
      : settings?.trustedCompanies && settings.trustedCompanies.length > 0
        ? settings.trustedCompanies
        : DEFAULT_COMPANIES;

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [autoRotateInterval, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setActiveIndex(
      (current) => (current - 1 + testimonials.length) % testimonials.length,
    );
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-label="Client Testimonials"
      className={cn(
        "relative w-full py-24 px-6 sm:px-12 lg:px-20 overflow-hidden bg-[#F3F5FB]",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-12 w-full lg:grid-cols-12 lg:gap-16 items-center"
        >
          {/* Left side: Heading and navigation */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div className="space-y-5">
              {resolvedBadge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.22em] font-semibold bg-[#3D5AFE]/10 text-[#3D5AFE] border border-[#3D5AFE]/20">
                  <Star className="h-3.5 w-3.5 fill-[#3D5AFE] text-[#3D5AFE]" />
                  <span>{resolvedBadge}</span>
                </div>
              )}

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-[#15172B] leading-[1.15] text-balance">
                {resolvedTitle}
              </h2>

              <p className="max-w-[580px] text-base sm:text-lg text-[#5A607F] leading-relaxed">
                {resolvedSubtitle}
              </p>

              <div className="flex items-center justify-between sm:justify-start gap-6 pt-3">
                <div className="flex items-center gap-2.5">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                        activeIndex === index
                          ? "w-10 bg-[#3D5AFE]"
                          : "w-2.5 bg-[#15172B]/20 hover:bg-[#15172B]/40",
                      )}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="w-10 h-10 rounded-full border border-[#E2E6F0] bg-white text-[#15172B] hover:border-[#3D5AFE] hover:text-[#3D5AFE] flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="w-10 h-10 rounded-full border border-[#E2E6F0] bg-white text-[#15172B] hover:border-[#3D5AFE] hover:text-[#3D5AFE] flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side: Testimonial cards */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-6 relative h-full min-h-[340px] sm:min-h-[360px] md:min-h-[380px]"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 80 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 80,
                  scale: activeIndex === index ? 1 : 0.94,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  zIndex: activeIndex === index ? 10 : 0,
                  pointerEvents: activeIndex === index ? "auto" : "none",
                }}
              >
                <div className="bg-white/95 backdrop-blur-md border border-[#E2E6F0] shadow-[0_20px_50px_rgba(21,23,43,0.06)] rounded-3xl p-7 sm:p-9 h-full flex flex-col justify-between">
                  <div>
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400"
                            />
                          ))}
                      </div>
                      <span className="font-mono text-xs text-[#5A607F]">
                        0{index + 1} / 0{testimonials.length}
                      </span>
                    </div>

                    <div className="relative mb-6">
                      <Quote className="absolute -top-3 -left-2 h-9 w-9 text-[#3D5AFE]/15 rotate-180 pointer-events-none" />
                      <p className="relative z-10 text-base sm:text-lg font-medium text-[#15172B] leading-relaxed">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div>
                    <Separator className="my-4 bg-[#E2E6F0]" />

                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border border-[#E2E6F0]">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback className="bg-[#3D5AFE]/10 text-[#3D5AFE] font-display font-bold">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-display font-bold text-[#15172B] text-base">
                          {testimonial.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5A607F]">
                          {testimonial.role}
                          {testimonial.role && testimonial.company ? " • " : ""}
                          <span className="text-[#3D5AFE] font-medium">
                            {testimonial.company}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="pointer-events-none absolute -bottom-5 -left-5 h-24 w-24 rounded-3xl bg-[#3D5AFE]/8 -z-10" />
            <div className="pointer-events-none absolute -top-5 -right-5 h-24 w-24 rounded-3xl bg-[#3D5AFE]/8 -z-10" />
          </motion.div>
        </motion.div>

        {trustedCompanies.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={controls}
            className="mt-20 pt-10 border-t border-[#E2E6F0] text-center"
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-[#5A607F] font-semibold mb-7">
              {resolvedCompaniesTitle}
            </h3>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {trustedCompanies.map((company) => (
                <div
                  key={company}
                  className="text-lg sm:text-xl font-display font-bold text-[#15172B]/40 hover:text-[#3D5AFE] transition-colors duration-200"
                >
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
