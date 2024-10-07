import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"

// Sample job data
const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    postedAt: "2 days ago",
  },
  {
    id: 2,
    title: "UX Designer",
    company: "DesignHub",
    location: "New York, NY",
    type: "Contract",
    postedAt: "1 week ago",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "DataSystems",
    location: "Remote",
    type: "Full-time",
    postedAt: "3 days ago",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "InnovateCo",
    location: "Seattle, WA",
    type: "Full-time",
    postedAt: "5 days ago",
  },
  {
    id: 5,
    title: "DevOps Specialist",
    company: "CloudTech",
    location: "Austin, TX",
    type: "Contract",
    postedAt: "1 day ago",
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "AI Solutions",
    location: "Boston, MA",
    type: "Full-time",
    postedAt: "4 days ago",
  },
]

export default function Component() {
  return (
    <div className="container mx-auto px-32">
       <div className="flex justify-between mt-10">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link to="/jobs/post">
        <Button>
          <FaPlus />
          Post Job
        </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <Link to={`/jobs/detail`}>
               <CardTitle>{job.title}</CardTitle>
              </Link>
             
              <CardDescription>{job.company}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Briefcase className="w-4 h-4" />
                <span>{job.type}</span>
              </div>
              <Badge variant="secondary" className="mb-4">
                <Clock className="w-4 h-4 mr-1" />
                {job.postedAt}
              </Badge>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}