import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IoPersonAddSharp } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
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
  DialogClose,
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
import SetTestWeights from "@/components/Modal/SetTestWeights";
import { MdAlternateEmail, MdOutlinePersonAddAlt } from "react-icons/md";
import { TrashIcon } from "@radix-ui/react-icons";

interface Test {
  name: string;
  weight: string;
  impact: string;
  duration: string;
}
interface Candidate {
  name: string;
  score: number;
  hired: boolean;
}
interface Question {
  text: string;
  type: string;
  duration: string;
}

const CandidateAssessmentDashboard = () => {
  const [showWeights, setShowWeights] = useState(false);
  const globalState = useGlobalState();
  const candidates: Candidate[] = [
    {
      name: "Abdul Muqeet",
      score: 11,
      hired: false,
    },
  ];
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
        <Card className="my-6 px-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Try the Assessment yourselef or invite your team members to
                trail it.
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center justify-between overflow-y-hidden">
                  <h1 className="text-2xl font-semibold">Team members</h1>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10 w-[300px]"
                        placeholder="Search users by name or email"
                      />
                    </div>

                    <Select>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-25">All Role</SelectItem>
                        <SelectItem value="26-50">Owner</SelectItem>
                        <SelectItem value="51-75">Admin</SelectItem>
                        <SelectItem value="76-100">Recruiter</SelectItem>
                        <SelectItem value="76-100">Hiring Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="whitespace-nowrap">
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invitation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="whitespace-nowrap ">
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          Abdul Muqeet                        
                        </div>
                      </TableCell>
                      <TableCell>11%</TableCell>
                      <TableCell>0%</TableCell>
                      <TableCell>32%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <hr className="my-3" />
                <div className="flex justify-between ">
                  <div>
                    <Button variant="outline" className="flex gap-2">
                      <MdAlternateEmail />
                      Customized Email
                    </Button>{" "}
                  </div>

                  <div className="flex gap-3">
                    <div className="">
                      {" "}
                      <Button variant="outline" className="flex gap-2"
                        onClick={() => globalState.openModal("add_team_member", true)}
                      >
                        <MdOutlinePersonAddAlt />
                        Add Team Member
                      </Button>
                    </div>
                    <div className="">
                      {" "}
                      <Button variant="outline" className="flex gap-2" disabled>
                        <LuSendHorizonal />
                        Send Invitations
                      </Button>
                    </div>
                  </div>
                </div>
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
                onClick={() => globalState.openModal("set_test_weights", true)}
              >
                Set test weights
              </span>
              <Dialog
                open={globalState.modals.add_team_member.open}
                onOpenChange={(open) =>
                  globalState.openModal("add_team_member", open)
                }
              >
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Invite team members</DialogTitle>
                    <DialogDescription className="space-y-5">
                      <p>You can always add and edit team members in the settings.</p>

                      <div>
                      <div className="flex gap-5 p-5 overflow-y-hidden h-[20rem] border border-slate-700 rounded-lg">
                      <Input placeholder="Teammate’s work email"/>
                      <div className="flex">
                      <Select>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>                    
                        <SelectItem value="51-75">Admin</SelectItem>
                        <SelectItem value="76-100">Recruiter</SelectItem>
                        <SelectItem value="76-100">Hiring Manager</SelectItem>
                      </SelectContent>
                    </Select>
                      <TrashIcon className="h-6 mt-2 w-10 cursor-pointer"/>
                      </div>
                      </div>
                      
                      </div>
                      {/* <div className="h-[20rem] border border-slate-700 rounded-lg">
                      </div> */}

                      {/* <hr /> */}
                          <div className="flex items-center justify-between">
                            <div className="flex  ">
                              <div className="flex items-center justify-between gap-2">
                                <IoPersonAddSharp />
                                <label htmlFor="no-hire" className="text-sm">
                                  Add another
                                </label>
                              </div>
                            </div>

                            <DialogFooter className="">
                              <DialogClose asChild>
                                <div className="flex gap-2">
                                  <Button type="button" variant="secondary">
                                    Cancel
                                  </Button>
                                  <Button disabled> Invite</Button>
                                </div>
                              </DialogClose>
                            </DialogFooter>
                          </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog
                open={globalState.modals.set_test_weights.open}
                onOpenChange={(open) =>
                  globalState.openModal("set_test_weights", open)
                }
              >
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Set Test Weights</DialogTitle>
                    <DialogDescription>
                      <SetTestWeights />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Dialog
                open={globalState.modals.feed_back.open}
                onOpenChange={(open) =>
                  globalState.openModal("feed_back", open)
                }
              >
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Who did you hire?</DialogTitle>
                    <DialogDescription>
                      {/* <SetTestWeights /> */}

                      <div className="w-full max-w-3xl mx-auto p-6">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold">
                              Assessment name: Software Engineer
                            </h1>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h2 className="text-lg font-medium">
                                Candidates
                              </h2>
                              <div className="relative w-72">
                                <FaSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-8"
                                  placeholder="Search"
                                  type="search"
                                />
                              </div>
                            </div>
                            <Card>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Avg. % score</TableHead>
                                    <TableHead>Hired</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {candidates.map((candidate) => (
                                    <TableRow key={candidate.name}>
                                      <TableCell>{candidate.name}</TableCell>
                                      <TableCell>{candidate.score}</TableCell>
                                      <TableCell>
                                        <Checkbox
                                        // checked={candidate.hired}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Card>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span>Items per page 10</span>
                                <span>1-1 of 1</span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="icon" disabled>
                                  <FaChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" disabled>
                                  <FaChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <hr />
                          <div className="flex items-center justify-between">
                            <div className="flex  ">
                              <div className="flex items-center justify-between gap-2">
                                <Checkbox />
                                <label htmlFor="no-hire" className="text-sm">
                                  I didn't hire anyone
                                </label>
                              </div>
                            </div>

                            <DialogFooter className="">
                              <DialogClose asChild>
                                <div className="flex gap-2">
                                  <Button>Save</Button>
                                  <Button type="button" variant="secondary">
                                    Cancel
                                  </Button>
                                </div>
                              </DialogClose>
                            </DialogFooter>
                          </div>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="whitespace-nowrap">
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

                    <TableHead>Status</TableHead>
                    <TableHead>Invited on</TableHead>
                    <TableHead>Overall rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="whitespace-nowrap ">
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
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      globalState.openModal("set_test_weights", true)
                    }
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit weights
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => globalState.openModal("feed_back", true)}
                  >
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
        <Card className="my-5 px-2">
          <div className="p-4 ">
            <h2 className="font-bold">Settings</h2>
          </div>

          <Accordion className="px-4" type="single" collapsible>
            <hr className="" />

            <AccordionItem value="job title">
              <AccordionTrigger>Assessment invitation details</AccordionTrigger>
              <AccordionContent>
                Enter the external job title for this assessment. This
                information helps candidates identify the sender and purpose of
                the assessment invitation.
                <Input
                  type="text"
                  className="w-80 mt-4 ml-1"
                  placeholder="Public Job Title"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion className="px-4" type="single" collapsible>
            <AccordionItem value="qualifying questions">
              <AccordionTrigger>Qualifying questions</AccordionTrigger>
              <AccordionContent>
                This assessment doesn't include any qualifying questions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion className="px-4" type="single" collapsible>
            <AccordionItem value="item 2">
              <AccordionTrigger>Manage team access</AccordionTrigger>
              <AccordionContent>
                No changes for access to this assessment.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion className="px-4" type="single" collapsible>
            <AccordionItem value="item 2">
              <AccordionTrigger>Intro/Outro Video</AccordionTrigger>
              <AccordionContent>
                This assessment doesn't include an intro/outro video.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion className="px-4" type="single" collapsible>
            <AccordionItem value="item 2">
              <AccordionTrigger>Anti-cheating settings</AccordionTrigger>
              <AccordionContent>
                Snapshots of candidates have been enabled
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion className="px-4" type="single" collapsible>
            <AccordionItem value="item 2">
              <AccordionTrigger>Extra time for tests</AccordionTrigger>
              <AccordionContent>
                No extra time was granted for this assessment
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion className="px-4" type="single" collapsible>
            <AccordionItem value="item 2">
              <AccordionTrigger>Accommodation for candidates</AccordionTrigger>
              <AccordionContent className=" ">
                Allow accommodation for fair treatment and equal opportunities,
                candidates can request an accommodation based on their English
                language proficiency or disability. By disabling these
                accommodations, you may be in violation of fair employment laws
                and regulations in your area. If you're unsure, we suggest
                seeking legal advice before proceeding.
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-2 ">
                    <Checkbox />
                    <span> Non-fluent English speakers. </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <span>
                      {" "}
                      Candidates with conditions that affect their concentration
                      or memory capacity.{" "}
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion className="px-4" type="single" collapsible>
            <AccordionItem value="item 2">
              <AccordionTrigger>Show results to candidates</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-2 py-4">
                  <Checkbox />
                  <span>
                    {" "}
                    Enable candidates redirection to TestGorilla Profiles{" "}
                  </span>
                </div>
                The results of this assessment will be visible to candidates via
                their TestGorilla Profiles. This profile is a one-stop-shop for
                all their assessments and results. They can instantly see their
                results after completing an assessment. Unchecking this feature
                will only turn off the post-assessment redirect. In line with
                Europe's GDPR, TestGorilla must share results with candidates
                upon request. This is also covered in our data processing
                agreement. Learn more
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </>
  );
};

export default CandidateAssessmentDashboard;
