"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GraduationCap, BookOpen, Clock, Trophy, TrendingUp, Brain, Calendar, Target } from "lucide-react"
import { StatCardComponent } from "@/shared/components/ui/stat-card"
import type { StatCard } from "@/shared/types/common"

interface StudentDashboardProps {
  activeView: string
}

export function StudentDashboard({ activeView }: StudentDashboardProps) {
  const [showJoinForm, setShowJoinForm] = useState(false)

  const stats: StatCard[] = [
    { title: "Classes Joined", value: "5", icon: GraduationCap, color: "text-blue-600" },
    { title: "Quizzes Completed", value: "23", icon: BookOpen, color: "text-green-600" },
    { title: "Average Score", value: "85%", icon: Trophy, color: "text-yellow-600" },
    { title: "Study Streak", value: "12 days", icon: TrendingUp, color: "text-purple-600" },
  ]

  const classes = [
    { id: 1, name: "Advanced React", teacher: "Prof. Smith", code: "REACT101", progress: 75, nextQuiz: "2024-01-20" },
    { id: 2, name: "Database Design", teacher: "Dr. Johnson", code: "DB201", progress: 60, nextQuiz: "2024-01-18" },
    { id: 3, name: "Machine Learning", teacher: "Prof. Davis", code: "ML301", progress: 90, nextQuiz: "2024-01-22" },
  ]

  const quizzes = [
    {
      id: 1,
      title: "React Hooks Quiz",
      class: "Advanced React",
      dueDate: "2024-01-20",
      status: "pending",
      score: null,
    },
    {
      id: 2,
      title: "SQL Fundamentals",
      class: "Database Design",
      dueDate: "2024-01-18",
      status: "completed",
      score: 88,
    },
    {
      id: 3,
      title: "Linear Regression",
      class: "Machine Learning",
      dueDate: "2024-01-22",
      status: "pending",
      score: null,
    },
    {
      id: 4,
      title: "Component Lifecycle",
      class: "Advanced React",
      dueDate: "2024-01-15",
      status: "completed",
      score: 92,
    },
  ]

  const recentPerformance = [
    { quiz: "Component Lifecycle", score: 92, suggestions: ["Review useEffect cleanup", "Practice custom hooks"] },
    { quiz: "SQL Fundamentals", score: 88, suggestions: ["Study JOIN operations", "Practice subqueries"] },
    { quiz: "Data Structures", score: 76, suggestions: ["Review binary trees", "Practice sorting algorithms"] },
  ]

  if (activeView === "dashboard") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600">Track your learning progress and upcoming assignments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCardComponent key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Quizzes</CardTitle>
              <CardDescription>Don't miss your assignment deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizzes
                  .filter((q) => q.status === "pending")
                  .map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{quiz.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{quiz.class}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            Due: {quiz.dueDate}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Start Quiz</Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Study Recommendations</CardTitle>
              <CardDescription>Personalized suggestions based on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Focus Area</p>
                      <p className="text-sm text-blue-800 mt-1">
                        Based on your recent quiz performance, consider reviewing React useEffect patterns and cleanup
                        functions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Strength</p>
                      <p className="text-sm text-green-800 mt-1">
                        You're excelling in Machine Learning concepts. Keep up the great work!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-900">Study Plan</p>
                      <p className="text-sm text-orange-800 mt-1">
                        Dedicate 30 minutes daily to SQL practice for better database performance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class Progress</CardTitle>
            <CardDescription>Your progress across all enrolled classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map((classItem) => (
                <div key={classItem.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{classItem.name}</h4>
                      <p className="text-sm text-gray-600">{classItem.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Next Quiz: {classItem.nextQuiz}</p>
                      <Badge variant="outline">{classItem.code}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{classItem.progress}%</span>
                    </div>
                    <Progress value={classItem.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (activeView === "classes") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Classes</h1>
            <p className="text-gray-600">View and manage your enrolled classes</p>
          </div>
          <Button onClick={() => setShowJoinForm(true)}>
            <GraduationCap className="h-4 w-4 mr-2" />
            Join Class
          </Button>
        </div>

        {showJoinForm && (
          <Card>
            <CardHeader>
              <CardTitle>Join a Class</CardTitle>
              <CardDescription>Enter the class code provided by your teacher</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="classCode">Class Code</Label>
                <Input id="classCode" placeholder="Enter class code (e.g., REACT101)" />
              </div>

              <div className="flex gap-2">
                <Button>Join Class</Button>
                <Button variant="outline" onClick={() => setShowJoinForm(false)}>
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
                <CardDescription>Instructor: {classItem.teacher}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{classItem.progress}%</span>
                    </div>
                    <Progress value={classItem.progress} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Next Quiz: {classItem.nextQuiz}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Materials
                    </Button>
                    <Button size="sm" className="flex-1">
                      Take Quiz
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

  if (activeView === "progress") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Progress Analytics</h1>
          <p className="text-gray-600">Track your learning journey and performance insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Quiz Performance</CardTitle>
              <CardDescription>Your latest quiz results and AI-generated improvement suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentPerformance.map((performance, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{performance.quiz}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{performance.score}%</span>
                        <Badge
                          variant={
                            performance.score >= 90 ? "default" : performance.score >= 80 ? "secondary" : "destructive"
                          }
                        >
                          {performance.score >= 90
                            ? "Excellent"
                            : performance.score >= 80
                              ? "Good"
                              : "Needs Improvement"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Brain className="h-4 w-4" />
                        AI Suggestions for Improvement:
                      </div>
                      <ul className="space-y-1">
                        {performance.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm text-gray-600 ml-6">
                            • {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Overall statistics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                  <p className="text-sm text-gray-600">Overall Average</p>
                  <Progress value={85} className="h-2 mt-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">React</span>
                    <div className="flex items-center gap-2">
                      <Progress value={90} className="h-2 w-16" />
                      <span className="text-sm font-medium">90%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="h-2 w-16" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Machine Learning</span>
                    <div className="flex items-center gap-2">
                      <Progress value={88} className="h-2 w-16" />
                      <span className="text-sm font-medium">88%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Improvement Trend</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your performance has improved by 12% over the last month. Keep up the excellent work!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz History</CardTitle>
            <CardDescription>Complete record of your quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{quiz.class}</Badge>
                    </TableCell>
                    <TableCell>{quiz.dueDate}</TableCell>
                    <TableCell>
                      {quiz.score ? (
                        <div className="flex items-center gap-2">
                          <span>{quiz.score}%</span>
                          <Progress value={quiz.score} className="h-2 w-16" />
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={quiz.status === "completed" ? "default" : "secondary"}>{quiz.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <div>Select a view from the sidebar</div>
}
