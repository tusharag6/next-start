"use server";

import { redirect } from "next/navigation";

import { z } from "zod";
import { createServerAction } from "zsa";

import { createSessionUseCase } from "@/use-cases/sessions";
import { registerUserUseCase } from "@/use-cases/users";

export const signUpAction = createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(3),
    })
  )
  .handler(async ({ input }) => {
    const { id } = await registerUserUseCase(
      input.email,
      input.password,
      input.name
    );
    await createSessionUseCase(id);
    return redirect("/");
  });
