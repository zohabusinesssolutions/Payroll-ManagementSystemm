// components/auth/AuthGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingScreen } from "../loading-screen";

type AuthGuardProps = {
  children: React.ReactNode;
  authRequired?: boolean;
  redirectTo?: string;
};

export default function AuthGuard({
  children,
  authRequired = false,
  redirectTo = authRequired ? "/auth/sign-in" : "/dashboard",
}: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If auth is required and user isn't authenticated, redirect to login
    if (authRequired && status === "unauthenticated") {
      router.push("/auth/sign-in");
    }

    // If auth is NOT required (like on login page) and user is authenticated, redirect away
    if (!authRequired && status === "authenticated") {
      router.push(redirectTo);
    }
  }, [authRequired, redirectTo, router, status]);

  if (status === "loading") {
    return <LoadingScreen message="Please wait, verifying..." />;
  }

  // Only show children if conditions are met
  if (authRequired && status === "authenticated") {
    return <>{children}</>;
  }

  if (!authRequired && status === "unauthenticated") {
    return <>{children}</>;
  }

  return null;
}
