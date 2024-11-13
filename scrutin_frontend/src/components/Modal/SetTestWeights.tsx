import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Test {
  name: string
  weight: number
  impact: string
}

export default function SetTestWeights() {
  const [tests, setTests] = React.useState<Test[]>([
    { name: "Problem Solving", weight: 1, impact: "25%" },
    { name: "Communication", weight: 1, impact: "25%" },
    { name: "Time Management", weight: 1, impact: "25%" },
    { name: "Motivation", weight: 1, impact: "25%" },
  ])

  const weights = [1, 2, 3, 4, 5]

  const handleWeightClick = (testIndex: number, weight: number) => {
    const updatedTests = [...tests]
    updatedTests[testIndex].weight = weight
    setTests(updatedTests)
  }

  return (
    <div className="w-full mx-auto">
      <CardHeader className="space-y-4">
        <CardTitle className="text-lg font-medium">
          Prioritize the tests that are most important to you by assigning them a weight.
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          The weight of a test directly impacts your average score.
        </p>
        <div className="space-y-2">
          <p className="text-sm">
            You can assign a weight value between x1 and x5 to each test. A test with a weight of x5 will boost the final
            score five times more than a test with a weight of x1.
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm">How to work with test weights?</p>
            <Button variant="link" className="h-auto p-0 text-primary">
              Read more
            </Button>
          </div>
        </div>
      </CardHeader>
      <Card>
      <CardContent>
        <div className="grid gap-6 py-3">
          <div className="flex justify-between grid-cols-[1fr,auto,auto] items-center gap-4">
            <div className="font-medium">Tests</div>
            <div className="">
           <div className="font-medium grid grid-cols-[1fr,auto,auto]  ">Weights</div>
             
            </div>
            <div className="font-medium">Impact</div>
          </div>
          <hr />
              <div className="flex items-center justify-center gap-2">
                {weights.map((w) => (
                  <div key={w} className="w-12 text-center text-sm">
                    x{w}
                  </div>
                ))}
              </div>
              <hr />
          {tests.map((test, testIndex) => (
            <div key={test.name} className="grid grid-cols-[1fr,auto,auto] items-center gap-4">
              <div className="text-sm">{test.name}</div>
              <div className="flex gap-2">
                {weights.map((weight) => (
                  <Button
                    key={weight}
                    variant="ghost"
                    className={`w-12 h-8 p-0 ${test.weight === weight ? "" : ""}`}
                    onClick={() => handleWeightClick(testIndex, weight)}
                  >
                    <Progress value={weight === test.weight ? 100 : 0} className="h-2 w-8" />
                  </Button>
                ))}
              </div>
              <div className="text-sm w-16 text-right">{test.impact}</div>
            </div>
          ))}
        </div>
      </CardContent>
      </Card>
      <CardFooter className="flex justify-end py-4">
        <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900">Set weights</Button>
      </CardFooter>
    </div>
  )
}