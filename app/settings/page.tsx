// app/settings/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { db } from "@/lib/db";
import { users, userSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";

import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const email = session.user.email!;

  const userRow = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!userRow) {
    redirect("/login"); // elvileg nem fordulhat elő
  }

  const settingsRow = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userRow.id),
  });

  const plan = (settingsRow?.plan as "Starter" | "Pro" | "Premium") ?? "Starter";
  const emailNotif = settingsRow?.emailNotif ?? true;
  const newsletter = settingsRow?.newsletter ?? false;

  const formatDate = (d: Date | null | undefined) =>
    d
      ? d.toLocaleDateString("hu-HU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";

  return (
    <SettingsClient
      user={{
        name: userRow.name ?? email,
        email,
        memberSince: formatDate(userRow.createdAt),
      }}
      settings={{
        plan,
        emailNotif,
        newsletter,
      }}
    />
  );
}
