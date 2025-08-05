"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  role: string
  fullName: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (username: string, password: string, fullName: string, role: string) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// API base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// JWT token decoder
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error decoding JWT:", error)
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      const decoded = decodeJWT(token)
      if (decoded && decoded.exp > Date.now() / 1000) {
        setUser({
          id: decoded.userId || decoded.sub,
          username: decoded.sub,
          role: decoded.role,
          fullName: decoded.fullName || decoded.sub,
        })
      } else {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.json()
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)

      const decoded = decodeJWT(data.accessToken)
      if (decoded) {
        const userData = {
          id: decoded.userId || decoded.sub,
          username: decoded.sub,
          role: decoded.role,
          fullName: decoded.fullName || decoded.sub,
        }
        setUser(userData)

        // Redirect based on role
        switch (decoded.role?.toLowerCase()) {
          case "student":
            router.push("/student/dashboard")
            break
          case "teacher":
            router.push("/teacher/dashboard")
            break
          case "writer":
            router.push("/writer/dashboard")
            break
          default:
            router.push("/")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    router.push("/auth/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, register, loading }}>{children}</AuthContext.Provider>
}

const register = async (
  username: string,
  password: string,
  fullName: string,
  role: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, fullName, role }),
    })
    return response.ok
  } catch (error) {
    console.error("Register error:", error)
    return false
  }
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
