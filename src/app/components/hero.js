// src/app/components/hero.js
'use client'

import React, { useState, useEffect } from 'react';

const Hero = () => {
  const textUntukDitulis = [
    'Im Obsessed with Building.',
    'Code, Create, Innovate.',
    'Every project is a new story.',
    'I build not only apps, but also myself.'
  ];

  const kecepatanMengetik = 100;
  const kecepatanMenghapus = 50;
  const jedaAntarKata = 1500;

  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = textUntukDitulis[textIndex];

      if (isDeleting) {
        if (charIndex > 0) {
          setDisplayedText(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % textUntukDitulis.length);
        }
      } else {
        if (charIndex < currentText.length) {
          setDisplayedText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), jedaAntarKata);
        }
      }
    };

    const timeout = setTimeout(handleTyping, isDeleting ? kecepatanMenghapus : kecepatanMengetik);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, displayedText]);

  return (
  // mobile: center; md+: balik left
  <section className="flex flex-col items-center md:items-start justify-center px-4 pt-1 pb-2 md:pt-8 md:pb-8">
    <div className="w-full text-center md:text-left">
      <h1 className="font-italic text-4xl md:text-5xl leading-tight">
        Hi, I&apos;m Andika.
      </h1>
      <p className="mt-2 md:mt-4 text-base md:text-xl text-gray-300">
        Sophomore | Software Engineer@Ubsi
      </p>
      <p className="mt-2 md:mt-4 text-base md:text-xl font-italic h-[22px] md:h-8 overflow-hidden whitespace-nowrap text-ellipsis max-w-[90vw] mx-auto md:mx-0">
        <span>{displayedText}</span>
        <span className="animate-pulse">|</span>
      </p>
    </div>
  </section>
  );
};

export default Hero;