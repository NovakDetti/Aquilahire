"use client";

import DashboardLayout from "@/components/layouts/DashboardLayoutClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default function ReportClient({ sessionUser, interview, answers, questions }) {

  const questionById = new Map(questions.map(q => [String(q.id), q]));

  const totalQuestions =
    interview.totalQuestions ?? (answers.length > 0 ? answers.length : null);

  const correctCount =
    interview.correctCount ?? answers.filter(a => a.isCorrect).length;

  const score =
    interview.score ??
    (totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0);

  const createdAt = interview.scheduledAt ?? interview.createdAt;

  return (
    <DashboardLayout userOverride={sessionUser}>
      <div className="max-w-5xl mx-auto py-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {interview.role}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(createdAt).toLocaleDateString("hu-HU")}
              </span>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Vissza
            </Link>
          </Button>
        </div>

        {/* SUMMARY CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Összefoglaló</CardTitle>
            <CardDescription>Az interjú eredménye</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-10">
              <div>
                <div className="text-xs text-muted-foreground">Pontszám</div>
                <div className="text-3xl font-bold">{score}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Helyes válaszok</div>
                <div className="text-xl font-semibold">
                  {correctCount}/{totalQuestions}
                </div>
              </div>
            </div>

            <Progress value={score} />
          </CardContent>
        </Card>

        {/* DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle>Kérdések és válaszok</CardTitle>
            <CardDescription>Mit jelöltél be és mi lett volna a helyes?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {answers.map((answer, i) => {
              const question = questionById.get(String(answer.questionId));
              const options = (question?.optionsJson?.options ?? []) as any[];

              const correctOpt = options.find(o => o.id === question?.correctOptionId);
              const selectedOpt = options.find(o => o.id === answer.selectedOptionId);

              return (
                <div key={answer.id} className="border p-4 rounded-xl space-y-3">
                  <h3 className="font-semibold">Kérdés {i + 1}: {question?.questionText}</h3>

                  <Badge variant={answer.isCorrect ? "outline" : "destructive"}>
                    {answer.isCorrect ? "Helyes" : "Helytelen"}
                  </Badge>

                  <div className="text-sm space-y-1">
                    <div><b>Te válaszod:</b> {selectedOpt?.text}</div>

                    <div><b>Helyes válasz:</b> {correctOpt?.text}</div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2">
                    Opciók:
                  </div>

                  {options.map(opt => (
                    <div
                      key={opt.id}
                      className={`p-2 rounded-lg border ${
                        opt.id === question?.correctOptionId
                          ? "bg-green-50 border-green-300"
                          : opt.id === answer.selectedOptionId
                          ? "bg-muted/40"
                          : "border-transparent"
                      }`}
                    >
                      {opt.text}
                    </div>
                  ))}

                </div>
              );
            })}

          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
