import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Download,
  Share2,
  Trophy,
  MessageSquare,
  ArrowRight,
  Link
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ScoreBadge from "@/components/ScoreBadge";
import ReportSection from "@/components/ReportSection";
import { useParams } from "next/navigation";

const InterviewReport = () => {
  const { id } = useParams<{ id: string }>();

  // Mock report data
  const report = {
    interviewId: id || "1",
    positionTitle: "Junior Frontend Developer",
    date: "2024-01-15",
    overallScore: 82,
    overallSummary: "Összességében jó teljesítményt nyújtottál. Erős technikai tudás, de a kommunikációs készségeiden érdemes dolgozni.",
    strengths: [
      "Jó React és TypeScript ismeretek",
      "Tiszta és strukturált válaszok",
      "Konkrét példák használata",
      "Problémamegoldó gondolkodás",
    ],
    weaknesses: [
      "Ritkán használsz számokat és mérőszámokat",
      "A csapatmunkáról keveset beszéltél",
      "Néhány válasz túl általános volt",
      "A soft skillekről többet beszélhetnél",
    ],
    practiceRecommendations: [
      "Gyakorold a STAR metódust (Situation, Task, Action, Result)",
      "Készíts listát a korábbi projektjeidről konkrét eredményekkel",
      "Gyakorold a csapatmunka és konfliktuskezelés példákat",
      "Időzítsd a válaszaidat - próbálj 2-3 percben válaszolni",
      "Készíts elő kérdéseket az interviewer számára",
    ],
    questions: [
      {
        id: "q1",
        order: 1,
        questionText: "Mesélj egy kicsit magadról és miért érdeklődsz ez a pozíció iránt!",
        answerText: "Általános bemutatkozás, tapasztalatok felsorolása...",
        score: 4,
        shortFeedback: "Jó bemutatkozás, de lehetett volna specifikusabb a motivációval kapcsolatban.",
      },
      {
        id: "q2",
        order: 2,
        questionText: "Milyen projekteken dolgoztál eddig? Mesélj részletesen az egyikről!",
        answerText: "E-commerce platform fejlesztése React és TypeScript használatával...",
        score: 5,
        shortFeedback: "Kiváló részletességű válasz konkrét példákkal és eredményekkel.",
      },
      {
        id: "q3",
        order: 3,
        questionText: "Mi a legnagyobb technikai kihívás, amivel szembesültél, és hogyan oldottad meg?",
        answerText: "Performance problémák megoldása egy nagy alkalmazásban...",
        score: 4,
        shortFeedback: "Jó példa, de lehetett volna több technikai részlet a megoldásról.",
      },
      {
        id: "q4",
        order: 4,
        questionText: "Hogyan tartod karban a tudásod és milyen új technológiákat tanulsz most?",
        answerText: "Folyamatos tanulás, online kurzusok, community részvétel...",
        score: 3,
        shortFeedback: "Általános válasz, specifikusabb forrásokat és projekteket említhettél volna.",
      },
      {
        id: "q5",
        order: 5,
        questionText: "Mesélj egy olyan szituációról, amikor csapatban kellett dolgoznod!",
        answerText: "Csapatprojekt egyetemen, együttműködés tapasztalatok...",
        score: 3,
        shortFeedback: "Jó kezdés, de több konkrétumot adhattál volna a saját szerepedről.",
      },
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };


  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vissza a dashboardra
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{report.positionTitle}</h1>
            <p className="text-muted-foreground">
              {new Date(report.date).toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Letöltés
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Megosztás
            </Button>
          </div>
        </div>

        {/* Overall Score - Enhanced */}
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-primary opacity-95" />
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl floating" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl floating" style={{ animationDelay: "1s" }} />
          </div>
          <CardContent className="relative z-10 py-16">
            <div className="text-center space-y-6 text-white">
              <div className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Trophy className="h-16 w-16" />
              </div>
              <div>
                <div className="text-7xl font-bold mb-2">{report.overallScore}</div>
                <div className="text-2xl opacity-90 font-medium">Összpontszám / 100</div>
              </div>
              <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                {report.overallSummary}
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Badge variant="secondary" className="text-base px-4 py-2">
                  Kérdések: {report.questions.length}
                </Badge>
                <Badge variant="secondary" className="text-base px-4 py-2">
                  Átlag: {Math.round(report.questions.reduce((acc, q) => acc + q.score, 0) / report.questions.length * 20)}/100
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strengths & Weaknesses - Enhanced */}
        <div className="grid md:grid-cols-2 gap-8">
          <ReportSection
            icon={TrendingUp}
            title="Erősségek"
            iconColor="text-success"
          >
            <ul className="space-y-3">
              {report.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-success/5 hover:bg-success/10 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-base leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </ReportSection>

          <ReportSection
            icon={TrendingDown}
            title="Fejlesztendő területek"
            iconColor="text-warning"
          >
            <ul className="space-y-3">
              {report.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 hover:bg-warning/10 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="h-4 w-4 text-warning" />
                  </div>
                  <span className="text-base leading-relaxed">{weakness}</span>
                </li>
              ))}
            </ul>
          </ReportSection>
        </div>

        {/* Practice Recommendations - Enhanced */}
        <ReportSection
          icon={Lightbulb}
          title="Ajánlott következő lépések"
          description="Ezeket a területeket gyakorold, hogy még jobb legyél"
          iconColor="text-mint"
        >
          <ul className="space-y-4">
            {report.practiceRecommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-cyan/5 border border-primary/10 hover:border-primary/30 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-base leading-relaxed pt-0.5">{recommendation}</span>
              </li>
            ))}
          </ul>
        </ReportSection>

        {/* Questions Details - Enhanced */}
        <ReportSection
          icon={MessageSquare}
          title="Részletes kérdés-válasz elemzés"
          description="Nézd át az egyes kérdésekre adott válaszaidat és a hozzájuk tartozó értékelést"
          iconColor="text-blue"
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {report.questions.map((question) => (
              <AccordionItem 
                key={question.id} 
                value={question.id}
                className="border-2 rounded-xl px-4 hover:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center justify-between w-full pr-4 text-left gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0 mt-1">
                        {question.order}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-base mb-1">
                          {question.questionText}
                        </div>
                      </div>
                    </div>
                    <ScoreBadge score={question.score} />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 pt-2 pl-11">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        A válaszod:
                      </h4>
                      <p className="text-base leading-relaxed">
                        {question.answerText}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-card rounded-lg border border-primary/10">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        AI visszajelzés:
                      </h4>
                      <p className="text-base leading-relaxed">{question.shortFeedback}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ReportSection>

        {/* CTA - Enhanced */}
        <Card className="relative overflow-hidden border-2 border-primary">
          <div className="absolute inset-0 bg-gradient-card" />
          <CardContent className="relative z-10 py-12 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-gradient-primary">
              Készen állsz a következő interjúra?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Gyakorold tovább, és javíts a pontszámodon! Minden interjú közelebb visz a céljaidhoz.
            </p>
            <Button asChild size="lg" className="shadow-primary h-14 px-8 text-base">
              <Link href="/interview/new">
                Új interjú indítása
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InterviewReport;
