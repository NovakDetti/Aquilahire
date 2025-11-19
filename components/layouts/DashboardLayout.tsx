import { ReactNode, Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayoutClient from "./DashboardLayoutClient";

interface SidebarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface DashboardLayoutProps {
  children: ReactNode;
  userOverride?: SidebarUser; 
}

export default async function DashboardLayout({
  children,
  userOverride,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Felület betöltése...
        </div>
      }
    >
      <DashboardLayoutClient session={session} userOverride={userOverride}>
        {children}
      </DashboardLayoutClient>
    </Suspense>
  );
}
