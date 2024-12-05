import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IoPersonAddSharp } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaSlidersH,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Clock, Edit, MessageSquare } from "lucide-react";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, Edit2, Eye, Globe, MoreVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useGlobalState } from "@/utils/StateProvider";
import SetTestWeights from "@/components/Modal/SetTestWeights";
import { MdAlternateEmail, MdOutlinePersonAddAlt } from "react-icons/md";
import { StarIcon, TrashIcon } from "@radix-ui/react-icons";
import { useFrappeGetCall } from "frappe-react-sdk";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useParams } from "react-router-dom";
import { RxTimer } from "react-icons/rx";
import { PiNotepadBold } from "react-icons/pi";
import { AssessmentData, Test } from "@/components/Interfaces/Interface";

const AssessmentDetailPage = () => {
  const [showWeights, setShowWeights] = useState(false);
  const globalState = useGlobalState();
  const params = useParams();
  const assessment_id = params?.assessment_id || null;

  const get_assessment_data = useFrappeGetCall(
    "scrutin.api.assessment_data.get_assessment_data",
    {
      assessment_id: assessment_id,
    }
  );

  const assessment_data = get_assessment_data?.data?.message || [];

  console.log(assessment_data, "assessment_data");

  const get_specific_assessment_candidate_name = useFrappeGetCall(
    "scrutin.api.assessment_data.get_specific_assessment_candidate_name",
    {
      assessment_name: assessment_id,
    }
  );

  const get_specific_assessment =
    get_specific_assessment_candidate_name?.data?.message || [];
    
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD-MM-YY  hh:mm A");
  };

  const candidates = [
    {
      name: "Abdul Muqeet",
      score: 11,
      hired: false,
    },
  ];

  return (
    <>
      <hr />
      <div className="flex items-center justify-between px-4 py-2 mb-4 border-b">
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-[hsl(217.24deg_32.58%_17.45%)] hover:bg-teal-950"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Go back</span>
          </Button>

          {assessment_data?.assessment_data?.map((data: AssessmentData) => (
            <div className="flex flex-col gap-1 ">
              <div className="flex gap-2">
                <h1 className="text-xl font-semibold">
                  {data?.assessment_name || ""}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-6 w-6"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit title</span>
                </Button>
              </div>

              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <PiNotepadBold />
                  <span>{data?.total_number_of_tests} tests</span>
                </div>
                <div className="flex items-center gap-2">
                  <RxTimer />
                  <span>
                    {data?.total_duration_of_all_tests < 60
                      ? data.total_duration_of_all_tests > 0
                        ? `${data.total_duration_of_all_tests} seconds`
                        : ""
                      : `${Math.floor(
                          data.total_duration_of_all_tests / 60
                        )} min${
                          data.total_duration_of_all_tests % 60 > 0
                            ? ` ${data.total_duration_of_all_tests % 60} sec`
                            : ""
                        }`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            English
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="rounded-full">
            <Eye className="h-4 w-4" />
            <span className="sr-only">Change view</span>
          </Button>

          <Button
            size="sm"
            className="bg-[#E31B88] hover:bg-[#C41875] text-white"
          >
            Invite
          </Button>
        </div>
      </div>

      <Card className="container mx-auto p-6">
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
                    {get_specific_assessment.map((data: AssessmentData) => (
                      <TableRow className="whitespace-nowrap ">
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {data?.applicant_name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>{data?.job_applicant}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-800"
                          >
                            Owner
                          </Badge>
                        </TableCell>
                        <TableCell>Send</TableCell>
                      </TableRow>
                    ))}
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
                      <Button
                        variant="outline"
                        className="flex gap-2"
                        onClick={() =>
                          globalState.openModal("add_team_member", true)
                        }
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
                      <p>
                        You can always add and edit team members in the
                        settings.
                      </p>

                      <div>
                        <div className="flex gap-5 p-5 overflow-y-hidden h-[20rem] border border-slate-700 rounded-lg">
                          <Input placeholder="Teammate’s work email" />
                          <div className="flex">
                            <Select>
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="51-75">Admin</SelectItem>
                                <SelectItem value="76-100">
                                  Recruiter
                                </SelectItem>
                                <SelectItem value="76-100">
                                  Hiring Manager
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <TrashIcon className="h-6 mt-2 w-10 cursor-pointer" />
                          </div>
                        </div>
                      </div>
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
                open={globalState?.modals?.set_test_weights?.open}
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
                open={globalState?.modals?.feed_back?.open}
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
                                  {candidates?.map((candidate) => (
                                    <TableRow key={candidate?.name}>
                                      <TableCell>{candidate?.name}</TableCell>
                                      <TableCell>{candidate?.score}</TableCell>
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
                  <TableRow className="">
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Overall</TableHead>
                    {assessment_data?.tests?.map(
                      (test: Test, index: number) => (
                        <TableHead key={index}>{test.title}</TableHead>
                      )
                    )}
                    <TableHead>Hiring stage</TableHead>

                    <TableHead>Status</TableHead>
                    <TableHead>Invited on</TableHead>
                    <TableHead>Overall rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessment_data?.candidate_name?.map(
                    (data: AssessmentData) => (
                      <TableRow className="whitespace-nowrap ">
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {data?.applicant_name || "N/A"}
                            {/* <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-800"
                          >
                            Owner
                          </Badge> */}
                          </div>
                        </TableCell>
                        <TableCell>{data.overall || "N/A"}</TableCell>
                        {assessment_data?.tests.map(
                          (test: Test, index: number) => (
                            <TableCell key={index}>
                              {data?.test_scores?.[test.title] || "0%"}
                            </TableCell>
                          )
                        )}
                        <TableCell>
                          <Select>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Not yet evaluated" />
                            </SelectTrigger>

                            <SelectContent>
                              {/* <SelectGroup> */}

                              <SelectItem value="2"> Evaluated</SelectItem>
                              <SelectItem value="3">
                                {" "}
                                Invited for interview
                              </SelectItem>
                              <SelectItem value="4"> Interviewed</SelectItem>
                              <SelectItem value="5">
                                {" "}
                                Invited for take-home test
                              </SelectItem>
                              <SelectItem value="6">
                                {" "}
                                Take-home test completed
                              </SelectItem>
                              <SelectItem value="7">
                                {" "}
                                References checked
                              </SelectItem>
                              <SelectItem value="8"> Offer sent</SelectItem>
                              <SelectItem value="9"> Offer declined</SelectItem>
                              <SelectItem value="10">
                                {" "}
                                Candidate withdrew
                              </SelectItem>
                              <SelectItem value="11">
                                {" "}
                                Candidate unresponsive
                              </SelectItem>
                              <SelectItem value="12"> Rejected</SelectItem>
                              <SelectItem value="13"> Hired 🎉</SelectItem>
                              {/* </SelectGroup> */}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            // className="bg-purple-100 text-purple-800"
                          >
                            {data?.status}
                          </Badge>{" "}
                        </TableCell>
                        <TableCell>{formatDate(data?.invited_on)}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={"w-4 h-4 text-gray-300"}
                              />
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )}
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
                  <div className="text-center grid grid-cols-4 gap-4 p-4 font-medium text-sm border-b">
                    <div>Test</div>
                    <div>Weight</div>
                    <div>Impact</div>
                    <div>Duration</div>
                  </div>
                  {assessment_data?.tests?.map((data: Test, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 p-4 text-sm border-b last:border-0 hover:bg-muted/50 text-center "
                    >
                      <div className="text-start">{data?.title}</div>
                      <div>{data?.weight || "--"}</div>
                      <div>{data?.impact || "--"}</div>
                      <div className="flex items-end">
                        <Clock className="mr-2 h-4 w-4" />
                        {data?.total_duration < 60
                          ? data.total_duration > 0
                            ? `${data.total_duration} seconds`
                            : ""
                          : `${Math.floor(data.total_duration / 60)} min${
                              data.total_duration % 60 > 0
                                ? ` ${data.total_duration % 60} sec`
                                : ""
                            }`}
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
                    <div className="col-span-1 md:col-span-2">Question</div>
                    <div className="grid grid-cols-2">
                      <div>Type</div>
                      <div>Duration</div>
                    </div>
                  </div>
                  {assessment_data?.custom_questions?.map(
                    (question: AssessmentData, index: number) => (
                      <div
                        key={index}
                        className="overflow-y-hidden grid grid-cols-2 gap-4 p-4 text-sm border-b last:border-0 hover:bg-muted/50"
                      >
                        {/* <div className="col-span-2">
                          {getPlainText(question?.question)}
                        </div> */}

                        <div
                          className="ql-editor read-mode [&_ol]:list-decimal [&_ul]:list-disc [&_li]:mb-2 [&_li]:ml-4"
                          // className="ql-editor read-mode"
                          dangerouslySetInnerHTML={{
                            __html: question?.question,
                          }}
                        ></div>

                        <div className="grid grid-cols-2">
                          <div className="flex items-center">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {question?.type}
                          </div>
                          <div className="flex items-center m-auto">
                            {/* {question.duration !== "--" && ( */}
                            <Clock className="mr-2 h-4 w-4" />
                            {/* )} */}
                            {question?.duration || 0}
                          </div>
                        </div>
                      </div>
                    )
                  )}
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
      </Card>
    </>
  );
};

export default AssessmentDetailPage;
