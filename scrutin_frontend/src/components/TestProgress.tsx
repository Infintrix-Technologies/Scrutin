import { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { Timer, HelpCircle } from "lucide-react"

export default function TestProgress() {
  const [timeLeft, setTimeLeft] = useState(464) // 7:44 in seconds
  const [currentQuestion] = useState(1)
  const totalQuestions = 16

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  // Calculate time progress based on time left (so it decreases)
  const timeProgress = (timeLeft / 464) * 100
  const questionProgress = (currentQuestion / totalQuestions) * 100

  return (
    <div className="w-full max-w-sm">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Timer className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium" data-testid="candidate.assessment.timer-progress-bar">
              {formatTime(timeLeft)}
            </span>
          </div>
          <Progress value={timeProgress} className="w-1/2" color="blue" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{currentQuestion}/{totalQuestions}</span>
          </div>
          <Progress value={questionProgress} className="w-1/2" color="blue" />
        </div>
      </div>
    </div>
  )
}
