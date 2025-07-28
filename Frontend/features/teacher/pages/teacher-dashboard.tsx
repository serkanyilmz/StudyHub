"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, Calendar, BarChart3, PlusCircle, Users, BookOpen, Clock, TrendingUp } from "lucide-react"
import { StatCardComponent } from "@/shared/components/ui/stat-card"
import type { StatCard } from "@/shared/types/common"

interface TeacherDashboardProps {
  activeView: string
}

export function TeacherDashboard({ activeView }: TeacherDashboardProps) {
  const [showClassForm, setShowClassForm] = useState(false)

  const stats: StatCard[] = [
    { title: "Active Classes", value: "8", icon: GraduationCap, color: "text-green-600" },
    { title: "Total Students", value: "234", icon: Users, color: "text-blue-600" },
    { title: "Assignments Given", value: "45", icon: Calendar, color: "text-orange-600" },
    { title: "Avg. Performance", value: "78%", icon: TrendingUp, color: "text-purple-600" },
  ]

  const classes = [
    { id: 1, name: "Advanced React", code: "REACT101", students: 32, assignments: 8, avgScore: 85 },
    { id: 2, name: "Database Design", code: "DB201", students: 28, assignments: 6, avgScore: 78 },
    { id: 3, name: "Machine Learning", code: "ML301", students: 24, assignments: 10, avgScore: 82 },
  ]

  const assignments = [
    {
      id: 1,
      title: "React Hooks Quiz",
      class: "Advanced React",
      dueDate: "2024-01-20",
      submitted: 28,
      total: 32,
      avgScore: 87,
    },
    {
      id: 2,
      title: "SQL Fundamentals",
      class: "Database Design",
      dueDate: "2024-01-18",
      submitted: 25,
      total: 28,
      avgScore: 75,
    },
    {
      id: 3,
      title: "Linear Regression",
      class: "Machine Learning",
      dueDate: "2024-01-22",
      submitted: 20,
      total: 24,
      avgScore: 90,
    },
  ]

  const performanceData = [
    { student: "Alice Johnson", class: "Advanced React", quizzes: 8, avgScore: 92, trend: "up" },
    { student: "Bob Smith", class: "Database Design", quizzes: 6, avgScore: 78, trend: "stable" },
    { student: "Carol Davis", class: "Machine Learning", quizzes: 7, avgScore: 85, trend: "up" },
    { student: "David Wilson", class: "Advanced React", quizzes: 5, avgScore: 65, trend: "down" },
  ]

  if (activeView === "dashboard") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-gray-600">Manage your classes and track student performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCardComponent key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Latest quiz assignments and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.slice(0, 3).map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{assignment.title}</h4>
                      <Badge variant="outline">{assignment.class}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Due: {assignment.dueDate}</span>
                        <span>
                          {assignment.submitted}/{assignment.total} submitted
                        </span>
                      </div>
                      <Progress value={(assignment.submitted / assignment.total) * 100} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Avg Score: {assignment.avgScore}%</span>
                        <span>{Math.round((assignment.submitted / assignment.total) * 100)}% completion</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Performance</CardTitle>
              <CardDescription>AI-generated insights on student performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Positive Trend</span>
                  </div>
                  <p className="text-sm text-green-800">
                    Advanced React class shows 15% improvement in quiz scores over the last month.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-900">Attention Needed</span>
                  </div>
                  <p className="text-sm text-orange-800">
                    4 students in Database Design need additional support with SQL joins.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Recommendation</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Consider adding more practice questions on machine learning algorithms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === "classes") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Classes</h1>
            <p className="text-gray-600">Manage your classes and students</p>
          </div>
          <Button onClick={() => setShowClassForm(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Class
          </Button>
        </div>

        {showClassForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Class</CardTitle>
              <CardDescription>Set up a new class for your students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Class Name</Label>
                  <Input id="className" placeholder="Enter class name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classCode">Class Code</Label>
                  <Input id="classCode" placeholder="Auto-generated" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description of the class" />
              </div>

              <div className="flex gap-2">
                <Button>Create Class</Button>
                <Button variant="outline" onClick={() => setShowClassForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <Badge variant="outline">{classItem.code}</Badge>
                </div>
                <CardDescription>
                  {classItem.students} students • {classItem.assignments} assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="font-medium">{classItem.avgScore}%</span>
                  </div>
                  <Progress value={classItem.avgScore} className="h-2" />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Users className="h-4 w-4 mr-1" />
                      Students
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Assign Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (activeView === "performance") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-gray-600">AI-powered insights into student performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Student Performance Overview</CardTitle>
              <CardDescription>Individual student progress and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Quizzes</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceData.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{student.student}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.quizzes}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{student.avgScore}%</span>
                          <Progress value={student.avgScore} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.trend === "up" ? "default" : student.trend === "down" ? "destructive" : "secondary"
                          }
                        >
                          {student.trend === "up"
                            ? "↗ Improving"
                            : student.trend === "down"
                              ? "↘ Declining"
                              : "→ Stable"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Gemini-powered analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-1">Top Performers</h4>
                  <p className="text-sm text-blue-800">
                    Alice Johnson and Carol Davis show consistent high performance across all subjects.
                  </p>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-900 mb-1">Needs Support</h4>
                  <p className="text-sm text-orange-800">
                    David Wilson may benefit from additional practice in React concepts.
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-1">Engagement</h4>
                  <p className="text-sm text-green-800">
                    Machine Learning class has the highest engagement rate at 94%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <div>Select a view from the sidebar</div>
}
