// src/app/components/customProjectCards.js
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSpring, useSprings, animated, to as springTo, config } from "@react-spring/web";

/* ------------------ KONTEN KARTU ------------------ */
const cardsData = [
  {
    type: "about",
    title: "Experiences",
    subtitle: "2022 - 2025",
    bullets: [
      "👨‍🎓 Served as Student Council President (2022–2023), leading school wide initiatives and events.",
      "🎤 Led the Independence Day Ceremony as Chief Ceremony Commander, August 17th, 2022.",
      "📂 Project Manager at developp.id, overseeing project timelines, teams, and deliverables.",
      "🌐 Part of Google Developer Group (GDG) Jakarta, engaging in community driven tech events.",
    ],
  },
  {
    type: "skills",
    title: "Skills",
    skills: [
      { name: "HTML & CSS", level: 85 },
      { name: "PHP / Laravel", level: 25 },
      { name: "JavaScript (ES6+)", level: 70 },
      { name: "React & Next.js", level: 68 },
      { name: "Node.js & Express", level: 65 },
      { name: "Tailwind CSS", level: 79 },
      { name: "Java", level: 55 },
      { name: "Golang", level: 60 },
      { name: "Python", level: 70 },
      { name: "SQL", level: 50 },
    ],
  },
  {
    type: "achievements",
    title: "Achievements",
    achievements: [
      { icon: "🥉", title: "Bronze Medalist - Economics", desc: "National Science Olympiad Hardiknas 2023" },
      { icon: "🥉", title: "Bronze Medalist - Sociology", desc: "National Science Olympiad Hardiknas 2023" },
      { icon: "🥉", title: "Bronze Medalist - Computer Science", desc: "National Science Olympiad Hardiknas 2023" },
      { icon: "🎓", title: "GPA 4.00/4.00", desc: "4-point scale" },
    ],
  },
];

/* ------------------ WIDGET ------------------ */
const AnimatedNumber = ({ n, active }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: active ? n : 0 },
    delay: 120,
    config: config.molasses,
    reset: !active,
  });
  return <animated.span>{number.to((v) => Math.floor(v))}</animated.span>;
};

const SkillBar = ({ skill, level, active }) => {
  const bar = useSpring({
    from: { width: "0%" },
    to: { width: active ? `${level}%` : "0%" },
    config: { duration: 900 },
    reset: !active,
  });
  return (
    <div className="w-full my-2">
      <div className="flex justify-between text-sm mb-1 text-gray-100/90">
        <span>{skill}</span>
        <span>
          <AnimatedNumber n={level} active={active} />%
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
        <animated.div
          className="h-2.5 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.45)] bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300"
          style={bar}
        />
      </div>
    </div>
  );
};

/* ------------------ UTIL & BG ------------------ */
const randBetween = (seed, a, b) => {
  const x = Math.sin(seed) * 43758.5453;
  const frac = x - Math.floor(x);
  return a + frac * (b - a);
};

const fancyBg = (type) => {
  const common = [
    "radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,0.28), transparent 60%)",
    "radial-gradient(900px 500px at 80% 80%, rgba(56,189,248,0.25), transparent 55%)",
  ];
  const typeLayer = {
    about: "linear-gradient(135deg, #0b1220 0%, #0f172a 45%, #0b132b 100%)",
    skills: "linear-gradient(135deg, #0a0f1c 0%, #111827 50%, #0a0f1c 100%)",
    achievements: "linear-gradient(135deg, #09121a 0%, #0f172a 55%, #052a2f 100%)",
  }[type || "about"];
  return { backgroundImage: [...common, typeLayer].join(", ") };
};

const fancyAccent = (type) => {
  switch (type) {
    case "skills":
      return "bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300";
    case "achievements":
      return "bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300";
    default:
      return "bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300";
  }
};

