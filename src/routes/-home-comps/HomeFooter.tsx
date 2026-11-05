import { Mail, MapPin, Phone } from "lucide-react";

import logoMark from "@/app/image/logo-mark.png";

const quickLinks = [
  { label: "Home", href: "/home" },
  { label: "About Us", href: "/home/about-us" },
  { label: "Our Work", href: "/home/our-work" },
  { label: "Contact Us", href: "/home/contact-us" },
  { label: "Policies", href: "/home/policies" },
];

export default function HomeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative isolate overflow-hidden bg-[#0b4b2b] text-white">
      <img
        src="/home_page/section_2_bg.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

      <div className="mx-auto max-w-[1240px] px-5 pb-7 pt-14 sm:px-8 sm:pt-16 lg:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.25fr_0.75fr_1.2fr] md:gap-8 lg:gap-16">
          <div>
            <a
              href="/home"
              aria-label="CREN home"
              className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b4b2b]"
            >
              <img src={"/footer_logo.png"} alt="" className="h-20 object-contain " />
            </a>
            <p className="mt-8 max-w-[220px] text-sm font-medium leading-[1.65] text-white/75">
              Powering Nigeria&apos;s Green Growth, Today and Tomorrow.
            </p>
          </div>

          <div>
            <h2 className="text-[0.82rem] font-semibold text-[#97d64c]">Quick Links</h2>
            <ul className="mt-4 grid gap-2.5 text-sm text-white/85">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition-colors duration-200 hover:text-[#97d64c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#97d64c]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.82rem] font-semibold text-[#97d64c]">Get in Touch</h2>
            <address className="mt-4 flex flex-col gap-3.5 text-sm not-italic leading-[1.65] text-white/85">
              <p className="flex items-start gap-3">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-[#97d64c]"
                  strokeWidth={1.8}
                />
                <span>
                  8 Bright Star Plaza, 50 Ebitu Ukiwe Street,
                  <br />
                  Jabi, Abuja, Nigeria.
                </span>
              </p>
              <a
                href="mailto:c.ren@greenmail.com"
                className="flex items-center gap-3 transition-colors duration-200 hover:text-[#97d64c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#97d64c]"
              >
                <Mail
                  aria-hidden="true"
                  className="size-4 shrink-0 text-[#97d64c]"
                  strokeWidth={1.8}
                />
                <span>cren.nigeria@greenmail.com</span>
              </a>
              <a
                href="tel:+2348035048073"
                className="flex items-center gap-3 transition-colors duration-200 hover:text-[#97d64c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#97d64c]"
              >
                <Phone
                  aria-hidden="true"
                  className="size-4 shrink-0 text-[#97d64c]"
                  strokeWidth={1.8}
                />
                <span>+234 803 504 9073</span>
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-5 text-[0.68rem] text-white/60 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Council for Renewable Energy Nigeria. All rights reserved.</p>
          <p>
            Design by: <span className="text-[#97d64c]">greenmouse</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
