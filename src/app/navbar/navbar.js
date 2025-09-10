// src/app/navbar.js
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav className="z-50 mt-6 md:mt-8">
      <div className="px-4">
        {/* NAVBAR WRAPPER (desain asli dipertahankan) */}
        <div className="max-w-lg mx-auto p-2 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.25)] bg-gradient-to-b from-gray-800 to-gray-900 border-t border-white/10">
          <div className="flex items-center justify-between px-2">
            {/* spacer kiri = lebar tombol kanan agar center presisi */}
            <div className="w-10 md:w-0" />

            {/* MENU DESKTOP: benar-benar center */}
            <div className="hidden md:flex justify-center flex-1 items-center space-x-10 text-lg font-italic">
              <Link href="/" className="hover:bg-gray-500 p-2 rounded-md">Home</Link>
              <Link href="#" className="hover:bg-gray-500 p-2 rounded-md">Project</Link>
              <Link href="/about" className="hover:bg-gray-500 p-2 rounded-md">About</Link>
              <Link href="#" className="hover:bg-gray-500 p-2 rounded-md">Resume</Link>
            </div>

            {/* HAMBURGER MOBILE */}
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(v => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <span className="relative block w-6 h-5">
                <span className={`absolute left-0 top-0 h-0.5 w-full bg-white transition-transform duration-300 ${open ? "translate-y-[10px] rotate-45" : "translate-y-0 rotate-0"}`} />
                <span className={`absolute left-0 top-1/2 h-0.5 w-full bg-white transition-opacity duration-200 -translate-y-1/2 ${open ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 bottom-0 h-0.5 w-full bg-white transition-transform duration-300 ${open ? "-translate-y-[10px] -rotate-45" : "translate-y-0 rotate-0"}`} />
              </span>
            </button>
          </div>
        </div>

        {/* OVERLAY klik-luar (tidak mengubah visual; membantu UX) */}
        {open && (
          <button
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 md:hidden bg-transparent"
          />
        )}

        {/* DROPDOWN MOBILE – floating terpisah + animasi slide+fade */}
        <div className="md:hidden relative z-50">
          <div
            id="mobile-menu"
            className={
              [
                "mx-auto max-w-lg",
                "rounded-xl border border-white/10",
                "bg-gradient-to-b from-gray-800 to-gray-900",
                "shadow-lg",
                "py-4 px-6",
                "flex flex-col items-center space-y-3 text-lg font-italic",
                // ANIMASI
                "transform-gpu transition-all duration-300",
                open
                  ? "opacity-100 translate-y-3 scale-100 pointer-events-auto"
                  : "opacity-0 -translate-y-1 scale-95 pointer-events-none",
              ].join(" ")
            }
            // kasih gap dari navbar agar terlihat terpisah
            style={{ marginTop: open ? "0.75rem" : "0rem" }} // 12px saat open
          >
            <Link href="/" className="w-full text-center hover:bg-gray-500 p-2 rounded-md" onClick={() => setOpen(false)}>Home</Link>
            <Link href="#" className="w-full text-center hover:bg-gray-500 p-2 rounded-md" onClick={() => setOpen(false)}>Project</Link>
            <Link href="/about" className="w-full text-center hover:bg-gray-500 p-2 rounded-md" onClick={() => setOpen(false)}>About</Link>
            <Link href="#" className="w-full text-center hover:bg-gray-500 p-2 rounded-md" onClick={() => setOpen(false)}>Resume</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
