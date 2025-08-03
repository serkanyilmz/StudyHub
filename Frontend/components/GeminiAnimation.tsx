"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"

interface GeminiAnimationProps {
  isActive: boolean
  onComplete?: () => void
}

export function GeminiAnimation({ isActive, onComplete }: GeminiAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (isActive) {
      setShowAnimation(true)
    }
    
  }, [isActive, onComplete])

  if (!showAnimation) return null

  return (
    <div className="gemini-animation">
      <div className="relative">
        <Sparkles className="h-6 w-6 text-blue-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
      </div>
    </div>
  )
}

export function useGeminiAnimation() {
  const [isAnimating, setIsAnimating] = useState(false)

  const triggerAnimation = () => {
    setIsAnimating(true)
  }

  const handleComplete = () => {
    setIsAnimating(false)
  }

  return {
    isAnimating,
    triggerAnimation,
    handleComplete,
    GeminiComponent: () => <GeminiAnimation isActive={isAnimating} onComplete={handleComplete} />,
  }
}
