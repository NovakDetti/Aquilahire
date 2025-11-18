import DashboardLayout from "@/components/layouts/DashboardLayout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserAdminData } from "../types/dashboard";
import { getUserDashboardData } from "@/lib/data/user-dashboard";
import UserAdminClient from "./UserAdminClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const data: UserAdminData = await getUserDashboardData(userId);

  return (
    <DashboardLayout>
      <UserAdminClient {...data} />
    </DashboardLayout>
  );
}
