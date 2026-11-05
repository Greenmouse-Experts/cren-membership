import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import logoMark from "@/app/image/logo-mark.png";
import { Link } from "@tanstack/react-router";

type HomeNavProps = {
  activeHref?: string;
  className?: string;
};

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "/home/about-us" },
  { label: "Our Work", href: "/home/our-work" },
  { label: "Contact Us", href: "/home/contact-us" },
];

const navShape = {
  clipPath:
    "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)",
};

function EnquiriesLink({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/auth/register"
      className={`group h-12 items-center justify-center gap-3 bg-[#084c2a] px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#063a20] focus-visible:bg-[#063a20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white ${className}`}
      style={{
        clipPath:
          "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
      }}
    >
      <span>Become a member</span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={2.2}
      />
    </Link>
  );
}

export default function HomeNav({ activeHref = "#home", className = "" }: HomeNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const navLinkClass = (href: string) =>
    `rounded-sm py-2 text-sm lg:text-base font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015907] focus-visible:ring-offset-4 ${
      activeHref === href ? "text-[#0a7a3c]" : "text-[#161616] hover:text-[#015907]"
    }`;

  return (
    <header
      id="home"
      className={`w-full bg-transparent px-4 py-4 sm:px-6 lg:px-8 ${className} absolute z-20 top-0`}
    >
      <div className="mx-auto container drop-shadow-[0_18px_36px_rgba(2,30,14,0.08)]">
        <div className="bg-white" style={navShape}>
          <div className="flex min-h-[74px] items-center justify-between gap-5 px-5 py-2 sm:min-h-[82px] sm:px-8 xl:grid xl:grid-cols-[auto_1fr_auto] xl:gap-8 xl:px-10 2xl:px-12">
            <a
              href="#home"
              className="group flex shrink-0 items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015907] focus-visible:ring-offset-4"
            >
              <img src={"/logo.png"} alt="" className="h-14 object-contain" />
            </a>

            <nav
              aria-label="Primary"
              className="hidden items-center justify-center gap-8 xl:flex 2xl:gap-12"
            >
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={activeHref === item.href ? "page" : undefined}
                  className={navLinkClass(item.href)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <EnquiriesLink className="hidden lg:flex" />

            <button
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="home-mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[#075b2f] transition-colors duration-200 hover:bg-[#edf3ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015907] focus-visible:ring-offset-2 xl:hidden"
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-6" strokeWidth={2} />
              ) : (
                <Menu aria-hidden="true" className="size-6" strokeWidth={2} />
              )}
            </button>
          </div>

          {menuOpen && (
            <nav
              id="home-mobile-nav"
              aria-label="Mobile primary"
              className="border-t border-black/10 px-5 pb-6 pt-3 sm:px-8 xl:hidden"
            >
              <ul className="flex flex-col">
                {navigation.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      aria-current={activeHref === item.href ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-md px-2 py-3 text-[1rem] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015907] ${
                        activeHref === item.href
                          ? "text-[#0a7a3c]"
                          : "text-[#161616] hover:text-[#015907]"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <EnquiriesLink className="mt-3 flex w-full" />
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
