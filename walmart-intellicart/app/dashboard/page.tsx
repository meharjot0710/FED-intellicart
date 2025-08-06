"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainApp } from "@/components/main-app";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <MainApp />
    </ProtectedRoute>
  );
} 