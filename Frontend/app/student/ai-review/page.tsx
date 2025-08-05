"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Brain, 
  Layers,
  Filter,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Topic {
  id: string
  name: string
  parentTopic?: {
    id: string
    name: string
  }
}

interface Question {
  id: string
  text: string
  options: Array<{
    id: string
    text: string
    correct: boolean
  }>
  topic: {
    id: string
    name: string
  }
}

interface StudentAnswer {
  id: string
  optionId: string
  questionId: string
  studentId: string
  quizId: string
}

interface QuestionWithAnswer {
  question: Question
  studentAnswer: StudentAnswer | null
  correct: boolean
  quiz: {
    id: string
    name: string
  }
}

export default function AIReviewPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [questions, setQuestions] = useState<QuestionWithAnswer[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedCorrectness, setSelectedCorrectness] = useState("")
  const [explanations, setExplanations] = useState<Record<string, string>>({})
  const [loadingExplanations, setLoadingExplanations] = useState<Record<string, boolean>>({})
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchData()
  }, [user?.id])

  const fetchData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      
      // Fetch topics
      const topicsData = await api.getTopics()
      setTopics(topicsData)

      // Get all student quiz results to find completed quizzes
      const allQuizResults = await api.getStudentAllQuizResults(user.id)
      
      // Get all completed quiz IDs
      const completedQuizIds = Object.keys(allQuizResults).filter(
        quizId => allQuizResults[quizId].completed
      )

      // Fetch questions and answers for each completed quiz
      const allQuestions: QuestionWithAnswer[] = []
      
      for (const quizId of completedQuizIds) {
        try {
          // Get quiz details
          const quiz = await api.getQuiz(quizId)
          
          // Get student answers for this quiz - try both methods
          let studentAnswers: StudentAnswer[] = []
          
          try {
            studentAnswers = await api.getStudentAnswers(user.id, quizId) as StudentAnswer[]
          } catch (error) {
            try {
              studentAnswers = await api.getStudentQuizAnswers(user.id, quizId) as StudentAnswer[]
            } catch (error2) {
              console.error(`Failed to get answers for quiz ${quizId}:`, error2)
            }
          }
          
          // Transform the student answers to match our expected format
          studentAnswers = studentAnswers.map((answer: any) => ({
            id: answer.id,
            questionId: answer.question?.id || answer.questionId,
            optionId: answer.option?.id || answer.optionId,
            studentId: answer.student?.id || answer.studentId,
            quizId: answer.quiz?.id || answer.quizId
          }))
          
          // Process each question in the quiz
          for (const quizQuestion of quiz.questions) {
            const question = quizQuestion.question
            
            const studentAnswer = studentAnswers.find(
              (answer: StudentAnswer) => answer.questionId === question.id
            )
            
            // Determine if the answer was correct
            let correct = false
            if (studentAnswer) {
              const selectedOption = question.options.find(
                (option: any) => option.id === studentAnswer.optionId
              )
              correct = selectedOption?.correct || false
            }

            allQuestions.push({
              question,
              studentAnswer: studentAnswer || null,
              correct,
              quiz: {
                id: quiz.id,
                name: quiz.name
              }
            })
          }
        } catch (error) {
          console.error(`Error fetching data for quiz ${quizId}:`, error)
        }
      }

      setQuestions(allQuestions)
    } catch (error) {
      console.error("Error fetching review data:", error)
      toast({
        title: "Error",
        description: "Failed to load your question history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getFilteredQuestions = () => {
    return questions.filter(({ question, correct }) => {
      // Search query filter
      if (searchQuery && !question.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Topic filter - allow selecting any topic in the hierarchy
      if (selectedTopic) {
        // Check if question topic matches selected topic or any of its children (recursive)
        const isTopicMatch = (topicId: string): boolean => {
          if (question.topic?.id === topicId) return true
          // Check child topics recursively
          const children = getChildTopics(topicId)
          return children.some(child => isTopicMatch(child.id))
        }
        
        if (!isTopicMatch(selectedTopic)) {
          return false
        }
      }

      // Correctness filter
      if (selectedCorrectness === "correct" && !correct) return false
      if (selectedCorrectness === "incorrect" && correct) return false

      return true
    })
  }

  const getTopicDisplayName = (questionTopic: { id: string; name: string }) => {
    const topic = topics.find(t => t.id === questionTopic.id)
    if (topic?.parentTopic) {
      return `${topic.parentTopic.name} > ${topic.name}`
    }
    return questionTopic.name
  }

  const getParentTopics = () => {
    return topics.filter(topic => !topic.parentTopic)
  }

  const getChildTopics = (parentId: string) => {
    return topics.filter(topic => topic.parentTopic?.id === parentId)
  }

  // Recursive function to render all topics for selection (like in writer)
  const renderTopicOptionsRecursively = (topic: Topic, level: number = 0): JSX.Element[] => {
    const result: JSX.Element[] = []
    const indent = "  ".repeat(level) + (level > 0 ? "└─ " : "")
    
    // Add current topic to options
    result.push(
      <SelectItem key={topic.id} value={topic.id}>
        <div className="flex items-center space-x-2">
          {level === 0 ? (
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          )}
          <span style={{ marginLeft: `${level * 0.5}rem` }}>{indent}{topic.name}</span>
        </div>
      </SelectItem>
    )
    
    // Add all child topics recursively
    const childTopics = getChildTopics(topic.id)
    childTopics.forEach(childTopic => {
      result.push(...renderTopicOptionsRecursively(childTopic, level + 1))
    })
    
    return result
  }

  const getSubtopics = (parentId: string) => {
    return topics.filter(topic => topic.parentTopic?.id === parentId)
  }

  const handleGetExplanation = async (questionId: string) => {
    setLoadingExplanations(prev => ({ ...prev, [questionId]: true }))
    
    try {
      const explanation = await api.getAnswerExplanation(questionId)
      setExplanations(prev => ({ ...prev, [questionId]: explanation }))
      setShowExplanations(prev => ({ ...prev, [questionId]: true }))
    } catch (error) {
      console.error("Error fetching explanation:", error)
      toast({
        title: "Error",
        description: "Failed to get AI explanation",
        variant: "destructive",
      })
    } finally {
      setLoadingExplanations(prev => ({ ...prev, [questionId]: false }))
    }
  }

  const toggleExplanation = (questionId: string) => {
    setShowExplanations(prev => ({ 
      ...prev, 
      [questionId]: !prev[questionId] 
    }))
  }

  const formatAIExplanation = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim()
      
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <h3 key={index} className="font-semibold text-lg mb-2 text-blue-800">
            {trimmedLine.slice(2, -2)}
          </h3>
        )
      }
      
      if (trimmedLine.startsWith('*') && trimmedLine.endsWith('*')) {
        return (
          <h4 key={index} className="font-medium text-base mb-1 text-blue-700">
            {trimmedLine.slice(1, -1)}
          </h4>
        )
      }
      
      if (trimmedLine === '') {
        return <br key={index} />
      }
      
      return (
        <p key={index} className="mb-2 text-gray-700 leading-relaxed">
          {trimmedLine}
        </p>
      )
    })
  }

  const filteredQuestions = getFilteredQuestions()
  const correctCount = filteredQuestions.filter(q => q.correct).length
  const incorrectCount = filteredQuestions.length - correctCount

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your question history...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <Link href="/student/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold flex items-center">
              <Image
                src="/gemini-logo.svg" 
                alt="Gemini Icon"
                width={32}
                height={32}
                className="object-contain mr-3"
              />
              Smart Explanations
            </h1>
            <p className="text-gray-600 mt-2">
              Review your completed questions and get AI-powered explanations
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="ai-enhanced border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <p className="text-xs text-muted-foreground">Questions answered</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <p className="text-xs text-muted-foreground">
                {questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0}% accuracy
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200 border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incorrect Answers</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
              <p className="text-xs text-muted-foreground">
                {questions.length > 0 ? Math.round((incorrectCount / questions.length) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label>Search Questions</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search question text..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Topic Selection */}
              <div className="space-y-2">
                <Label>Topic</Label>
                <Select
                  value={selectedTopic}
                  onValueChange={(value) => {
                    setSelectedTopic(value === "all" ? "" : value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center space-x-2">
                        <Layers className="h-4 w-4" />
                        <span>All Topics</span>
                      </div>
                    </SelectItem>
                    {getParentTopics().flatMap(topic => renderTopicOptionsRecursively(topic, 0))}
                  </SelectContent>
                </Select>
              </div>

              {/* Correctness */}
              <div className="space-y-2">
                <Label>Answer Status</Label>
                <Select
                  value={selectedCorrectness}
                  onValueChange={(value) => setSelectedCorrectness(value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All answers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Answers</SelectItem>
                    <SelectItem value="correct">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Correct Only</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="incorrect">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>Incorrect Only</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Your Questions ({filteredQuestions.length})
            </CardTitle>
            <CardDescription>
              Review your answers and get AI explanations for better understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No questions found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {questions.length === 0 
                    ? "Complete some quizzes to see your questions here"
                    : "Try adjusting your filters to see more questions"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredQuestions.map(({ question, studentAnswer, correct, quiz }) => (
                  <div key={`${question.id}-${quiz.id}`} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{quiz.name}</Badge>
                          <Badge variant="outline">{getTopicDisplayName(question.topic)}</Badge>
                          <Badge 
                            variant={correct ? "default" : "destructive"}
                            className={correct ? "bg-green-100 text-green-800 border-green-300" : ""}
                          >
                            {correct ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Correct
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Incorrect
                              </>
                            )}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-medium mb-4">{question.text}</h3>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                      <div className="space-y-2">
                        {question.options.map((option) => {
                          const isSelected = studentAnswer?.optionId === option.id
                          const correctOption = option.correct
                          
                          let optionClass = "border p-3 rounded"
                          if (isSelected && correctOption) {
                            optionClass += " border-green-500 bg-green-50"
                          } else if (isSelected && !correctOption) {
                            optionClass += " border-red-500 bg-red-50"
                          } else if (correctOption) {
                            optionClass += " border-green-500 bg-green-50"
                          }

                          return (
                            <div key={option.id} className={optionClass}>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                  {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                  )}
                                </div>
                                <Label className="flex-1 cursor-default">
                                  {option.text}
                                </Label>
                                {isSelected && (
                                  <Badge variant="outline" className="text-xs">
                                    Your Answer
                                  </Badge>
                                )}
                                {correctOption && (
                                  <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                                    Correct Answer
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* AI Explanation Section */}
                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <div className="relative flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGetExplanation(question.id)}
                            disabled={loadingExplanations[question.id]}
                            className="mb-4 ai-enhanced flex items-center"
                          >
                            <span className={loadingExplanations[question.id] ? "mr-2 animate-pulse" : "mr-2"}>
                              <Image
                                src="/gemini-logo.svg"
                                alt="Gemini Logo"
                                width={16}
                                height={16}
                                className="h-4 w-4"
                              />
                            </span>
                            {loadingExplanations[question.id] ? "Getting explanation..." : "Get AI Explanation"}
                          </Button>
                          {explanations[question.id] && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleExplanation(question.id)}
                              className="ml-2 mb-4"
                            >
                              {showExplanations[question.id] ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Show
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {explanations[question.id] && showExplanations[question.id] && (
                          <Alert className="ai-enhanced mt-4">
                            <Brain className="h-4 w-4 text-blue-600" />
                            <AlertDescription>
                              <div className="mt-2 text-sm">
                                {formatAIExplanation(explanations[question.id])}
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
