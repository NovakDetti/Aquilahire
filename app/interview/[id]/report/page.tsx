import { notFound } from "next/navigation";
import { eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  interviews,
  interviewAnswers,
  interviewQuestions,
} from "@/lib/schema";
import ReportClient from "./ReportClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InterviewReportPage({ params }: PageProps) {
  const { id } = await params;    
  const interviewId = id;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) notFound();

  const interview = await db.query.interviews.findFirst({
    where: eq(interviews.id, interviewId),
  });

  if (!interview) notFound();

  const answers = await db.query.interviewAnswers.findMany({
    where: eq(interviewAnswers.interviewId, interviewId),
    orderBy: (a, { asc }) => asc(a.createdAt),
  });

  const questionIds = answers.map(a => a.questionId).filter(Boolean);

  const questionRows = questionIds.length
    ? await db.query.interviewQuestions.findMany({
        where: inArray(interviewQuestions.id, questionIds),
      })
    : [];

  return (
    <ReportClient
      sessionUser={{
        name: session.user.name,
        email: session.user.email!,
        image: session.user.image ?? null,
      }}
      interview={interview}
      answers={answers}
      questions={questionRows}
    />
  );
}
