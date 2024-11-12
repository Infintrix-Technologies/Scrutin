import * as React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import {
  FaQuestionCircle,
  FaDownload,
  FaEnvelope,
  FaUserTimes,
  FaStar,
  FaCog,
} from "react-icons/fa";
import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  FaDesktop,
  FaGlobe,
  FaLock,
  FaMapPin,
  FaExpand,
  FaMousePointer,
  FaVideo,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Pencil1Icon, StarIcon } from "@radix-ui/react-icons";

import { Textarea } from "@/components/ui/textarea";
import { Eye, Settings2 } from "lucide-react";

interface Question {
  text: string;
  rating: number;
}

const questions: Question[] = [
  {
    text: "Tell us about yourself, what attracts you to this opportunity, and why you are a great candidate for this role. Pro tip: It might be helpful to pretend you are writing this to a new friend and just be yourself. We want to get to know you better....",
    rating: 3,
  },
  {
    text: "Describe a time when you identified a personal weakness at work and took steps to improve it. In your response, consider discussing the following: What was the personal weakness you identified? How did you identify this weakness? What steps...",
    rating: 0,
  },
  {
    text: "Describe a time when you worked collaboratively as part of a team to achieve a common goal at work. In your response, consider discussing the following: What was the goal of the team? What were the challenges you faced as a team? How did you...",
    rating: 0,
  },
  {
    text: "Please provide a link to your LinkedIn profile. For this question, you can exit full-screen mode. Leave blank if you do not have one.",
    rating: 0,
  },
];

