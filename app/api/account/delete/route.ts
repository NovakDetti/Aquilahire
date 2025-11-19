import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { db } from "@/lib/db";
import { users, userSettings, cvs, interviews } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const email = session.user.email;

  const userRow = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!userRow) {
    return NextResponse.json({ ok: true });
  }

  await db.transaction(async (tx) => {
    await tx.delete(cvs).where(eq(cvs.userId, userRow.id));
    await tx
      .delete(interviews)
      .where(eq(interviews.userId, userRow.id));
    await tx
      .delete(userSettings)
      .where(eq(userSettings.userId, userRow.id));

    await tx.delete(users).where(eq(users.id, userRow.id));
  });

  return NextResponse.json({ ok: true });
}
