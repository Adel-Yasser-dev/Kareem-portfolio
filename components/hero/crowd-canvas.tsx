"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface Walker {
  sx: number;
  sy: number;
  w: number;
  h: number;
  x: number;
  y: number;
  s: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
  base: number;
  c: number;
}

interface CrowdCanvasProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  textRef: React.RefObject<HTMLDivElement | null>;
}

export function CrowdCanvas({ containerRef, textRef }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const rows = 12;
    const cols = 6;
    const tw = 150;
    const th = 320;
    const P = 12;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Offscreen sprite sheets: full-body line-art walkers, thin outlines
    function mk(): HTMLCanvasElement {
      const c = document.createElement("canvas");
      c.width = rows * (tw + P);
      c.height = cols * (th + P);
      return c;
    }

    const sp = mk();
    const sc = mk();
    let s: CanvasRenderingContext2D;
    const ink = "#0a0a0a";
    const W = "#ffffff";
    const LW = 2.5;

    function R(i: number, k: number): number {
      const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
      return x - Math.floor(x);
    }

    function pl(pts: [number, number][], w: number, c: string) {
      s.lineJoin = "round";
      s.lineCap = "round";
      const passes: [number, string][] = [
        [w + LW * 2, ink],
        [w, c],
      ];
      passes.forEach(([lineW, strokeC]) => {
        s.lineWidth = lineW;
        s.strokeStyle = strokeC;
        s.beginPath();
        s.moveTo(pts[0][0], pts[0][1]);
        for (let q = 1; q < pts.length; q++) {
          s.lineTo(pts[q][0], pts[q][1]);
        }
        s.stroke();
      });
      s.lineWidth = LW;
      s.strokeStyle = ink;
    }

    function fs(c: string) {
      s.fillStyle = c;
      s.fill();
      s.stroke();
    }

    function el(
      x: number,
      y: number,
      rx: number,
      ry: number,
      c: string,
      r: number = 0,
    ) {
      s.beginPath();
      s.ellipse(x, y, rx, ry, r, 0, 7);
      fs(c);
    }

    function top(x: number, y: number, rx: number, ry: number, c: string) {
      s.beginPath();
      s.ellipse(x, y, rx, ry, 0, Math.PI, 0);
      s.closePath();
      fs(c);
    }

    function ln(a: number, b: number, c: number, d: number, col?: string) {
      s.strokeStyle = col || ink;
      s.beginPath();
      s.moveTo(a, b);
      s.lineTo(c, d);
      s.stroke();
      s.strokeStyle = ink;
    }

    function rect(
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
      c: string,
    ) {
      s.beginPath();
      if ("roundRect" in s && typeof s.roundRect === "function") {
        s.roundRect(x, y, w, h, r);
      } else {
        s.rect(x, y, w, h);
      }
      fs(c);
    }

    function sheet(cnv: HTMLCanvasElement, col: boolean) {
      const context = cnv.getContext("2d");
      if (!context) return;
      s = context;

      for (let i = 0; i < rows * cols; i++) {
        const ox = (i % rows) * (tw + P) + P / 2;
        const oy = Math.floor(i / rows) * (th + P) + P / 2;
        const a = 0.6 + R(i, 1) * 0.5;
        const b = 0.5 + R(i, 2) * 0.6;
        const of = Math.floor(R(i, 3) * 6);
        const pt = Math.floor(R(i, 4) * 4); // 0: slim chino, 1: denim, 2: tailored pleat, 3: shorts/athletic
        const hs = Math.floor(R(i, 5) * 8);
        const it = Math.floor(R(i, 6) * 5); // 0: walker/coffee, 1: phone, 2: laptop, 3: crossbody, 4: backpack
        const isPhone = it === 1;
        const hasCoffee = (it === 0 || it === 3) && R(i, 16) < 0.45;
        const hasTote = it === 0 && !hasCoffee && R(i, 21) < 0.35;
        const gl = R(i, 7) < 0.32;
        const sh = R(i, 8) < 0.5 ? ink : W;
        const P6 = [
          "#3D5AFE",
          "#FFA8CB",
          "#FFE45C",
          "#9BE8C8",
          "#C9BBFF",
          "#FF9E7A",
        ];
        const c1 = P6[Math.floor(R(i, 13) * 6)];
        const sknList = ["#FFE0C8", "#F2C29B", "#D9A06F", "#B57B52", "#7D4E2D"];
        const skn = col ? sknList[Math.floor(R(i, 11) * sknList.length)] : W;
        const hcList = [
          "#1E1E24",
          "#3D2B1F",
          "#6B4226",
          "#B8860B",
          "#D4A373",
          "#E6C280",
          "#22252A",
        ];
        const hc = col ? hcList[Math.floor(R(i, 12) * hcList.length)] : ink;
        const cc = col ? c1 : of === 1 || of === 2 || of === 5 ? W : ink;
        const legCList = [
          "#1F2E4D",
          "#3B5998",
          "#2A2D34",
          "#E8E2D5",
          "#151722",
          "#3E4A3D",
        ];
        const legC = col
          ? legCList[Math.floor(R(i, 14) * legCList.length)]
          : pt === 1
            ? W
            : ink;
        const hipY = -118;
        const hx = 6;
        const hy = isPhone ? -258 : -262;

        s.save();
        s.beginPath();
        s.rect(ox, oy, tw, th);
        s.clip();
        s.translate(ox + tw / 2, oy + th - 4);
        s.lineWidth = LW;
        s.strokeStyle = ink;

        /* --- REALISTIC ANATOMICAL SNEAKER ROUTINE --- */
        function drawSneaker(
          ax: number,
          ay: number,
          isFront: boolean,
          upperColor: string,
        ) {
          // Ground contact shadow directly on the ground plane (y = 0)
          s.save();
          const shadowX = isFront ? ax + 6 : ax + 7;
          const shadowW = isFront ? 16 : 12;
          s.beginPath();
          s.ellipse(shadowX, 0.8, shadowW, 2.4, 0, 0, Math.PI * 2);
          s.fillStyle = col
            ? "rgba(15, 20, 35, 0.16)"
            : "rgba(10, 10, 10, 0.2)";
          s.fill();
          s.restore();

          s.save();
          // Anchor at ankle (ax, ay):
          // Front foot planted (-0.03 rad); back foot pushes off with heel lifted (+0.24 rad clockwise)
          const angle = isFront ? -0.03 : 0.24;
          s.translate(ax, ay);
          s.rotate(angle);

          const gumSole = col && R(i, 18) < 0.42;
          const soleColor = gumSole ? "#C98F5B" : W;
          const stripeColor =
            upperColor === ink ? (col ? c1 : W) : col ? c1 : ink;
          const detailInk = upperColor === ink ? W : ink;

          // 1. Main Sneaker Upper (Ankle opening centered at (0,0) so leg/sock tucks naturally inside)
          s.beginPath();
          s.moveTo(-8, -0.5); // Back Achilles collar
          s.quadraticCurveTo(-9.5, 2.5, -9, 6); // Sculpted heel counter
          s.lineTo(21, 6); // Base of upper along midsole
          s.quadraticCurveTo(22.5, 2, 18, 0); // Sleek rounded toe box
          s.quadraticCurveTo(11, -1, 5.5, -4); // Instep / throat ramp
          s.lineTo(2, -2.5); // Padded tongue peak
          s.quadraticCurveTo(-2.5, 1.2, -8, -0.5); // Anatomical ankle collar scoop
          s.closePath();
          fs(upperColor);

          // Fine line weight for internal sneaker craft details
          s.lineWidth = 1.4;

          // 2. Suede Toe Cap & Heel Counter Stitch Panels
          s.beginPath();
          s.moveTo(13.5, 6);
          s.quadraticCurveTo(14.5, 1.5, 19, 0.5);
          s.strokeStyle = detailInk;
          s.stroke();

          // Heel counter curve & pull tab
          s.beginPath();
          s.moveTo(-4, 6);
          s.quadraticCurveTo(-4.5, 2, -8.2, 1);
          s.stroke();
          rect(-9.2, -2.2, 2.6, 3.2, 0.8, stripeColor);

          // 3. Athletic Side Stripe (clean vector swoosh/chevron)
          s.save();
          s.lineWidth = 2.2;
          s.strokeStyle = stripeColor;
          s.beginPath();
          s.moveTo(-2.5, 4.2);
          s.quadraticCurveTo(3.5, 1.2, 8.5, 2.5);
          s.stroke();
          s.restore();

          // 4. Criss-Cross Laces along throat
          s.lineWidth = 1.3;
          ln(4.5, -2.2, 7.2, 0, detailInk);
          ln(7, -1.2, 9.6, 0.8, detailInk);
          ln(9.5, -0.3, 12, 1.5, detailInk);

          // 5. Sculpted Midsole & Outsole Tread (y = 5.5 to y = 9.4)
          s.lineWidth = LW;
          s.strokeStyle = ink;
          s.beginPath();
          s.moveTo(-9, 5.5);
          s.lineTo(21, 5.5);
          s.quadraticCurveTo(22.8, 6.2, 21.5, 9); // Toe bumper rocker
          s.lineTo(-8.2, 9.4);
          s.quadraticCurveTo(-9.6, 9, -9, 5.5);
          s.closePath();
          fs(soleColor);

          // Midsole foxing line & outsole traction notches
          s.lineWidth = 1.2;
          ln(-7.5, 7.4, 19.5, 7.3, ink);
          ln(-5, 7.4, -5, 9.2, ink);
          ln(1, 7.4, 1, 9.2, ink);
          ln(7, 7.4, 7, 9.2, ink);
          ln(13, 7.4, 13, 9.1, ink);

          s.lineWidth = LW;
          s.strokeStyle = ink;
          s.restore();
        }

        /* --- REALISTIC SCULPTED ANATOMICAL LEG ROUTINE --- */
        function drawLeg(
          pts: [number, number][],
          colCode: string,
          isFront: boolean,
          pType: number,
        ) {
          const [hip, knee, ankle] = pts;
          const [hxL, hyL] = hip;
          const [kxL, kyL] = knee;
          const [axL, ayL] = ankle;

          // Upper leg (thigh: hip -> knee) unit vector & perpendicular normal
          const dxUp = kxL - hxL;
          const dyUp = kyL - hyL;
          const lenUp = Math.hypot(dxUp, dyUp) || 1;
          const uxUp = dxUp / lenUp;
          const uyUp = dyUp / lenUp;
          const nxUp = -uyUp; // Points forward (+X when leg goes down)
          const nyUp = uxUp;

          // Lower leg (shin/calf: knee -> ankle) unit vector & perpendicular normal
          const dxLow = axL - kxL;
          const dyLow = ayL - kyL;
          const lenLow = Math.hypot(dxLow, dyLow) || 1;
          const uxLow = dxLow / lenLow;
          const uyLow = dyLow / lenLow;
          const nxLow = -uyLow; // Points forward (shin side)
          const nyLow = uxLow;

          // 1. Ribbed Athletic Crew Sock (aligned with lower leg vector, tucks into sneaker collar)
          const sockTopX = axL - uxLow * 13;
          const sockTopY = ayL - uyLow * 13;
          const sockBotX = axL + uxLow * 1.5;
          const sockBotY = ayL + uyLow * 1.5;
          const sockC = col && R(i, 19) < 0.35 ? c1 : W;

          s.beginPath();
          s.moveTo(sockTopX - nxLow * 4.5, sockTopY - nyLow * 4.5);
          s.lineTo(sockBotX - nxLow * 4.2, sockBotY - nyLow * 4.2);
          s.lineTo(sockBotX + nxLow * 4.2, sockBotY + nyLow * 4.2);
          s.lineTo(sockTopX + nxLow * 4.5, sockTopY + nyLow * 4.5);
          s.closePath();
          fs(sockC);

          // Dual athletic sock stripes perpendicular to shin
          if (sockC === W) {
            s.lineWidth = 1.4;
            const s1x = axL - uxLow * 10;
            const s1y = ayL - uyLow * 10;
            const s2x = axL - uxLow * 7.5;
            const s2y = ayL - uyLow * 7.5;
            ln(
              s1x - nxLow * 4.3,
              s1y - nyLow * 4.3,
              s1x + nxLow * 4.3,
              s1y + nyLow * 4.3,
              col ? c1 : ink,
            );
            ln(
              s2x - nxLow * 4.3,
              s2y - nyLow * 4.3,
              s2x + nxLow * 4.3,
              s2y + nyLow * 4.3,
              col ? c1 : ink,
            );
            s.lineWidth = LW;
          }

          if (pType === 3) {
            // --- SHORTS + SCULPTED BARE ANATOMICAL LEG (QUADS, KNEE, CALF, SHIN) ---
            const calfPeakX = kxL + dxLow * 0.36;
            const calfPeakY = kyL + dyLow * 0.36;
            const achillesX = kxL + dxLow * 0.78;
            const achillesY = kyL + dyLow * 0.78;

            s.beginPath();
            // Back of thigh (hamstring)
            s.moveTo(hxL - nxUp * 7.5, hyL - nyUp * 7.5);
            s.lineTo(kxL - nxUp * 5.8, kyL - nyUp * 5.8);
            // Sculpted gastrocnemius (calf muscle belly) tapering to Achilles tendon
            s.bezierCurveTo(
              calfPeakX - nxLow * 7.8,
              calfPeakY - nyLow * 7.8,
              achillesX - nxLow * 5.2,
              achillesY - nyLow * 5.2,
              sockTopX - nxLow * 4.5,
              sockTopY - nyLow * 4.5,
            );
            // Across sock top
            s.lineTo(sockTopX + nxLow * 4.5, sockTopY + nyLow * 4.5);
            // Front shin bone up to patella (kneecap)
            s.quadraticCurveTo(
              kxL + dxLow * 0.5 + nxLow * 5.2,
              kyL + dyLow * 0.5 + nyLow * 5.2,
              kxL + nxLow * 6.2,
              kyL + nyLow * 6.2,
            );
            // Front quadriceps curve up to hip
            s.quadraticCurveTo(
              (hxL + kxL) * 0.5 + nxUp * 8.2,
              (hyL + kyL) * 0.5 + nyUp * 8.2,
              hxL + nxUp * 8,
              hyL + nyUp * 8,
            );
            s.closePath();
            fs(skn);

            // Subtle kneecap (patella) & calf definition line
            s.lineWidth = 1.4;
            s.beginPath();
            s.arc(kxL + nxLow * 3.5, kyL + nyLow * 3.5, 2.5, -0.8, 0.9);
            s.stroke();
            s.lineWidth = LW;

            // Tailored Shorts Sleeve aligned with thigh vector
            const shEndX = hxL + dxUp * 0.58;
            const shEndY = hyL + dyUp * 0.58;
            s.beginPath();
            s.moveTo(hxL - nxUp * 9, hyL - nyUp * 9);
            s.lineTo(shEndX - nxUp * 8.2, shEndY - nyUp * 8.2);
            s.lineTo(shEndX + nxUp * 8.8, shEndY + nyUp * 8.8);
            s.lineTo(hxL + nxUp * 9.2, hyL + nyUp * 9.2);
            s.closePath();
            fs(colCode);

            // Shorts hem stitch & side pocket detail
            s.lineWidth = 1.4;
            const hemX = hxL + dxUp * 0.52;
            const hemY = hyL + dyUp * 0.52;
            ln(
              hemX - nxUp * 8.2,
              hemY - nyUp * 8.2,
              hemX + nxUp * 8.8,
              hemY + nyUp * 8.8,
              ink,
            );
            s.lineWidth = LW;
          } else {
            // --- TAILORED TROUSERS / DENIM / CHINOS ---
            // Cuff ends 5px above ankle along the lower leg vector
            const cuffX = axL - uxLow * 5;
            const cuffY = ayL - uyLow * 5;
            const midThighX = (hxL + kxL) * 0.5;
            const midThighY = (hyL + kyL) * 0.5;
            const midShinX = (kxL + cuffX) * 0.5;
            const midShinY = (kyL + cuffY) * 0.5;

            s.beginPath();
            // Back hip / glute down to back of knee
            s.moveTo(hxL - nxUp * 8.8, hyL - nyUp * 8.8);
            s.quadraticCurveTo(
              midThighX - nxUp * 8.2,
              midThighY - nyUp * 8.2,
              kxL - nxUp * 7.2,
              kyL - nyUp * 7.2,
            );
            // Back of knee down to rear ankle cuff (with natural calf drape)
            s.quadraticCurveTo(
              midShinX - nxLow * 7.8,
              midShinY - nyLow * 7.8,
              cuffX - nxLow * 6.5,
              cuffY - nyLow * 6.5,
            );
            // Perpendicular ankle hem
            s.lineTo(cuffX + nxLow * 6.8, cuffY + nyLow * 6.8);
            // Front shin up to knee
            s.quadraticCurveTo(
              midShinX + nxLow * 7.2,
              midShinY + nyLow * 7.2,
              kxL + nxLow * 7.5,
              kyL + nyLow * 7.5,
            );
            // Front thigh up to hip
            s.quadraticCurveTo(
              midThighX + nxUp * 8.8,
              midThighY + nyUp * 8.8,
              hxL + nxUp * 9,
              hyL + nyUp * 9,
            );
            s.closePath();
            fs(colCode);

            // Realistic fabric & tailoring details (using crisp 1.4px stitch weight)
            s.lineWidth = 1.4;
            const detailC =
              colCode === W
                ? ink
                : col
                  ? "rgba(255,255,255,0.45)"
                  : W;

            if (pType === 1) {
              // Denim: selvedge outseam stitch + knee whiskers + rolled cuff
              ln(hxL, hyL + 6, kxL, kyL, detailC);
              ln(kxL, kyL, cuffX, cuffY, detailC);
              // Knee articulation creases
              ln(
                kxL - nxLow * 4,
                kyL - nyLow * 4,
                kxL + nxLow * 2,
                kyL + nyLow * 2,
                ink,
              );
            } else if (pType === 2) {
              // Tailored trousers: center press crease & slanted pocket
              ln(
                hxL + nxUp * 2,
                hyL + nyUp * 2 + 8,
                kxL + nxUp * 2,
                kyL + nyUp * 2,
                detailC,
              );
              ln(
                kxL + nxLow * 2,
                kyL + nyLow * 2,
                cuffX + nxLow * 2,
                cuffY + nyLow * 2,
                detailC,
              );
            }

            // Ankle cuff hem stitch aligned perpendicular to shin
            const stX = axL - uxLow * 8;
            const stY = ayL - uyLow * 8;
            ln(
              stX - nxLow * 6.5,
              stY - nyLow * 6.5,
              stX + nxLow * 6.7,
              stY + nyLow * 6.7,
              ink,
            );
            s.lineWidth = LW;
          }
        }

        /* --- BACK ARM & ACCESSORIES --- */
        const bw: [number, number] = [4 - 26 * b, -150];
        if (it === 4) {
          // Commuter Backpack on back with straps and vertical zip
          const bx = -15;
          const by = -226;
          s.beginPath();
          s.arc(bx + 11, by - 3, 7.5, Math.PI, 0);
          s.stroke();
          rect(bx, by + 2, 23, 32, 5, col ? "#1E2232" : W);
          rect(bx + 3, by + 16, 17, 14, 3, col ? c1 : ink);
          ln(bx + 11, by + 4, bx + 11, by + 15, W); // Vertical waterproof zip
          rect(bx + 9, by + 12, 4, 3, 1, W); // Zipper pull tab
        }

        // Back arm swing
        pl([[4, -230], [4 - 12 * b, -192], bw], 12.5, of === 3 ? skn : cc);
        if (of !== 3) ln(bw[0] - 4, bw[1] - 2, bw[0] + 4, bw[1] + 2, ink);
        el(bw[0], bw[1], 5.5, 5.5, skn);

        /* --- BACK LEG --- */
        const bk: [number, number][] = [
          [-3, hipY],
          [-3 - 6 * a, -64],
          [-4 - 22 * a, -16],
        ];
        drawLeg(bk, legC, false, pt);
        drawSneaker(bk[2][0], bk[2][1], false, sh);

        /* --- PELVIS / HIP CONNECTOR & FRONT LEG --- */
        // Unified hip/pelvis block so back and front legs form a single cohesive pair of trousers/shorts
        rect(-10, hipY - 4, 22, 14, 5, legC);

        const fr: [number, number][] = [
          [3, hipY],
          [3 + 14 * a, -66],
          [4 + 26 * a, -10],
        ];
        drawLeg(fr, legC, true, pt);
        drawSneaker(fr[2][0], fr[2][1], true, sh);

        /* --- TORSO & CLOTHING (Drapes naturally over the waist/hips) --- */
        // Anatomical neck with subtle collar shadow
        pl(
          [
            [hx - 2, hy + 14],
            [3, -236],
          ],
          9.5,
          skn,
        );

        // Contoured anatomical torso silhouette (natural chest, back & waist taper)
        s.beginPath();
        s.moveTo(-11, -236);
        s.quadraticCurveTo(2, -245, 14, -236); // Shoulders / traps
        if (of === 5) {
          // Tailored blazer hem
          s.quadraticCurveTo(16, -165, 16, -92);
          s.lineTo(-14, -92);
          s.quadraticCurveTo(-13, -165, -11, -236);
        } else if (of === 0) {
          // Overcoat / trench coat hem
          s.quadraticCurveTo(16, -170, 17, -104);
          s.lineTo(-14, -104);
          s.quadraticCurveTo(-13, -170, -11, -236);
        } else {
          // Standard top / sweater / hoodie / tee resting over the waistband
          s.quadraticCurveTo(15, -180, 13.5, hipY + 3);
          s.lineTo(-11.5, hipY + 3);
          s.quadraticCurveTo(-12.5, -180, -11, -236);
        }
        s.closePath();
        fs(cc);

        // Visible white crew-neck undershirt collar on casual tops
        s.beginPath();
        s.ellipse(2, -237, 6.5, 3.2, 0, 0, Math.PI);
        fs(W);

        // Clothing styling
        if (of === 0) {
          // Tailored trench / overcoat with lapels & horn buttons
          ln(2, -238, 2, -106, W);
          ln(-14, -108, 17, -108, W);
          rect(-8, -170, 8, 11, 1.5, W);
          // Lapel triangles & belt tie
          ln(-3, -236, 2, -210, W);
          ln(7, -236, 2, -210, W);
          rect(-11, -145, 25, 6, 2, col ? c1 : W);
        } else if (of === 1) {
          // Breton sailor striped sweater
          for (let yS = -226; yS <= -124; yS += 9) {
            ln(-11, yS, 13, yS);
          }
        } else if (of === 2) {
          // Ribbed knit sweater with collar & hem ribbing
          rect(-6, -240, 15, 6, 2, W);
          for (let yR = -226; yR < -122; yR += 11) ln(-11, yR, 13, yR);
          rect(-11.5, hipY - 2, 25, 5, 1.5, W);
        } else if (of === 3) {
          // Casual tee with subtle chest pocket & hem stitch
          s.lineWidth = 1.4;
          rect(4, -206, 6.5, 7.5, 1, cc === W ? (col ? c1 : W) : W);
          ln(-11, hipY, 13, hipY, ink);
          s.lineWidth = LW;
        } else if (of === 4) {
          // Streetwear hoodie with 3D hood, drawstrings with metal aglets & pouch
          el(-9, -239, 10, 7, ink); // Draped hood volume
          rect(-9, -156, 19, 20, 3, W); // Kangaroo pouch
          ln(-5, -232, -4, -212, W); // Left drawstring
          rect(-5, -212, 2, 4, 0.5, ink); // Aglet tip
          ln(2, -232, 3, -212, W); // Right drawstring
          rect(2, -212, 2, 4, 0.5, ink); // Aglet tip
        } else if (of === 5) {
          // Structured blazer with notched collar & chest pocket square
          ln(2, -238, 2, -92);
          s.beginPath();
          s.moveTo(-7, -238);
          s.lineTo(2, -216);
          s.lineTo(11, -238);
          s.closePath();
          fs(ink);
          rect(6, -212, 6, 3, 1, W); // Pocket square
        }

        // Crossbody sling bag
        if (it === 3) {
          ln(-8, -237, 14, -140);
          rect(4, -152, 28, 22, 4, col ? "#1F2333" : ink);
          rect(8, -146, 20, 8, 2, W);
          rect(2, -180, 6, 5, 1, W); // Metallic slider buckle
        }

        // Canvas Tote Bag
        if (hasTote) {
          ln(2, -236, 12, -165, ink); // Tote strap from shoulder
          rect(6, -165, 26, 30, 3, col ? "#EBE6DD" : W); // Canvas tote body
          rect(10, -152, 18, 12, 1, col ? c1 : ink); // Minimalist graphic logo
        }

        /* --- HEAD, HAIR & FACIAL ANATOMY --- */
        const headX = isPhone ? hx + 2 : hx;
        const headY = isPhone ? hy + 2 : hy;

        // Head base shape
        el(headX, headY, 12, 14, skn);
        el(headX - 4, headY + 1, 2.5, 4, skn); // Ear

        // Hairstyles (8 distinct cuts)
        if (hs === 0) {
          // Textured crop fade
          top(headX - 1, headY - 4, 13.5, 11, hc);
          el(headX - 9, headY + 1, 5, 8, hc);
          ln(headX - 10, headY - 14, headX + 4, headY - 14, hc);
        } else if (hs === 1) {
          // French bob with blunt bangs
          top(headX - 1, headY - 4, 14, 11, hc);
          el(headX - 10, headY + 4, 8, 16, hc);
          rect(headX + 2, headY - 8, 7, 6, 1, hc);
        } else if (hs === 2) {
          // Top knot / sleek high bun
          top(headX - 1, headY - 4, 13.5, 11, hc);
          el(headX - 7, headY - 18, 8, 8, hc);
        } else if (hs === 3) {
          // Textured voluminous afro fade / curls
          top(headX - 1, headY - 4, 14, 12, hc);
          for (let k = 0; k < 5; k++) {
            el(headX - 10 + k * 5.5, headY - 15 - (k % 2) * 2.5, 6.5, 6.5, hc);
          }
        } else if (hs === 4) {
          // Modern baseball cap with curved visor & top button
          const cap = col
            ? P6[Math.floor(R(i, 15) * 6)]
            : R(i, 9) < 0.5
              ? ink
              : W;
          top(headX, headY - 4, 14, 10.5, cap);
          el(headX - 1, headY - 14.5, 2, 2, ink); // Top button
          s.beginPath();
          s.moveTo(headX + 12, headY - 5);
          s.lineTo(headX + 26, headY - 3);
          s.lineTo(headX + 12, headY - 1);
          s.closePath();
          fs(cap);
        } else if (hs === 5) {
          // Long flowing layers past shoulder
          top(headX - 1, headY - 4, 13.5, 11, hc);
          el(headX - 10, headY + 14, 11, 28, hc);
        } else if (hs === 6) {
          // Sleek parted curtain waves
          top(headX - 1, headY - 4, 13.5, 11, hc);
          s.beginPath();
          s.ellipse(headX + 2, headY + 7, 10, 9, 0, 0.1, Math.PI - 0.25);
          s.closePath();
          fs(hc);
        } else if (hs === 7) {
          // Fisherman ribbed beanie cuffed high above ears
          const beanieC = col ? c1 : ink;
          top(headX - 1, headY - 5, 13.5, 9, beanieC);
          rect(headX - 13, headY - 7, 26, 6, 2, beanieC);
          for (let bX = headX - 11; bX <= headX + 11; bX += 4) {
            ln(bX, headY - 7, bX, headY - 2, W);
          }
        }

        // Expressive eye & downward gaze for phone walkers
        s.fillStyle = ink;
        s.beginPath();
        if (isPhone) {
          // Downcast gaze looking directly at phone
          s.arc(headX + 6, headY + 0.5, 1.7, 0, 7);
          s.fill();
          ln(headX + 3, headY - 4, headX + 9, headY - 4.5); // Angled brow
        } else {
          // Alert forward walking gaze
          s.arc(headX + 6, headY - 2, 1.7, 0, 7);
          s.fill();
          ln(headX + 3, headY - 6.5, headX + 9, headY - 6.5);
        }

        // Nose & sculpted profile
        s.beginPath();
        s.moveTo(headX + 11.5, headY - 1.5);
        s.quadraticCurveTo(headX + 17.5, headY + 3.5, headX + 11.5, headY + 5);
        s.stroke();
        ln(headX + 6, headY + 9, headX + 11, headY + 8.5, hs === 6 ? W : ink); // Lips

        // Glasses
        if (gl) {
          s.beginPath();
          s.arc(headX + 7, headY - 2, 4.8, 0, 7);
          s.stroke();
          ln(headX + 2, headY - 2, headX - 4, headY - 1);
        }

        // Modern AirPods Pro in ear
        if (isPhone || R(i, 17) < 0.4) {
          el(headX - 4.5, headY + 1.5, 2.5, 2.5, W);
          ln(headX - 4.5, headY + 2.5, headX - 4, headY + 7, W);
          el(headX - 4.5, headY + 1.2, 0.9, 0.9, ink); // Acoustic vent
        }

        /* --- FRONT ARM, SMARTPHONE & CARRIED ITEMS --- */
        let fe: [number, number] = [4 + 14 * b, -190];
        let fw: [number, number] = [4 + 30 * b, -146];

        if (it === 1) {
          // Natural bent forearm in phone-viewing posture
          fe = [19, -188];
          fw = [26, -212];
        } else if (it === 2) {
          // Holding laptop under arm
          fe = [16, -196];
          fw = [22, -174];
        } else if (hasCoffee) {
          // Holding takeaway coffee cup
          fe = [16, -194];
          fw = [22, -188];
        }

        // Arm sleeve & limb
        pl([[4, -230], fe, fw], 12.5, of === 3 ? skn : cc);
        if (of !== 3) ln(fw[0] - 4, fw[1] - 2, fw[0] + 4, fw[1] + 2, ink);

        if (it === 1) {
          /* --- SMARTWATCH ON WRIST --- */
          rect(fw[0] - 3.5, fw[1] - 3.5, 7, 7, 2, col ? "#1B1E2D" : ink);
          rect(fw[0] - 2, fw[1] - 2, 4, 4, 1, col ? "#3D5AFE" : W); // OLED glint

          /* --- HIGH-FIDELITY SMARTPHONE & TACTILE HAND GRIP --- */
          s.save();
          const phoneX = fw[0] + 8;
          const phoneY = fw[1] - 8;
          s.translate(phoneX, phoneY);
          s.rotate(-0.35); // Ergonomic 20° tilt towards face

          // Screen Radial Ambient Glow (cast onto fingers, wrist, and chin)
          if (col) {
            const glow = s.createRadialGradient(0, 0, 3, 0, 0, 28);
            glow.addColorStop(0, "rgba(61, 90, 254, 0.24)");
            glow.addColorStop(0.6, "rgba(155, 232, 200, 0.1)");
            glow.addColorStop(1, "rgba(61, 90, 254, 0)");
            s.fillStyle = glow;
            s.beginPath();
            s.arc(0, 0, 28, 0, 7);
            s.fill();
          }

          // 1. Titanium Chassis with metallic edge highlight (18px wide x 38px tall)
          rect(-9, -19, 18, 38, 4.5, "#141724");
          // Triple camera bump on rear edge
          rect(-11.5, -17, 3, 10, 1.2, "#0D0F18");
          el(-10.5, -15, 0.8, 0.8, "#383F5E");
          el(-10.5, -12, 0.8, 0.8, "#383F5E");
          el(-10.5, -9, 0.8, 0.8, "#383F5E");

          // 2. Edge-to-Edge Luminous OLED Screen
          rect(-7.5, -17.5, 15, 35, 3.5, col ? "#F3F7FF" : W);

          // 3. Dynamic Island Notch Pill
          rect(-3, -16.5, 6, 2.2, 1.1, ink);
          el(-1.5, -15.4, 0.6, 0.6, "#383F5E"); // Camera sensor

          // 4. Modern Mobile App UI
          if (col) {
            // Status bar time & signal
            ln(-5.5, -14, -3, -14, "#64748B");
            ln(3.5, -14, 5.5, -14, "#64748B");
            // Chat conversation: Outgoing message bubble (electric indigo)
            rect(-5.5, -8, 11, 4.5, 1.8, "#3D5AFE");
            ln(-4, -6, 3, -6, W);
            // Incoming message bubble (mint)
            rect(-5.5, -2, 9.5, 4.2, 1.8, "#9BE8C8");
            ln(-4, 0, 2, 0, "#1E293B");
            // Audio wave / voice message pill
            rect(-5.5, 3.8, 11, 3.8, 1.5, "#C9BBFF");
            ln(-4, 5.7, 3.5, 5.7, "#3D5AFE");
            // Bottom iOS Home Indicator Bar
            rect(-3, 14.8, 6, 1.2, 0.6, "#64748B");
          } else {
            ln(-5.5, -14, -3, -14, ink);
            ln(3.5, -14, 5.5, -14, ink);
            rect(-5.5, -7.5, 11, 4.5, 1.8, ink);
            rect(-5.5, -1.5, 9.5, 4.2, 1.8, W);
            ln(-4, 0, 2, 0, ink);
            rect(-5.5, 4, 11, 3.8, 1.5, ink);
            rect(-3, 14.8, 6, 1.2, 0.6, ink);
          }

          // 5. Tactile Human Hand & Fingers holding the device
          // Palm / thenar base supporting lower corner
          s.beginPath();
          s.ellipse(-7.5, 10, 3.5, 5.5, 0.35, 0, 7);
          fs(skn);

          // Pinky support shelf beneath the bottom edge
          rect(-5.5, 17.5, 5, 3, 1.2, skn);

          // Ring, Middle, and Index fingers wrapped around the side frame
          rect(-11, 8, 4.5, 3.2, 1.4, skn);
          rect(-11, 2.5, 4.5, 3.2, 1.4, skn);
          rect(-11, -3, 4.5, 3.2, 1.4, skn);

          // Active scrolling thumb touching the front glass
          s.beginPath();
          s.ellipse(-1.5, 6, 3.2, 5, 0.42, 0, 7);
          fs(skn);

          s.restore();
        } else if (it === 2) {
          /* --- SPACE GRAY MACBOOK / LAPTOP --- */
          s.save();
          s.translate(fw[0] + 3, fw[1] + 2);
          s.rotate(0.08);
          // Aluminum unibody chassis
          rect(-16, -11, 32, 22, 3.5, col ? "#2E344A" : ink);
          ln(-15, -11, 15, -11, W); // Lid edge glint
          el(0, 0, 2.8, 2.8, W); // Reflective Apple logo
          // Hand gripping bottom edge
          el(-2, 9, 5.5, 4.5, skn);
          rect(-5, 8, 9, 3.5, 1.5, skn);
          s.restore();
        } else if (hasCoffee) {
          /* --- ARTISAN TAKEAWAY COFFEE CUP --- */
          s.save();
          s.translate(fw[0] + 4, fw[1] - 4);
          // Tapered insulated cup
          s.beginPath();
          s.moveTo(-5, -7);
          s.lineTo(5, -7);
          s.lineTo(4, 9);
          s.lineTo(-4, 9);
          s.closePath();
          fs(W);
          // Corrugated kraft heat sleeve
          s.beginPath();
          s.moveTo(-4.6, -3);
          s.lineTo(4.6, -3);
          s.lineTo(4.1, 4.5);
          s.lineTo(-4.1, 4.5);
          s.closePath();
          fs(col ? "#C88E58" : ink);
          el(0, 0.8, 2, 2, W); // Circular sleeve badge
          // Fitted sipping lid
          rect(-5.8, -9.5, 11.6, 3, 1.2, W);
          ln(-4, -8, -1, -8, ink); // Sip hole
          // Fingers wrapped around sleeve
          rect(-5.2, -0.5, 4.5, 2.8, 1.2, skn);
          rect(-5.2, 2.8, 4.5, 2.8, 1.2, skn);
          s.restore();
        } else {
          // Relaxed natural walking hand
          el(fw[0], fw[1], 5.5, 5.5, skn);
          el(fw[0] + 2.5, fw[1] + 2.5, 2.8, 3.2, skn, 0.3);
        }

        s.restore();
      }
    }

    sheet(sp, false);
    sheet(sc, true);

    let base = 1;
    let lw = 0;
    let lh = 0;
    const st = { width: 0, height: 0 };
    const all: Walker[] = [];
    const avail: Walker[] = [];
    const crowd: Walker[] = [];
    let on = true;

    for (let j = 0; j < rows * cols; j++) {
      all.push({
        sx: (j % rows) * (tw + P) + P / 2,
        sy: Math.floor(j / rows) * (th + P) + P / 2,
        w: tw,
        h: th,
        x: 0,
        y: 0,
        s: 1,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        base: 1,
        c: 0,
      });
    }

    function rnd(min: number, max: number): number {
      return min + Math.random() * (max - min);
    }

    function reset(p: Walker): { sy: number; a: number; b: number } {
      const d = Math.random() > 0.5 ? 1 : -1;
      const t = gsap.parseEase("power2.in")(Math.random());
      const sc = base * (1 - 0.3 * t);
      const fy = st.height + 2 - 150 * base * t;
      const w = tw * sc;
      let a: number;
      let b: number;
      p.s = sc;

      if (d === 1) {
        a = -w;
        b = st.width;
        p.scaleX = 1;
      } else {
        a = st.width + w;
        b = 0;
        p.scaleX = -1;
      }
      p.x = a;
      p.y = fy - (th - 4) * sc;
      p.anchorY = fy;
      return { sy: p.y, a, b };
    }

    function add(): Walker | undefined {
      if (!avail.length) return undefined;
      const p = avail.splice(Math.floor(rnd(0, avail.length)), 1)[0];
      const pr = reset(p);
      const tl = gsap.timeline();
      p.base = rnd(0.7, 1.25);
      p.c = 0;
      tl.timeScale(p.base);
      const walkDuration = rnd(13, 21) * (Math.max(800, st.width) / 1440);
      tl.to(
        p,
        {
          duration: walkDuration,
          x: pr.b,
          ease: "none",
        },
        0,
      );
      tl.to(
        p,
        {
          duration: 0.4,
          repeat: Math.ceil(walkDuration / 0.4) + 10,
          yoyo: true,
          y: pr.sy - 6 * base,
        },
        0,
      );
      tl.eventCallback("onComplete", () => {
        const idx = crowd.indexOf(p);
        if (idx !== -1) crowd.splice(idx, 1);
        avail.push(p);
        add();
      });
      p.walk = tl;
      crowd.push(p);
      crowd.sort((wA, wB) => wA.anchorY - wB.anchorY);
      return p;
    }

    let R2 = 240;
    let mx = 0;
    let my = 0;
    let inside = false;
    let g = 0;

    function textRect() {
      const e = textRef.current;
      if (!e || !cv) return null;
      const a = e.getBoundingClientRect();
      const c = cv.getBoundingClientRect();
      const pd = 14;
      return {
        x: a.left - c.left - pd,
        y: a.top - c.top - pd,
        w: a.width + pd * 2,
        h: a.height + pd * 2,
      };
    }

    function render() {
      if (!on || !cv || !ctx) return;
      const d = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.save();
      ctx.scale(d, d);

      g += ((inside ? 1 : 0) - g) * 0.1;

      for (let i = 0; i < crowd.length; i++) {
        const p = crowd[i];
        const dx = p.x + (p.scaleX * tw * p.s) / 2 - mx;
        const dy = p.y + th * p.s * 0.45 - my;
        const near = inside
          ? Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / R2)
          : 0;
        p.c += (near - p.c) * 0.12;
        if (p.c < 0.003) p.c = 0;

        if (p.walk) {
          p.walk.timeScale(p.base * (1 - 0.85 * p.c));
        }

        const k = 1 + 0.05 * p.c;
        ctx.save();
        ctx.translate(p.x, p.y - th * p.s * 0.05 * p.c);
        ctx.scale(p.scaleX * p.s * k, p.s * k);

        // Draw monochrome walker
        ctx.drawImage(sp, p.sx, p.sy, tw, th, 0, 0, tw, th);

        // Overlay colored walker with smooth alpha
        if (p.c > 0.02) {
          ctx.globalAlpha = Math.min(1, p.c * 1.3);
          ctx.drawImage(sc, p.sx, p.sy, tw, th, 0, 0, tw, th);
        }
        ctx.restore();
      }

      ctx.restore();
    }

    function resize() {
      if (!cv) return;

      const d = window.devicePixelRatio || 1;
      const w0 =
        cv.clientWidth || cv.parentElement?.clientWidth || window.innerWidth;
      const h0 = cv.clientHeight || Math.round(window.innerHeight * 0.7);

      if (!w0 || !h0) return;
      if (crowd.length && Math.abs(w0 - lw) < 2 && Math.abs(h0 - lh) < 60)
        return;

      lw = w0;
      lh = h0;
      st.width = w0;
      st.height = h0;
      cv.width = w0 * d;
      cv.height = h0 * d;

      // People size and count follow the screen
      base = Math.max(0.5, Math.min(1.4, Math.min(w0 / 1100, h0 / 560)));
      R2 = Math.max(150, 240 * base);

      const n = Math.max(20, Math.min(130, Math.round(w0 / (20 * base))));

      crowd.forEach((p) => {
        if (p.walk) p.walk.kill();
      });
      crowd.length = 0;
      avail.length = 0;

      const ord = all.slice().sort(() => Math.random() - 0.5);
      for (let k = 0; k < n; k++) {
        const q = ord[k % ord.length];
        avail.push({
          sx: q.sx,
          sy: q.sy,
          w: q.w,
          h: q.h,
          x: 0,
          y: 0,
          s: 1,
          anchorY: 0,
          scaleX: 1,
          walk: null,
          base: 1,
          c: 0,
        });
      }

      // Distribute initial walkers uniformly across the entire screen width
      // Eliminates the "2 groups of people" bug completely!
      const totalInitial = avail.length;
      for (let i = 0; i < totalInitial; i++) {
        const p = add();
        if (p?.walk) {
          // targetX is uniformly spaced from 0 to st.width
          const targetX = ((i + rnd(0.15, 0.85)) / totalInitial) * st.width;
          const a = p.scaleX === 1 ? -p.w * p.s : st.width + p.w * p.s;
          const b = p.scaleX === 1 ? st.width : 0;
          const progress = Math.max(
            0.01,
            Math.min(0.99, (targetX - a) / (b - a)),
          );
          p.walk.progress(progress);
        }
      }

      // If document is currently hidden, pause walkers so they don't walk while user is in another tab
      if (document.hidden) {
        crowd.forEach((p) => {
          if (p.walk) p.walk.pause();
        });
      } else {
        render();
      }

      if (calm) {
        crowd.forEach((p) => {
          if (p.walk) p.walk.pause();
        });
        render();
      }
    }

    const sec = containerRef.current;
    function handlePointerMove(e: PointerEvent) {
      if (!cv) return;
      const r = cv.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      const tr = textRect();
      inside = !(
        tr &&
        mx > tr.x &&
        mx < tr.x + tr.w &&
        my > tr.y &&
        my < tr.y + tr.h
      );
    }

    function handlePointerLeave() {
      inside = false;
    }

    if (!calm && sec) {
      sec.addEventListener("pointermove", handlePointerMove);
      sec.addEventListener("pointerleave", handlePointerLeave);
    }

    // Freeze walker timelines when tab is hidden, resume when tab is active
    function handleVisibilityChange() {
      if (document.hidden) {
        on = false;
        crowd.forEach((p) => {
          if (p.walk) p.walk.pause();
        });
      } else {
        on = true;
        // If crowd wasn't populated yet, populate it now
        if (crowd.length === 0) {
          resize();
        } else {
          crowd.forEach((p) => {
            if (p.walk && !calm) p.walk.resume();
          });
          render();
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    resize();
    gsap.ticker.add(render);
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      (entries) => {
        on = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0 },
    );
    observer.observe(cv);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      gsap.ticker.remove(render);
      window.removeEventListener("resize", resize);
      observer.disconnect();

      if (sec) {
        sec.removeEventListener("pointermove", handlePointerMove);
        sec.removeEventListener("pointerleave", handlePointerLeave);
      }

      crowd.forEach((p) => {
        if (p.walk) p.walk.kill();
      });
      crowd.length = 0;
      avail.length = 0;
    };
  }, [containerRef, textRef]);

  return (
    <canvas
      ref={canvasRef}
      id="crowd"
      aria-hidden="true"
      className="absolute left-0 bottom-0 w-full h-[70vh] z-1 pointer-events-none select-none"
    />
  );
}
