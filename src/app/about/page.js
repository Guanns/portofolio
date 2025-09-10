// src/app/about/page.js

import React from 'react';
import Image from 'next/image';
import PhotoDeck from './photoDeck';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-6 md:px-20 py-6 md:py-8">
      {/* --- Area Profil (Teks di Kiri, Foto di Kanan) --- */}
       <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-center">

        {/* --- KOLOM KIRI (HANYA TEKS) --- */}
        <div className="mt-6 md:mt-20 md:w-2/3">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 md:mb-6 text-center md:text-left">
            Andika Akhdan
          </h1>

          <div className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-300 leading-relaxed text-center md:text-left">
            <p>
              Hi, You can call me Andika or dika. Im a sophomore at Universitas Bina Sarana Informatika,
              majoring in Software Engineering. I'm passionate about building web applications and Software.
            </p>
            <p>
              Many valuable experiences have shaped who I am today from serving as the Student Council President in the 2022 until 2023 academic year.
              And being part of the ceremonial honor guard (Paskibra).
              I was born on June 20, 2005, a date I personally consider a meaningful one.
              Beyond those early milestones, I continue to grow through every opportunity, carrying forward a sense of discipline, leadership, and responsibility
              that I strive to apply in both my personal journey and professional aspirations.
            </p>
            <p>
              In the midst of my daily activities, I truly enjoy relaxing single-player games.
              I usually play them while listening to my favorite songs works by Tulus, Asumuh, Hindia, Maliq & D’Essentials, Ardhito Pramono, Arash Buana,
              along with a mix of other random tracks. It’s my way of unwinding, finding balance, and keeping creativity alive.
              Beyond entertainment, these small moments of leisure help me stay inspired, refreshed, and ready to face new challenges with a clear mind.
            </p>
          </div>
        </div>

        {/* --- KOLOM KANAN (PHOTO DECK) --- */}
        <div className="w-full md:w-auto flex justify-center md:justify-start mt-4 md:mt-0 lg:mt-40 md:ml-15">
          <PhotoDeck />
        </div>
      </div>

      {/* --- Area Lagu Favorit (Sekarang di Bawah dan Lebih Lebar) --- */}
      <div className="mt-10 md:mt-20">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white text-center">
          My Favorite Songs
        </h2>

        {/* DIUBAH: Grid sekarang menjadi 3 kolom di layar besar (lg) untuk tampilan lebih lebar */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-4">
          {/* GANTI SETIAP SRC DENGAN URL EMBED LAGU ANDA */}
          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/track/1gSlPyS178VS0UwWLbgjcl?si=8eb5d693ca044d77" // asumuh
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>

          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/track/72MEldEAmz3WMJ2MkII3kP?si=bafd6350ab024479" // sesaat kau hadir
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>

          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/track/1x9jnpPOAMSrr7DuIG5jMl?si=de88cc9401d24e23" // kita usahakan rumah itu
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>

          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/track/5TReP8XK4aTOe2m44ZjQqz?si=166cb4d0cb2c41b3" // tujuh belas
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>
          
          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/track/5i0klM2RR5OCpQcZUnJhhQ?si=99af1bc14b224ebe" // terkagum kagum
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>

          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/track/1rf43cwY7lqr7dqfeM23Jj?si=1f7290a1cdf0475b" // ARASH
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;