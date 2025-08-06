"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, PenTool, Brain, Play, Pause, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const { user  } = useAuth()
  const router = useRouter()
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      if (!isPlaying) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
             <Image
              src="/studyhub-logo-darkgrey-text.png" 
              alt="studyhub logo"
              width={300}
              height={200}
              className="object-contain "
            />
          </div>
          <p className="text-xl text-gray-600 mb-8">AI-Powered Learning Platform for Students, Teachers and Writers</p>
          
          <div className="flex gap-4 justify-center mb-6">
            <Link href="/auth/login">
              <Button size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Audio Introduction - Below buttons */}
          <div className="flex items-center justify-center ">
            {(isPlaying || currentTime > 0) && (
              <Button
                onClick={restartAudio}
                size="sm"
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={toggleAudio}
              size="sm"
              variant="ghost"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              Hear Our Story
            </Button>
          </div>
          
          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src="/introduction.mp3"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            preload="metadata"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" style={{ color: "hsl(var(--studyhub-student-green))" }} />
              <CardTitle>For Students</CardTitle>
              <CardDescription>
                Take quizzes, get AI-powered explanations and track your learning progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Interactive quizzes and homework</li>
                <li>• AI-powered answer explanations</li>
                <li>• Personalized study recommendations</li>
                <li>• Progress tracking and analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" style={{ color: "hsl(var(--studyhub-teacher-blue))" }}/>
              <CardTitle>For Teachers</CardTitle>
              <CardDescription>Manage classrooms, assign homework and monitor student progress</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Create and manage classrooms</li>
                <li>• Assign homework and quizzes</li>
                <li>• Monitor student performance</li>
                <li>• AI-assisted grading insights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <PenTool className="h-12 w-12 text-purple-600 mx-auto mb-4" style={{ color: "hsl(var(--studyhub-writer-orange))" }} />
              <CardTitle>For Writers</CardTitle>
              <CardDescription>Create engaging questions and quizzes with AI assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Create questions and quizzes</li>
                <li>• Organize content by topics</li>
                <li>• AI-powered content suggestions</li>
                <li>• Quality assessment tools</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Powered by Artificial Intelligence</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform uses advanced AI to provide personalized learning experiences, intelligent content
            recommendations and detailed explanations to help students succeed in their educational journey.
          </p>
        </div>
      </div>
    </div>
  )
}
