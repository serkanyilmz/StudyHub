"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

import Link from "next/link"
import Image from "next/image"
const demoUsers = [
  {
    label: "Demo Writer",
    username: "serkan.yilmaz",
    password: "Developer101!",
  },
  {
    label: "Demo Teacher",
    username: "erkim.berk",
    password: "Developer101!",
  },
  {
    label: "Demo Student",
    username: "sumeyye.sakar",
    password: "Developer101!",
  },
]

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(username, password)
      // Clear form on successful login
      setUsername("")
      setPassword("")
    } catch (err) {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername)
    setPassword(demoPassword)
    setLoading(true)
    setError("")

    try {
      await login(demoUsername, demoPassword)
    } catch (err) {
      setError("Invalid demo credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Image
                src="/studyhub-logo-darkgrey-text.png" 
                alt="My Icon"
                width={180}
                height={180}
                className="object-contain"  
            />
          </div>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
        {demoUsers.map((user, index) => {
          // Assign color based on label
          let color = "";
          let btnColor = "";
          if (user.label.includes("Student")) {
        color = "#28a745";
        btnColor = "bg-[#28a745] hover:bg-[#218838] text-white";
          } else if (user.label.includes("Teacher")) {
        color = "#4b70e1";
        btnColor = "bg-[#4b70e1] hover:bg-[#3a5bb5] text-white";
          } else if (user.label.includes("Writer")) {
        color = "#ec8900";
        btnColor = "bg-[#ec8900] hover:bg-[#c46f00] text-white";
          }
          return (
        <div key={index} className="p-2 bg-white rounded-md shadow-md border w-52">
          <div
            className="text-xs font-medium mb-1"
            style={{ color }}
          >
            {user.label}
          </div>
          <div className="text-xs text-gray-500 mb-1">
            <div>👤 {user.username}</div>
          </div>
          <Button
            type="button"
            size="sm"
            className={`w-full mt-1 ${btnColor}`}
            onClick={() => handleDemoLogin(user.username, user.password)}
            disabled={loading}
          >
            Use
          </Button>
        </div>
          );
        })}
      </div>
    </div>    
  )
}
