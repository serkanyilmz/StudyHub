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
import { Clock, CheckCircle, Brain, ArrowLeft, Play, BookOpen, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useGeminiAnimation } from "@/components/GeminiAnimation"
import Image from "next/image"

interface Option {
  correct: boolean
  id: string
  text: string
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

interface StudentAnswer {
  questionId: string
  optionId: string
}

export default function HomeworkPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

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
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [submittingQuiz, setSubmittingQuiz] = useState(false)
  const [studentAnswers, setStudentAnswers] = useState<Record<string, StudentAnswer[]>>({})

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
  }, [params.id, user?.id, toast])

  const fetchQuizResults = async (quizzes: Quiz[], studentId: string) => {
    const results: Record<string, QuizResult> = {}
    const answers: Record<string, StudentAnswer[]> = {}

    for (const quiz of quizzes) {
      try {
        const result = await api.getStudentQuizResult(studentId, quiz.id)
        results[quiz.id] = result

        if (result.completed) {
          try {
            const studentAnswers = await api.getStudentAnswers(studentId, quiz.id)
            answers[quiz.id] = studentAnswers
          } catch (error) {
            console.error(`Error fetching answers for quiz ${quiz.id}:`, error)
          }
        }
      } catch (error) {
        console.error(`Error fetching result for quiz ${quiz.id}:`, error)
        results[quiz.id] = { completed: false, score: 0 }
      }
    }

    setQuizResults(results)
    setStudentAnswers(answers)
  }

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
    if (!isReviewMode) return // Only allow explanations in review mode

    
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

      // Store student answers for review
      setStudentAnswers((prev) => ({
        ...prev,
        [currentQuiz.id]: quizAnswers,
      }))

      toast({
        title: "Quiz Submitted!",
        description: `Your score: ${score}%`,
      })

      localStorage.setItem("shouldFetchProgress", "true")
      
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
    setIsReviewMode(false)
    setShowExplanation(null)
  }

  const reviewQuiz = async (quizIndex: number) => {
    const quiz = homework?.quizzes[quizIndex]
    if (!quiz || !user?.id) return

    setCurrentQuizIndex(quizIndex)
    setCurrentQuestionIndex(0)

    try {
      // Fetch fresh student answers for review
      const freshAnswers = await api.getStudentAnswers(user.id, quiz.id)

      // Load previous answers for review
      const previousAnswers: Record<string, string> = {}
      freshAnswers.forEach((answer: any) => {
        if (answer.option && answer.question) {
          previousAnswers[answer.question.id] = answer.option.id
        }
      })

      setAnswers(previousAnswers)
      setIsQuizMode(true)
      setIsReviewMode(true)
      setShowExplanation(null)
    } catch (error) {
      console.error("Error loading quiz for review:", error)
      toast({
        title: "Error",
        description: "Failed to load quiz for review",
        variant: "destructive",
      })
    }
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

 

  function formatAIExplanation(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\$(.*?)\$/g, "<span style='font-family:monospace'>$1</span>")
    .replace(/\n/g, "<br/>")
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
    const selectedAnswer = answers[currentQuestion.question.id]
    

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
                {currentQuiz?.name} {isReviewMode && "(Review Mode)"}
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
                value={selectedAnswer || ""}
                onValueChange={(value) => !isReviewMode && handleAnswerChange(currentQuestion.question.id, value)}
                disabled={isReviewMode}
              >
                {currentQuestion.question.options.map((option) => {
                  // Hem isCorrect hem correct alanını kontrol et
                  const isCorrect =  option.correct
                  const isSelected = selectedAnswer === option.id

                  let optionClass = ""
                  if (isReviewMode && selectedAnswer) {
                    if (isCorrect && isSelected) {
                      optionClass = "border-green-500 bg-green-50"
                    } else if (isCorrect) {
                      optionClass = "border-green-500 bg-green-50"
                    } else if (isSelected && !isCorrect) {
                      optionClass = "border-red-500 bg-red-50"
                    }
                  }

                  return (
                    <div key={option.id} className={`flex items-center space-x-2 p-2 rounded ${optionClass}`}>
                      <RadioGroupItem value={option.id} id={option.id} checked={isSelected} disabled={isReviewMode} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.text}
                        {isReviewMode && isCorrect && (
                          <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                        )}
                        {isReviewMode && isSelected && (
                          <span className={`ml-2 font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                            {isCorrect ? "✓ Your answer" : "✗ Your answer"}
                          </span>
                        )}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>

              {/* AI Explanation - Only in Review Mode */}
             {isReviewMode && (
                <div className="border-t pt-4">
                  <div className="relative flex items-center">
                    <Button
                variant="outline"
                size="sm"
                onClick={() => handleGetExplanation(currentQuestion.question.id)}
                disabled={loadingExplanation}
                className="mb-4 ai-enhanced flex items-center"
              >
                <span className={loadingExplanation ? "mr-2 animate-pulse" : "mr-2"}>
                  <Image
                    src="/gemini-logo.svg"
                    alt="Gemini Logo"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                </span>
                {loadingExplanation ? "Getting explanation..." : "Get AI Explanation"}
              </Button>
                  </div>

                  {showExplanation === currentQuestion.question.id && explanation && (
                    <Alert className="ai-enhanced mt-4">
                      <AlertDescription className="mt-2">
                        <div dangerouslySetInnerHTML={{ __html: formatAIExplanation(explanation) }} />
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  Previous
                </Button>

                <div className="space-x-2">
                  {currentQuestionIndex === (currentQuiz?.questions.length || 0) - 1 ? (
                    isReviewMode ? (
                      <Button onClick={() => setIsQuizMode(false)} className="bg-green-600 hover:bg-green-700">
                        Finish Review
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitQuiz}
                        disabled={submittingQuiz}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {submittingQuiz ? "Submitting..." : "Submit Quiz"}
                      </Button>
                    )
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
                const isExpired = new Date(homework.deadline) < new Date()

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
                          <Badge variant={isExpired ? "destructive" : "secondary"}>Not started</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isCompleted ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => reviewQuiz(index)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </>
                      ) : isExpired ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => reviewQuiz(index)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </>
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