const AssessmentDashboard: React.FC = () => {
  const [ratings, setRatings] = React.useState<number[]>(Array(5).fill(0));

  const handleRatingChange = (index: number) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = updatedRatings[index] === 0 ? 1 : 0;
    setRatings(updatedRatings);
  };

  return (
    <>
      <Card className="container m-auto p-5 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-center">
            <div className="flex items-center">
              <h2 className="font-bold text-lg">Assessment</h2>
              <span className="ml-2">Software Engineer</span>
            </div>
            <div className="flex justify-start items-start gap-2">
              {ratings.map((rating, index) => (
                <FaStar
                  key={index}
                  className={`cursor-pointer ${
                    rating === 1 ? "text-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => handleRatingChange(index)}
                />
              ))}
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="rounded-full border p-2 hover:bg-gray-200">
              <FaQuestionCircle />
            </button>
            <button className="rounded-full border p-2 hover:bg-gray-200">
              <FaDownload />
            </button>
            <button className="rounded-full border p-2 hover:bg-gray-200">
              <FaEnvelope />
            </button>
            <button className="rounded-full border p-2 hover:bg-gray-200">
              <FaUserTimes />
            </button>
          </div>
        </div>
      </Card>
      <div className="container mx-auto pt-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <div className="p-4 border rounded-md">
              <div className="mb-2">
                <h3 className="font-bold text-lg">Invited</h3>
                <p className="text-gray-600">October 6th, 2024</p>
              </div>

              <div className="mb-2">
                <h3 className="font-bold text-lg">Completed</h3>
                <p className="text-gray-600">October 6th, 2024</p>
              </div>

              <div className="mb-2">
                <h3 className="font-bold text-lg">Extra time breakdown</h3>
                <p className="text-gray-600">
                  No extra time was granted to this candidate
                </p>
              </div>

              <div className="mb-2">
                <h3 className="font-bold text-lg">Source</h3>
                <p className="text-gray-600">General public link</p>
              </div>

              <div className="mb-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <Card className="container ">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <Badge variant="outline">Test User</Badge>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">15%</h1>
                    <p className="text-sm text-gray-500">Average score</p>
                  </div>
                </div>
                <Progress className="mt-4" value={15} max={100} />
                <p className="text-xs mt-2 text-gray-500">
                  How to interpret results
                </p>
              </CardHeader>
            </Card>
            <Card className="container mt-4">
              <CardHeader>
                <div className="max-w-2xl space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h2 className="text-sm font-medium text-muted-foreground">
                        Scoring method
                      </h2>
                      <p className="text-lg font-semibold">
                        Percentage of correct answers
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="flex justify-between items-center gap-2 rounded-full border"
                    >
                      <Pencil1Icon className="h-4 w-4" />
                      Change
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">
                      Tests included in overall assessment score
                    </h3>
                  </div>
                </div>

                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <Accordion key={index} type="single" collapsible>
                      <AccordionItem value={`item-${index + 1}`}>
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                          Yes. It adheres to the WAI-ARIA design pattern.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
              </CardHeader>
            </Card>
          </div>
          <div className="col-span-1">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  Anti-cheating monitor
                </CardTitle>
                <Link
                  className="text-primary hover:underline text-sm font-medium"
                  to="#"
                >
                  Learn more
                </Link>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaDesktop className="h-4 w-4" />
                      <span className="text-sm">Device used</span>
                    </div>
                    <span className="text-sm font-medium">Desktop</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaMapPin className="h-4 w-4" />
                      <span className="text-sm">Location</span>
                    </div>
                    <span className="text-sm font-medium">Lahore (PB), PK</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaGlobe className="h-4 w-4" />
                      <span className="text-sm">
                        Filled out only once from IP address?
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100"
                    >
                      Yes
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaVideo className="h-4 w-4" />
                      <span className="text-sm">Webcam enabled?</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100"
                    >
                      Yes
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaExpand className="h-4 w-4" />
                      <span className="text-sm">
                        Full-screen mode always active?
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-700 hover:bg-red-100"
                    >
                      No
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaMousePointer className="h-4 w-4" />
                      <span className="text-sm">
                        Mouse always in assessment window?
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-700 hover:bg-red-100"
                    >
                      No
                    </Badge>
                  </div>
                </div>
                <div className="mt-6 aspect-video w-full rounded-lg bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <FaLock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom questions</CardTitle>
          </CardHeader>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>View Answer</TableHead>
                <TableHead>Average Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {questions.map((question, index) => (
                <TableRow key={index}>
                  {/* Question Column */}

                  <TableCell className="p-4 flex items-center">
                    <p className="">{question.text}</p>
                  </TableCell>

                  {/* View Answer Column */}
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Read
                    </Button>
                  </TableCell>

                  {/* Rating Column */}
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < question.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <hr className="mt-10" />
          <div className="flex mt-6 justify-between">
            <CardHeader>
              <CardTitle>Your rating</CardTitle>
              <p className="text-sm text-muted-foreground">
                Give your personal overall rating of this candidate based on
                your impressions and interactions with him or her.
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-6 h-6 text-gray-300" />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add your private notes here (auto-saved)..."
                  className="min-h-[100px] w-[30rem] resize-none"
                />
              </div>
            </CardContent>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assessment</CardTitle>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                Software Engineer - Pakistan - On/Site
              </p>
              <Settings2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Scoring method</p>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Percentage of correct answers
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium">
                Tests included in overall assessment score
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Problem Solving</p>
                  <p className="text-sm">0%</p>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium">Anti-cheating monitor</p>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Device used</p>
                  <p className="text-sm font-medium">Desktop</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Webcam enabled?</p>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded">
                    No
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Full-screen mode always active?</p>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded">
                    Yes
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Mouse always in assessment window?</p>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded">
                    Yes
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="flex items-center gap-5">
                  Assessment{" "}
                  <p className="text-sm font-medium">
                    Software Engineer - Pakistan - On/Site
                  </p>
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-6 h-6 text-gray-300" />
                  ))}
                </div>
              </div>
              <Button variant="outline" size="icon">
                <FaCog className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <hr />

          <div className="container mx-auto pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Invited</p>
                      <p className="text-sm">August 28th, 2024</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Extra time breakdown
                      </p>
                      <p className="text-sm">Disability +50%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Source</p>
                      <p className="text-sm">Invitation by email</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Hiring stage</p>
                      <Select defaultValue="not-yet-evaluated">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-yet-evaluated">
                            Not yet evaluated
                          </SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </div>
              <div className="col-span-1">
                <Card className="container mt-4">
                  <CardHeader>
                    <div className="max-w-2xl space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h2 className="text-sm font-medium text-muted-foreground">
                            Scoring method
                          </h2>
                          <p className="text-lg font-semibold">
                            Percentage of correct answers
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="flex justify-between items-center gap-2 rounded-full border"
                        >
                          <Pencil1Icon className="h-4 w-4" />
                          Change
                        </Button>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">
                          Tests included in overall assessment score
                        </h3>
                      </div>
                    </div>

                    {Array(2)
                      .fill(null)
                      .map((_, index) => (
                        <Accordion key={index} type="single" collapsible>
                          <AccordionItem value={`item-${index + 1}`}>
                            <AccordionTrigger>
                              Is it accessible?
                            </AccordionTrigger>
                            <AccordionContent>
                              Yes. It adheres to the WAI-ARIA design pattern.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                  </CardHeader>
                </Card>
              </div>
              <div className="col-span-1 p-5">
                <div className="space-y-4">
                  <p className="text-sm font-medium">Anti-cheating monitor</p>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Device used</p>
                      <p className="text-sm font-medium">Desktop</p>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between">
                      <p className="text-sm">
                        Filled out only once from IP address?
                      </p>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded">
                        Yes
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Webcam enabled?</p>
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded">
                        No
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Full-screen mode always active?</p>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded">
                        Yes
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">
                        Mouse always in assessment window?
                      </p>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded">
                        Yes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="mt-10" />
          <div className="flex mt-6 justify-between">
            <CardHeader>
              <CardTitle>Your rating</CardTitle>
              <p className="text-sm text-muted-foreground">
                Give your personal overall rating of this candidate based on
                your impressions and interactions with him or her.
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-6 h-6 text-gray-300" />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add your private notes here (auto-saved)..."
                  className="min-h-[100px] w-[30rem] resize-none"
                />
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AssessmentDashboard;
