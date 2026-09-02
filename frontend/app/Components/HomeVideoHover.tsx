"use client";

import Image from "next/image";

export default function HomeVideoHover() {
  return (
    <section className="container section-padding overflow-x-hidden">
      <div className="relative group overflow-hidden shadow-lg rounded-2xl">
        <Image
          src="/images/home/video.jpg"
          alt="FBS Signs print and signage service showcase"
          width={800}
          height={500}
          className="w-full h-96 md:h-[500px] object-cover"
        />
        <video
          src="/fbs.mp4"
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
      </div>
    </section>
  );
}
