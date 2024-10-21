import { redirect } from "next/navigation";

import { getCurrentSession } from "@/app/lib/session";

import { LoginForm } from "./login-form";

export default async function Page() {
  const { session } = await getCurrentSession();
  if (session !== null) {
    return redirect("/");
  }
  return (
    <>
      <LoginForm />
    </>
  );
}
