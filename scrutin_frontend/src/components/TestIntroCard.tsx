import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TestIntroCard() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <p className="text-sm text-muted-foreground">This is the next test:</p>
        <CardTitle className="text-2xl font-bold">Communication</CardTitle>
        <p className="text-sm">The actual test starts now. Good luck!</p>
      </CardHeader>
      <Separator className="my-2" />
      <CardContent className="space-y-4">
        <p className="text-sm">
          The test will start in <span className="font-bold">6 seconds</span>
        </p>
        <p className="text-sm">
          Please stay on this screen. The timer for your next test has <span className="font-bold">started</span> and <span className="font-bold">cannot be paused</span>. The timer continues even when you close the browser.
        </p>
      </CardContent>
    </Card>
  )
}