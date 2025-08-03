"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, CheckCircle, Brain, ArrowLeft, Play, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useGeminiAnimation } from "@/components/GeminiAnimation"

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  text: string
  options: Option[]
}

interface Quiz {
  id: string
  name: string
  questions: Array<{
    question: Question
    questionNo: number
  }>
}

interface Homework {
  id: string
  name: string
  deadline: string
  quizzes: Quiz[]
}

interface QuizResult {
  completed: boolean
  score: number
}

export default function HomeworkPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const { isAnimating,handleComplete, triggerAnimation, GeminiComponent } = useGeminiAnimation()
  const [homework, setHomework] = useState<Homework | null>(null)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showExplanation, setShowExplanation] = useState<string | null>(null)
  const [explanation, setExplanation] = useState<string>("")
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>({})
  const [isQuizMode, setIsQuizMode] = useState(false)
  const [submittingQuiz, setSubmittingQuiz] = useState(false)

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const homeworkData = await api.getHomework(params.id as string)
        setHomework(homeworkData)

        // Get quiz completion status and scores
        if (user?.id && homeworkData.quizzes) {
          const results: Record<string, QuizResult> = {}

          for (const quiz of homeworkData.quizzes) {
            const result = await api.getStudentQuizResult(user.id, quiz.id)
            results[quiz.id] = result
          }

          setQuizResults(results)
        }
      } catch (error) {
        console.error("Error fetching homework:", error)
        toast({
          title: "Error",
          description: "Failed to load homework",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHomework()
  }, [params.id, toast, user?.id])

  const currentQuiz = homework?.quizzes[currentQuizIndex]
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex]

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleNext = () => {
    if (!currentQuiz) return

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
    setShowExplanation(null)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
    setShowExplanation(null)
  }

  const handleGetExplanation = async (questionId: string) => {
    triggerAnimation()
    setLoadingExplanation(true)
    try {
      const explanationText = await api.getAnswerExplanation(questionId)
      setExplanation(explanationText)
      setShowExplanation(questionId)
    } catch (error) {
      console.error("Error fetching explanation:", error)
      toast({
        title: "Error",
        description: "Failed to get AI explanation",
        variant: "destructive",
      })
    } finally {
      setLoadingExplanation(false)
      handleComplete()
    }
  }

  const handleSubmitQuiz = async () => {
    if (!user?.id || !currentQuiz) return

    setSubmittingQuiz(true)

    try {
      // Allow blank answers - send empty string for unanswered questions
      const quizAnswers = currentQuiz.questions.map((q) => ({
        questionId: q.question.id,
        optionId: answers[q.question.id] || "", // Send empty string for blank answers
      }))

      const score = await api.submitQuiz(quizAnswers, user.id, currentQuiz.id)

      // Update quiz results
      setQuizResults((prev) => ({
        ...prev,
        [currentQuiz.id]: { completed: true, score },
      }))

      toast({
        title: "Quiz Submitted!",
        description: `Your score: ${score}%`,
      })

      setIsQuizMode(false)
      setAnswers({})
      setCurrentQuestionIndex(0)
    } catch (error) {
      console.error("Error submitting quiz:", error)
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      })
    } finally {
      setSubmittingQuiz(false)
    }
  }

  const startQuiz = (quizIndex: number) => {
    setCurrentQuizIndex(quizIndex)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setIsQuizMode(true)
  }

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCompletedQuizzes = () => {
    return Object.values(quizResults).filter((result) => result.completed).length
  }

  const getAverageScore = () => {
    const completedResults = Object.values(quizResults).filter((result) => result.completed)
    if (completedResults.length === 0) return 0

    const totalScore = completedResults.reduce((sum, result) => sum + result.score, 0)
    return Math.round(totalScore / completedResults.length)
  }

  const isHomeworkFullyCompleted = () => {
    if (!homework) return false
    return homework.quizzes.every((quiz) => quizResults[quiz.id]?.completed)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading homework...</p>
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

  // Quiz taking mode
  if (isQuizMode && currentQuestion) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => setIsQuizMode(false)} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
              <h1 className="text-2xl font-bold" style={{ color: "hsl(var(--studyhub-dark-grey))" }}>
                {currentQuiz?.name}
              </h1>
              <Badge variant="outline" className="mt-2 student-bg">
                Question {currentQuestionIndex + 1} of {currentQuiz?.questions.length}
              </Badge>
            </div>
          </div>

          <Card className="connection-line border-2">
            <CardHeader>
              <CardDescription className="text-base">{currentQuestion.question.text}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={answers[currentQuestion.question.id] || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion.question.id, value)}
              >
                {currentQuestion.question.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="border-t pt-4">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGetExplanation(currentQuestion.question.id)}
                    disabled={loadingExplanation}
                    className="mb-4 ai-enhanced"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {loadingExplanation ? "Getting explanation..." : "Get AI Explanation"}
                  </Button>
                  <GeminiComponent />
                </div>

                {showExplanation === currentQuestion.question.id && explanation && (
                  <Alert className="ai-enhanced">
                    <Brain className="h-4 w-4" />
                    <AlertDescription className="mt-2">
                      <strong>AI Explanation:</strong>
                      <div className="mt-2 text-sm">{explanation}</div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  Previous
                </Button>

                <div className="space-x-2">
                  {currentQuestionIndex === (currentQuiz?.questions.length || 0) - 1 ? (
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={submittingQuiz}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {submittingQuiz ? "Submitting..." : "Submit Quiz"}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Overview mode
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold" style={{ color: "hsl(var(--studyhub-dark-grey))" }}>
              {homework.name}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Due: {formatDeadline(homework.deadline)}
              </Badge>
              <Badge variant="secondary" className="student-bg">
                {getCompletedQuizzes()} / {homework.quizzes.length} completed
              </Badge>
              {getCompletedQuizzes() > 0 && (
                <Badge variant="default" className="student-bg">
                  Average: {getAverageScore()}%
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="student-bg border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <CheckCircle className="h-4 w-4 student-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold student-accent">{homework.quizzes.length}</div>
              <p className="text-xs text-muted-foreground">In this homework</p>
            </CardContent>
          </Card>

          <Card className="student-bg border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 student-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold student-accent">{getCompletedQuizzes()}</div>
              <p className="text-xs text-muted-foreground">Quizzes finished</p>
            </CardContent>
          </Card>

          <Card className="student-bg border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <CheckCircle className="h-4 w-4 student-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold student-accent">{getAverageScore()}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Quiz List */}
        <Card className="connection-line border-2">
          <CardHeader>
            <CardTitle>Quizzes</CardTitle>
            <CardDescription>Complete each quiz to finish your homework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {homework.quizzes.map((quiz, index) => {
                const result = quizResults[quiz.id]
                const isCompleted = result?.completed || false
                const score = result?.score || 0

                return (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 border rounded-lg connection-line"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{quiz.name}</h3>
                      <p className="text-sm text-gray-600">
                        {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {isCompleted ? (
                          <>
                            <Badge variant="default" className="student-bg">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                            <Badge variant="outline">Score: {score}%</Badge>
                          </>
                        ) : (
                          <Badge variant="secondary">Not started</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isCompleted ? (
                        // Show Review button if homework is fully completed, otherwise allow retake
                        isHomeworkFullyCompleted() ? (
                          <Button variant="outline" size="sm" onClick={() => startQuiz(index)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </Button>
                        )
                      ) : (
                        <Button size="sm" onClick={() => startQuiz(index)} className="bg-green-600 hover:bg-green-700">
                          <Play className="h-4 w-4 mr-2" />
                          Start Quiz
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
