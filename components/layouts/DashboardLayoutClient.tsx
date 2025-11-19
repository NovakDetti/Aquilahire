"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessagesSquare,
  MessageSquare as Logo,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";

interface SidebarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface DashboardLayoutClientProps {
  children: ReactNode;
  session?: Session | null;
  userOverride?: SidebarUser;
}

type NavItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const navItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Interjúk", icon: MessagesSquare, href: "/interview" },
  { title: "Admin", icon: User, href: "/admin" },
];

export default function DashboardLayoutClient({
  children,
  session,
  userOverride,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();

  const user =
    userOverride ?? session?.user ?? { name: "Ismeretlen felhasználó", email: "nincs email" };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-card hidden md:block">
        <div className="h-full flex flex-col">
          <div className="h-16 border-b flex items-center px-6 gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AquilaHire</span>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 mt-6 rounded-lg transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {user?.name?.[0] ?? "U"}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.name ?? "Ismeretlen felhasználó"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email ?? "nincs email"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4 md:hidden">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AquilaHire</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Vissza a főoldalra</Link>
          </Button>
        </header>

        <main className="flex-1 p-6 md:p-8 bg-background overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
