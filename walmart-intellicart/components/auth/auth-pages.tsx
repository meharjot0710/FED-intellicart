"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Sparkles, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface AuthPagesProps {
  onComplete: () => void
}

export function AuthPages({ onComplete }: AuthPagesProps) {
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(formData.email, formData.password)
      toast({
        title: "Success!",
        description: "Signed in successfully",
      })
      onComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Sign in failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.name)
      toast({
        title: "Success!",
        description: "Account created successfully",
      })
      onComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Sign up failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setLoading(true)
    try {
      // For now, just show a toast - implement actual social login later
      toast({
        title: "Coming Soon",
        description: `${provider} login will be available soon`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Social login failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-blue-600 rounded-full">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Walmart IntelliCart</h1>
          <p className="text-gray-600">Your AI-powered grocery shopping assistant</p>
        </div>

        {/* Auth Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back!</CardTitle>
                <CardDescription>Sign in to continue your smart shopping journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <LoadingSpinner size="sm" /> : "Sign In"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => handleSocialLogin("google")} disabled={loading}>
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" onClick={() => handleSocialLogin("apple")} disabled={loading}>
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C8.396 0 8.025.044 6.79.207 5.56.37 4.703.64 3.967.984c-.74.344-1.368.8-1.992 1.424C1.35 3.032.895 3.66.551 4.4.207 5.136-.063 5.993-.207 7.223-.35 8.458-.394 8.83-.394 12.45c0 3.62.044 3.992.207 5.227.144 1.23.414 2.087.758 2.823.344.74.8 1.368 1.424 1.992.624.624 1.252 1.08 1.992 1.424.736.344 1.593.614 2.823.758 1.235.144 1.607.188 5.227.188 3.62 0 3.992-.044 5.227-.188 1.23-.144 2.087-.414 2.823-.758.74-.344 1.368-.8 1.992-1.424.624-.624 1.08-1.252 1.424-1.992.344-.736.614-1.593.758-2.823.144-1.235.188-1.607.188-5.227 0-3.62-.044-3.992-.188-5.227-.144-1.23-.414-2.087-.758-2.823-.344-.74-.8-1.368-1.424-1.992C20.368 1.35 19.74.895 19 .551 18.264.207 17.407-.063 16.177-.207 14.942-.35 14.57-.394 10.95-.394c-3.62 0-3.992.044-5.227.207-1.23.144-2.087.414-2.823.758-.74.344-1.368.8-1.992 1.424C.284 3.619-.172 4.247-.516 4.987c-.344.736-.614 1.593-.758 2.823C-1.418 9.045-1.462 9.417-1.462 13.037c0 3.62.044 3.992.207 5.227.144 1.23.414 2.087.758 2.823.344.74.8 1.368 1.424 1.992.624.624 1.252 1.08 1.992 1.424.736.344 1.593.614 2.823.758 1.235.144 1.607.188 5.227.188 3.62 0 3.992-.044 5.227-.188 1.23-.144 2.087-.414 2.823-.758.74-.344 1.368-.8 1.992-1.424.624-.624 1.08-1.252 1.424-1.992.344-.736.614-1.593.758-2.823.144-1.235.188-1.607.188-5.227 0-3.62-.044-3.992-.188-5.227-.144-1.23-.414-2.087-.758-2.823-.344-.74-.8-1.368-1.424-1.992C19.74.895 19.112.439 18.372.095 17.636-.249 16.779-.519 15.549-.663 14.314-.807 13.942-.851 10.322-.851 6.702-.851 6.33-.807 5.095-.663c-1.23.144-2.087.414-2.823.758-.74.344-1.368.8-1.992 1.424C.656 2.743.2 3.371-.144 4.111c-.344.736-.614 1.593-.758 2.823C-.046 8.169-.09 8.541-.09 12.161c0 3.62.044 3.992.207 5.227.144 1.23.414 2.087.758 2.823.344.74.8 1.368 1.424 1.992.624.624 1.252 1.08 1.992 1.424.736.344 1.593.614 2.823.758 1.235.144 1.607.188 5.227.188 3.62 0 3.992-.044 5.227-.188 1.23-.144 2.087-.414 2.823-.758.74-.344 1.368-.8 1.992-1.424.624-.624 1.08-1.252 1.424-1.992.344-.736.614-1.593.758-2.823.144-1.235.188-1.607.188-5.227 0-3.62-.044-3.992-.188-5.227-.144-1.23-.414-2.087-.758-2.823-.344-.74-.8-1.368-1.424-1.992C20.368 1.35 19.74.895 19 .551 18.264.207 17.407-.063 16.177-.207 14.942-.35 14.57-.394 10.95-.394z" />
                    </svg>
                    Apple
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>Join thousands of smart shoppers today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <LoadingSpinner size="sm" /> : "Create Account"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => handleSocialLogin("google")} disabled={loading}>
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" onClick={() => handleSocialLogin("apple")} disabled={loading}>
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C8.396 0 8.025.044 6.79.207 5.56.37 4.703.64 3.967.984c-.74.344-1.368.8-1.992 1.424C1.35 3.032.895 3.66.551 4.4.207 5.136-.063 5.993-.207 7.223-.35 8.458-.394 8.83-.394 12.45c0 3.62.044 3.992.207 5.227.144 1.23.414 2.087.758 2.823.344.74.8 1.368 1.424 1.992.624.624 1.252 1.08 1.992 1.424.736.344 1.593.614 2.823.758 1.235.144 1.607.188 5.227.188 3.62 0 3.992-.044 5.227-.188 1.23-.144 2.087-.414 2.823-.758.74-.344 1.368-.8 1.992-1.424.624-.624 1.08-1.252 1.424-1.992.344-.736.614-1.593.758-2.823.144-1.235.188-1.607.188-5.227 0-3.62-.044-3.992-.188-5.227-.144-1.23-.414-2.087-.758-2.823-.344-.74-.8-1.368-1.424-1.992C20.368 1.35 19.74.895 19 .551 18.264.207 17.407-.063 16.177-.207 14.942-.35 14.57-.394 10.95-.394z" />
                    </svg>
                    Apple
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
