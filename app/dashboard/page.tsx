
import Link from 'next/link'
import { FileText, MessageSquare, Plus, TrendingUp, Calendar, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const recentInterviews = [
    {
      id: "1",
      positionTitle: "Junior Frontend Developer",
      date: "2024-01-15",
      score: 82,
      status: "completed",
    },
    {
      id: "2",
      positionTitle: "Full Stack Engineer",
      date: "2024-01-10",
      score: 75,
      status: "completed",
    },
    {
      id: "3",
      positionTitle: "React Developer",
      date: "2024-01-05",
      score: 88,
      status: "completed",
    },
  ];

  const cvList = [
    {
      id: "1",
      name: "Junior Developer CV",
      language: "magyar",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Senior Developer CV",
      language: "angol",
      createdAt: "2024-01-08",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Szia, Használó! 👋</h1>
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

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Összes interjú
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                +3 az elmúlt hónapban
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
              <div className="text-2xl font-bold">81.7</div>
              <p className="text-xs text-success mt-1">
                +5.2% a múlt hónaphoz képest
              </p>
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

        {/* Recent Interviews */}
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
                      <span>{new Date(interview.date).toLocaleDateString("hu-HU")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Pontszám</div>
                      <div className={`text-2xl font-bold ${getScoreColor(interview.score)}`}>
                        {interview.score}
                      </div>
                    </div>
                    <Badge variant={getScoreBadgeVariant(interview.score)}>
                      {interview.status === "completed" ? "Befejezve" : "Folyamatban"}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                    <Link href={interview ? `/interview/${interview.id}` : "/dashboard"}>
                      Részletek
                    </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CV List */}
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
                      <span>Létrehozva: {new Date(cv.createdAt).toLocaleDateString("hu-HU")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Szerkesztés
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/interview/new?cvId=${cv.id}`}>
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
};

export default Dashboard;
