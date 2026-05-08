"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HeroSlide = {
  src: string;
  eyebrow: string;
  title: string;
  body: string;
};

export function HeroSlider({
  slides,
  latestNewsHref,
  programsHref,
  latestNewsLabel,
  programsLabel,
}: {
  slides: HeroSlide[];
  latestNewsHref: string;
  programsHref: string;
  latestNewsLabel: string;
  programsLabel: string;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = slides[activeSlide];
  const goToPrevious = () => setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  const goToNext = () => setActiveSlide((current) => (current + 1) % slides.length);

  useEffect(() => {
    if (slides.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7500);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      <div className="absolute inset-0 bg-[#12175f]">
        {slides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out",
              index === activeSlide ? "opacity-45" : "opacity-0",
            ].join(" ")}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12175f]/45 via-[#12175f]/15 to-[#12175f]/25" />
      </div>
      <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-slate-950/30 text-white shadow-lg backdrop-blur transition hover:bg-white hover:text-[#2f3192] sm:left-6"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={goToNext}
          className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-slate-950/30 text-white shadow-lg backdrop-blur transition hover:bg-white hover:text-[#2f3192] sm:right-6"
        >
          <ChevronRight size={22} />
        </button>
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-100">{currentSlide.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-normal sm:text-6xl">
            {currentSlide.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
            {currentSlide.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={latestNewsHref} className="rounded-md bg-[#249ac6] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#2f3192]">
              {latestNewsLabel}
            </Link>
            <Link href={programsHref} className="rounded-md bg-white px-5 py-3 text-sm font-bold text-[#2f3192] transition hover:bg-cyan-50">
              {programsLabel}
            </Link>
          </div>
        </div>
        <div className="mt-10 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeSlide}
              onClick={() => setActiveSlide(index)}
              className={[
                "h-3 w-3 rounded-full border border-white/80 transition",
                index === activeSlide ? "bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.2)]" : "bg-white/35 hover:bg-white/75",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </>
  );
}
