"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, BookOpen, Brain, PlusCircle, Sparkles, Edit, Trash2 } from "lucide-react"
import { FileUploader } from "@/shared/components/ui/file-uploader"
import { StatCardComponent } from "@/shared/components/ui/stat-card"
import type { StatCard } from "@/shared/types/common"

interface WriterDashboardProps {
  activeView: string
}

export function WriterDashboard({ activeView }: WriterDashboardProps) {
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")

  const stats: StatCard[] = [
    { title: "Questions Created", value: "156", icon: FileText, color: "text-blue-600" },
    { title: "Quizzes Published", value: "23", icon: BookOpen, color: "text-green-600" },
    { title: "AI Suggestions Used", value: "89", icon: Brain, color: "text-purple-600" },
    { title: "Total Views", value: "2,341", icon: PlusCircle, color: "text-orange-600" },
  ]

  const questions = [
    { id: 1, title: "What is React?", category: "Programming", difficulty: "Easy", status: "Published", views: 234 },
    { id: 2, title: "Explain Machine Learning", category: "AI/ML", difficulty: "Hard", status: "Draft", views: 0 },
    {
      id: 3,
      title: "Database Normalization",
      category: "Database",
      difficulty: "Medium",
      status: "Published",
      views: 156,
    },
  ]

  const generateAISuggestion = () => {
    const suggestions = [
      "Consider adding a multiple-choice question about React hooks with useState and useEffect examples.",
      "Create a scenario-based question about database optimization techniques.",
      "Add a coding question that tests understanding of async/await in JavaScript.",
      "Include a question about machine learning model evaluation metrics.",
    ]
    setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
  }

  if (activeView === "dashboard") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Writer Dashboard</h1>
          <p className="text-gray-600">Create and manage questions and quizzes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCardComponent key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Questions</CardTitle>
              <CardDescription>Your latest created questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.slice(0, 3).map((question) => (
                  <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{question.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge variant={question.status === "Published" ? "default" : "secondary"}>
                          {question.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{question.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Get AI-powered suggestions for your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={generateAISuggestion} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Question Suggestion
                </Button>
                {aiSuggestion && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">AI Suggestion</p>
                        <p className="text-sm text-blue-800 mt-1">{aiSuggestion}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === "questions") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Questions</h1>
            <p className="text-gray-600">Create and manage your questions</p>
          </div>
          <Button onClick={() => setShowQuestionForm(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Question
          </Button>
        </div>

        {showQuestionForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Question</CardTitle>
              <CardDescription>Add a new question to your collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Question Title</Label>
                  <Input id="title" placeholder="Enter question title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="AI will suggest category" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea id="question" placeholder="Enter your question here" rows={3} />
              </div>

              <div className="space-y-4">
                <Label>Answer Options</Label>
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <Input placeholder={`Option ${num}`} />
                    <Button variant="outline" size="sm">
                      {num === 1 ? "Correct" : "Mark Correct"}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea id="explanation" placeholder="Explain the correct answer" rows={2} />
              </div>

              <div className="flex gap-2">
                <Button>Save Question</Button>
                <Button variant="outline" onClick={generateAISuggestion}>
                  <Brain className="h-4 w-4 mr-2" />
                  Get AI Help
                </Button>
                <Button variant="outline" onClick={() => setShowQuestionForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Questions</CardTitle>
            <CardDescription>Manage your created questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">{question.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{question.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          question.difficulty === "Easy"
                            ? "default"
                            : question.difficulty === "Medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={question.status === "Published" ? "default" : "secondary"}>
                        {question.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.views}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

  if (activeView === "bulk-import") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bulk Import</h1>
          <p className="text-gray-600">Import questions and quizzes from PDF files</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload PDF Files</CardTitle>
            <CardDescription>
              Upload PDF files containing questions or quizzes. Our AI will extract and format them automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">AI Processing</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Our Gemini AI will automatically extract questions, identify answer options, categorize content, and
                    format everything for your review.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import History</CardTitle>
            <CardDescription>Track your previous imports and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { file: "math_questions.pdf", status: "Completed", questions: 25, date: "2024-01-15" },
                { file: "science_quiz.pdf", status: "Processing", questions: 0, date: "2024-01-15" },
                { file: "history_test.pdf", status: "Failed", questions: 0, date: "2024-01-14" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.file}</p>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm">{item.questions} questions</p>
                      <Badge
                        variant={
                          item.status === "Completed"
                            ? "default"
                            : item.status === "Processing"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <div>Select a view from the sidebar</div>
}
