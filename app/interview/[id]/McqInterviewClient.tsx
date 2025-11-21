"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Home,
} from "lucide-react";

import DashboardLayout from "@/components/layouts/DashboardLayoutClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/app/hooks/use-toast";

type McqOption = {
  id: string;
  text: string;
};

type McqQuestion = {
  id: string;
  text: string;
  options: McqOption[];
  correctOptionId: string;
};

type McqSessionResponse = {
  interviewId: string;
  positionTitle: string;
  cvName?: string;
  language: "hu" | "en";
  questions: McqQuestion[];
};

type AnswerFeedback = {
  correct: boolean;
  explanation?: string;
  scoreDelta?: number;
};

type Props = {
  interviewId: string;
};


export default function McqInterviewClient({ interviewId }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [session, setSession] = useState<McqSessionResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [finished, setFinished] = useState(false);

  const [results, setResults] = useState<
  { questionId: string; selectedOptionId: string; correct: boolean }[]>([]);
  const [correctCount, setCorrectCount] = useState(0);


  const baseUrl = process.env.NEXT_PUBLIC_N8N_BASE_URL;

  useEffect(() => {
    const loadSession = async () => {
      try {
        if (!baseUrl) {
          throw new Error("NEXT_PUBLIC_N8N_BASE_URL nincs beállítva");
        }

        const res = await fetch(
          `${baseUrl}/interview-mcq-session?interviewId=${encodeURIComponent(
            interviewId
          )}`,
          {
            method: "GET",
          }
        );

        if (!res.ok) {
          throw new Error("Nem sikerült betölteni az interjút.");
        }

        const raw = await res.json();
        if (Array.isArray(raw)) {
        const questions = raw.map((q: any) => ({
            id: q.id,
            text: q.question_text,
            options: q.options_json.options,
            correctOptionId: q.correct_option_id,
        }));

        setSession({
            interviewId: raw[0]?.interview_id ?? interviewId,
            positionTitle: "Interjú",
            cvName: "",
            language: "hu",
            questions,
        });

        } else {
        setSession(raw);
        }

      } catch (err) {
        console.error(err);
        toast({
          title: "Hiba történt",
          description:
            err instanceof Error
              ? err.message
              : "Nem sikerült betölteni az interjút.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [interviewId, baseUrl, toast]);

    const submitAnswer = async () => {
        if (!session || !currentQuestion || !selectedOptionId) return;

        setSubmitting(true);
        setFeedback(null);

        console.log(session)

        try {
            const isCorrect = selectedOptionId === currentQuestion.correctOptionId;

            setFeedback({ correct: isCorrect });
            setResults((prev) => [
            ...prev,
            {
                questionId: currentQuestion.id,
                selectedOptionId,
                correct: isCorrect,
            },
            ]);

            if (isCorrect) {
            setCorrectCount((prev) => prev + 1);
            }

            if (isLastQuestion) {
            setFinished(true);
            await sendFinalResults();
            }
        } catch (err) {
            console.error(err);
            toast({
            title: "Hiba történt",
            description:
                err instanceof Error
                ? err.message
                : "Valami elromlott a válasz feldolgozásakor.",
            variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const sendFinalResults = async () => {
        if (!baseUrl || !session) return;

        try {
            await fetch(`${baseUrl}/interview-mcq-finish`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                interviewId: session.interviewId,
                totalQuestions,
                correctCount,
                answers: results,
            }),
            });
        } catch (error) {
            console.error("Final results POST error", error);
            
        }
    };



    const goToNextQuestion = () => {
    setFeedback(null);
    setSelectedOptionId(null);

    if (!isLastQuestion) {
        setCurrentIndex((prev) => prev + 1);
    } else {
        setFinished(true);
        void sendFinalResults(); 
    }
    };

    if (loading || !session) {
    return (
        <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Interjú betöltése...</p>
        </div>
        </DashboardLayout>
    );
    }

  const currentQuestion = session.questions[currentIndex];
  const current = currentQuestion;
  const totalQuestions = session.questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Fejléc */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Feleletválasztós interjú
            </p>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              {session.positionTitle}
            </h1>
            {session.cvName && (
              <p className="text-sm text-muted-foreground mt-1">
                CV: <span className="font-medium">{session.cvName}</span>
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            Vissza a főoldalra
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Kérdés{" "}
            <span className="font-semibold text-foreground">
              {currentIndex + 1}/{totalQuestions}
            </span>
          </span>
          {finished && (
            <Badge variant="outline" className="border-green-500 text-green-600">
              Interjú befejezve
            </Badge>
          )}
        </div>

        {/* Aktuális kérdés */}
        {current && !finished && (
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                {current.text}
              </CardTitle>
              <CardDescription>
                Válassz egyet az alábbi lehetőségek közül.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {current.options.map((opt, idx) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect =
                    feedback?.correct && isSelected;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={submitting || !!feedback}
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={[
                        "w-full text-left rounded-xl border px-4 py-3 transition-colors",
                        "flex items-start gap-3",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-muted/60",
                        feedback && isSelected && feedback.correct
                          ? "border-green-500 bg-green-50"
                          : "",
                        feedback && isSelected && !feedback?.correct
                          ? "border-destructive bg-destructive/10"
                          : "",
                      ].join(" ")}
                    >
                      <div className="mt-1 text-xs font-mono text-muted-foreground">
                        {String.fromCharCode(65 + idx)}.
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base">{opt.text}</p>
                      </div>
                      {isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div
                  className={[
                    "rounded-xl border px-4 py-3 text-sm flex gap-3 items-start",
                    feedback.correct
                      ? "border-green-200 bg-green-50 text-green-900"
                      : "border-destructive/40 bg-destructive/5 text-destructive",
                  ].join(" ")}
                >
                  {feedback.correct ? (
                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 mt-0.5" />
                  )}

                  <div>
                    <p className="font-semibold mb-1">
                      {feedback.correct
                        ? "Helyes válasz!"
                        : "Most ez nem volt teljesen jó."}
                    </p>
                    {feedback.explanation && (
                      <p className="text-sm leading-snug">
                        {feedback.explanation}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                {!feedback ? (
                  <Button
                    type="button"
                    disabled={!selectedOptionId || submitting}
                    onClick={submitAnswer}
                    className="shadow-primary"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Értékelés...
                      </>
                    ) : (
                      <>
                        Válasz elküldése
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToNextQuestion}
                  >
                    {isLastQuestion ? "Interjú lezárása" : "Következő kérdés"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        {finished && (
          <Card className="mt-4 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                Gratulálok, befejezted az interjút!
              </CardTitle>
              <CardDescription className="text-green-900/80">
                Hamarosan elérhető lesz a részletes riport az eredményeidről.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Vissza a Dashboardra
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
