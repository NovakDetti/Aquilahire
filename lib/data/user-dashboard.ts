
import { CvItem, InterviewItem, UserAdminData, UserInfo, UserSettings, UserStats } from "@/app/types/dashboard";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { cvs, interviews, users, userSettings } from "../schema";

export async function getUserDashboardData(userId: string): Promise<UserAdminData> {
  const [userRow] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!userRow) {
    throw new Error("User not found in DB");
  }

  const user: UserInfo = {
    id: userRow.id,
    name: userRow.name ?? "Névtelen felhasználó",
    email: userRow.email,
    memberSince: userRow.createdAt.toISOString().slice(0, 10),
  };

  const [settingsRow] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId));

  const settings: UserSettings = {
    plan: (settingsRow?.plan as "Starter" | "Pro" | "Premium") ?? "Starter",
    emailNotif: settingsRow?.emailNotif ?? true,
    newsletter: settingsRow?.newsletter ?? false,
  };

  const cvRows = await db
    .select()
    .from(cvs)
    .where(eq(cvs.userId, userId))
    .orderBy(cvs.createdAt);

  const cvItems: CvItem[] = cvRows.map((cv) => ({
    id: cv.id,
    name: cv.title,
    language: cv.language as "hu" | "en",
    createdAt: cv.createdAt.toISOString().slice(0, 10),
  }));

  const interviewRows = await db
    .select()
    .from(interviews)
    .where(eq(interviews.userId, userId))
    .orderBy(interviews.createdAt);

  const interviewItems: InterviewItem[] = interviewRows.map((int) => ({
    id: int.id,
    cvName: int.cvName,
    role: int.role,
    date:
      int.status === "draft"
        ? "Vázlat"
        : int.scheduledAt?.toLocaleString("hu-HU") ?? "",
    status: int.status as InterviewItem["status"],
    score: int.score ?? undefined,
  }));

  const stats: UserStats = calcStatsFromInterviews(
    interviewItems,
    settings.plan
  );

  return {
    user,
    settings,
    stats,
    cvs: cvItems,
    interviews: interviewItems,
  };
}

function calcStatsFromInterviews(
  interviews: InterviewItem[],
  plan: "Starter" | "Pro" | "Premium"
): UserStats {
  const totalInterviews = interviews.length;
  const finished = interviews.filter(
    (i) => i.status === "finished" && i.score != null
  );

  const avgScore =
    finished.length > 0
      ? Math.round(
          finished.reduce((sum, i) => sum + (i.score ?? 0), 0) / finished.length
        )
      : 0;

  const monthlyLimit = plan === "Starter" ? 3 : plan === "Pro" ? 10 : 999;
  const remainingThisMonth = Math.max(0, monthlyLimit - totalInterviews);

  return {
    remainingThisMonth,
    totalInterviews,
    avgScore,
  };
}
