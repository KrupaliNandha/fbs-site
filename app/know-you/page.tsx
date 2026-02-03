"use client";

import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Image from "next/image";
import SmoothScroll from "@/app/Components/SmoothScroll";
import Slider from "../Components/Slider";
import { useEffect, useState, useRef } from "react";
import "aos/dist/aos.css";

import PageLoader from "../Components/Preloader";

/* ================= HOVER CARD ================= */
function HoverCard({
  title,
  desc,
  thumb,
}: {
  title: string;
  desc: string;
  thumb: string;
}) {
  return (
    <div className="absolute  bottom-full left-1/2 -translate-x-1/2 mb-4 w-[250px] sm:w-[360px] rounded-2xl bg-pink-700 text-white shadow-2xl z-40">
      <div className="flex gap-4 p-4">
        {/* IMAGE */}
        <div className="relative w-20 sm:w-30 h-40 sm:h:45 bg-gray-300 rounded-xl overflow-hidden shrink-0">
          <Image
            src={thumb}
            alt={title}
            width={160}
            height={200}
            className="object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 text-center">
          <h4 className="text-md sm:text-2xl font-bold">{title}</h4>
          <p className="text-sm mt-2 text-white/90">{desc}</p>
          <button className="mt-4 bg-white text-pink-700 px-4 py-1.5 rounded-lg text-md font-semibold">
            Know More
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MAP ICON (CLICK) ================= */
function MapIcon({
  top,
  left,
  img,
  title,
  desc,
  thumb,
}: {
  top: string;
  left: string;
  img: string;
  title: string;
  desc: string;
  thumb: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${
        open ? "z-50" : "z-20"
      }`}
      style={{ top, left }}
    >
      {/* ICON */}
      <div
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 sm:w-12 sm:h-12 cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-pink-500 opacity-30 animate-ping"></span>
        <div className="absolute w-full h-full rounded-full bg-pink-700 shadow-lg overflow-hidden z-10">
          <Image
            src={img}
            alt="Location"
            fill
            sizes="48px"
            className="object-contain p-2"
          />{" "}
        </div>
      </div>

      {/* CARD */}
      {open && <HoverCard title={title} desc={desc} thumb={thumb} />}
    </div>
  );
}

/* ================= PAGE ================= */
export default function Page() {
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    import("aos").then((AOS) =>
      AOS.default.init({
        duration: 1200,
        once: true,
        easing: "ease-in-out",
        offset: 100,
      }),
    );
  }, []);

  const map1Markers = [
    {
      top: "38%",
      left: "19%",
      img: "/icons/text-tool.png",
      title: "Shop",
      desc: "A trusted shop serving your daily needs",
      thumb: "/SIMG.png",
    },
    {
      top: "60%",
      left: "56%",
      img: "/icons/pylon.png",
      title: "Pylon Sign",
      desc: "Tall freestanding signs designed for maximum roadside visibility.",
      thumb: "/SIMG.png",
    },
    {
      top: "41%",
      left: "71%",
      img: "/icons/text-tool.png",
      title: "Shop",
      desc: "A trusted shop serving your daily needs",
      thumb: "/SIMG.png",
    },
    {
      top: "66%",
      left: "24%",
      img: "/icons/stand.png",
      title: "Billboard Banner",
      desc: "Billboards deliver high-impact brand visibility on highways and busy streets.",
      thumb: "/SIMG.png",
    },
    {
      top: "36%",
      left: "33%",
      img: "/icons/text-tool.png",
      title: "Shop",
      desc: "A trusted shop serving your daily needs",
      thumb: "/SIMG.png",
    },
  ];

  const map2Markers = [
    {
      top: "39%",
      left: "20%",
      img: "/icons/stand.png",
      title: "Standee Display",
      desc: "Compact promotional displays ideal for retail spaces.",
      thumb: "/SIMG.png",
    },
    {
      top: "86%",
      left: "27%",
      img: "/icons/stand.png",
      title: "Standee Display",
      desc: "Compact promotional displays ideal for retail spaces.",
      thumb: "/SIMG.png",
    },
    {
      top: "27%",
      left: "265%",
      img: "/icons/stand.png",
      title: "Standee Display",
      desc: "Compact promotional displays ideal for retail spaces.",
      thumb: "/SIMG.png",
    },
    {
      top: "70%",
      left: "71%",
      img: "/icons/stand.png",
      title: "Standee Display",
      desc: "Ideal standee displays for events, stores, and promotions.",
      thumb: "/SIMG.png",
    },
    {
      top: "10%",
      left: "42%",
      img: "/icons/board-stand.png",
      title: "Standee Display",
      desc: "Compact promotional displays ideal for retail spaces.",
      thumb: "/SIMG.png",
    },
    {
      top: "21%",
      left: "29%",
      img: "/icons/text-tool.png",
      title: "Shop",
      desc: "A trusted shop serving your daily needs",
      thumb: "/SIMG.png",
    },
  ];

  return (
    <>
      {!loaderDone && <PageLoader onFinish={() => setLoaderDone(true)} />}
      <Navbar />
      <SmoothScroll>
        {/* SECTION 1 */}
        <section className="container">
          <div className="relative bg-white rounded-[32px] shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              {/* LEFT CONTENT */}
              <div
                data-aos="fade-right"
                className=" relative z-10 bg-white border-l-4 border-pink-600 p-5 sm:p-5 md:p-5 lg:p-8 lg:ml-14 lg:-mr-24 rounded-b-[32px] lg:rounded-2xl shadow-lg order-2 lg:order-1"
              >
                <div className="h-1 w-14 bg-pink-600 rounded-full mb-5"></div>

                <p className="mt-5 text-gray-600 font-bold text-4xl md:text-5xl lg:text-6xl text-center lg:text-start">
                  Know Your
                  <span className="text-pink-700"> Signs</span>
                </p>

                <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed lg:max-w-md text-center lg:text-start">
                  FBS Prints & Signs showcases an extensive collection of
                  business signage, awnings, and vehicle wraps we&apos;ve
                  designed and installed for our clients. Our gallery is
                  organized by sign type, making it easy to browse options like
                  channel letters, LED displays, pylon signs, menu boards, and
                  more. You&apos;ll also find behind-the-scenes photos
                  highlighting the sign-making process!
                </p>
              </div>

              {/* RIGHT IMAGE */}
              <div
                data-aos="fade-left"
                className="
                          relative h-[300px] sm:h-[400px] md:h-[480px] lg:h-[560px]
                          order-1 lg:order-2
                        "
              >
                <Image
                  src="/Knowyouimg1.jpg"
                  alt="Printing Service"
                  fill
                  priority
                  className="object-cover rounded-t-[32px] lg:rounded-r-[32px] lg:rounded-t-none"
                />

                <div className="absolute inset-0 rounded-t-[32px] lg:rounded-r-[32px] lg:rounded-t-none bg-gradient-to-l from-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="section-padding">
          <div className="relative w-full overflow-hidden">
            {/* MAP 1 */}
            <div className="relative aspect-[29/10] w-full sm:block hidden">
              <Image
                src="/Scene-4-01.jpg"
                alt="City Map 1"
                fill
                className="object-contain bg-white "
              />

              <div className="absolute inset-0">
                {map1Markers.map((m, i) => (
                  <MapIcon key={`m1-${i}`} {...m} />
                ))}
              </div>
            </div>

            {/* MAP 2 */}
            <div className="relative aspect-[29/10] w-full sm:block hidden">
              <Image
                src="/Scene-4-02.jpg"
                alt="City Map 2"
                fill
                className="object-contain bg-white"
              />

              <div className="absolute inset-0">
                {map2Markers.map((m, i) => (
                  <MapIcon key={`m2-${i}`} {...m} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Slider />
        <Footer />
      </SmoothScroll>
    </>
  );
}
