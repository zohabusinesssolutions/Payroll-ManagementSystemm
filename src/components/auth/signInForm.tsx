"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AdminityButton } from "../adminity-button";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function SignInForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const toastShownRef = useRef(false);

  const errorMessages: Record<string, string> = {
    CredentialsSignin: "Invalid email or password.",
    NotInOrg:
      "Access denied. Your account has not been activated. Please contact your system administrator.",
    default: "Login failed. Please contact support if the issue persists.",
  };
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const errorMessage = error
    ? errorMessages[error] || errorMessages.default
    : "";

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    const signInResponse = await signIn("credentials", {
      ...data,
      redirect: true,
      callbackUrl: "/",
    });
    if (signInResponse && signInResponse.error) {
      reset();
      toast.error("Authentication Failed", {
        icon: <ShieldAlert className="text-red-500" />,
        duration: 4000,
        closeButton:true,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
  if (errorMessage && !toastShownRef.current) {
    toastShownRef.current = true;
    toast.error(errorMessage, {
      closeButton:true,
      icon: <ShieldAlert className="text-red-500" />,
      duration: 4000,
    });
  }
}, [errorMessage]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            className="h-10"
            placeholder="name@example.com"
            {...register("email")}
            disabled={loading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            className="h-10"
            placeholder="********"
            {...register("password")}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <AdminityButton loading={loading} type="submit" className="w-full">
          <span className="flex items-center justify-center gap-2">
            Sign in
          </span>
        </AdminityButton>
      </div>
    </form>
  );
}
