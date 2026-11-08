// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import {
  type CSSProperties,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Inline stand-in for @gsap/react's useGSAP. Mirrors its default
   `revertOnUpdate: false`: one gsap.context lives for the component's
   lifetime, the callback is re-added when dependencies change, and the
   context is reverted only on unmount. A callback may return its own
   cleanup, which runs before the next re-add and on unmount. */
function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[];
    scope?: { current: Element | null } | Element | null;
  },
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : (scope as Element | null);
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export type JourneyItem = {
  id: string;
  year: string;
  month: string;
  content: string;
};

export type TimelineProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  topItems?: JourneyItem[];
  bottomItems?: JourneyItem[];
  /** Reveal animation duration, in seconds. */
  duration?: number;
  /** Fallback reveal duration when `duration` is omitted, in seconds. */
  scrollDuration?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);

  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

const defaultTopJourneyData: JourneyItem[] = [
  {
    id: "childhood-spark",
    year: "Childhood",
    month: "Spark",
    content:
      "I found my passion for computers and video games, which sparked my lifelong curiosity about technology and visual design.",
  },
  {
    id: "2022-january",
    year: "2022",
    month: "January",
    content:
      "Transitioned into UI/UX design — mastering Figma, Adobe XD, Photoshop, Illustrator, and component libraries.",
  },
  {
    id: "2023-july",
    year: "2023",
    month: "July",
    content:
      "Earned Google UX Credential: 'Foundations of User Experience (UX) Design' on Coursera.",
  },
  {
    id: "2024-october",
    year: "2024",
    month: "October",
    content:
      "Over 15 diverse projects delivered across multiple industries, creating human-centered interfaces that scale.",
  },
];

const defaultBottomJourneyData: JourneyItem[] = [
  {
    id: "2019-september",
    year: "2019",
    month: "September",
    content:
      "Enrolled in Computer Science at Mansoura University — building strong programming fundamentals and algorithmic thinking in Python.",
  },
  {
    id: "2023-june",
    year: "2023",
    month: "June",
    content:
      "Graduated with Bachelor of Computer Science from Mansoura University, uniting engineering logic with design empathy.",
  },
  {
    id: "2023-august",
    year: "2023",
    month: "August",
    content:
      "Completed 'Start the UX Design Process: Empathize, Define, and Ideate' certification — mastering user research & wireframing.",
  },
];

