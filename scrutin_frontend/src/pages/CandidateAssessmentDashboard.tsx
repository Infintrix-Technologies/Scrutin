import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaSlidersH,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
// import { Link } from "react-router-dom";
import { Clock, Edit, MessageSquare, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useGlobalState } from "@/utils/StateProvider";

interface Test {
  name: string;
  weight: string;
  impact: string;
  duration: string;
}

interface Question {
  text: string;
  type: string;
  duration: string;
}

const CandidateAssessmentDashboard = () => {
  const [showWeights, setShowWeights] = useState(false);
  const globalState = useGlobalState();

  const tests: Test[] = [
    { name: "Problem Solving", weight: "--", impact: "--", duration: "9'" },
    { name: "Communication", weight: "--", impact: "--", duration: "8'" },
    { name: "Time Management", weight: "--", impact: "--", duration: "9'" },
    { name: "Motivation", weight: "--", impact: "--", duration: "15'" },
    { name: "Big 5 (OCEAN)", weight: "--", impact: "--", duration: "10'" },
  ];

  const questions: Question[] = [
    {
      text: "Tell us about yourself, what attracts you to this opportunity, and why you are a great candidate for this role. Pro tip: it might be helpful to pretend...",
      type: "Essay",
      duration: "5'",
    },
    {
      text: "Describe a time when you identified a personal weakness at work and took steps to improve it. In your response, consider discussing the following: What...",
      type: "Essay",
      duration: "5'",
    },
    {
      text: "Describe a time when you worked collaboratively as part of a team to achieve a common goal at work. In your response, consider discussing the following:...",
      type: "Essay",
      duration: "5'",
    },
    {
      text: "Please feel welcome to upload your resume/CV or portfolio (if you have one). Leave blank if you do not have one. For this question, you can exit full-screen...",
      type: "File",
      duration: "--",
    },
    {
      text: "Please provide a link to your LinkedIn profile. For this question, you can exit full-screen mode. Leave blank if you do not have one.",
      type: "Essay",
      duration: "2'",
    },
  ];

  return (
    <>
      <div className="container mx-auto p-6">
        {/* <Card className="">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              MOTIVATION TEST SURVEY
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-base">
                You added the Motivation test to your assessment. Great choice!
              </p>

              <p className="text-base">
                This test requires you to take the motivation survey to indicate
                the key characteristics, elements of the work environment, and
                activities that are most important for success in the role for
                which you are hiring.{" "}
                <span className="font-semibold">
                  Only after you complete this survey will the test calculate a
                  score
                </span>
                , showing you how each of your candidates' expectations align
                with the job you're offering.
              </p>

              <p className="text-base">
                Plan to spend at least 15 minutes on the survey and note that
                you may need input from others in your organization to complete
                it. You can{" "}
                <Link to="#" className="text-pink-500 hover:text-pink-600">
                  read more about how the motivation test works
                </Link>{" "}
                and how results are shown.
              </p>
              <Button className="w-full md:w-auto m-auto h-11 rounded-lg">
                Take the survey
              </Button>
            </div>

            <div className="space-y-8 border-l-2 pl-6">
              <CardDescription className="text-base">
                Or you can invite a colleague to take the survey.
              </CardDescription>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  type="text"
                  placeholder="First name"
                  className="border-zinc-200 h-11"
                />
                <Input
                  type="text"
                  placeholder="Last name"
                  className="border-zinc-200 h-11"
                />
              </div>
              <Input
                type="email"
                placeholder="Email address"
                className="border-zinc-200 h-11"
              />
              <Button className="w-full md:w-auto m-auto h-11 rounded-lg">
                Send invitation
              </Button>
            </div>
          </CardContent>
        </Card> */}
        <Card className="my-6 px-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Try the Assessment yourselef or invite your team members to
                trail it.
              </AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
        <Card>
          <div className="p-6 my-3 space-y-8">
            <div className="flex items-center justify-between overflow-y-hidden">
              <h1 className="text-2xl font-semibold">Candidates</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-10 w-[300px]" placeholder="Search" />
                </div>

                <Select>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Score range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-25">0-25</SelectItem>
                    <SelectItem value="26-50">26-50</SelectItem>
                    <SelectItem value="51-75">51-75</SelectItem>
                    <SelectItem value="76-100">76-100</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="gap-2">
                  <FaSlidersH className="h-4 w-4" />
                  More filters
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={showWeights} onCheckedChange={setShowWeights} />
              <span
          className="text-sm font-medium cursor-pointer"
          onClick={() => globalState.openModal("set_test_weights", true)} // Open modal on text click
        >
          Set test weights
        </span>

        <Dialog
        open={globalState.modals.set_test_weights.open}
        onOpenChange={(open) => globalState.openModal("set_test_weights", open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Test Weights</DialogTitle>
            <DialogDescription>
              Adjust the test weights for your assessments here.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                // Add your submit logic for the weights here
                globalState.openModal("set_test_weights", false); // Close modal after submitting
              }}
            >
              Save
            </Button>
            <Button onClick={() => globalState.openModal("set_test_weights", false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Overall</TableHead>
                    <TableHead>Problem Solving</TableHead>
                    <TableHead>Communication</TableHead>
                    <TableHead>Time Management</TableHead>
                    <TableHead>Motivation</TableHead>
                    <TableHead>Hiring stage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        Abdul Muqeet
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800"
                        >
                          Owner
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>11%</TableCell>
                    <TableCell>0%</TableCell>
                    <TableCell>32%</TableCell>
                    <TableCell>0%</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Not yet evaluated" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-evaluated">
                            Not yet evaluated
                          </SelectItem>
                          <SelectItem value="screening">Screening</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Items per page
                </span>
                <Select defaultValue="25">
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  1 - 1 of 1
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <FaChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <FaChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <div className="container mx-auto pt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tests Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-bold">
                  Included tests
                </CardTitle>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit weights
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Feedback
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <div className="grid grid-cols-4 gap-4 p-4 font-medium text-sm border-b">
                    <div>Test</div>
                    <div>Weight</div>
                    <div>Impact</div>
                    <div>Duration</div>
                  </div>
                  {tests.map((test, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 p-4 text-sm border-b last:border-0 hover:bg-muted/50"
                    >
                      <div>{test.name}</div>
                      <div>{test.weight}</div>
                      <div>{test.impact}</div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {test.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Questions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Custom questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <div className="grid grid-cols-3 gap-4 p-4 font-medium text-sm border-b">
                    <div className="col-span-2">Question</div>
                    <div className="grid grid-cols-2">
                      <div>Type</div>
                      <div>Duration</div>
                    </div>
                  </div>
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className="overflow-y-hidden grid grid-cols-3 gap-4 p-4 text-sm border-b last:border-0 hover:bg-muted/50"
                    >
                      <div className="col-span-2">{question.text}</div>
                      <div className="grid grid-cols-2">
                        <div className="flex items-center">
                          {question.type === "File" ? (
                            <Upload className="mr-2 h-4 w-4" />
                          ) : (
                            <MessageSquare className="mr-2 h-4 w-4" />
                          )}
                          {question.type}
                        </div>
                        <div className="flex items-center">
                          {question.duration !== "--" && (
                            <Clock className="mr-2 h-4 w-4" />
                          )}
                          {question.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="my-5 p-2">
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <Accordion className="px-4" key={index} type="single" collapsible>
                <AccordionItem value={`item-${index + 1}`}>
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
        </Card>
      </div>
    </>
  );
};

export default CandidateAssessmentDashboard;
