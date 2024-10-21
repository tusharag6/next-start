"use server";

import { redirect } from "next/navigation";

import { z } from "zod";
import { createServerAction } from "zsa";

import { createSessionUseCase } from "@/use-cases/sessions";
import { signInUseCase } from "@/use-cases/users";

export const signInAction = createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })
  )
  .handler(async ({ input }) => {
    const { id } = await signInUseCase(input.email, input.password);
    await createSessionUseCase(id);
    return redirect("/");
  });
