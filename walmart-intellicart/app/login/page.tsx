"use client";
import { AuthPages } from "@/components/auth/auth-pages";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return <AuthPages onComplete={() => router.push("/dashboard")} />;
} 