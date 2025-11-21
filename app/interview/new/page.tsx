import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, cvs } from "@/lib/schema";

import NewInterviewClient from "./NewInterviewClient";

export default async function NewInterviewPage() {
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

  const userHeader = {
    name: userRow?.name ?? email,
    email,
    image: userRow?.image ?? null,
  };

  const userCvs = await db.query.cvs.findMany({
    where: eq(cvs.userId, userRow.id!),
    orderBy: (c, { desc }) => desc(c.createdAt),
  });

  const cvList = userCvs.map((cv) => ({
    id: cv.id,
    name: cv.title,
    language: cv.language,
  }));

  return <NewInterviewClient cvList={cvList} user={userHeader} />;
}
