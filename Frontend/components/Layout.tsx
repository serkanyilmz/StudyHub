"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Brain, LogOut, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const getRoleColor = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "text-blue-600"
      case "TEACHER":
        return "text-green-600"
      case "WRITER":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const getDashboardLink = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "/student/dashboard"
      case "TEACHER":
        return "/teacher/dashboard"
      case "WRITER":
        return "/writer/dashboard"
      default:
        return "/"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={user ? getDashboardLink(user.role) : "/"} className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">StudyHub</span>
            </Link>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{user.username}</span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
