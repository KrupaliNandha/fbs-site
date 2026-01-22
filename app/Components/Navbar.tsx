"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  const linkClass = (path: string) =>
    pathname === path
      ? "bg-gradient-to-r from-pink-700 to-green-400 text-white px-4 py-2 rounded-full"
      : "px-4 py-2 text-black rounded-full transition hover:bg-gray-200";

  return (
    <header className="top-0 z-50 w-full shadow-md bg-white px-4 py-2">
      <nav className="flex items-center justify-between  max-w-7xl mx-auto">
        {/* LOGO */}
        <Image
          src="/FBS-LOGO.png"
          alt="Printing Service"
          width={70}
          height={50}
          className="w-auto h-auto"
        />

        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-2 text-lg bg-gray-100 p-4 rounded-full font-medium">
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
          <li className="relative group">
            <span
              className={`${linkClass("/services")} flex items-center gap-1 cursor-pointer`}
            >
              Services ▾
            </span>

            {/* DROPDOWN */}
            <ul className="absolute top-12 left-0 w-52 bg-white shadow-xl rounded-xl py-3 opacity-0 invisible translate-y-2 transition-all duration-300 ease-in group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-50">
              <li>
                <Link
                  href="/services/Printing-Product"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Printing Product{" "}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/Signage"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Signage
                </Link>
              </li>
              <li>
                <Link
                  href="/services/Direct-MaIilintg"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Direct MaIilintg
                </Link>
              </li>
              <li>
                <Link
                  href="/services/Web-Design"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Web Design
                </Link>
              </li>
              <li>
                <Link
                  href="/services/SEO"
                  className="block px-4 py-2 hover:bg-gray-100"
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

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-4">
          <img src="/100-percent.gif" alt="gif" className="w-24" />
          <button className="rounded bg-yellow-400 px-6 py-2 font-semibold text-white">
            Custom Print <br /> Order Now
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
        <div className="lg:hidden bg-white px-4 py-4 text-lg">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>{" "}
          <br />
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About Us
          </Link>
          {/* MOBILE SERVICES */}
          <div>
            <button
              onClick={() => setServiceOpen(!serviceOpen)}
              className="font-semibold"
            >
              Services ▾
            </button>

            {serviceOpen && (
              <div className="ml-4">
                <Link href="/services/Printing-Product">Printing Product</Link>
                <br />
                <Link href="/services/Signage">Signage</Link>
                <br />
                <Link href="/services/Direct-MaIilintg">Direct MaIilintg</Link>
                <br />
                <Link href="/services/Web-Design">Web Design</Link>
                <br />
                <Link href="/services/SEO">SEO</Link>
              </div>
            )}
          </div>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact Us
          </Link>
          <div className="items-center gap-4">
            <div>
              <img src="/100-percent.gif" alt="gif" className="w-24" />
            </div>
            <div className="pt-5">
              <button className="rounded bg-yellow-400 px-6 py-2 font-semibold text-white">
                Custom Print <br /> Order Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
