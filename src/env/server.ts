/* eslint-disable n/no-process-env */
import { createEnv } from "@t3-oss/env-nextjs";
// import { config } from "dotenv";
// import { expand } from "dotenv-expand";
import { ZodError, z } from "zod";

// expand(config());

const constructDatabaseUrl = (
  user: string,
  password: string,
  host: string,
  port: number,
  name: string
) => `postgresql://${user}:${password}@${host}:${port}/${name}`;

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    DB_PORT: z.coerce.number(),
    DATABASE_URL: z
      .string()
      .url()
      .or(z.undefined())
      .refine(
        (url) => {
          if (url) return true;
          // If DATABASE_URL is not provided, check if all individual DB variables are present
          return (
            process.env.DB_HOST &&
            process.env.DB_USER &&
            process.env.DB_PASSWORD &&
            process.env.DB_NAME &&
            process.env.DB_PORT
          );
        },
        {
          message:
            "DATABASE_URL is required if individual DB variables are not provided",
        }
      )
      .transform((url) => {
        if (url) return url;
        // Construct DATABASE_URL if not provided
        return constructDatabaseUrl(
          process.env.DB_USER!,
          process.env.DB_PASSWORD!,
          process.env.DB_HOST!,
          Number(process.env.DB_PORT),
          process.env.DB_NAME!
        );
      }),
    DB_MIGRATING: z
      .string()
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "true")
      .optional(),
    SENDGRID_API_KEY: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },
  onValidationError: (error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    process.exit(1);
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
