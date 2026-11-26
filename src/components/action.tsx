"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";
import { useSiteReducedMotion } from "./use-media-query";

function moveIcon(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse") return;
  const link = event.currentTarget;
  const rect = link.getBoundingClientRect();
  link.style.setProperty(
    "--action-x",
    `${(event.clientX - rect.left - rect.width / 2) * 0.045}px`,
  );
  link.style.setProperty(
    "--action-y",
    `${(event.clientY - rect.top - rect.height / 2) * 0.09}px`,
  );
}

function resetIcon(event: PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.removeProperty("--action-x");
  event.currentTarget.style.removeProperty("--action-y");
}

export function Action({
  href,
  children,
  secondary = false,
  diagonal = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  diagonal?: boolean;
}) {
  const Icon = diagonal ? ArrowUpRight : ArrowRight;
  const reduced = useSiteReducedMotion();
  return (
    <Link
      className={`button ${secondary ? "button-outline" : "button-primary"}`}
      href={href}
      onPointerMove={secondary || reduced ? undefined : moveIcon}
      onPointerLeave={secondary ? undefined : resetIcon}
    >
      {children}
      <Icon size={17} aria-hidden />
    </Link>
  );
}
