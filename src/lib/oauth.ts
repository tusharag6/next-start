import { Google } from "arctic";

import { env } from "@/env/server";

export const google = new Google(
  env.GOOGLE_CLIENT_ID ?? "",
  env.GOOGLE_CLIENT_SECRET ?? "",
  "http://localhost:3000/api/login/google/callback"
);
