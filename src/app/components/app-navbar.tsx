import { ClientNavbar } from "@/app/components/client-navbar";

import { getCurrentSession } from "../lib/session";

export async function AppNavbar() {
  const { session } = await getCurrentSession();
  return <ClientNavbar session={session} />;
}
