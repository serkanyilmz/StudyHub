"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

interface User {
  id: string
  username: string
  role: string
  fullName: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (username: string, password: string, fullName: string, role: string) => Promise<boolean>
  loading: boolean
  ensureValidToken: () => Promise<string | null>
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

// Function to refresh access token using refresh token
const refreshAccessToken = async (): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      return null
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: localStorage.getItem("accessToken") || "",
        refreshToken: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }
  } catch (error) {
    console.error("Token refresh error:", error)
    return null
  }
}

// Function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.exp) {
      return true
    }
    return decoded.exp <= Date.now() / 1000
  } catch (error) {
    return true
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = localStorage.getItem("accessToken")
      const refreshToken = localStorage.getItem("refreshToken")
      
      if (token && refreshToken) {
        // Check if access token is expired
        if (isTokenExpired(token)) {
          console.log("Access token expired, trying to refresh...")
          const newTokens = await refreshAccessToken()
          
          if (newTokens) {
            // Successfully refreshed tokens
            localStorage.setItem("accessToken", newTokens.accessToken)
            localStorage.setItem("refreshToken", newTokens.refreshToken)
            
            const decoded = decodeJWT(newTokens.accessToken)
            if (decoded) {
              setUser({
                id: decoded.userId || decoded.sub,
                username: decoded.sub,
                role: decoded.role,
                fullName: decoded.fullName || decoded.sub,
              })
            }
          } else {
            // Failed to refresh, redirect to login
            console.log("Failed to refresh token, redirecting to login")
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            setUser(null)
            router.push("/auth/login")
          }
        } else {
          // Token is still valid
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
            setUser(null)
            router.push("/auth/login")
          }
        }
      }
      setLoading(false)
    }

    checkAndRefreshToken()
  }, [router])

  useEffect(() => {
    // Configure API client with token validator function
    api.setTokenValidator(ensureValidToken)
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

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (refreshToken) {
        // Call backend logout endpoint to blacklist the refresh token
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: localStorage.getItem("accessToken") || "",
            refreshToken: refreshToken,
          }),
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always clear tokens and redirect, even if backend call fails
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      router.push("/auth/login")
    }
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

  // Function to ensure we have a valid access token for API calls
  const ensureValidToken = useCallback(async (): Promise<string | null> => {
    let accessToken = localStorage.getItem("accessToken")
    
    if (!accessToken) {
      return null
    }

    // Check if token is expired
    if (isTokenExpired(accessToken)) {
      console.log("Access token expired during API call, trying to refresh...")
      const newTokens = await refreshAccessToken()
      
      if (newTokens) {
        // Successfully refreshed tokens
        localStorage.setItem("accessToken", newTokens.accessToken)
        localStorage.setItem("refreshToken", newTokens.refreshToken)
        
        // Update user state with new token
        const decoded = decodeJWT(newTokens.accessToken)
        if (decoded) {
          setUser({
            id: decoded.userId || decoded.sub,
            username: decoded.sub,
            role: decoded.role,
            fullName: decoded.fullName || decoded.sub,
          })
        }
        
        return newTokens.accessToken
      } else {
        // Failed to refresh, clear tokens and redirect to login
        console.log("Failed to refresh token during API call, redirecting to login")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        setUser(null)
        router.push("/auth/login")
        return null
      }
    }

    return accessToken
  }, [router])

  useEffect(() => {
    // Configure API client with token validator function
    api.setTokenValidator(ensureValidToken)
  }, [ensureValidToken])

  return <AuthContext.Provider value={{ user, login, logout, register, loading, ensureValidToken }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
