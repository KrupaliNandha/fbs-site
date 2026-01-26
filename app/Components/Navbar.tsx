"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  /* ================= CLASSES ================= */

  const linkClass = (path: string) =>
    pathname === path
      ? "bg-gradient-to-r from-pink-700 to-green-400 text-white px-3 py-2 rounded-full"
      : "px-3 py-2 text-black border border-gray-200 rounded-full transition";

  const parentLinkClass = (path: string) =>
    pathname.startsWith(path)
      ? "bg-gradient-to-r from-pink-700 to-green-400 text-white px-3 py-2 rounded-full"
      : "px-3 py-2 text-black border border-gray-200 rounded-full transition";

  const dropdownLinkClass = (path: string) =>
    pathname === path
      ? "block px-4 py-2 bg-gradient-to-r from-pink-700 to-green-400 text-white rounded-lg"
      : "block px-4 py-2 text-black hover:bg-gray-100 rounded-lg";

  const mobileLinkClass = (path: string) =>
    pathname === path
      ? "block w-full bg-gradient-to-r from-pink-700 to-green-400 text-white px-4 py-3 rounded-xl"
      : "block w-full px-4 py-3 text-black border border-gray-200 rounded-xl";

  /* ================= JSX ================= */

  return (
    <header className="top-0 z-50 w-full shadow-md bg-white py-2">
      <nav className="flex items-center justify-between container mx-auto section-padding-header">
        {/* LOGO */}
        <Image
          src="/FBS-LOGO.png"
          alt="Printing Service"
          width={70}
          height={50}
          className="w-25 h-auto"
        />

        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-2 text-md font-medium">
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

          {/* SERVICES */}
          <li className="relative group">
            <span
              className={`${parentLinkClass(
                "/services",
              )} flex items-center gap-1 cursor-pointer`}
            >
              Services ▾
            </span>

            <ul className="absolute top-12 left-0 w-52 bg-white shadow-xl rounded-xl py-3 opacity-0 invisible translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-50">
              <li>
                <Link
                  href="/services/Printing-Product"
                  className={dropdownLinkClass("/services/Printing-Product")}
                >
                  Printing Product
                </Link>
              </li>
              <li>
                <Link
                  href="/services/Signage"
                  className={dropdownLinkClass("/services/Signage")}
                >
                  Signage
                </Link>
              </li>
              <li>
                <Link
                  href="/services/Direct-MaIilintg"
                  className={dropdownLinkClass("/services/Direct-Mailing")}
                >
                  Direct Mailing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/Web-Design"
                  className={dropdownLinkClass("/services/Web-Design")}
                >
                  Web Design
                </Link>
              </li>
              <li>
                <Link
                  href="/services/SEO"
                  className={dropdownLinkClass("/services/SEO")}
                >
                  SEO
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link href="/know-you" className={linkClass("/know-you")}>
              Know Your Sign
            </Link>
          </li>
          <li>
            <Link href="/contact" className={linkClass("/contact")}>
              Contact Us
            </Link>
          </li>
        </ul>

        {/* DESKTOP RIGHT */}
        <div className="hidden lg:flex items-center gap-3">
          <img src="/100-percent.gif" alt="gif" className="w-24" />
          <button className="flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-2 rounded-full rounded-tr-[100px] shadow-md transition">
            <span>BOOK A SERVICE</span>
            <span className="flex items-center justify-center w-10 h-10 bg-pink-700 text-white rounded-full">
              <FiArrowUpRight />
            </span>
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="lg:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white px-8 py-4 space-y-3">
          <Link
            href="/"
            className={mobileLinkClass("/")}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={mobileLinkClass("/about")}
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>

          {/* MOBILE SERVICES */}
          <div>
            <button
              onClick={() => setServiceOpen(!serviceOpen)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-semibold flex justify-between"
            >
              Services ▾
            </button>

            {serviceOpen && (
              <div className="mt-2 space-y-2 pl-4">
                <Link
                  href="/services/Printing-Product"
                  className="block w-full px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Printing Product
                </Link>
                <Link
                  href="/services/Signage"
                  className="block w-full px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Signage
                </Link>
                <Link
                  href="/services/Direct-MaIilintg"
                  className="block w-full px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Direct Mailing
                </Link>
                <Link
                  href="/services/Web-Design"
                  className="block w-full px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Web Design
                </Link>
                <Link
                  href="/services/SEO"
                  className="block w-full px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  SEO
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/know-you"
            className={mobileLinkClass("/know-you")}
            onClick={() => setMenuOpen(false)}
          >
            Know Your Sign
          </Link>

          <Link
            href="/contact"
            className={mobileLinkClass("/contact")}
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </Link>

          <button className="flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-2 rounded-full rounded-tr-[100px] shadow-md transition">
            <span>BOOK A SERVICE</span>
            <span className="flex items-center justify-center w-10 h-10 bg-pink-700 text-white rounded-full">
              <FiArrowUpRight />
            </span>
          </button>
        </div>
      )}
    </header>
  );
}
