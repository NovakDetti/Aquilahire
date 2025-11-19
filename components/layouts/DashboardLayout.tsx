"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  MessageSquare as Logo,
  MessagesSquare,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

type NavItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
};

const navItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Interjúk", icon: MessagesSquare, href: "/interview" },
  { title: "Admin", icon: User, href: "/admin" },]

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:block">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 border-b flex items-center px-6 gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AquilaHire</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasHref = !!item.href;
              const active = hasHref ? isActive(item.href!) : false;

              // ha nincs href, sima label
              if (!hasHref) {
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                );
              }

              // ha van href -> Next Link
              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
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

          {/* User Section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Használó</p>
                <p className="text-xs text-muted-foreground truncate">
                  felhasznalo@email.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4 md:hidden">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AquilaHire</span>
          </div>
          <div className="ml-auto">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Vissza a főoldalra</Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 bg-background overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
