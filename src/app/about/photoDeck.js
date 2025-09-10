"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSprings, animated, to as springTo } from "@react-spring/web";

// --- DATA FOTO ---
const photosData = [
  { imageUrl: "/pict-about.jpg",  caption: "Me When Doing Nothing In My School." },
  { imageUrl: "/Pict-about2.jpg", caption: "Hello World!" },
  { imageUrl: "/Pict-about3.jpg", caption: "Powered by coffee and Wi-Fi." },
  { imageUrl: "/pict-about4.jpg", caption: "Good at overthinking, bad at replying texts." }
];

// Util jitternya (untuk desktop)
const randBetween = (seed, a, b) => {
  const x = Math.sin(seed) * 43758.5453;
  const frac = x - Math.floor(x);
  return a + frac * (b - a);
};

function Deck() {
  const count = photosData.length;

  // Deteksi mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Urutan kartu
  const [order, setOrder] = useState(Array.from({ length: count }, (_, i) => i));
  const orderRef = useRef(order);
  useEffect(() => { orderRef.current = order; }, [order]);

  // Seed untuk desktop agar tetap acak
  const [seed, setSeed] = useState(1);

  // Param animasi – mobile lebih slow & smooth
  const SWIPE_MS     = isMobile ? 520 : 420;
  const INTERVAL_MS  = isMobile ? 6500 : 5200;
  const SWIPE_OFFSET = isMobile ? 80  : 110;
  const ROTATE_MAX   = isMobile ? 2   : 6;

  const BASE_CFG = isMobile
    ? { mass: 0.9, tension: 220, friction: 36 }
    : { mass: 0.9, tension: 380, friction: 30 };

  const [outIdx, setOutIdx] = useState(null);
  const [outDir, setOutDir] = useState(1);

  const [springs, api] = useSprings(count, () => ({
    x: 0, y: 0, rotZ: 0, rotY: 0, scale: 1, z: 0, opacity: 1, config: BASE_CFG,
  }));

  // Layout: rapi di mobile, acak di desktop/iPad
  const layoutForPos = useMemo(() => {
    if (isMobile) {
      return Array.from({ length: count }, (_, pos) => {
        const yStack = pos * -10;                 // sedikit bertumpuk
        const rZ = pos === 0 ? 0 : (pos % 2 ? -0.5 : 0.5);
        const sc = 1 - pos * 0.04;
        return { x: 0, y: yStack, rotZ: rZ, rotY: 0, scale: sc, opacity: Math.max(0.35, 1 - pos * 0.15) };
      });
    }
    // desktop/iPad: tetap acak
    const s = seed;
    return Array.from({ length: count }, (_, pos) => {
      const baseY = pos * -12;
      const xJit = randBetween(s + pos * 13.37, -12, 12);
      const yJit = randBetween(s + pos * 7.77, -4, 4);
      const rZ = randBetween(s + pos * 5.55, -8, 8);
      const rY = randBetween(s + pos * 9.99, -6, 6);
      const sc = 1 - pos * 0.055;
      return { x: xJit, y: baseY + yJit, rotZ: rZ, rotY: rY, scale: sc, opacity: Math.max(0.25, 1 - pos * 0.16) };
    });
  }, [count, seed, isMobile]);

  const transform = (x, y, ry, rz, s) =>
    `translate3d(${x}px, ${y}px, 0) perspective(1000px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`;

  // Terapkan layout + animasi
  useEffect(() => {
    api.start((i) => {
      const pos = order.indexOf(i);
      const lay = layoutForPos[pos];
      return {
        x: lay.x, y: lay.y, rotZ: lay.rotZ, rotY: lay.rotY, scale: lay.scale,
        z: count - pos, opacity: lay.opacity,
        immediate: (k) => k === "z",
        config: BASE_CFG,
      };
    });
  }, [api, order, layoutForPos, count, BASE_CFG]);

  // Auto-swipe
  useEffect(() => {
    const interval = setInterval(() => {
      const top = orderRef.current[0];
      const dir = Math.random() < 0.5 ? -1 : 1;
      setOutIdx(top); setOutDir(dir);
      setTimeout(() => {
        setOrder((prev) => { const [first, ...rest] = prev; return [...rest, first]; });
        if (!isMobile) setSeed((s) => s + 1);   // desktop reshuffle, mobile tetap rapi
        setOutIdx(null);
      }, SWIPE_MS);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [SWIPE_MS, INTERVAL_MS, isMobile]);

  // Transisi keluar kartu paling atas
  useEffect(() => {
    if (outIdx == null) return;
    const pos = orderRef.current.indexOf(outIdx);
    const lay = layoutForPos[Math.max(0, pos)];
    api.start((i) => {
      if (i !== outIdx) return;
      return {
        x: outDir * SWIPE_OFFSET,
        y: lay.y,
        rotZ: outDir * ROTATE_MAX,
        rotY: lay.rotY,
        scale: 1.02,
        z: count + 5,
        opacity: 0.92,
        immediate: (k) => k === "z",
        config: isMobile ? { mass: 0.9, tension: 210, friction: 34 } : { mass: 0.9, tension: 340, friction: 28 },
      };
    });
  }, [outIdx, outDir, api, layoutForPos, count, isMobile, SWIPE_OFFSET, ROTATE_MAX]);

  return (
    <div
      className="w-full h-full flex items-center justify-center relative select-none"
      style={{ overscrollBehaviorY: "contain" }}
    >
      {springs.map(({ x, y, rotY, rotZ, scale, z, opacity }, i) => {
        const photo = photosData[i];
        return (
          <animated.div
            key={i}
            className="absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            style={{
              zIndex: z.to((zz) => Math.floor(zz)),
              opacity,
              transform: springTo([x, y, rotY, rotZ, scale], transform),
              backfaceVisibility: "hidden",
              willChange: "transform, opacity",
              touchAction: isMobile ? "pan-x" : "none",
            }}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.caption}
              fill
              className="object-cover rounded-2xl"
              priority={i === 0}
              sizes="(max-width: 767px) 90vw, (max-width: 1024px) 400px, 400px"
            />
            <div className="absolute bottom-4 left-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-lg text-center">
              <p className="text-white text-sm font-semibold">{photo.caption}</p>
            </div>
          </animated.div>
        );
      })}
    </div>
  );
}

const PhotoDeck = () => {
  return (
    // MOBILE: lebar fleksibel & tinggi portrait; MD+: kembali ke ukuran semula
    <div className="w-[90vw] max-w-[400px] aspect-[3.2/5] md:w-[400px] md:h-[600px] md:aspect-auto">
      <Deck />
    </div>
  );
};

export default PhotoDeck;