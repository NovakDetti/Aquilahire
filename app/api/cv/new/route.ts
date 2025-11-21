import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { db } from "@/lib/db";
import { users, cvs } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Nem vagy bejelentkezve." },
      { status: 401 }
    );
  }

  const { name, language, text_content } = (await req.json()) as {
    name: string;
    language: string;
    text_content?: string; 
  };

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "A CV neve kötelező." },
      { status: 400 }
    );
  }

  const email = session.user.email!;
  let userRow = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!userRow) {
    const [inserted] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        email,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      })
      .returning();
    userRow = inserted;
  }

  const cvId = randomUUID();

  const [insertedCv] = await db
    .insert(cvs)
    .values({
      id: cvId,
      userId: userRow.id,
      title: name,
      language,
      text_content
    })
    .returning();

  return NextResponse.json(
    {
      cvId: insertedCv.id,
      message: "CV sikeresen elmentve.",
    },
    { status: 201 }
  );
}
