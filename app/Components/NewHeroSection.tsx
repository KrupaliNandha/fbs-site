"use client";

import React from "react";
import {
  Play,
  Printer,
  PenLine,
  Clock,
  Headphones,
  Smile,
  Copy,
  Award,
} from "lucide-react";

/**
 * FBS Signs — Home Hero Section
 * Brand colors pulled from the logo:
 *   cyan/blue  #16A8E2
 *   magenta    #E91580
 *   yellow     #F6C915
 *   navy text  #14142B
 *   bg blush   #FDEFF3
 *
 * Required image assets (place in /public/images/home/):
 *   Home-1-v2.png -> notebook + business cards + brochure cutout
 *   Home-2-v2.png -> succulent planter cutout
 */

const stats = [
  { icon: Smile, value: "500+", label: "Happy Clients" },
  { icon: Copy, value: "10K+", label: "Projects Done" },
  { icon: Award, value: "5+", label: "Years Experience" },
];

const features = [
  {
    icon: Printer,
    color: "#E91580",
    title: "High Quality Printing",
    desc: "We use the latest technology to deliver top-notch prints.",
  },
  {
    icon: PenLine,
    color: "#16A8E2",
    title: "Creative Design",
    desc: "Eye-catching designs that communicate your brand.",
  },
  {
    icon: Clock,
    color: "#F6A315",
    title: "On-Time Delivery",
    desc: "We value your time and ensure fast delivery.",
  },
  {
    icon: Headphones,
    color: "#22A85B",
    title: "Dedicated Support",
    desc: "Our team is always here to help you.",
  },
];

export default function NewHeroSection() {
  return (
    <section className="w-full bg-white mt-16 md:mt-20">
      {/* ---------------- Hero ---------------- */}
      <div
        className="relative pt-2 md:pt-6 lg:pt-8"
        style={{ backgroundColor: "#FDEEF4" }}
      >
        {/* Background decors, clipped so they never bleed above this section */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Background decors, clipped so they never bleed above this section */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* {/ Bold diagonal pink shape - right side (matches reference design) /} */}
            <svg
              className="absolute right-0 top-0 hidden h-[50%] w-[70%] md:block"
              viewBox="0 0 900 700"
              fill="none"
              preserveAspectRatio="xMaxYMin slice"
            >
              <defs>
                <linearGradient
                  id="fbsPinkGradient"
                  x1="120"
                  y1="650"
                  x2="850"
                  y2="80"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#FF8FC0" />
                  <stop offset="50%" stopColor="#F0439A" />
                  <stop offset="100%" stopColor="#E91580" />
                </linearGradient>
              </defs>
              <path
                d="M900 0H520L190 360C95 455 105 610 220 700H900V0Z"
                fill="url(#fbsPinkGradient)"
              />
            </svg>

            {/* Dot pattern, upper-left */}
            <div
              className="absolute left-10 top-8 hidden h-40 w-64 opacity-50 md:block"
              style={{
                backgroundImage:
                  "radial-gradient(#EE9BC0 1.6px, transparent 1.6px)",
                backgroundSize: "16px 16px",
              }}
            />
          </div>
        </div>

        <div className="container relative mx-auto grid grid-cols-2 gap-10">
          {/* ---- Left: copy ---- */}
          <div className="relative z-10 flex flex-col justify-center">
            <span
              className="mb-4 text-sm font-bold tracking-[0.2em]"
              style={{ color: "#E91580" }}
            >
              PRINT. PROMOTE. GROW.
            </span>

            <p
              className="text-7xl font-bold leading-tight sm:text-5xl"
              style={{ color: "#161629" }}
            >
              Powerful Prints.
              <br />
              Smart Marketing.
              <br />
              <span style={{ color: "#E91580" }}>Real Results.</span>
            </p>

            <p className="mt-5 max-w-md pb-8 text-base leading-relaxed text-slate-600">
              High-quality printing solutions and creative marketing that help
              your business stand out and grow.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
                style={{ backgroundColor: "#E91580" }}
              >
                <Printer size={18} />
                Explore Services
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#161629" }}
                >
                  <Play size={11} fill="white" color="white" />
                </span>
                View Our Work
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6">
              {stats.map(({ icon: Icon, value, label }, idx) => (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-3">
                    <Icon
                      size={28}
                      strokeWidth={1.5}
                      style={{
                        color:
                          label === "Happy Clients"
                            ? "#E91580"
                            : label === "Projects Done"
                              ? "#16A8E2"
                              : "#F6A315",
                      }}
                    />
                    <div className="leading-tight">
                      <p
                        className="text-lg font-extrabold"
                        style={{ color: "#161629" }}
                      >
                        {value}
                      </p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  </div>
                  {idx !== stats.length - 1 && (
                    <div className="hidden h-10 w-[1px] bg-slate-300 sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ---- Right: Hero Images ---- */}
          <div className="relative flex items-center w-full justify-center">
            {/*
                            Fixed-height stage that both images are absolutely
                            positioned inside of. This is the key change: every
                            class here is a real Tailwind utility, so nothing gets
                            silently dropped like `top-50` / `z-100` did before.
                        */}
            <div className="relative h-[380px] w-full sm:h-[460px] lg:h-[560px]">
              {/* Main mockup — notebook, business cards, brochure */}
              <div>
                <img
                  src="/images/home/Home-1-v2.png"
                  alt="FBS Signs branded notebook, business cards, and brochure mockup"
                  className="absolute inset-0 -top-4 z-20 h-full w-full drop-shadow-2xl scale-[1.2]"
                />
              </div>

              <div>
                {/* Plant — anchored to the right edge, roughly mid-height, in front */}
                <img
                  src="/images/home/Home-2-v2.png"
                  alt="Succulent plant in a geometric pot"
                  className="absolute inset-0 z-30 left-1/2 -top-16 blur-sm h-full w-full object-contain drop-shadow-2xl scale-[0.8]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Feature strip (floating card) ---------------- */}
      <div className="container relative z-40 -top-28 mx-auto px-6 pb-16 pt-16 md:px-10">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[1.5rem] bg-white px-6 py-8 shadow-[0_4px_20px_rgb(0,0,0,0.05)] lg:flex-row lg:gap-0 lg:px-8">
          {features.map(({ icon: Icon, color, title, desc }, index) => (
            <React.Fragment key={title}>
              <div className="flex w-full items-center gap-5 lg:w-auto lg:flex-1 lg:justify-center">
                <span
                  className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-full border-[1.5px]"
                  style={{ borderColor: color, color }}
                >
                  <Icon size={26} strokeWidth={2} />
                </span>
                <div className="flex max-w-[210px] flex-col justify-center">
                  <h3
                    className="text-[16px] font-bold tracking-tight"
                    style={{ color: "#14142B" }}
                  >
                    {title}
                  </h3>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">
                    {desc}
                  </p>
                </div>
              </div>
              {index !== features.length - 1 && (
                <>
                  <div className="hidden h-12 w-[1px] flex-none bg-slate-200 lg:block lg:mx-4 xl:mx-8" />
                  <div className="h-[1px] w-[80%] bg-slate-100 lg:hidden" />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
