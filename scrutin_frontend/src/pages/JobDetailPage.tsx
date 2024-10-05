import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, DollarSign, Calendar, Clock } from "lucide-react"

export default function JobDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">Senior Frontend Developer</CardTitle>
              <CardDescription className="text-lg">TechCorp Inc.</CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">Full-time</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
              <span>San Francisco, CA (Remote)</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-muted-foreground" />
              <span>$120,000 - $160,000 / year</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
              <span>Start date: Immediate</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
              <span>Posted 2 days ago</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-muted-foreground">
              We are seeking a talented Senior Frontend Developer to join our innovative team. In this role, you will be responsible for developing and maintaining cutting-edge web applications using modern technologies such as React, Next.js, and TypeScript.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>5+ years of experience in frontend development</li>
              <li>Strong proficiency in React, Next.js, and TypeScript</li>
              <li>Experience with state management libraries (e.g., Redux, MobX)</li>
              <li>Familiarity with modern CSS frameworks and methodologies</li>
              <li>Excellent problem-solving and communication skills</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Benefits</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Competitive salary and equity package</li>
              <li>Flexible work hours and remote work options</li>
              <li>Health, dental, and vision insurance</li>
              <li>401(k) plan with company match</li>
              <li>Professional development budget</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Apply Now</Button>
        </CardFooter>
      </Card>
    </div>
  )
}