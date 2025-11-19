import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { db } from "@/lib/db";
import {
  users,
  userSettings,
  cvs as cvsTable,
  interviews as interviewsTable,
} from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { Plan, UserAdminData } from "../types/dashboard";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const PLAN_LIMITS: Record<Plan, number> = {
  Starter: 3,
  Pro: 10,
  Premium: 9999,
};

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

  const cvRows = await db
    .select()
    .from(cvsTable)
    .where(eq(cvsTable.userId, userRow.id))
    .orderBy(desc(cvsTable.createdAt));

  const cvs = cvRows.map((cv) => ({
    id: cv.id,
    name: cv.title,
    language: (cv.language === "en" ? "en" : "hu") as "hu" | "en",
    createdAt: formatDate(cv.createdAt),
  }));

  // 4) Interjúk
  const interviewRows = await db
    .select()
    .from(interviewsTable)
    .where(eq(interviewsTable.userId, userRow.id))
    .orderBy(desc(interviewsTable.createdAt));

  const totalInterviews = interviewRows.length;

  const finishedWithScore = interviewRows
    .filter((i) => i.status === "finished" && i.score != null)
    .slice(0, 10);

  const avgScore =
    finishedWithScore.length > 0
      ? Math.round(
          finishedWithScore.reduce((sum, i) => sum + (i.score ?? 0), 0) /
            finishedWithScore.length
        )
      : 0;

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const thisMonthInterviews = interviewRows.filter((i) => {
    if (!i.createdAt) return false;
    return i.createdAt >= firstDay && i.createdAt < nextMonth;
  });

  const remainingThisMonth = Math.max(
    0,
    PLAN_LIMITS[plan] - thisMonthInterviews.length
  );

  const interviews = interviewRows.slice(0, 5).map((i) => ({
    id: i.id,
    cvName: i.cvName,
    role: i.role,
    status: i.status as "scheduled" | "finished" | "draft",
    date:
      i.status === "draft"
        ? "Vázlat"
        : i.scheduledAt
        ? formatDate(i.scheduledAt)
        : formatDate(i.createdAt),
    score: i.score,
  }));

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

  const stats: UserAdminData["stats"] = {
    remainingThisMonth,
    totalInterviews,
    avgScore,
  };

  return (
    <DashboardLayout>
      <UserAdminClient
        user={user}
        settings={settings}
        stats={stats}
        cvs={cvs}
        interviews={interviews}
      />
    </DashboardLayout>
  );
}
