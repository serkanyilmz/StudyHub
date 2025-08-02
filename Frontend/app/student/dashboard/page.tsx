"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Clock, Trophy, TrendingUp, Brain, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Classroom {
  id: string
  name: string
  code: string
  teacher: {
    firstName: string
    lastName: string
  }
}

interface Homework {
  id: string
  name: string
  deadline: string
  quizzes: Array<{
    id: string
    name: string
  }>
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [homework, setHomework] = useState<Homework[]>([])
  const [loading, setLoading] = useState(true)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [classCode, setClassCode] = useState("")
  const [joining, setJoining] = useState(false)

  const fetchData = async () => {
    if (!user?.id) return

    try {
      const [classroomsData] = await Promise.all([api.getStudentClassrooms(user.id)])

      setClassrooms(classroomsData)

      // Fetch homework for all classrooms
      const allHomework: Homework[] = []
      for (const classroom of classroomsData) {
        try {
          const homeworkData = await api.getHomeworkByClassroom(classroom.id)
          allHomework.push(...homeworkData)
        } catch (error) {
          console.error(`Error fetching homework for classroom ${classroom.id}:`, error)
        }
      }
      setHomework(allHomework)
    } catch (error) {
      console.error("Error fetching student data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user?.id, toast])

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!classCode.trim() || !user?.id) return

    setJoining(true)
    try {
      // Find classroom by code first
      const allClassrooms = await api.getClassrooms()
      const targetClassroom = allClassrooms.find((c: any) => c.code === classCode.trim())

      if (!targetClassroom) {
        toast({
          title: "Error",
          description: "Invalid class code",
          variant: "destructive",
        })
        return
      }

      // Add student to classroom
      await api.addStudentToClassroom(targetClassroom.id, user.id)

      toast({
        title: "Success",
        description: `Successfully joined ${targetClassroom.name}!`,
      })

      // Refresh all data including homework
      await fetchData()

      setShowJoinForm(false)
      setClassCode("")
    } catch (error) {
      console.error("Error joining class:", error)
      toast({
        title: "Error",
        description: "Failed to join class. Please check the code and try again.",
        variant: "destructive",
      })
    } finally {
      setJoining(false)
    }
  }

  const getUpcomingHomework = () => {
    return homework
      .filter((hw) => new Date(hw.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5)
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    if (diffDays > 0) return `Due in ${diffDays} days`
    return "Overdue"
  }

  const getDeadlineColor = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "destructive"
    if (diffDays <= 1) return "destructive"
    if (diffDays <= 3) return "secondary"
    return "default"
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening in your studies</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classrooms.length}</div>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUpcomingHomework().length}</div>
              <p className="text-xs text-muted-foreground">Due soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Assistance</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Available</div>
              <p className="text-xs text-muted-foreground">Get explanations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Good</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Classes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Classes</CardTitle>
                  <CardDescription>Your enrolled classrooms</CardDescription>
                </div>
                <Button onClick={() => setShowJoinForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Join Class
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Join Class Form */}
              {showJoinForm && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <form onSubmit={handleJoinClass} className="space-y-4">
                    <div>
                      <Label htmlFor="classCode">Class Code</Label>
                      <Input
                        id="classCode"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="Enter class code..."
                        required
                        disabled={joining}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={joining || !classCode.trim()} size="sm">
                        {joining ? "Joining..." : "Join Class"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowJoinForm(false)
                          setClassCode("")
                        }}
                        size="sm"
                        disabled={joining}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {classrooms.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No classes enrolled yet</p>
                  <p className="text-sm text-gray-500 mt-2">Ask your teacher for a class code to join</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {classrooms.map((classroom) => (
                    <div key={classroom.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{classroom.name}</h3>
                        <p className="text-sm text-gray-600">
                          {classroom.teacher.firstName} {classroom.teacher.lastName}
                        </p>
                        <p className="text-xs text-gray-500">Code: {classroom.code}</p>
                      </div>
                      <Link href={`/student/classroom/${classroom.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Homework */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Homework</CardTitle>
              <CardDescription>Your pending assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {getUpcomingHomework().length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">All caught up!</p>
                  <p className="text-sm text-gray-500 mt-2">No pending homework assignments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getUpcomingHomework().map((hw) => (
                    <div key={hw.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{hw.name}</h3>
                        <p className="text-sm text-gray-600">
                          {hw.quizzes.length} quiz{hw.quizzes.length !== 1 ? "es" : ""}
                        </p>
                        <Badge variant={getDeadlineColor(hw.deadline)} className="mt-2">
                          {formatDeadline(hw.deadline)}
                        </Badge>
                      </div>
                      <Link href={`/student/homework/${hw.id}`}>
                        <Button size="sm">Start</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Study Assistant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI Study Assistant
            </CardTitle>
            <CardDescription>Get personalized study recommendations and explanations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-medium mb-2">Smart Explanations</h3>
                <p className="text-sm text-gray-600 mb-4">Get AI-powered explanations for any question you encounter</p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-medium mb-2">Study Recommendations</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Receive personalized study suggestions based on your performance
                </p>
                <Button variant="outline" size="sm">
                  Get Suggestions
                </Button>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-medium mb-2">Progress Insights</h3>
                <p className="text-sm text-gray-600 mb-4">Understand your learning patterns with AI analytics</p>
                <Button variant="outline" size="sm">
                  View Insights
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
