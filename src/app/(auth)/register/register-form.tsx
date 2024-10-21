"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Terminal } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";

import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { signUpAction } from "./actions";

const registrationFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password should be at least 8 characters",
  }),
  name: z.string().min(4, {
    message: "Name should be at least 4 characters",
  }),
});

export function RegisterForm() {
  const { toast } = useToast();

  const { execute, isPending, error, reset } = useServerAction(signUpAction, {
    // onError({ err }) {
    //   toast({
    //     title: "Something went wrong",
    //     description: err.message,
    //     variant: "destructive",
    //   });
    // },
    onSuccess() {
      toast({
        title: "Let's Go!",
        description: "Enjoy your session",
      });
      reset();
    },
  });

  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof registrationFormSchema>) {
    execute(values);
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your username"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Uh-oh, we couldn&apos;t log you in</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}

              <LoaderButton
                isLoading={isPending}
                className="w-full"
                type="submit"
              >
                Register
              </LoaderButton>
            </form>
          </Form>

          <Button variant="outline" className="w-full">
            Register with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
