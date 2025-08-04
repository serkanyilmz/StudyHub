"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Classroom {
  id: string
  name: string
  code: string
  teacher: {
    id: string
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

export default function ClassroomPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [homework, setHomework] = useState<Homework[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classroomData, homeworkData] = await Promise.all([
          api.getClassroom(params.id as string),
          api.getHomeworkByClassroom(params.id as string),
        ])

        setClassroom(classroomData)
        setHomework(homeworkData)
      } catch (error) {
        console.error("Error fetching classroom data:", error)
        toast({
          title: "Error",
          description: "Failed to load classroom data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

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

  const getUpcomingHomework = () => {
    return homework
      .filter((hw) => new Date(hw.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  }

  const getPastHomework = () => {
    return homework
      .filter((hw) => new Date(hw.deadline) <= new Date())
      .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading classroom...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!classroom) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Classroom Not Found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{classroom.name}</h1>
            <p className="text-gray-600 mt-2">
              Teacher: {classroom.teacher.firstName} {classroom.teacher.lastName}
            </p>
            <Badge variant="outline" className="mt-2">
              Code: {classroom.code}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Homework</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{homework.length}</div>
              <p className="text-xs text-muted-foreground">Assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUpcomingHomework().length}</div>
              <p className="text-xs text-muted-foreground">Due soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getPastHomework().length}</div>
              <p className="text-xs text-muted-foreground">Past due</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Homework */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Homework</CardTitle>
              <CardDescription>Assignments due soon</CardDescription>
            </CardHeader>
            <CardContent>
              {getUpcomingHomework().length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming homework</p>
                  <p className="text-sm text-gray-500 mt-2">All caught up!</p>
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

          {/* Past Homework */}
          <Card>
            <CardHeader>
              <CardTitle>Past Homework</CardTitle>
              <CardDescription>Previously assigned work</CardDescription>
            </CardHeader>
            <CardContent>
              {getPastHomework().length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No past homework</p>
                  <p className="text-sm text-gray-500 mt-2">Assignments will appear here after their due date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getPastHomework()
                    .slice(0, 5)
                    .map((hw) => (
                      <div key={hw.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-700">{hw.name}</h3>
                          <p className="text-sm text-gray-600">
                            {hw.quizzes.length} quiz{hw.quizzes.length !== 1 ? "es" : ""}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {formatDeadline(hw.deadline)}
                          </Badge>
                        </div>
                        <Link href={`/student/homework/${hw.id}`}>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </Link>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
