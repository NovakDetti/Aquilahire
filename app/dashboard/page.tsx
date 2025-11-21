import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { db } from "@/lib/db";
import {
  users,
  cvs,
  interviews,      
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import DashboardLayout from "@/components/layouts/DashboardLayoutClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  ExternalLink,
  FileText,
  MessageSquare,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { randomUUID } from "crypto";

type UiStatus = "completed" | "scheduled" | "draft";

type RecentInterview = {
  id: string;
  positionTitle: string;
  date: Date;
  score: number | null;
  status: UiStatus;
  correctCount: number | null;
  totalQuestions: number | null;
};

const mapStatusToUi = (status: string | null): UiStatus => {
  switch (status) {
    case "finished":
    case "completed":
      return "completed";
    case "scheduled":
      return "scheduled";
    case "draft":
      return "draft";
    default:
      return "draft";
  }
};

const statusLabel = (status: UiStatus) => {
  switch (status) {
    case "completed":
      return "Befejezve";
    case "scheduled":
      return "Ütemezve";
    case "draft":
      return "Vázlat";
  }
};

const getScoreColor = (score: number | null) => {
  if (score == null) return "text-muted-foreground";
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};

const getScoreBadgeVariant = (
  status: UiStatus
): "default" | "secondary" | "destructive" => {
  if (status === "completed") return "default";
  if (status === "scheduled") return "secondary";
  return "secondary";
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const email = session.user.email!;

  let userRow = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!userRow) {
    const inserted = await db
      .insert(users)
      .values({
        id: randomUUID(),
        email,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      })
      .returning();

    userRow = inserted[0];
  }

  const userCvs = await db.query.cvs.findMany({
    where: eq(cvs.userId, userRow.id!),
    orderBy: (c, { desc }) => desc(c.createdAt),
  });

  const cvList = userCvs.map((cv) => ({
    id: cv.id,
    name: cv.title,
    language: cv.language,
    createdAt: cv.createdAt,
  }));

  const dbInterviews = await db.query.interviews.findMany({
    where: eq(interviews.userId, userRow.id!), 
    orderBy: (t, { desc }) => desc(t.createdAt),
    limit: 5,
  });

  const recentInterviews: RecentInterview[] = dbInterviews.map((int) => ({
    id: int.id,
    positionTitle: int.role,
    date: int.scheduledAt ?? int.createdAt,
    score: int.score,
    status: mapStatusToUi(int.status),
    correctCount: int.correctCount ?? null,
    totalQuestions: int.totalQuestions ?? null,
  }));

  return (
    <DashboardLayout
      userOverride={{
        name: userRow?.name ?? email,
        email,
        image: userRow?.image ?? null,
      }}
    >
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Szia, {userRow.name ? userRow.name.split(" ")[0] : ""}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Készen állsz a gyakorlásra?
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/cv/new">
                <Plus className="h-4 w-4 mr-2" />
                Új CV
              </Link>
            </Button>
            <Button asChild className="shadow-primary">
              <Link href="/interview/new">
                <Plus className="h-4 w-4 mr-2" />
                Új interjú
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Összes interjú
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dbInterviews.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                (később ide jöhet havi bontás is)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Átlagos pontszám
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {(() => {
                const scored = dbInterviews.filter((i) => i.score != null);
                const avg =
                  scored.length > 0
                    ? scored.reduce((s, i) => s + (i.score ?? 0), 0) /
                      scored.length
                    : null;
                return (
                  <>
                    <div className="text-2xl font-bold">
                      {avg != null ? avg.toFixed(1) : "—"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Az értékelt interjúk átlaga
                    </p>
                  </>
                );
              })()}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Tárolt CV-k
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cvList.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Magyar és angol nyelven
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Legutóbbi interjúk
            </CardTitle>
            <CardDescription>
              Tekintsd meg a korábbi interjúid eredményeit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentInterviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Még nincs elmentett interjú. Kezdd azzal, hogy indítasz egyet
                a fenti <span className="font-medium">„Új interjú”</span> gombbal.
              </p>
            ) : (
              <div className="space-y-4">
                {recentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {interview.positionTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {interview.date.toLocaleDateString("hu-HU")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">
                          Pontszám
                        </div>
                        <div
                          className={`text-2xl font-bold ${getScoreColor(
                            interview.correctCount
                          )}`}
                        >
                          {interview.score != null ? interview.score : "—"}
                        </div>
                      </div>
                      <Badge variant={getScoreBadgeVariant(interview.status)}>
                        {statusLabel(interview.status)}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/interview/${interview.id}/report`}>
                          Részletek
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Önéletrajzaid
            </CardTitle>
            <CardDescription>
              Kezeld a feltöltött CV-ket és indíts új interjút
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cvList.map((cv) => (
                <div
                  key={cv.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{cv.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="outline">{cv.language}</Badge>
                      <span>
                        Létrehozva:{" "}
                        {cv.createdAt.toLocaleDateString("hu-HU")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Szerkesztés
                    </Button>
                  <Button size="sm" asChild>
                    <Link href={`/interview/new?cvId=${cv.id}&type=mcq`}>
                      Új interjú indítása
                    </Link>
                  </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
