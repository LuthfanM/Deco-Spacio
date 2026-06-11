"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#191816]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d8d0c2] bg-white/70 px-4 py-2 text-sm text-[#5b554c] shadow-sm">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-[#bf7c45]" />
            Next.js 15 + Tailwind CSS 4 starter
          </div>

          <h1 className="text-5xl font-semibold tracking-normal text-balance sm:text-7xl">
            Deco Spacio
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5b554c] sm:text-xl">
            A clean boilerplate with TypeScript, App Router, Tailwind CSS,
            lucide-react icons, and Motion ready for product UI work.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="https://nextjs.org/docs"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#191816] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#34312c] focus:outline-none focus:ring-2 focus:ring-[#bf7c45] focus:ring-offset-2"
            >
              Next docs
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href="https://tailwindcss.com/docs"
              className="inline-flex min-h-11 items-center rounded-md border border-[#d8d0c2] bg-white px-5 py-3 text-sm font-medium text-[#191816] transition hover:border-[#b8ad9d] focus:outline-none focus:ring-2 focus:ring-[#bf7c45] focus:ring-offset-2"
            >
              Tailwind docs
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
