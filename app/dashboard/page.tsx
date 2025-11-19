import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { db } from "@/lib/db";
import {
  users,
  userSettings,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Plan, UserAdminData } from "../types/dashboard";
import DashboardLayout from "@/components/layouts/DashboardLayoutClient";
import AdminClient from "../admin/AdminClient";

function formatDate(date: Date | null | undefined) {
  if (!date) return "";
  return date.toLocaleString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const email = session.user.email!;

  const userRow = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!userRow) {
    throw new Error("Felhasználó nem található az adatbázisban.");
  }

  const settingsRow = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userRow.id),
  });

  const plan: Plan =
    (settingsRow?.plan as Plan | null) ?? "Starter";
  const emailNotif = settingsRow?.emailNotif ?? true;
  const newsletter = settingsRow?.newsletter ?? false;


  const user: UserAdminData["user"] = {
    name: userRow.name ?? email,
    email,
    memberSince: formatDate(userRow.createdAt),
  };

  const settings: UserAdminData["settings"] = {
    plan,
    emailNotif,
    newsletter,
  };

  return (
    <DashboardLayout>
      <AdminClient
        user={user}
        settings={settings}
      />
    </DashboardLayout>
  );
}
