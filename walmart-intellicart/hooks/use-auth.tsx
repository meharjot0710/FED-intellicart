"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  role?: string
  avatar?: string
  onboarded: boolean
  preferences?: {
    householdSize: string
    dietaryNeeds: string[]
    shoppingDays: string[]
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, address?: any) => Promise<void>
  signOut: () => void
  updateUserPreferences: (preferences: any) => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

// Helper function to remove cookie
const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("intellicart-token")
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const userData = await response.json()
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          address: userData.address,
          role: userData.role,
          onboarded: true,
        }
        setUser(user)
        localStorage.setItem("intellicart-user", JSON.stringify(user))
      } else {
        localStorage.removeItem("intellicart-token")
        localStorage.removeItem("intellicart-user")
        removeCookie("intellicart-token")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("intellicart-token")
      localStorage.removeItem("intellicart-user")
      removeCookie("intellicart-token")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        address: data.user.address,
        role: data.user.role,
        onboarded: true,
      }

      setUser(user)
      localStorage.setItem("intellicart-token", data.token)
      localStorage.setItem("intellicart-user", JSON.stringify(user))
      setCookie("intellicart-token", data.token)
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string, address?: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, address }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        address: data.user.address,
        role: data.user.role,
        onboarded: false,
      }

      setUser(user)
      localStorage.setItem("intellicart-token", data.token)
      localStorage.setItem("intellicart-user", JSON.stringify(user))
      setCookie("intellicart-token", data.token)
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("intellicart-token")
    localStorage.removeItem("intellicart-user")
    removeCookie("intellicart-token")
  }

  const updateUserPreferences = async (preferences: any) => {
    if (user) {
      const updatedUser = { ...user, preferences, onboarded: true }
      setUser(updatedUser)
      localStorage.setItem("intellicart-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUserPreferences,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
