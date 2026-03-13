"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarRange,
  ClipboardList,
  LayoutDashboard,
  PencilLine,
} from "lucide-react";
import { MOBILE_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  "/dashboard": LayoutDashboard,
  "/subjects": ClipboardList,
  "/planner": CalendarRange,
  "/record": PencilLine,
  "/analytics": BarChart3,
};

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md border-t border-white/60 bg-[rgba(255,255,255,0.92)] px-3 pb-3 pt-2 backdrop-blur-md">
      <div className="mx-auto grid grid-cols-5 gap-2">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = iconMap[item.href as keyof typeof iconMap];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                isActive
                  ? "bg-[var(--foreground)] text-white"
                  : "text-[var(--muted)] hover:bg-[var(--surface-alt)]",
              )}
            >
              <Icon size={18} strokeWidth={2.2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

