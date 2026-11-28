"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, X } from "lucide-react";
import { brand } from "@/lib/site";
import { useRef, useState } from "react";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/products", "Products"],
  ["/applications", "Applications"],
  ["/contact", "Contact"],
];

export function BrandMark({
  variant = "dark",
  eager = false,
}: {
  variant?: "light" | "dark";
  eager?: boolean;
}) {
  return (
    <Image
      className="brand-logo"
      src={`/images/logo/bharat-lums-${variant === "light" ? "blue" : "white"}.png`}
      alt="Bharat Lums — Powering a Brighter Tomorrow"
      width={432}
      height={237}
      sizes="160px"
      loading={eager ? "eager" : "lazy"}
    />
  );
}

export default function Header() {
  const path = usePathname();
  const menuToggle = useRef<HTMLButtonElement>(null);
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === path;

  function followLink(href: string, preventDefault: () => void) {
    setOpenedAt(null);
    if (path !== "/") return;

    if (href === "/") {
      preventDefault();
      const oldURL = window.location.href;
      if (window.location.hash || window.location.search) {
        window.history.pushState(null, "", "/");
        window.dispatchEvent(
          new HashChangeEvent("hashchange", {
            oldURL,
            newURL: window.location.href,
          }),
        );
      }
      window.scrollTo({ top: 0, behavior: "instant" });

    }
  }

  return (
    <header
      className={path === "/" ? "site-header home-header" : "site-header"}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setOpenedAt(null);
          menuToggle.current?.focus();
        }
      }}
    >
      <div className="shell header-inner">
        <Link
          href="/"
          className="brand-link"
          onNavigate={(event) => followLink("/", event.preventDefault)}
        >
          <BrandMark variant="light" eager />
        </Link>
        <button
          className="menu-toggle icon-button"
          ref={menuToggle}
          aria-controls="site-navigation"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpenedAt(open ? null : path)}
        >
          {open ? <X aria-hidden="true" /> : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="M5 9h14M5 15h8" />
            </svg>
          )}
        </button>
        <nav
          id="site-navigation"
          className={open ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
        >
          {links.map(([href, label]) => {
            const current = path === href;
            const inSection = href !== "/" && path.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={current ? "page" : undefined}
                className={current || inSection ? "active" : undefined}
                onNavigate={(event) => followLink(href, event.preventDefault)}
              >
                {label}
              </Link>
            );
          })}
          <a className="button button-outline mobile-quote" href={brand.phoneHref} onClick={() => setOpenedAt(null)} aria-label={`Call Bharat Lums at ${brand.phone}`}>
            <Phone size={16} aria-hidden="true" /> {brand.phone}
          </a>
        </nav>
        <a className="button button-outline header-quote" href={brand.phoneHref} aria-label={`Call Bharat Lums at ${brand.phone}`}>
          <Phone size={16} aria-hidden="true" /> {brand.phone}
        </a>
      </div>
    </header>
  );
}
