import Image from "next/image";
import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaFacebookF,
  FaDribbble,
  FaBehance,
} from "react-icons/fa";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { IconType } from "react-icons";
import Link from "next/link";

export default function Footer() {
  const socialIcons: {
    name: string;
    Icon: IconType;
    url: string;
  }[] = [
    { name: "Twitter", Icon: FaTwitter, url: "https://twitter.com" },
    { name: "LinkedIn", Icon: FaLinkedin, url: "https://linkedin.com" },
    { name: "Instagram", Icon: FaInstagram, url: "https://instagram.com" },
    { name: "Facebook", Icon: FaFacebookF, url: "https://facebook.com" },
    { name: "Dribbble", Icon: FaDribbble, url: "https://dribbble.com" },
    { name: "Behance", Icon: FaBehance, url: "https://behance.net" },
  ];

  return (
    <footer data-aos="fade-up" className="pt-10 px-4">
      {/* Mind-Section */}
      <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image */}
        <Image
          src="/Footer.png"
          alt="Creative Mind Bulb"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">
            Have Projects in Mind?
          </h2>

          <p className="text-white/90 text-base md:text-xl font-semibold mb-8">
            Let’s work together to build something great
          </p>

          <button
            className="px-10 py-4 rounded-full text-white font-semibold
          bg-gradient-to-r from-pink-500 to-orange-400
          hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-200 relative px-6 py-12">
        <div
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Logo */}
          <div className="flex flex-col justify-self-center lg:justify-start">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute w-full h-full border-2 shadow-lg rotate-48 rounded-xl"></div>
              <Image
                src="/FBS-LOGO.png"
                alt="Profile"
                width={70}
                height={70}
                className="relative z-10"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold pt-5 text-center">FBS Prints</h1>
            </div>
          </div>

          {/* Pages */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-pink-700">Pages</h1>
            <ul className="text-lg font-semibold pt-5 space-y-1">
              <li>Home</li>
              <li>Services</li>
              <li>Project</li>
              <li>About Us</li>
              <li>Blog</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center">
            <p className="flex flex-col text-xl items-center gap-2 font-semibold">
              <FaPhoneAlt className="text-3xl mx-auto mb-2 text-pink-700" /> +1-855-222-1133
            </p>
            <p className="flex flex-col text-xl items-center gap-2 font-semibold pt-4">
              <FaEnvelope className="text-3xl mx-auto mb-2 text-pink-700" />{" "}
              Info@fbsprints.com
            </p>
          </div>

          {/* Location */}
          <div className="text-center">
            <FaMapMarkerAlt className="text-3xl mx-auto mb-2 text-pink-700" />
            <p className="font-semibold">Illinois, USA</p>
          </div>
        </div>

        {/* Social Icons */}
        <div
          className="
    absolute left-1/2 -bottom-10 -translate-x-1/2
    flex gap-3 bg-gray-200 px-4 py-2
    rounded-full shadow-lg
  "
        >
          {socialIcons.map(({ name, Icon, url }, i) => (
            <Link
              key={i}
              href={url}
              target="_blank"
              aria-label={name}
              className="relative group"
            >
              <Icon
                className="
          bg-white text-pink-700
          p-3 rounded-full
          text-4xl sm:text-5xl
          transition-all duration-300
          hover:bg-pink-700  hover:text-white
          group-hover:scale-110
        "
              />
              <span
                className="
          absolute -top-7 left-1/2 -translate-x-1/2
          bg-black text-white text-xs px-2 py-1 rounded
          opacity-0 group-hover:opacity-100
          transition
        ">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-pink-700 text-white px-4 py-3 mt-10">
        <div
          className="
      max-w-7xl mx-auto
      flex flex-col sm:flex-row
      justify-between items-center gap-2
    "
        >
          <p className="text-sm text-center">
            2026 © All rights reserved. FBS PRINTS.
          </p>
          <p className="cursor-pointer hover:underline text-sm">
            Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
}
