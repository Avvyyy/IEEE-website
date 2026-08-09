"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { SiteConfig } from "@/lib/types";

export function Hero({ site }: { site: SiteConfig }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % site.heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [site.heroImages.length]);

  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={site.heroImages[index]}
            alt="IEEE Babcock SB branch activities"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-deep/70 via-deep/60 to-deep" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep/80 via-deep/20 to-transparent" />

      <div className="relative z-10 h-full container-page flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-accent-gold font-semibold tracking-widest uppercase text-sm mb-4"
        >
          {site.shortName} · {site.region}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold max-w-3xl leading-tight text-gradient"
        >
          {site.tagline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg text-body"
        >
          {site.branchName} is a community of engineers and innovators building the future,
          one project at a time.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href={site.joinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-8 py-4 text-base font-semibold text-white shadow-lg shadow-ieee-blue/30 transition-all hover:bg-ieee-blue-light active:scale-95"
          >
            Join IEEE
            <ChevronRight size={18} />
          </a>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/5 active:scale-95"
          >
            Learn More
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {site.heroImages.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-accent-gold" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