export default function Timeline({
  id = "journey",
  title = "Kareem's Journey.",
  subtitle = "Where childhood gaming curiosity meets engineering logic and human-centered design.",
  eyebrow = "Career Path & Milestones",
  periodLabel = "Childhood — Present",
  textColor = "var(--color-foreground, #15172B)",
  mutedTextColor = "var(--color-muted-foreground, #6B7089)",
  activeColor = "#3D5AFE",
  backgroundColor = "var(--color-background, #F3F5FB)",
  imageUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  imageAlt = "Modern creative engineering studio",
  topItems = defaultTopJourneyData,
  bottomItems = defaultBottomJourneyData,
  duration,
  scrollDuration = 1.2,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const animationDuration = duration ?? scrollDuration;
  const normalizedDuration = Math.max(0.2, animationDuration);

  // Alternating items in sequence: Top 0 (Childhood), Bottom 0 (2019), Top 1 (2022), Bottom 1 (2023 Jun), Top 2 (2023 Jul), Bottom 2 (2023 Aug), Top 3 (2024 Oct)
  const allJourneyItems: JourneyItem[] = [];
  const maxItems = Math.max(topItems.length, bottomItems.length);
  for (let i = 0; i < maxItems; i++) {
    if (topItems[i]) allJourneyItems.push(topItems[i]);
    if (bottomItems[i]) allJourneyItems.push(bottomItems[i]);
  }

  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };
  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  };
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !wholeSliderRef.current) return;

      const isMobile = window.innerWidth < 600;
      const slidePercent = isMobile ? -86 : -78;
      const lineWidth = "100%";
      const slideEnd = isMobile ? "85% 50%" : "94% bottom";

      if (reducedMotion) {
        gsap.set(wholeSliderRef.current, { xPercent: 0 });
        gsap.set(".journey-line", { width: lineWidth });
        allJourneyItems.forEach((item) => {
          gsap.set(`.jl-${item.id}`, { scaleY: 1 });
          gsap.set(`.jd-${item.id}`, { scale: 1 });
          gsap.set(`.title-${item.id}`, { opacity: 1, y: 0 });
          gsap.set(`.description-${item.id}`, { opacity: 1, y: 0 });
        });
        return;
      }

      // Initial state: ALL milestones start hidden and reveal sequentially
      // as the active line with its ball travels to each milestone
      allJourneyItems.forEach((item) => {
        const isTop = topItems.some((topItem) => topItem.id === item.id);
        const lineSelector = `.jl-${item.id}`;

        gsap.set(lineSelector, {
          scaleY: 0,
          transformOrigin: isTop ? "bottom center" : "top center",
        });
        gsap.set(`.jd-${item.id}`, { scale: 0 });
        gsap.set(`.title-${item.id}`, { opacity: 0, y: isTop ? 14 : -14 });
        gsap.set(`.description-${item.id}`, {
          opacity: 0,
          y: isTop ? 14 : -14,
        });
      });

      // Master horizontal scrub timeline
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: slideEnd,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // 1. Horizontal slider travel
      mainTimeline.to(
        wholeSliderRef.current,
        {
          xPercent: slidePercent,
          ease: "none",
          duration: 100,
        },
        0,
      );

      // 2. Horizontal progress line with ball at its head
      mainTimeline.to(
        ".journey-line",
        {
          width: lineWidth,
          ease: "none",
          duration: 100,
        },
        0,
      );

      // 3. Sequenced milestones across generous travel intervals:
      // Each milestone has dedicated space and time to appear cleanly:
      // Item 0: t=4..15
      // Item 1: t=18..29
      // Item 2: t=32..43
      // Item 3: t=46..57
      // Item 4: t=60..71
      // Item 5: t=74..85
      // Item 6: t=88..98
      const itemWindows = [
        { start: 4, end: 15 },
        { start: 18, end: 29 },
        { start: 32, end: 43 },
        { start: 46, end: 57 },
        { start: 60, end: 71 },
        { start: 74, end: 85 },
        { start: 88, end: 98 },
      ];

      allJourneyItems.forEach((item, index) => {
        const win = itemWindows[index];
        if (!win) return;

        const lineSelector = `.jl-${item.id}`;
        const dotSelector = `.jd-${item.id}`;
        const titleSelector = `.title-${item.id}`;
        const descSelector = `.description-${item.id}`;

        const dur = win.end - win.start;
        const lineDur = dur * 0.45;
        const textDur = dur * 0.7;

        // Line expansion from timeline axis
        mainTimeline.to(
          lineSelector,
          {
            scaleY: 1,
            duration: lineDur,
            ease: "power1.out",
          },
          win.start,
        );

        // Ball pop at the card
        mainTimeline.to(
          dotSelector,
          {
            scale: 1,
            duration: lineDur,
            ease: "back.out(2)",
          },
          win.start + dur * 0.15,
        );

        // Title reveal
        mainTimeline.to(
          titleSelector,
          {
            opacity: 1,
            y: 0,
            duration: textDur,
            ease: "power2.out",
          },
          win.start + dur * 0.25,
        );

        // Description reveal
        mainTimeline.to(
          descSelector,
          {
            opacity: 1,
            y: 0,
            duration: textDur,
            ease: "power2.out",
          },
          win.start + dur * 0.35,
        );
      });

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className="h-[320vw] max-[600px]:h-[560vh] w-full relative select-none"
      style={sectionStyle}
    >
      <div className="h-screen w-screen sticky top-0 flex items-center overflow-hidden">
        <div
          ref={wholeSliderRef}
          className="mr-[2vw] flex h-[27vw] w-[430vw] items-center gap-[4vw] px-[4vw] max-[600px]:h-[80vh] max-[600px]:w-[960vw] max-[600px]:px-[6vw]"
        >
          {/* No-image Architectural Blueprint / Origin Card */}
          <div className="relative h-full w-[22vw] overflow-hidden rounded-[1.4vw] max-[600px]:h-[55vw] max-[600px]:w-[75vw] max-[600px]:rounded-[4vw] bg-white/85 backdrop-blur-md border border-[#DCE2EE] shadow-xs shrink-0 p-[1.8vw] max-[600px]:p-[5vw] flex flex-col justify-between">
            {/* Subtle blueprint grid background */}
            <div
              className="pointer-events-none absolute inset-0 opacity-45"
              style={{
                backgroundImage:
                  "radial-gradient(#3D5AFE 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />

            {/* Top tag & live status */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="font-mono text-[0.68vw] max-[600px]:text-[2.4vw] uppercase tracking-[0.22em] text-[#3D5AFE] font-semibold px-[0.7vw] py-[0.25vw] rounded-full bg-[#3D5AFE]/10">
                Blueprint
              </span>
              <span className="font-mono text-[0.72vw] max-[600px]:text-[2.5vw] text-[#6B7089] font-medium">
                01 — 07
              </span>
            </div>

            {/* Center typographic emblem */}
            <div className="relative z-10 my-auto py-[1vw]">
              <div className="font-display font-extrabold text-[3.2vw] max-[600px]:text-[9vw] leading-none tracking-tight text-[#15172B]">
                CS <span className="text-[#3D5AFE]">×</span> UX
              </div>
              <p className="mt-[0.5vw] text-[0.82vw] max-[600px]:text-[3vw] text-[#6B7089] leading-snug">
                Algorithmic logic meets human-centered product craft.
              </p>
            </div>

            {/* Bottom career coordinates */}
            <div className="relative z-10 pt-[0.9vw] border-t border-[#E2E6F0] flex items-center justify-between font-mono text-[0.68vw] max-[600px]:text-[2.4vw] text-[#15172B]/80">
              <span>B.Sc. Computer Science</span>
              <span className="text-[#3D5AFE] font-bold">→</span>
              <span>30+ Products</span>
            </div>
          </div>

          <div className="relative h-full w-full">
            {/* Center horizontal timeline axis: single traveling circle anchored at the end of the line */}
            <div className="w-full absolute left-0 top-[50%] translate-y-[-50%] flex items-center h-fit pointer-events-none">
              <div
                className="relative h-[2px] w-[0%] rounded-full journey-line shrink-0"
                style={activeStyle}
              >
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-[0.9vw] max-[600px]:size-[2.4vw] rounded-full shadow-sm"
                  style={activeStyle}
                />
              </div>
            </div>

            {/* Top row */}
            <div className="flex h-1/2 w-full items-center justify-start">
              {/* Kareem's Journey title card: generous w-[28vw] width */}
              <div className="h-full w-[28vw] flex flex-col justify-end pb-[3.5vw] shrink-0 max-[600px]:w-[80vw]">
                {eyebrow && (
                  <span className="font-mono text-[0.72vw] max-[600px]:text-[2.6vw] tracking-[0.25em] uppercase text-[#3D5AFE] font-bold mb-[0.4vw]">
                    {eyebrow}
                  </span>
                )}
                <h2 className="w-full font-display font-extrabold text-[2.2vw] leading-[1.12] max-[600px]:text-[6.5vw] text-[#15172B]">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-[0.5vw] w-full text-[0.85vw] max-[600px]:text-[3vw] text-[#6B7089] leading-[1.45] line-clamp-3">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Increased spacing rhythm: gap-x-[80vw] with 54vw alternating milestone pitch */}
              <div className="flex h-full gap-x-[80vw] ml-[14vw] max-[600px]:gap-x-[120vw] max-[600px]:ml-[20vw] shrink-0">
                {topItems.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative h-full w-[28vw] px-[1.5vw] shrink-0 max-[600px]:flex max-[600px]:w-[74vw] max-[600px]:flex-col max-[600px]:px-[5vw]"
                  >
                    {/* Centered vertical stem & ball marker: 5.5vw height anchored directly to center axis */}
                    <div className="absolute left-0 bottom-0 flex flex-col items-center translate-x-[-50%] pointer-events-none">
                      <div
                        className={`size-[0.85vw] max-[600px]:size-[2.4vw] rounded-full jd-${item.id} shadow-sm z-20 shrink-0`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`w-[2px] h-[5.5vw] max-[600px]:h-[9vw] origin-bottom rounded-full jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    <div className="flex h-full w-full flex-col justify-end pb-[3.5vw] pl-[2.2vw] space-y-[0.4vw]">
                      <h4
                        className={`title-${item.id} font-display font-bold text-[1.7vw] leading-tight max-[600px]:text-[5.2vw] text-[#15172B]`}
                      >
                        {item.year} {item.month}
                      </h4>
                      <p
                        className={`description-${item.id} w-full text-[0.95vw] leading-[1.45] max-[600px]:text-[3.8vw] line-clamp-3 text-[#6B7089]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div className="h-1/2 flex items-center justify-start w-full">
              {/* Bottom period label card: matching w-[28vw] width */}
              <div className="h-full w-[28vw] flex flex-col justify-start pt-[3.5vw] shrink-0 max-[600px]:w-[80vw]">
                <div className="flex items-center gap-[0.5vw]">
                  <span className="w-[0.45vw] h-[0.45vw] rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                  <p className="font-mono text-[0.95vw] leading-none max-[600px]:text-[3.6vw] font-semibold tracking-wider uppercase text-[#3D5AFE]">
                    {periodLabel}
                  </p>
                </div>
                <p className="mt-[0.5vw] text-[0.82vw] max-[600px]:text-[2.8vw] text-[#6B7089] leading-snug">
                  7 defining milestones across curiosity, degree & 15+ shipped
                  digital products.
                </p>
              </div>

              {/* ml-[68vw] places bottom items precisely at the 54vw midpoint between top items */}
              <div className="flex h-full gap-x-[80vw] ml-[68vw] max-[600px]:gap-x-[120vw] max-[600px]:ml-[80vw] shrink-0">
                {bottomItems.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative h-full w-[28vw] px-[1.5vw] shrink-0 max-[600px]:w-[74vw] max-[600px]:px-[5vw]"
                  >
                    {/* Centered vertical stem & ball marker: 4.5vw height anchored directly to center axis */}
                    <div className="absolute left-0 top-0 flex flex-col items-center translate-x-[-50%] pointer-events-none">
                      <div
                        className={`w-[2px] h-[4.5vw] max-[600px]:h-[8vw] origin-top rounded-full jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`size-[0.85vw] max-[600px]:size-[2.4vw] rounded-full jd-${item.id} shadow-sm z-20 shrink-0`}
                        style={activeStyle}
                      ></div>
                    </div>

                    <div className="flex h-full w-full flex-col justify-start pt-[3.5vw] pl-[2.2vw] space-y-[0.4vw]">
                      <h4
                        className={`title-${item.id} font-display font-bold text-[1.7vw] leading-tight max-[600px]:text-[5.2vw] text-[#15172B]`}
                      >
                        {item.year} {item.month}
                      </h4>
                      <p
                        className={`description-${item.id} w-full text-[0.95vw] leading-[1.45] max-[600px]:text-[3.8vw] line-clamp-3 text-[#6B7089]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
