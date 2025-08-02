"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Calendar, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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
  classroom: {
    id: string
    name: string
  }
  quizzes: Array<{
    id: string
    name: string
  }>
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [allHomework, setAllHomework] = useState<Homework[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return

      try {
        // Fetch all classrooms first
        const classroomsData = await api.getClassrooms()

        // Filter classrooms for current teacher
        const teacherClassrooms = classroomsData.filter((classroom: Classroom) => classroom.teacher.id === user.id)
        setClassrooms(teacherClassrooms)

        // Fetch homework for teacher's classrooms
        const homework: Homework[] = []
        for (const classroom of teacherClassrooms) {
          try {
            const homeworkData = await api.getHomeworkByClassroom(classroom.id)
            homework.push(...homeworkData)
          } catch (error) {
            console.error(`Error fetching homework for classroom ${classroom.id}:`, error)
            // Continue with other classrooms even if one fails
          }
        }
        setAllHomework(homework)
      } catch (error) {
        console.error("Error fetching teacher data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id, toast])

  const getRecentHomework = () => {
    return allHomework.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()).slice(0, 5)
  }

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your classes and assignments</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/teacher/classroom/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Classroom
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Classes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classrooms.length}</div>
              <p className="text-xs text-muted-foreground">Active classrooms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allHomework.length}</div>
              <p className="text-xs text-muted-foreground">Total homework</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  allHomework.filter((hw) => {
                    const deadline = new Date(hw.deadline)
                    const now = new Date()
                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                    return deadline >= now && deadline <= weekFromNow
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Due this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Classrooms */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Classrooms</CardTitle>
                  <CardDescription>Manage your classes</CardDescription>
                </div>
                <Link href="/teacher/classroom/new">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Class
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {classrooms.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No classrooms yet</p>
                  <p className="text-sm text-gray-500 mt-2">Create your first classroom to get started</p>
                  <Link href="/teacher/classroom/new">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Classroom
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {classrooms.map((classroom) => (
                    <div key={classroom.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{classroom.name}</h3>
                        <p className="text-sm text-gray-600">Code: {classroom.code}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/teacher/classroom/${classroom.id}`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Homework */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Your latest homework assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {getRecentHomework().length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No assignments yet</p>
                  <p className="text-sm text-gray-500 mt-2">Create homework for your students</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getRecentHomework().map((homework) => (
                    <div key={homework.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{homework.name}</h3>
                        <p className="text-sm text-gray-600">{homework.classroom.name}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">
                            {homework.quizzes.length} quiz{homework.quizzes.length !== 1 ? "es" : ""}
                          </Badge>
                          <Badge variant="secondary">Due: {formatDeadline(homework.deadline)}</Badge>
                        </div>
                      </div>
                      <Link href={`/teacher/homework/${homework.id}`}>
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
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for teachers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/teacher/classroom/new">
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium mb-1">Create Classroom</h3>
                  <p className="text-sm text-gray-600">Set up a new class for your students</p>
                </div>
              </Link>
              <Link href="/teacher/assign-homework">
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium mb-1">Assign Homework</h3>
                  <p className="text-sm text-gray-600">Create and assign new homework</p>
                </div>
              </Link>
              <div
                className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  // Navigate to reports for first classroom
                  if (classrooms.length > 0) {
                    router.push(`/teacher/reports/${classrooms[0].id}`)
                  } else {
                    toast({
                      title: "No Classrooms",
                      description: "Create a classroom first to view reports",
                      variant: "destructive",
                    })
                  }
                }}
              >
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium mb-1">View Reports</h3>
                <p className="text-sm text-gray-600">Check student progress and grades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
