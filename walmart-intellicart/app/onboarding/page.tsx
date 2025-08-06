"use client";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return <OnboardingFlow onComplete={() => router.push("/app")} />;
} 