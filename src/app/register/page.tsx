import { redirect } from "next/navigation";

import { getCurrentSession } from "@/session";

import { RegisterForm } from "./register-form";

export default async function Page() {
  const { session } = await getCurrentSession();
  if (session !== null) {
    return redirect("/");
  }
  return <RegisterForm />;
}
