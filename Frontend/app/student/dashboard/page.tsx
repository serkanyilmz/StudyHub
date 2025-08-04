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
import { BookOpen, Clock, Trophy, TrendingUp, Brain, Plus, Minus, TrendingDown } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useGeminiAnimation } from "@/components/GeminiAnimation"
import Image from "next/image"
import { set } from "date-fns"

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
  const [progressData, setProgressData] = useState<[string, string] | null>(null)
  const [progressLoading, setProgressLoading] = useState(false)

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

  const fetchProgress = async () => {
  if (!user?.id) return
  setProgressLoading(true)
  try {
    const result = await api.getStudentProgress(user.id)
    // result örneğin: ["Good", "Keep it up!"]
    setProgressData(result)
    localStorage.setItem("progressData", JSON.stringify(result))
  } catch (e) {
    setProgressData(["Unknown", ""])
    localStorage.setItem("progressData", JSON.stringify(["Unknown", ""]))
  } finally {
    setProgressLoading(false)
  }
}

useEffect(() => {
  
  const storedProgress = localStorage.getItem("progressData")
  if (storedProgress) {
    setProgressData(JSON.parse(storedProgress))
  } else {
    setProgressData(null)
  }

  if (localStorage.getItem("shouldFetchProgress") === "true") {
    setProgressLoading(true)
    fetchProgress()
    localStorage.removeItem("shouldFetchProgress")
  }
}, [user?.id])

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

  const handleAIAction = (action: string) => {
    
    toast({
      title: "AI Assistant",
      description: `${action} feature coming soon!`,
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
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
          <h1 className="text-3xl font-bold" style={{ color: "hsl(var(--studyhub-dark-grey))" }}>
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening in your studies</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="student-bg border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Classes</CardTitle>
              <BookOpen className="h-4 w-4 student-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold student-accent">{classrooms.length}</div>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </CardContent>
          </Card>

          <Card className="student-bg border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
              <Clock className="h-4 w-4 student-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold student-accent">{getUpcomingHomework().length}</div>
              <p className="text-xs text-muted-foreground">Due soon</p>
            </CardContent>
          </Card>

          

<Card
  className={
    progressLoading
      ? "student-bg border-2"
      : (progressData?.[0] === "Good"
        ? "bg-green-50 border-green-200"
        : progressData?.[0] === "Average"
        ? "bg-yellow-50 border-yellow-200"
        : progressData?.[0] === "Bad"
        ? "bg-red-50 border-red-200"
        : "student-bg border-2")
  }
>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Progress</CardTitle>
    {progressLoading ? (
      null
    ) : progressData?.[0] === "Good" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : progressData?.[0] === "Average" ? (
      <Minus className="h-4 w-4 text-yellow-500" />
    ) : progressData?.[0] === "Bad" ? (
      <TrendingDown className="h-4 w-4 text-red-600" />
    ) : (
      <Brain className="h-4 w-4 text-gray-400" />
    )}
  </CardHeader>
  <CardContent>
    {progressLoading ? (
      <div className="flex items-center justify-center h-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    ) : (
      <>
        <div
          className={`text-2xl font-bold ${
            progressData?.[0] === "Good"
              ? "text-green-600"
              : progressData?.[0] === "Average"
              ? "text-yellow-500"
              : progressData?.[0] === "Bad"
              ? "text-red-600"
              : "student-accent"
          }`}
        >
          {progressData?.[0] ? progressData[0] : "-"}
        </div>
        <p className="text-xs text-muted-foreground">{progressData?.[1] || ""}</p>
      </>
    )}
  </CardContent>
</Card>
          
          <Card className="ai-enhanced border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Assistance</CardTitle>
               <Image src="/gemini-logo.svg" alt="Gemini" width={20} height={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Available</div>
              <p className="text-xs text-muted-foreground">Get explanations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Classes */}
          <Card className="connection-line border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Classes</CardTitle>
                  <CardDescription>Your enrolled classrooms</CardDescription>
                </div>
                <Button onClick={() => setShowJoinForm(true)} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Join Class
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Join Class Form */}
              {showJoinForm && (
                <div className="mb-6 p-4 border rounded-lg ai-enhanced">
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
                      <Button
                        type="submit"
                        disabled={joining || !classCode.trim()}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
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
                    <div
                      key={classroom.id}
                      className="flex items-center justify-between p-4 border rounded-lg connection-line"
                    >
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
          <Card className="connection-line border-2">
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
                    <div
                      key={hw.id}
                      className="flex items-center justify-between p-4 border rounded-lg connection-line"
                    >
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
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Start
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Study Assistant */}
        <Card className="ai-enhanced border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image
                src="/gemini-logo.svg" 
                alt="Gemini Icon"
                width={30}
                height={30}
                className="object-contain mr-2"
              />
              AI Study Assistant
            </CardTitle>
            <CardDescription>Get personalized study recommendations and explanations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center connection-line">
                <h3 className="font-medium mb-2">Smart Explanations</h3>
                <p className="text-sm text-gray-600 mb-4">Get AI-powered explanations for any question you encounter</p>
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => handleAIAction("Smart Explanations")}>
                    Learn More
                  </Button>
                  
                </div>
              </div>
              <div className="p-4 border rounded-lg text-center connection-line">
                <h3 className="font-medium mb-2">Study Recommendations</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Receive personalized study suggestions based on your performance
                </p>
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => handleAIAction("Study Recommendations")}>
                    Get Suggestions
                  </Button>
                  
                </div>
              </div>
              <div className="p-4 border rounded-lg text-center connection-line">
                <h3 className="font-medium mb-2">Progress Insights</h3>
                <p className="text-sm text-gray-600 mb-4">Understand your learning patterns with AI analytics</p>
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => handleAIAction("Progress Insights")}>
                    View Insights
                  </Button>
                  
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
