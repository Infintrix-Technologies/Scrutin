import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckIcon, ChevronRightIcon, EyeIcon } from "lucide-react"
import { Link } from "react-router-dom"

export default function AssessmentOverview() {
  return (
    <div className="flex justify-center items-center px-64 h-screen">

    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Hello Abdul! Ready to showcase your skills?</h2>
        <p className="mb-2">Thank you for applying for this role and welcome to your skill assessment administered by TestGorilla.</p>
        <p className="mb-6">Completing it will give you a chance to show off your skills and stand out from the crowd! Good luck!</p>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">This assessment includes the following steps:</h3>
          <div className="flex flex-row items-center space-y-4">
            {[
              { name: "Problem Solving", questions: 12, time: 9 },
              { name: "Communication", questions: 15, time: 8 },
              { name: "Time Management", questions: 16, time: 9 },
              { name: "Job preferences", questions: 20, time: 15 },
              { name: "Big 5 (OCEAN)", questions: 50, time: 10 },
              { name: "Custom questions", questions: 5, time: "Timed & untimed" },
            ].map((step, index) => (
              <div key={index} className="flex flex-col justify-center items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  {index < 4 ? (
                    <CheckIcon className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <span className="text-primary-foreground">{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{step.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {step.questions} questions • {step.time} {typeof step.time === 'number' ? 'mins' : ''}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <EyeIcon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-semibold">View results</p>
                <p className="text-sm text-muted-foreground">Test scores</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            <h3 className="font-semibold mb-2">Learn how to navigate your assessment:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>We recommend <strong>completing the assessment in one go</strong> but you can <strong>pause or take breaks between tests</strong> if needed.</li>
              <li>The <strong>assessment is timed</strong>. A timer is shown per test and/or per question.</li>
              <li>You can use pen, paper, and calculator during the assessment but avoid using AI and other tools.</li>
            </ul>
          </div>
          <div className="w-full">
            <h3 className="font-semibold mb-2">Technical requirements for your assessment:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Have a <strong>camera and microphone</strong> as you may be required to answer questions in a video format.</li>
              <li>Enable webcam and speakers/headphones for identity verification and test integrity.</li>
              <li><strong>Snapshots will be taken</strong> of you periodically during the assessment to ensure fairness for everyone.</li>
              <li>Ensure you have a <strong>reliable internet connection</strong> to avoid any disruptions during your assessment.</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end">
          <Link to={'/assessments'}>
        <Button className="text-end">
          Continue
          <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Button>

          </Link>

        </div>
      </CardContent>
    </Card>

    </div>
  )
}