"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Users, BookOpen, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Quiz {
  id: string
  name: string
  topic: {
    name: string
  }
  questions: Array<{
    question: {
      id: string
      text: string
    }
    questionNo: number
  }>
}

interface Homework {
  id: string
  name: string
  deadline: string
  classroom: {
    id: string
    name: string
    code: string
  }
  quizzes: Quiz[]
}

export default function HomeworkDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [homework, setHomework] = useState<Homework | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const homeworkData = await api.getHomework(params.id as string)
        setHomework(homeworkData)
      } catch (error) {
        console.error("Error fetching homework:", error)
        toast({
          title: "Error",
          description: "Failed to load homework details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHomework()
  }, [params.id, toast])

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalQuestions = () => {
    return homework?.quizzes.reduce((total, quiz) => total + quiz.questions.length, 0) || 0
  }

  const getDeadlineStatus = () => {
    if (!homework) return "unknown"

    const deadline = new Date(homework.deadline)
    const now = new Date()

    if (deadline < now) return "overdue"

    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) return "urgent"
    if (diffDays <= 3) return "soon"
    return "upcoming"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "destructive"
      case "urgent":
        return "destructive"
      case "soon":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "overdue":
        return "Overdue"
      case "urgent":
        return "Due soon"
      case "soon":
        return "Due this week"
      default:
        return "Upcoming"
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading homework details...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!homework) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Homework Not Found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </Layout>
    )
  }

  const deadlineStatus = getDeadlineStatus()

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{homework.name}</h1>
            <p className="text-gray-600 mt-2">
              Classroom: {homework.classroom.name} ({homework.classroom.code})
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={getStatusColor(deadlineStatus)}>
                <Clock className="h-3 w-3 mr-1" />
                {getStatusText(deadlineStatus)}
              </Badge>
              <Badge variant="outline">Due: {formatDeadline(homework.deadline)}</Badge>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{homework.quizzes.length}</div>
              <p className="text-xs text-muted-foreground">Assigned quizzes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalQuestions()}</div>
              <p className="text-xs text-muted-foreground">Questions to answer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classroom</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{homework.classroom.code}</div>
              <p className="text-xs text-muted-foreground">Class code</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusText(deadlineStatus)}</div>
              <p className="text-xs text-muted-foreground">Current status</p>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Details */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Quizzes</CardTitle>
            <CardDescription>Detailed breakdown of quizzes in this homework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {homework.quizzes.map((quiz, index) => (
                <div key={quiz.id} className="p-6 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{quiz.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Topic: {quiz.topic.name}</p>
                      <Badge variant="outline" className="mt-2">
                        {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <Badge variant="secondary">Quiz {index + 1}</Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Questions Preview:</h4>
                    <div className="space-y-1">
                      {quiz.questions.slice(0, 3).map((q, qIndex) => (
                        <div key={q.question.id} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
                          {qIndex + 1}. {q.question.text.substring(0, 100)}
                          {q.question.text.length > 100 ? "..." : ""}
                        </div>
                      ))}
                      {quiz.questions.length > 3 && (
                        <div className="text-sm text-gray-500 pl-4">
                          ... and {quiz.questions.length - 3} more question{quiz.questions.length - 3 !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Manage this homework assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => router.push(`/teacher/classroom/${homework.classroom.id}`)}>
                View Classroom
              </Button>
              <Button variant="outline" onClick={() => router.push(`/teacher/reports/${homework.classroom.id}`)}>
                View Student Reports
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this homework? This action cannot be undone.")) {
                    api
                      .deleteHomework(homework.id)
                      .then(() => {
                        toast({
                          title: "Success",
                          description: "Homework deleted successfully",
                        })
                        router.back()
                      })
                      .catch(() => {
                        toast({
                          title: "Error",
                          description: "Failed to delete homework",
                          variant: "destructive",
                        })
                      })
                  }
                }}
              >
                Delete Homework
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
