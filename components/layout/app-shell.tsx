"use client";

import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";

const hideNavigationRoutes = new Set(["/", "/onboarding"]);

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const showNavigation = !hideNavigationRoutes.has(pathname);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-[rgba(13,159,154,0.12)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-44 w-44 rounded-full bg-[rgba(15,91,215,0.12)] blur-3xl" />
      {children}
      {showNavigation ? <MobileNav /> : null}
    </div>
  );
}

