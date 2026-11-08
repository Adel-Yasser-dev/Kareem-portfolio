"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Premium Custom Black Cursor Component
 *
 * Architecture:
 * - Outer positioning containers track coordinates via translate3d(x, y, 0)
 * - Inner visual wrappers handle scale and color transforms
 * - Zero collision between requestAnimationFrame transforms and CSS transitions
 * - Fully persistent: never vanishes or flies away on hover or click
 * - Automatically disabled on touch / mobile devices via (pointer: fine)
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // Position references (avoid React state re-renders during 120fps loop)
  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only enable if device has a fine pointer (mouse / trackpad)
    const media = window.matchMedia("(pointer: fine)");
    if (!media.matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Show cursor as soon as mouse moves inside window
      setIsVisible(true);

      // Check if mouse is hovering an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest(
            "a, button, input, textarea, select, [role='button'], .cursor-pointer, [data-cursor-hover]",
          ),
        );
        setIsHovered(interactive);

        // Detect if cursor is inside navbar or any dark container
        const overDark = Boolean(
          target.closest(
            "header, nav, [data-theme='dark'], [data-cursor-light], .dark-glass, .dark",
          ),
        );
        setIsOverDark(overDark);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    // 120fps hardware-accelerated lerp loop
    let rafId: number;
    const render = () => {
      // Smooth 0.2 lerp interpolation for the outer ring
      ring.current.x += (mouse.current.x - ring.current.x) * 0.2;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.2;

      // Direct translate3d on outer containers (NO CSS transition on transform)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-[999999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Outer Fluid Following Ring: Wrapper handles position; inner child handles scale & color */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 -ml-[18px] -mt-[18px] pointer-events-none will-change-transform"
      >
        <div
          className={`w-[36px] h-[36px] rounded-full transition-all duration-200 ease-out ${
            isClicked
              ? isOverDark
                ? "scale-75 border-2 border-white bg-white/30"
                : "scale-75 border-2 border-[#15172B] bg-[#15172B]/20"
              : isHovered
                ? isOverDark
                  ? "scale-140 border-2 border-[#7C8FFF] bg-[#3D5AFE]/30 backdrop-blur-[1px]"
                  : "scale-140 border-2 border-[#3D5AFE] bg-[#3D5AFE]/12 backdrop-blur-[1px]"
                : isOverDark
                  ? "scale-100 border border-white/70 bg-white/10 backdrop-blur-[0.5px] shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                  : "scale-100 border border-[#15172B]/45 bg-[#15172B]/[0.04] backdrop-blur-[0.5px]"
          }`}
        />
      </div>

      {/* Center Precision Core Dot: Tracks 1:1 with mouse, white on dark surfaces & black on light */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 -ml-[4px] -mt-[4px] pointer-events-none will-change-transform"
      >
        <div
          className={`w-[8px] h-[8px] rounded-full transition-all duration-150 ease-out shadow-xs ${
            isHovered
              ? isOverDark
                ? "scale-60 bg-[#7C8FFF]"
                : "scale-60 bg-[#3D5AFE]"
              : isOverDark
                ? "scale-100 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                : "scale-100 bg-[#15172B]"
          }`}
        />
      </div>
    </div>
  );
}
