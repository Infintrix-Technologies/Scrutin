import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Timer, Star } from 'lucide-react'

type Test = {
  name: string
  duration: string
}

type CustomQuestion = {
  question: string
  type: string
  duration: string
}

const tests: Test[] = [
  { name: "Problem Solving", duration: "9'" },
  { name: "Communication", duration: "8'" },
  { name: "Time Management", duration: "9'" },
  { name: "Motivation", duration: "15'" },
  { name: "Big 5 (OCEAN)", duration: "10'" },
]

const customQuestions: CustomQuestion[] = [
  { question: "Tell us about yourself, what attracts you to this opportunity, and why you are a great candidate for this role. Pro tip: it might be helpful to pretend...", type: "essay", duration: "5'" },
  { question: "Describe a time when you identified a personal weakness at work and took steps to improve it. In your response, consider discussing the following: What...", type: "essay", duration: "5'" },
  { question: "Describe a time when you worked collaboratively as part of a team to achieve a common goal at work. In your response, consider discussing the following:...", type: "essay", duration: "5'" },
  { question: "Please feel welcome to upload your resume/CV or portfolio (if you have one). Leave blank if you do not have one. For this question, you can exit full-screen...", type: "file", duration: "―" },
  { question: "Please provide a link to your LinkedIn profile. For this question, you can exit full-screen mode. Leave blank if you do not have one.", type: "essay", duration: "2'" },
]

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-4 py-2 text-left font-medium text-gray-500">{children}</th>
)

const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="px-4 py-2">{children}</td>
)

const IncludedTests: React.FC = () => (
  <Card>
    <CardContent className="p-0">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Included tests</h2>
        <Button variant="ghost" size="sm">
          Edit weights
        </Button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <TableHeader>Test</TableHeader>
            <TableHeader>Weight</TableHeader>
            <TableHeader>Impact</TableHeader>
            <TableHeader>Duration</TableHeader>
          </tr>
        </thead>
        <tbody>
          {tests.map((test, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <TableCell>{test.name}</TableCell>
              <TableCell>--</TableCell>
              <TableCell>--</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Timer className="w-4 h-4 mr-1" />
                  {test.duration}
                </div>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
)

const CustomQuestions: React.FC = () => (
  <Card>
    <CardContent className="p-0">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Custom questions</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <TableHeader>Question</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Duration</TableHeader>
          </tr>
        </thead>
        <tbody>
          {customQuestions.map((question, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 mr-2 text-amber-500" />
                        <span className="truncate max-w-xs">{question.question}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{question.question}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{question.type}</TableCell>
              <TableCell>
                {question.duration !== "―" && (
                  <div className="flex items-center">
                    <Timer className="w-4 h-4 mr-1" />
                    {question.duration}
                  </div>
                )}
                {question.duration === "―" && "―"}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
)

export default function TestsAndQuestions() {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      <div className="w-full md:w-1/2">
        <IncludedTests />
      </div>
      <div className="w-full md:w-1/2">
        <CustomQuestions />
      </div>
    </div>
  )
}