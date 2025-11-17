"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import InterviewQuestionCard from "@/components/InterviewQuestionCard";
import ScoreBadge from "@/components/ScoreBadge";
import { useToast } from "../hooks/use-toast";

type Question = {
  id: string;
  order: number;
  questionText: string;
};

type Feedback = {
  score: number;
  shortFeedback: string;
  improvementTips: string[];
};

const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_BASE_URL;

const Interview = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { toast } = useToast();

  const [questions] = useState<Question[]>([
    {
      id: "q1",
      order: 1,
      questionText:
        "Mesélj egy kicsit magadról és miért érdeklődsz ez a pozíció iránt!",
    },
    {
      id: "q2",
      order: 2,
      questionText:
        "Milyen projekteken dolgoztál eddig? Mesélj részletesen az egyikről!",
    },
    {
      id: "q3",
      order: 3,
      questionText:
        "Mi a legnagyobb technikai kihívás, amivel szembesültél, és hogyan oldottad meg?",
    },
    {
      id: "q4",
      order: 4,
      questionText:
        "Hogyan tartod karban a tudásod és milyen új technológiákat tanulsz most?",
    },
    {
      id: "q5",
      order: 5,
      questionText:
        "Mesélj egy olyan szituációról, amikor csapatban kellett dolgoznod!",
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / questions.length) * 100;
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "Válasz hiányzik",
        description: "Kérlek, írj egy választ a kérdésre!",
        variant: "destructive",
      });
      return;
    }

    if (!N8N_BASE_URL || !id) {
      toast({
        title: "Beállítási hiba",
        description:
          "Hiányzik az N8N_BASE_URL vagy az interjú azonosítója.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${N8N_BASE_URL}/webhook/interview-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interviewId: id,
            questionId: currentQuestion.id,
            answerText: answer,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Válasz feldolgozása sikertelen");
      }

      const data = await response.json();

      const score = data.score ?? Math.floor(Math.random() * 3) + 3; // 3–5 mock
      const shortFeedback =
        data.shortFeedback ||
        "Jó válasz! Jól kifejtetted a gondolataidat.";
      const improvementTips =
        data.improvementTips || [
          "Próbálj még konkrétabb példákat hozni",
          "Mérd számokkal a sikeredet, ha lehetséges",
        ];

      setFeedback({
        score,
        shortFeedback,
        improvementTips,
      });

      setScores([...scores, score]);

      toast({
        title: "Válasz értékelve! ✓",
        description: `Pontszám: ${score}/5`,
      });
    } catch (error) {
      toast({
        title: "Hiba történt",
        description:
          error instanceof Error ? error.message : "Próbáld újra",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
      setFeedback(null);
    }
  };

  const handleFinishInterview = async () => {
    if (!N8N_BASE_URL || !id) {
      toast({
        title: "Beállítási hiba",
        description:
          "Hiányzik az N8N_BASE_URL vagy az interjú azonosítója.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${N8N_BASE_URL}/webhook/interview-finish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interviewId: id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Interjú lezárása sikertelen");
      }

      toast({
        title: "Interjú befejezve! 🎉",
        description: "A részletes riport elkészült.",
      });

      router.push(`/interview/${id}/report`);
    } catch (error) {
      toast({
        title: "Hiba történt",
        description:
          error instanceof Error ? error.message : "Próbáld újra",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-card border-2 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary mb-2">
                Állásinterjú
              </h1>
              <p className="text-lg text-muted-foreground">
                Junior Frontend Developer
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-1">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Előrehaladás
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-6 h-3" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Interview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <InterviewQuestionCard
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              questionText={currentQuestion.questionText}
            >
              <div className="space-y-4">
                <Textarea
                  placeholder={
                    "Írd be a válaszod...\n\nTipp: Használd a STAR módszert (Situation, Task, Action, Result) a válaszaidhoz."
                  }
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={loading || !!feedback}
                  className="min-h-[250px] text-base"
                />

                <div className="flex gap-3">
                  {!feedback ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={loading || !answer.trim()}
                      className="flex-1 shadow-primary h-12 text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Értékelés folyamatban...
                        </>
                      ) : (
                        "Válasz elküldése"
                      )}
                    </Button>
                  ) : currentQuestionIndex <
                    questions.length - 1 ? (
                    <Button
                      onClick={handleNextQuestion}
                      className="flex-1 h-12 text-base"
                    >
                      Következő kérdés →
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFinishInterview}
                      disabled={loading}
                      className="flex-1 shadow-primary h-12 text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Lezárás...
                        </>
                      ) : (
                        "Interjú lezárása 🎉"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </InterviewQuestionCard>

            {/* Feedback Card */}
            {feedback && (
              <Card className="border-2 border-primary shadow-primary bg-gradient-card">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">
                          AI Visszajelzés
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Azonnali értékelés
                        </p>
                      </div>
                    </div>
                    <ScoreBadge score={feedback.score} size="lg" />
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-blue" />
                        Értékelés
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {feedback.shortFeedback}
                      </p>
                    </div>

                    <div className="p-4 bg-background rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-mint" />
                        Fejlesztési javaslatok
                      </h4>
                      <ul className="space-y-2">
                        {feedback.improvementTips.map(
                          (tip, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 p-2 rounded bg-mint/5"
                            >
                              <span className="font-bold text-mint min-w-[24px]">
                                {index + 1}.
                              </span>
                              <span className="text-foreground">
                                {tip}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="border-2 sticky top-6">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-6">
                  Jelenlegi teljesítmény
                </h3>

                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-card rounded-xl">
                    <div className="text-sm text-muted-foreground mb-2">
                      Átlagos pontszám
                    </div>
                    <div className="text-5xl font-bold text-gradient-primary mb-2">
                      {averageScore > 0 ? averageScore : "-"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      / 5 pont
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Megválaszolt kérdések
                    </div>
                    <div className="text-2xl font-bold">
                      {scores.length} / {questions.length}
                    </div>
                    <Progress
                      value={
                        (scores.length / questions.length) * 100
                      }
                      className="mt-2 h-2"
                    />
                  </div>

                  {scores.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold mb-3">
                        Eddigi pontszámok
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {scores.map((score, index) => (
                          <ScoreBadge key={index} score={score} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interview;
