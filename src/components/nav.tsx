"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useRef, useState } from "react";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/products", "Products"],
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
          {open ? <X /> : <Menu />}
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
          <Link
            className="button button-outline mobile-quote"
            href="/request-quote"
            onClick={() => setOpenedAt(null)}
          >
            Request a quote <ArrowUpRight size={15} />
          </Link>
        </nav>
        <Link
          className="button button-outline header-quote"
          href="/request-quote"
        >
          Request a quote <ArrowUpRight size={15} />
        </Link>
      </div>
    </header>
  );
}
