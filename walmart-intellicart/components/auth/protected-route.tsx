"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, requireAuth, redirectTo, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  return <>{children}</>
} 