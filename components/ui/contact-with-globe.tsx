"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Mail,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as d3 from "d3";
import { feature } from "topojson-client";
import type {
  Topology,
  GeometryCollection,
} from "topojson-specification";
import type { GeoPermissibleObjects } from "d3";
import type { SanityContactLink, SanitySiteSettings } from "@/sanity/queries";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

const CONTACT_ICON_MAP = {
  mail: Mail,
  mappin: MapPin,
  clock: Clock,
  phone: Phone,
} as const;

const DEFAULT_CONTACT_LINKS: SanityContactLink[] = [
  {
    icon: "mail",
    label: "contact@kareem.dev",
    href: "mailto:contact@kareem.dev",
  },
  {
    icon: "mappin",
    label: "Cairo, Egypt • Remote Worldwide (UAE, Canada, EU)",
    href: "#contact",
  },
  {
    icon: "clock",
    label: "GMT+3 • Available for full-time & select freelance",
    href: "mailto:contact@kareem.dev?subject=Project%20Inquiry%20for%20Kareem",
  },
];

interface GlobeWireframeProps {
  width?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  graticuleColor?: string;
  graticuleOpacity?: number;
  sphereOutlineColor?: string;
  sphereOutlineWidth?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  initialRotation?: [number, number];
  enableInteraction?: boolean;
  showGraticule?: boolean;
  countryFillColor?: string;
  scale?: number;
}

interface WorldAtlasTopology extends Topology {
  objects: {
    countries: GeometryCollection;
    land?: GeometryCollection;
  };
}

let cachedWorldGeo: GeoPermissibleObjects | null = null;

function GlobeWireframe({
  width,
  height,
  className = "aspect-square w-full max-w-150",
  strokeColor = "#3D5AFE",
  strokeWidth = 0.75,
  graticuleColor = "#15172B",
  graticuleOpacity = 0.1,
  sphereOutlineColor = "#3D5AFE",
  sphereOutlineWidth = 1.2,
  autoRotate = true,
  autoRotateSpeed = 0.35,
  initialRotation = [-31.23, -25.0],
  enableInteraction = true,
  showGraticule = true,
  countryFillColor = "rgba(61, 90, 254, 0.05)",
  scale = 1,
}: GlobeWireframeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDraggingUI, setIsDraggingUI] = useState(false);

  const rotationRef = useRef<[number, number]>(initialRotation);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef<[number, number]>([0, 0]);
  const isVisibleRef = useRef(false);
  const drawFrameRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const graticuleGeo = d3.geoGraticule().step([15, 15])();
    const sphereGeo: GeoPermissibleObjects = { type: "Sphere" };

    const projection = d3
      .geoOrthographic()
      .precision(0.6)
      .rotate([rotationRef.current[0], rotationRef.current[1]]);
    const pathGenerator = d3.geoPath(projection, ctx);

    let cssWidth = width || container.offsetWidth || 320;
    let cssHeight = height || cssWidth;

    const updateSize = () => {
      if (!container || !canvas) return;
      cssWidth = width || container.offsetWidth || 320;
      cssHeight = height || cssWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const radius = (Math.min(cssWidth, cssHeight) / 2) * scale * 0.9;
      projection.scale(radius).translate([cssWidth / 2, cssHeight / 2]);
    };

    const draw = () => {
      if (!ctx || !cachedWorldGeo || cssWidth === 0) return;

      ctx.clearRect(0, 0, cssWidth, cssHeight);
      projection.rotate([rotationRef.current[0], rotationRef.current[1]]);

      if (showGraticule && graticuleOpacity > 0) {
        ctx.beginPath();
        pathGenerator(graticuleGeo);
        ctx.strokeStyle = graticuleColor;
        ctx.globalAlpha = graticuleOpacity;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      ctx.beginPath();
      pathGenerator(cachedWorldGeo);
      if (countryFillColor && countryFillColor !== "none") {
        ctx.fillStyle = countryFillColor;
        ctx.globalAlpha = 1;
        ctx.fill();
      }
      ctx.strokeStyle = strokeColor;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();

      ctx.beginPath();
      pathGenerator(sphereGeo);
      ctx.strokeStyle = sphereOutlineColor;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = sphereOutlineWidth;
      ctx.stroke();

      ctx.globalAlpha = 1;
    };

    drawFrameRef.current = draw;
    updateSize();

    const initData = async () => {
      if (!cachedWorldGeo) {
        try {
          const response = await fetch(
            "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
          );
          const world = (await response.json()) as WorldAtlasTopology;
          cachedWorldGeo = feature(
            world,
            world.objects.countries,
          ) as unknown as GeoPermissibleObjects;
        } catch {
          cachedWorldGeo = sphereGeo;
        }
      }
      if (isMounted) {
        setIsReady(true);
        draw();
      }
    };

    initData();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
      draw();
    });
    resizeObserver.observe(container);

    let rafId: number | null = null;
    let lastTick = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const animate = (now: number) => {
      if (!isVisibleRef.current || document.hidden) {
        rafId = null;
        return;
      }

      if (!isDraggingRef.current && autoRotate && !prefersReducedMotion) {
        if (now - lastTick >= FRAME_INTERVAL) {
          const dt = Math.min((now - lastTick) / 16.67, 3);
          rotationRef.current = [
            (rotationRef.current[0] + autoRotateSpeed * dt) % 360,
            rotationRef.current[1],
          ];
          draw();
          lastTick = now;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (rafId === null && isVisibleRef.current && !prefersReducedMotion) {
        lastTick = performance.now();
        rafId = requestAnimationFrame(animate);
      }
    };

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          draw();
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (isVisibleRef.current) {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    width,
    height,
    scale,
    strokeColor,
    strokeWidth,
    graticuleColor,
    graticuleOpacity,
    sphereOutlineColor,
    sphereOutlineWidth,
    showGraticule,
    countryFillColor,
    autoRotate,
    autoRotateSpeed,
  ]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enableInteraction) return;
    isDraggingRef.current = true;
    setIsDraggingUI(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    lastMouseRef.current = [event.clientX, event.clientY];
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !enableInteraction) return;
    const dx = event.clientX - lastMouseRef.current[0];
    const dy = event.clientY - lastMouseRef.current[1];
    lastMouseRef.current = [event.clientX, event.clientY];

    rotationRef.current = [
      rotationRef.current[0] + dx * 0.45,
      Math.max(-85, Math.min(85, rotationRef.current[1] - dy * 0.45)),
    ];
    drawFrameRef.current?.();
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingUI(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "w-full h-full block touch-pan-y transition-opacity duration-700",
          isReady ? "opacity-100" : "opacity-0",
        )}
        style={{
          cursor: enableInteraction
            ? isDraggingUI
              ? "grabbing"
              : "grab"
            : "default",
        }}
      />
    </div>
  );
}

