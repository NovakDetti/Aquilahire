import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cvs, interviews, userSettings } from "@/lib/schema";
import { db } from "@/lib/db";

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  await db.delete(interviews).where(eq(interviews.userId, userId));
  await db.delete(cvs).where(eq(cvs.userId, userId));
  await db.delete(userSettings).where(eq(userSettings.userId, userId));
  return NextResponse.json({ ok: true });
}
