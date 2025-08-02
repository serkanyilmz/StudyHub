"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, PenTool, Brain } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case "STUDENT":
          router.push("/student/dashboard")
          break
        case "TEACHER":
          router.push("/teacher/dashboard")
          break
        case "WRITER":
          router.push("/writer/dashboard")
          break
        default:
          break
      }
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return null // Will redirect based on role
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">StudyHub</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">AI-Powered Learning Platform for Students, Teachers, and Writers</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>For Students</CardTitle>
              <CardDescription>
                Take quizzes, get AI-powered explanations, and track your learning progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Interactive quizzes and homework</li>
                <li>• AI-powered answer explanations</li>
                <li>• Personalized study recommendations</li>
                <li>• Progress tracking and analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>For Teachers</CardTitle>
              <CardDescription>Manage classrooms, assign homework, and monitor student progress</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Create and manage classrooms</li>
                <li>• Assign homework and quizzes</li>
                <li>• Monitor student performance</li>
                <li>• AI-assisted grading insights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <PenTool className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>For Writers</CardTitle>
              <CardDescription>Create engaging questions and quizzes with AI assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Create questions and quizzes</li>
                <li>• Organize content by topics</li>
                <li>• AI-powered content suggestions</li>
                <li>• Quality assessment tools</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Powered by Artificial Intelligence</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform uses advanced AI to provide personalized learning experiences, intelligent content
            recommendations, and detailed explanations to help students succeed in their educational journey.
          </p>
        </div>
      </div>
    </div>
  )
}