const FormDots = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => {
    const isHorizontal = orientation === "horizontal";
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 flex items-center justify-center overflow-hidden",
          isHorizontal ? "w-full" : "h-full",
          className,
        )}
        {...props}
      >
        <div
          className={cn("relative", isHorizontal ? "w-full h-4" : "h-full w-4")}
        >
          <div
            className={cn("absolute inset-0 bg-repeat text-[#15172B]/25")}
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
              backgroundSize: isHorizontal ? "6px 100%" : "100% 6px",
              maskImage: isHorizontal
                ? "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
                : "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          />
        </div>
      </SeparatorPrimitive.Root>
    );
  },
);
FormDots.displayName = "FormDots";

interface ContactWithGlobeProps {
  title?: string;
  subtitle?: string;
  description?: string;
  settings?: SanitySiteSettings | null;
  className?: string;
}

export default function ContactWithGlobe({
  title,
  subtitle,
  description,
  settings,
  className,
}: ContactWithGlobeProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const resolvedSubtitle =
    subtitle || settings?.contactSubtitle || "Get In Touch";
  const resolvedTitle =
    title ||
    settings?.contactTitle ||
    "Let's build your next digital product together.";
  const resolvedDescription =
    description ||
    settings?.contactDescription ||
    "Have a product idea, design system challenge, or remote UI/UX role in mind? Drop a message and let's turn complex workflows into clear, user-centered experiences.";
  const resolvedChannelsHeading =
    settings?.contactChannelsHeading || "Direct Channels & Global Reach";
  const resolvedChannelsDescription =
    settings?.contactChannelsDescription ||
    "Collaborating with product teams across time zones. Reach out directly or drag the globe below—I typically reply within 24 hours.";

  const targetEmail = settings?.email || "contact@kareem.dev";

  const contactLinks: SanityContactLink[] =
    settings?.contactLinks && settings.contactLinks.length > 0
      ? settings.contactLinks
      : settings?.email || settings?.location || settings?.timezone
        ? [
            {
              icon: "mail",
              label: targetEmail,
              href: `mailto:${targetEmail}`,
            },
            {
              icon: "mappin",
              label:
                settings?.location ||
                "Cairo, Egypt • Remote Worldwide (UAE, Canada, EU)",
              href: "#contact",
            },
            {
              icon: "clock",
              label:
                settings?.timezone ||
                "GMT+3 • Available for full-time & select freelance",
              href: `mailto:${targetEmail}?subject=Project%20Inquiry`,
            },
            ...(settings?.phone
              ? [
                  {
                    icon: "phone" as const,
                    label: settings.phone,
                    href: `tel:${settings.phone}`,
                  },
                ]
              : []),
          ]
        : DEFAULT_CONTACT_LINKS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const subject = encodeURIComponent(
      `Portfolio Inquiry from ${formState.name || "Client"}${formState.company ? ` (${formState.company})` : ""}`,
    );
    const body = encodeURIComponent(
      `Name: ${formState.name}\nCompany: ${formState.company}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`,
    );
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      id="contact"
      aria-label={`Contact ${settings?.fullName || "Kareem Yasser Ebaid"}`}
      className={cn(
        "relative w-full bg-[#F3F5FB] overflow-hidden py-24 px-6 sm:px-12 lg:px-20 border-t border-[#E2E6F0]",
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D5AFE]/10 border border-[#3D5AFE]/25"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3D5AFE]" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#3D5AFE] font-semibold">
              {resolvedSubtitle}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#15172B] tracking-tight max-w-3xl text-balance leading-[1.12]"
          >
            {resolvedTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="text-base sm:text-lg text-[#5A607F] max-w-xl leading-relaxed"
          >
            {resolvedDescription}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 max-w-6xl mx-auto items-start">
          {/* Left Column: Contact Details & Interactive 3D Globe */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-[#15172B]">
                {resolvedChannelsHeading}
              </h3>
              <p className="text-sm sm:text-base text-[#5A607F] leading-relaxed max-w-md">
                {resolvedChannelsDescription}
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              {contactLinks.map((item, i) => {
                const Icon =
                  CONTACT_ICON_MAP[item.icon || "mail"] || Mail;
                return (
                  <motion.a
                    key={item._key || item.label || i}
                    href={item.href || "#contact"}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + i * 0.1,
                      ease: smoothEase,
                    }}
                    className="group flex items-center gap-3.5 w-fit text-sm sm:text-base text-[#5A607F] hover:text-[#15172B] transition-colors duration-200"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E6F0] group-hover:border-[#3D5AFE]/40 group-hover:bg-[#3D5AFE]/10 flex items-center justify-center shrink-0 transition-all duration-200 shadow-2xs">
                      <Icon className="w-4 h-4 text-[#5A607F] group-hover:text-[#3D5AFE] transition-colors duration-200" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </motion.a>
                );
              })}
            </div>

            <div className="relative overflow-hidden h-64 sm:h-72 rounded-3xl bg-white/60 border border-[#E2E6F0]/80 p-2">
              <GlobeWireframe
                className="w-full aspect-square max-w-full absolute -top-4 left-0"
                autoRotate
                autoRotateSpeed={0.35}
                strokeColor="#3D5AFE"
                graticuleColor="#15172B"
                sphereOutlineColor="#3D5AFE"
                strokeWidth={0.75}
                graticuleOpacity={0.1}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#F3F5FB] via-[#F3F5FB]/70 to-transparent" />
            </div>
          </motion.div>

          {/* Right Column: Contact Form Card */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="rounded-3xl border border-[#E2E6F0] bg-white shadow-[0_20px_50px_rgba(21,23,43,0.06)] p-6 sm:p-9 flex flex-col gap-5"
          >
            <div>
              <h3 className="text-xl font-bold font-display text-[#15172B] mb-1">
                Send a message
              </h3>
              <p className="text-sm text-[#5A607F]">
                Share a bit about your project, timeline, or team goals.
              </p>
            </div>

            <FormDots />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] font-semibold tracking-widest uppercase text-[#5A607F]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, name: e.target.value }))
                  }
                  placeholder="Alex Morgan"
                  className="w-full bg-[#F3F5FB]/70 border border-[#E2E6F0] rounded-xl px-4 py-2.5 text-sm text-[#15172B] placeholder:text-[#5A607F]/50 outline-none focus:bg-white focus:border-[#3D5AFE] focus:ring-3 focus:ring-[#3D5AFE]/15 transition-all duration-200"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] font-semibold tracking-widest uppercase text-[#5A607F]">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={formState.company}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, company: e.target.value }))
                  }
                  placeholder="Acme Product Studio"
                  className="w-full bg-[#F3F5FB]/70 border border-[#E2E6F0] rounded-xl px-4 py-2.5 text-sm text-[#15172B] placeholder:text-[#5A607F]/50 outline-none focus:bg-white focus:border-[#3D5AFE] focus:ring-3 focus:ring-[#3D5AFE]/15 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] font-semibold tracking-widest uppercase text-[#5A607F]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, email: e.target.value }))
                }
                placeholder="alex@company.com"
                className="w-full bg-[#F3F5FB]/70 border border-[#E2E6F0] rounded-xl px-4 py-2.5 text-sm text-[#15172B] placeholder:text-[#5A607F]/50 outline-none focus:bg-white focus:border-[#3D5AFE] focus:ring-3 focus:ring-[#3D5AFE]/15 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] font-semibold tracking-widest uppercase text-[#5A607F]">
                Project Details / Message
              </label>
              <textarea
                required
                value={formState.message}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, message: e.target.value }))
                }
                placeholder="Tell me about the product, timeline, and what you're looking to achieve..."
                rows={4}
                className="w-full bg-[#F3F5FB]/70 border border-[#E2E6F0] rounded-xl px-4 py-3 text-sm text-[#15172B] placeholder:text-[#5A607F]/50 outline-none focus:bg-white focus:border-[#3D5AFE] focus:ring-3 focus:ring-[#3D5AFE]/15 resize-none transition-all duration-200"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <Button
                type="submit"
                className="w-fit h-11 px-7 rounded-full font-semibold text-sm bg-[#15172B] hover:bg-[#3D5AFE] text-white transition-all duration-200 shadow-md hover:shadow-lg group cursor-pointer"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                    <span>Opening Mail Client...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <span className="text-xs text-[#5A607F] hidden sm:inline-block">
                Replies within 24 hours
              </span>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
