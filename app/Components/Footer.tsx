import Image from "next/image";
import Link from "next/link";
import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaFacebookF,
  FaDribbble,
  FaBehance,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IconType } from "react-icons";

export default function Footer() {
  const socialIcons: { name: string; Icon: IconType; url: string }[] = [
    { name: "Twitter", Icon: FaTwitter, url: "https://twitter.com" },
    { name: "LinkedIn", Icon: FaLinkedin, url: "https://linkedin.com" },
    { name: "Instagram", Icon: FaInstagram, url: "https://instagram.com" },
    { name: "Facebook", Icon: FaFacebookF, url: "https://facebook.com" },
    { name: "Dribbble", Icon: FaDribbble, url: "https://dribbble.com" },
    { name: "Behance", Icon: FaBehance, url: "https://behance.net" },
  ];

  return (
    <footer className="pt-10 relative overflow-hidden">
      {/* ===== CTA SECTION ===== */}
      <section className="relative h-[420px] flex items-center justify-center">
        <Image
          src="/Footer.png"
          alt="Footer Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h2 className="text-white text-4xl md:text-6xl font-bold mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-8">
            Let’s build something bold, creative & impactful together.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2
              px-10 py-4 rounded-full
              bg-gradient-to-r from-pink-500 to-green-400
              text-white font-semibold text-lg
              shadow-xl hover:scale-105 transition"
          >
            Contact Us →
          </Link>
        </div>
      </section>

      {/* ===== FOOTER MAIN ===== */}
      <section className="relative bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="p-5 section-padding">
          {/* Glass Card */}
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {/* Logo */}
            <div>
              <Image
                src="/FBS-LOGO.png"
                alt="FBS Prints"
                width={90}
                height={80}
              />
              <h3 className="text-xl font-bold mt-4">FBS Prints</h3>
              <p className="text-gray-600 mt-3">
                Premium printing solutions designed to elevate your brand.
              </p>
            </div>

            {/* Pages */}
            <div>
              <h4 className="text-lg font-semibold text-pink-600 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2 font-medium">
                {[
                  "Home",
                  "Services",
                  "Project",
                  "About Us",
                  "Blog",
                  "Contact Us",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item === "Home" ? "" : item.toLowerCase().replace(" ", "")}`}
                      className="hover:text-pink-600 transition"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold text-pink-600 mb-4">
                Services
              </h4>
              <ul className="space-y-2 font-medium">
                <li>
                  <Link href="/services/Printing-Product">
                    Printing Product
                  </Link>
                </li>
                <li>
                  <Link href="/services/Signage">Signage</Link>
                </li>
                <li>
                  <Link href="/services/Direct-MaIilintg">Direct Mailing</Link>
                </li>
                <li>
                  <Link href="/services/Web-Design">Web Design</Link>
                </li>
                <li>
                  <Link href="/services/SEO">SEO</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-pink-600 mb-4">
                Contact
              </h4>

              <div className="space-y-4 font-medium">
                <p className="flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
                  <FaPhoneAlt className="text-pink-600 shrink-0" />
                  <span>+1-855-222-1133</span>
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base break-all sm:break-normal">
                  <FaEnvelope className="text-pink-600 shrink-0" />
                  <span>info@fbsprints.com</span>
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <FaMapMarkerAlt className="text-pink-600 shrink-0" />
                  <span>Illinois, USA</span>
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
                {socialIcons.map(({ Icon, url, name }, i) => (
                  <Link
                    key={i}
                    href={url}
                    target="_blank"
                    aria-label={name}
                    className="
        flex items-center justify-center
        w-10 h-10 sm:w-8 sm:h-8
        rounded-full bg-white shadow
        text-pink-600
        hover:bg-pink-600 hover:text-white
        transition-all hover:-translate-y-1
        active:scale-95
      "
                  >
                    <Icon className="text-base sm:text-xl" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM BAR ===== */}
      <div className="bg-gradient-to-r from-pink-600 to-orange-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>© 2026 FBS PRINTS. All rights reserved.</p>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