/* ------------------ DECK (AUTO SWIPE) ------------------ */
function Deck() {
  const count = cardsData.length;

  // Deteksi mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // urutan kartu (0 = paling atas)
  const [order, setOrder] = useState(Array.from({ length: count }, (_, i) => i));
  const orderRef = useRef(order);
  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  // seed untuk layout desktop acak
  const [seed, setSeed] = useState(1);
  const [outIdx, setOutIdx] = useState(null);
  const [outDir, setOutDir] = useState(1);

  // PARAMETER ANIMASI
  const SWIPE_MS = isMobile ? 520 : 420; // durasi geser
  const INTERVAL_MS = isMobile ? 6500 : 5200; // jeda antar swipe otomatis
  const SWIPE_OFFSET = isMobile ? 80 : 110; // jarak geser
  const ROTATE_MAX = isMobile ? 2 : 6; // rotasi saat swipe
  const BASE_CFG = isMobile
    ? { mass: 0.9, tension: 220, friction: 36 }
    : { mass: 0.9, tension: 380, friction: 30 };

  const [springs, api] = useSprings(count, () => ({
    x: 0,
    y: 0,
    rotZ: 0,
    rotY: 0,
    scale: 1,
    z: 0,
    opacity: 1,
    config: BASE_CFG,
  }));

  // Layout posisi tiap lapis
  const layoutForPos = useMemo(() => {
    if (isMobile) {
      // MOBILE: rapi, tanpa jitter
      return Array.from({ length: count }, (_, pos) => {
        const yStack = pos * -10;
        const rZ = pos === 0 ? 0 : pos % 2 ? -0.5 : 0.5;
        const sc = 1 - pos * 0.04;
        return {
          x: 0,
          y: yStack,
          rotZ: rZ,
          rotY: 0,
          scale: sc,
          opacity: Math.max(0.3, 1 - pos * 0.15),
        };
      });
    }

    // DESKTOP/TABLET: acak
    return Array.from({ length: count }, (_, pos) => {
      const baseY = pos * -12;
      const xJit = randBetween(seed + pos * 13.37, -12, 12);
      const yJit = randBetween(seed + pos * 7.77, -4, 4);
      const rZ = randBetween(seed + pos * 5.55, -8, 8);
      const rY = randBetween(seed + pos * 9.99, -6, 6);
      const sc = 1 - pos * 0.055;
      return {
        x: xJit,
        y: baseY + yJit,
        rotZ: rZ,
        rotY: rY,
        scale: sc,
        opacity: Math.max(0.25, 1 - pos * 0.16),
      };
    });
  }, [count, seed, isMobile]);

  const transform = (x, y, ry, rz, s) =>
    `translate3d(${x}px, ${y}px, 0) perspective(1000px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`;

  // Terapkan layout + animasi
  useEffect(() => {
    api.start((i) => {
      if (i === outIdx) {
        const pos = orderRef.current.indexOf(i);
        const lay = layoutForPos[Math.max(0, pos)];
        return {
          x: outDir * SWIPE_OFFSET,
          y: lay.y,
          rotZ: outDir * ROTATE_MAX,
          rotY: lay.rotY,
          scale: 1.02,
          z: count + 5,
          opacity: 0.92,
          immediate: (k) => k === "z",
          config: isMobile
            ? { mass: 0.9, tension: 210, friction: 34 }
            : { mass: 0.9, tension: 340, friction: 28 },
        };
      }
      const pos = order.indexOf(i);
      const lay = layoutForPos[pos];
      return {
        x: lay.x,
        y: lay.y,
        rotZ: lay.rotZ,
        rotY: lay.rotY,
        scale: lay.scale,
        z: count - pos,
        opacity: lay.opacity,
        immediate: (k) => k === "z",
        config: BASE_CFG,
      };
    });
  }, [api, order, outIdx, outDir, layoutForPos, count, isMobile, SWIPE_OFFSET, ROTATE_MAX, BASE_CFG]);

  // Auto-swipe — DITAMBAHKAN PAUSE CHECK
  useEffect(() => {
    let alive = true;

    const tick = () => {
      if (!alive) return;

      // ✅ PAUSE: kalau PasswordGate/ChatModal terbuka, jangan gerakkan deck
      if (typeof window !== "undefined" && window.__PAUSE_DECK__) return;

      const top = orderRef.current[0];
      const dir = Math.random() < 0.5 ? -1 : 1;

      setOutIdx(top);
      setOutDir(dir);

      setTimeout(() => {
        if (!alive) return;
        setOrder((prev) => {
          const [first, ...rest] = prev;
          return [...rest, first];
        });
        if (!isMobile) setSeed((s) => s + 1); // desktop reshuffle
        setOutIdx(null);
      }, SWIPE_MS);
    };

    const interval = setInterval(tick, INTERVAL_MS);

    // Tambahan: pause saat tab tidak aktif
    const visHandler = () => {
      const hidden = document.hidden;
      if (hidden) {
        window.__PAUSE_DECK__ = true;
      } else {
        window.__PAUSE_DECK__ = false;
      }
    };
    document.addEventListener("visibilitychange", visHandler);

    return () => {
      alive = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", visHandler);
    };
  }, [SWIPE_MS, INTERVAL_MS, isMobile]);

  return (
    <div
      className="w-full h-full flex items-center justify-center relative select-none"
      style={{ overscrollBehaviorY: "contain" }}
    >
      {springs.map(({ x, y, rotY, rotZ, scale, z, opacity }, i) => {
        const card = cardsData[i];
        const accent = fancyAccent(card.type);
        const isTopActive = order.indexOf(i) === 0 && outIdx == null;

        return (
          <animated.div
            key={i}
            className="absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            style={{
              zIndex: z.to((zz) => Math.floor(zz)),
              opacity,
              transform: springTo([x, y, rotY, rotZ, scale], transform),
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              touchAction: isMobile ? "pan-x" : "none",
              ...fancyBg(card.type),
            }}
          >
            {/* Isi kartu */}
            <div className="w-full h-full rounded-2xl flex flex-col justify-start p-6 gap-4 text-white">
              <div>
                <div className={`inline-block rounded-xl p-[3px] ${accent} shadow-sm`}>
                  <div className="rounded-[10px] px-3 py-1 bg-black/30 backdrop-blur">
                    <h2 className="text-3xl font-bold">{card.title}</h2>
                  </div>
                </div>
                {card.subtitle && <p className="text-sm text-white/80 mt-2">{card.subtitle}</p>}
              </div>

              {card.type === "about" && (
                <div className="space-y-3 text-white/90 leading-relaxed text-base">
                  {card.bullets.map((bullet, index) => (
                    <p key={index}>{bullet}</p>
                  ))}
                </div>
              )}

              {card.type === "skills" && (
                <div>
                  {card.skills.map((s) => (
                    <SkillBar key={s.name} skill={s.name} level={s.level} active={isTopActive} />
                  ))}
                </div>
              )}

              {card.type === "achievements" && (
                <div className="space-y-4 pt-2">
                  {card.achievements.map((ach) => (
                    <div key={ach.title} className="flex items-center gap-4">
                      <span className="text-3xl">{ach.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{ach.title}</h3>
                        <p className="text-sm text-gray-200/90">{ach.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </animated.div>
        );
      })}
    </div>
  );
}

const CustomProjectCards = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center px-4 mt-20 md:-mt-6 md:ml-30">
      <div className="p-2 sm:p-3">
        {/* Mobile: lebih tinggi (portrait), Desktop/iPad: tetap seperti sekarang */}
        <div className="w-[88vw] max-w-[400px] aspect-[3/5] md:aspect-[4.5/5]">
          <Deck />
        </div>
      </div>
    </div>
  );
};

export default CustomProjectCards;