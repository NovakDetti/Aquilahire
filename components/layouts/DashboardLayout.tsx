import { ReactNode, Suspense } from "react";
import DashboardLayoutClient from "./DashboardLayoutClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Felület betöltése...
        </div>
      }
    >
      <DashboardLayoutClient session={session} >
        {children}
      </DashboardLayoutClient>
    </Suspense>
  );
}
