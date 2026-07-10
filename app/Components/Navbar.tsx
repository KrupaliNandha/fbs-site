"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [desktopServiceOpen, setDesktopServiceOpen] = useState(false);

  const linkClass = (path: string) =>
    `relative px-3 py-2 text-black transition
     after:content-[''] after:absolute after:right-0 after:bottom-0
     after:h-[2px] after:w-0 after:bg-black
     after:transition-all after:duration-300
     hover:after:w-full hover:after:left-0
     ${pathname === path ? "after:w-full after:left-0" : ""}`;

  const parentLinkClass = (path: string) =>
    `relative px-3 py-2 text-black transition
     after:content-[''] after:absolute after:right-0 after:bottom-0
     after:h-[2px] after:w-0 after:bg-black
     after:transition-all after:duration-300
     hover:after:w-full hover:after:left-0
     ${pathname.startsWith(path) ? "after:w-full after:left-0" : ""}`;

  const dropdownLinkClass = (path: string) =>
    pathname === path
      ? "block px-4 py-2"
      : "block px-4 py-2 rounded-lg text-primary-dark/60 transition hover:text-primary-dark/80";

  return (
    <>
      {/* HEADER */}
      <header className="top-0 z-50 fixed w-full shadow-md bg-white">
        <nav className="flex items-center justify-between container section-padding-header">
          {/* LOGO */}
          <Link href="/" aria-label="FBS Prints home">
            <Image
              src="/images/brand/fbs-prints-logo.webp"
              alt="FBS Prints logo"
              width={160}
              height={60}
              priority
              style={{ height: "70px", width: "auto" }}
            />
          </Link>

          {/* DESKTOP MENU */}
          <ul className="hidden lg:flex items-center gap-2 text-xl font-medium">
            <li>
              <Link href="/" className={linkClass("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className={linkClass("/about")}>
                About Us
              </Link>
            </li>

            {/* SERVICES DROPDOWN */}
            <li
              className="relative"
              onMouseEnter={() => setDesktopServiceOpen(true)}
              onMouseLeave={() => setDesktopServiceOpen(false)}
            >
              <button
                className={`${parentLinkClass("/services")} flex items-center gap-1`}
                onClick={() => setDesktopServiceOpen(!desktopServiceOpen)}
              >
                Services ▾
              </button>
              <ul
                className={`absolute top-12 left-0 w-52 bg-white shadow-xl rounded-xl py-3 transition-all duration-300 z-50
                ${desktopServiceOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}`}
              >
                {[
                  ["Printing Product", "/services/printing-products"],
                  ["Signage", "/services/signage"],
                  ["Direct Mailing", "/services/direct-mailing"],
                  ["Web Design", "/services/web-design"],
                  ["SEO", "/services/seo"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className={dropdownLinkClass(href)}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link href="/contact" className={linkClass("/contact")}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/blog" className={parentLinkClass("/blog")}>
                Blog
              </Link>
            </li>
          </ul>

          {/* DESKTOP RIGHT */}
          <div className="hidden lg:flex items-center gap-3">
            <Image
              src="/images/brand/one-hundred-percent-badge.gif"
              alt="100 percent satisfaction badge"
              width={96}
              height={96}
              unoptimized
              className="w-24 h-auto"
            />
            <button className="flex items-center gap-3 bg-primary px-3 py-2 rounded-full">
              <span className="font-semibold">BOOK A SERVICE</span>
              <Link href="/contact">
                <span className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full">
                  <FiArrowUpRight />
                </span>
              </Link>
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className={`lg:hidden z-[10] transition-opacity duration-300
            ${menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <IoIosMenu size={34} className="text-black" />
          </button>
        </nav>
      </header>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 lg:hidden
        ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* MOBILE SLIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-dvh w-[75%] max-w-[340px]
        bg-white z-50 transform transition-transform duration-500
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:hidden flex flex-col`}
      >
        {/* CLOSE BUTTON */}
        <div className="flex items-center justify-between px-8 pt-8 pb-3">
          <span className="text-black text-sm tracking-[0.1em] uppercase">
            Menu
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-white/20 transition"
            aria-label="Close menu"
          >
            <IoClose size={25} className="text-black" />
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-8 pt-4">
          <ul className="space-y-1">
            {[
              ["HOME", "/"],
              ["ABOUT US", "/about"],
              ["BLOG", "/blog"],
              ["CONTACT", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-black text-xl tracking-[0.10em]"
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* SERVICES ACCORDION */}
            <li className="border-b border-black/[0.06] pb-10">
              <button
                onClick={() => setServiceOpen(!serviceOpen)}
                className="w-full flex items-center justify-between py-2 text-black text-xl tracking-[0.10em]"
              >
                SERVICES
                <span
                  className={`transition-transform ${serviceOpen ? "rotate-180" : ""} text-2xl flex items-center justify-center`}
                >
                  ▾
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all ${serviceOpen ? "max-h-72 pb-3" : "max-h-0"}`}
              >
                {[
                  ["Printing Product", "/services/printing-products"],
                  ["Signage", "/services/signage"],
                  ["Direct Mailing", "/services/direct-mailing"],
                  ["Web Design", "/services/web-design"],
                  ["SEO", "/services/seo"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block pl-4 py-2 text-black hover:text-white text-md uppercase"
                  >
                    - {label}
                  </Link>
                ))}
              </div>
            </li>
          </ul>
          <div className="py-10 space-y-4 justify-end items-end">
            <div className="flex items-center gap-2">
              <p>
                <FaEnvelope />
              </p>
              <p className="block text-black hover:text-white/70 text-md tracking-wide transition-colors duration-200">
                info@fbsprints.com
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p>
                <FaPhoneAlt />
              </p>
              <p className="block  text-black hover:text-white/70 text-md tracking-wide transition-colors duration-200">
                +1-855-222-1133
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p>
                <FaMapMarkerAlt />
              </p>
              <p className="block  text-black hover:text-white/70 text-md tracking-wide transition-colors duration-200">
                Serving Naperville & Schaumburg, IL
              </p>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
