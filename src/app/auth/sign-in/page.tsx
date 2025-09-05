"use client";

import githubLogo from "@/../public/github-logo.svg";
import googleLogo from "@/../public/google-logo.svg";
import { AppConfig } from "@/app/core/config";
import AuthGuard from "@/components/auth/authGuard";
import { SignInForm } from "@/components/auth/signInForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function SignIn() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: string) => {
    setLoadingProvider(provider);
    await signIn(provider, { redirect: true });
    setLoadingProvider(null);
  };

  return (
    <AuthGuard authRequired={false} redirectTo="/">
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 gap-0">
            <div className="flex justify-start">
              <Image
                src="/logo.png"
                alt="Logo"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <CardTitle className="text-xl font-bold">
              Log in to {AppConfig.appName}
            </CardTitle>
            <CardDescription>
              Please log in to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-10 px-5 justify-center gap-2 font-medium text-black border-slate-300 hover:bg-slate-50"
                onClick={() => handleOAuthLogin("google")}
                disabled={!!loadingProvider}
              >
                {loadingProvider === "google" ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Image
                    src={googleLogo}
                    alt="Google Logo"
                    width={20}
                    height={20}
                  />
                )}
                {loadingProvider === "google"
                  ? "Logging in..."
                  : "Log in with Google"}
              </Button>

              <Button
                variant="outline"
                className="w-full h-10 px-5 justify-center gap-2 font-medium text-black border-slate-300 hover:bg-slate-50"
                onClick={() => handleOAuthLogin("github")}
                disabled={!!loadingProvider}
              >
                {loadingProvider === "github" ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Image
                    src={githubLogo}
                    alt="Github Logo"
                    width={20}
                    height={20}
                  />
                )}
                {loadingProvider === "github"
                  ? "Logging in..."
                  : "Log in with GitHub"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <SignInForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
