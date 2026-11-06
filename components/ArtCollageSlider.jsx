"use client";

import { useMemo } from "react";

const ARTWORKS = [
  {
    id: "art-1",
    src: "/art/822454183_18116058677070803_7997214052897677537_n.jpg",
    aspect: "aspect-[4/5]",
  },
  {
    id: "art-2",
    src: "/art/823606039_18116134385070803_3865341406544213906_n.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: "art-3",
    src: "/art/817902603_18115636340070803_3091029228027957233_n.jpg",
    aspect: "aspect-[4/5]",
  },
  {
    id: "art-4",
    src: "/art/818988016_18116134361070803_5613175907062480033_n.jpg",
    aspect: "aspect-[1/1]",
  },
  {
    id: "art-5",
    src: "/art/794222736_18113991668070803_4825890433763461046_n.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: "art-6",
    src: "/art/813661180_18115305131070803_8784916059366770496_n.jpg",
    aspect: "aspect-[4/5]",
  },
  {
    id: "art-7",
    src: "/art/811266960_18115098530070803_4087374646249167423_n.jpg",
    aspect: "aspect-[1/1]",
  },
  {
    id: "art-8",
    src: "/art/810148848_18115030028070803_5556986987562606541_n.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: "art-9",
    src: "/art/751035238_18109216892070803_7635210586793161675_n.jpg",
    aspect: "aspect-[4/5]",
  },
  {
    id: "art-10",
    src: "/art/727621305_18106189697070803_8331127044024333624_n.jpg",
    aspect: "aspect-[1/1]",
  },
  {
    id: "art-11",
    src: "/art/655428058_18542777713071262_2316752950858361917_n.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: "art-12",
    src: "/art/489590201_18062396645070803_1654056798950479995_n.webp",
    aspect: "aspect-[4/5]",
  },
  {
    id: "art-13",
    src: "/art/489288189_18062396654070803_5449039346745997428_n.webp",
    aspect: "aspect-[3/4]",
  },
];

function ArtCard({ art }) {
  return (
    <div className="group/art relative overflow-hidden rounded-2xl bg-[#F8F5EE] p-2 sm:p-2.5 border border-[#EBE4D8] shadow-[0_10px_30px_rgba(30,25,20,0.06)] transition-all duration-500 hover:shadow-[0_20px_45px_rgba(201,169,110,0.24)] hover:border-[#C9A96E]/60 hover:-translate-y-1">
      {/* Archival Artwork Matting */}
      <div className={`relative w-full ${art.aspect} overflow-hidden rounded-xl bg-[#EFECE6]`}>
        <img
          src={art.src}
          alt="Nancy Sikri Original Artwork"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/art:scale-105"
        />
        {/* Subtle Canvas Inner Rim */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl" />
      </div>
    </div>
  );
}

export default function ArtCollageSlider() {
  // Curate 3 columns with diverse styles & color stories
  const columnA = useMemo(() => [
    ARTWORKS[0],
    ARTWORKS[8],
    ARTWORKS[2],
    ARTWORKS[12],
  ], []);

  const columnB = useMemo(() => [
    ARTWORKS[1],
    ARTWORKS[4],
    ARTWORKS[7],
    ARTWORKS[10],
    ARTWORKS[9],
  ], []);

  const columnC = useMemo(() => [
    ARTWORKS[3],
    ARTWORKS[5],
    ARTWORKS[6],
    ARTWORKS[11],
  ], []);

  return (
    <div className="animate-collage-fade-in relative w-full h-full overflow-hidden select-none bg-[#F7F3EC]/50 rounded-3xl border border-[#E8DDD0] shadow-[0_12px_40px_rgba(30,25,20,0.04)]">
      {/* Warm Ambient Atelier Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,110,0.18)_0%,_transparent_75%)]" />

      {/* Top & Bottom Vignette Mask to smoothly dissolve infinite loop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-44 bg-gradient-to-b from-[#FDFAF5] via-[#FDFAF5]/80 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-[#FDFAF5] via-[#FDFAF5]/80 to-transparent z-20" />

      {/* Subtle Side Vignette for softer blending */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10 bg-gradient-to-r from-[#FDFAF5]/40 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-10 bg-gradient-to-l from-[#FDFAF5]/40 to-transparent z-10" />

      {/* ── DESKTOP & TABLET: 3 Staggered Kinetic Columns (Widened spacing) ── */}
      <div className="hidden sm:grid grid-cols-3 gap-4 lg:gap-5 h-full p-4 lg:p-6 items-start">
        {/* Column 1: Smooth Upward Flow */}
        <div className="relative overflow-hidden h-full">
          <div className="flex flex-col gap-4 lg:gap-5 animate-collage-up-slow">
            {columnA.concat(columnA).map((art, idx) => (
              <ArtCard key={`colA-${art.id}-${idx}`} art={art} />
            ))}
          </div>
        </div>

        {/* Column 2: Smooth Downward Flow (Alternating Direction) */}
        <div className="relative overflow-hidden h-full">
          <div className="flex flex-col gap-4 lg:gap-5 animate-collage-down-slow">
            {columnB.concat(columnB).map((art, idx) => (
              <ArtCard key={`colB-${art.id}-${idx}`} art={art} />
            ))}
          </div>
        </div>

        {/* Column 3: Medium Upward Flow */}
        <div className="relative overflow-hidden h-full">
          <div className="flex flex-col gap-4 lg:gap-5 animate-collage-up-medium">
            {columnC.concat(columnC).map((art, idx) => (
              <ArtCard key={`colC-${art.id}-${idx}`} art={art} />
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE: 2 Elegant Kinetic Columns ── */}
      <div className="grid sm:hidden grid-cols-2 gap-3 h-full p-3 items-start">
        <div className="relative overflow-hidden h-full">
          <div className="flex flex-col gap-3 animate-collage-up-slow">
            {columnA.concat(columnB.slice(0, 2)).concat(columnA).map((art, idx) => (
              <ArtCard key={`mobA-${art.id}-${idx}`} art={art} />
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden h-full">
          <div className="flex flex-col gap-3 animate-collage-down-slow">
            {columnB.slice(2).concat(columnC).concat(columnB.slice(2)).map((art, idx) => (
              <ArtCard key={`mobB-${art.id}-${idx}`} art={art} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
