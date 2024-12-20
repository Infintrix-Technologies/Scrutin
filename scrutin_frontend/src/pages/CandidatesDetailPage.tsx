import * as React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  FaChevronRight,
  FaStarHalfAlt,
  FaRegStar,
  FaPaperPlane,
} from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router-dom";
import {
  FaDesktop,
  FaGlobe,
  FaLock,
  FaMapPin,
  FaExpand,
  FaMousePointer,
  FaVideo,
} from "react-icons/fa";
import { RxTimer } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Eye } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useGlobalState } from "@/utils/StateProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaClock, FaLanguage, FaChartLine } from "react-icons/fa";
import { MdCheckCircle, MdTimer } from "react-icons/md";
import { VscTypeHierarchySuper } from "react-icons/vsc";
import { AiOutlineBarChart } from "react-icons/ai";
import { FaChevronLeft } from "react-icons/fa6";
import {
  useFrappeGetCall,
  useFrappePostCall,
} from "frappe-react-sdk";
import { CandidateDetailAssessments, CandidateTestResponseReport, AssessmentCustomQuestion, JobApplicantSelectAssessment } from "@/types/Interface";
import dayjs from "dayjs";
import NotFound from "./NotFound";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";


const CandidatesDetailPage: React.FC = () => {
  const [sliderValue, setSliderValue] = React.useState(0);
  const [updatedRatings, setUpdatedRatings] = React.useState<{ [key: string]: number }>({});
  const [ratingUpdated, setRatingUpdated] = React.useState(false); 
  const [selectedAssessment, setSelectedAssessment] = React.useState<string | null>(null);
  const globalState = useGlobalState();
  const params = useParams();
  const email = params.email || null;

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  const { data, isLoading, error } = useFrappeGetCall(
    "scrutin.api.assessment_data.get_combined_candidate_detail_with_snapshot",
    { email: email , ratingUpdated: ratingUpdated}
  );
 
  const candidate_details = data?.message?.candidate_assessment || [];
  // console.log(candidate_details, "candidate_details");

  const send_email_to_candidate_test_response_report = useFrappePostCall(
    "scrutin.api.test_response_report.send_email_to_candidate_test_response_report"
  );
  const update_job_applicant_status = useFrappePostCall("scrutin.api.candidate_test.update_job_applicant_status")

  const assessment_list_page_api = useFrappeGetCall("scrutin.api.assessment_data.assessment_list_page_api")
  const assessment_list_query =
  assessment_list_page_api?.data?.message || [];
  // console.log(assessment_list_query,"assessment_list_query")
  const get_candidate_test_response_report = useFrappeGetCall(
    "scrutin.api.test_response_report.get_candidate_test_response_report",
    {
      candidate_id: candidate_details[0]?.candidate_id,
    }
  );
 
  const candidate_test_response_report =
    get_candidate_test_response_report?.data?.message || [];
  const update_job_applicant_rating = useFrappePostCall("scrutin.api.candidate_test.update_job_applicant_rating")

   const send_invite = useFrappePostCall("scrutin.api.send_invite.send_invite");

   const webcam_snapshot_api = useFrappeGetCall("scrutin.api.testing_api.webcam_snapshot_api",{
    candidate_id: candidate_details[0]?.candidate_id,
  })
  const webcam_snapshot = webcam_snapshot_api?.data?.message || [];
console.log(webcam_snapshot,"webcam_snapshot")

   const handleSendInvite = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!selectedAssessment) {
      toast.error("Please select an assessment.");
      return;
    }
  
    if (!email) {
      toast.error("Email is not available.");
      return; 
    }
  
    try {
      const response = await send_invite.call({
        assessment: selectedAssessment,
        email_id: email,
      });
  
      if (response.message.message) {
        toast.success(response.message.message);
        globalState.openModal("candidate_send_invite", false);
        send_invite.reset()
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast.error("Failed to send invite. Please try again.");
    }
  };
  

  const renderStars = (
    rating: number,
    onClickHandler?: (rating: number) => void
  ) => {
    const stars = [];
    const fullStar = <FaStar className="text-yellow-300" />;
    const halfStar = <FaStarHalfAlt className="text-yellow-300" />;
    const emptyStar = <FaRegStar className="text-yellow-300" />;

    const convertedRating = Math.round(rating * 10);
    const fullStarsCount = Math.floor(convertedRating / 2);
    const halfStarCount = convertedRating % 2;
    const emptyStarsCount = 5 - (fullStarsCount + halfStarCount);

    for (let i = 0; i < fullStarsCount; i++) {
      stars.push(
        <span
          key={`full-${i}`}
          onClick={() => onClickHandler && onClickHandler((i + 1) * 0.2)}
        >
          {fullStar}
        </span>
      );
    }
    if (halfStarCount === 1) {
      stars.push(
        <span
          key="half"
          onClick={() => onClickHandler && onClickHandler(fullStarsCount * 0.2 + 0.1)}
        >
          {halfStar}
        </span>
      );
    }
    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(
        <span
          key={`empty-${i}`}
          onClick={() =>
            onClickHandler &&
            onClickHandler((fullStarsCount + i + 1) * 0.2)
          }
        >
          {emptyStar}
        </span>
      );
    }

    return stars;
  };
  const handleRatingUpdate = async (assessmentId: string, rating: number) => {
    try {
      const roundedRating = Math.round(rating * 10) / 10;

      const response = await update_job_applicant_rating.call({
        applicant_id: email,
        rating: roundedRating,
      });

      if (response.message) {
        // toast.success(response.message);
        setUpdatedRatings((prevRatings) => ({
          ...prevRatings,
          [assessmentId]: roundedRating,
        }));
        setRatingUpdated(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update rating!");
    }
  };
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD-MM-YY hh:mm A");
  };
  const handleRejectApplicant = async () => {
    try {
      const response = await update_job_applicant_status.call({ applicant_id: email });
      if (response.message.rejected) {
        toast.error(response.message.message || 'The applicant has already been rejected.');
      } else {
        toast.success('The applicant status has been updated successfully.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating the status.');
    }
  };
  const handleDownloadPDF = () => {
    const candidateDetails = candidate_details[0];
    const responseReport = get_candidate_test_response_report?.data?.message;
  
    if (!candidateDetails || !responseReport) {
      alert("No data available to download.");
      return;
    }
  
  const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text("Candidate Assessment Report", 10, 10);
    doc.setFontSize(12);

    doc.setFont("helvetica", "normal");
    doc.text("Candidate Name : ", 10, 20);
  
    doc.setFont("helvetica", "bold");
    doc.text(`${candidateDetails.candidate_name}`, 50, 20);
    
    doc.setFont("helvetica", "normal");
    doc.text("Candidate Email : ", 10, 30);
    
    doc.setFont("helvetica", "bold");
    doc.text(`${candidateDetails.job_applicant}`, 50, 30);
  
    doc.setFont("helvetica", "normal");
    doc.text("Assessment Name : ", 10, 40);
  
    doc.setFont("helvetica", "bold");
    doc.text(`${candidateDetails.assessment_title}`, 50, 40);
  
    doc.setFont("helvetica", "normal");
    doc.text("Assessment Average : ", 10, 50);
  
    doc.setFont("helvetica", "bold");
    doc.text(`${responseReport.assessment_average.toFixed(0)} %`, 55, 50);
  
    doc.setFont("helvetica", "normal");
    doc.text("Assessment Status : ", 10, 60);
  
    doc.setFont("helvetica", "bold");
    doc.text(`${candidateDetails.status || "Not Completed"}`, 50, 60);
  
    doc.line(10, 65, 200, 65);
  
    const testTableData = candidate_details.map((assessments:CandidateDetailAssessments) => [
      formatDate(assessments.invited_on || "N/A"),
      formatDate(assessments.assessment_completed_at || "Not Completed"),
      "desktop",
      "Lahore",
      assessments.filled_out_only_once_from_ip_address === 0 ? "No" : "Yes",
      assessments.web_cam_enabled === 0 ? "No" : "Yes",
      assessments.full_screen_mode_always_active === 0 ? "No" : "Yes",
      assessments.mouse_always_in_assessment_window === 0 ? "No" : "Yes",
    ]);
  
    
    autoTable(doc, {
      head: [["Invited_on", "Completed at", "Device Used", "Location", "Filled only once IP", "Webcam", "Full-screen","Mouse always in window"]],
      body: testTableData,
      startY: 70,
      styles: { fontSize: 10, cellPadding: 4 },
      theme: "grid",
    });
  
   
    const testTableData2 = responseReport.tests.map((test:CandidateTestResponseReport, index:number) => [
      index + 1,
      test.test_title,
      test.test_level,
      test.total_questions,
      test.correct_count,
      test.incorrect_count,
      test.unanswered_questions,
      `${test.accuracy.toFixed(0)}%`,
    ]);
  
    autoTable(doc, {
      head: [["#", "Test Title", "Level", "Total Questions", "Correct", "Incorrect","unanswered" ,"Accuracy"]],
      body: testTableData2,
      startY: 120,
      styles: { fontSize: 10, cellPadding: 4 },
      theme: "grid",
    });
  
    doc.save(`Assessment_Report_${candidateDetails.candidate_name}.pdf`);
  };
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <NotFound />;

  return (
    <div className="">
      <header className="flex  justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-[hsl(217.24deg_32.58%_17.45%)] hover:bg-teal-950"
          >
            
            <Link to={'/candidates'}>
            <FaChevronLeft className="h-4 w-4" />
            </Link>
            <span className="sr-only">Go back</span>
          </Button>

          <div className="flex flex-col sm:flex-col px-2 gap-0 sm:gap-2">
            <h1 className="text-base font-semibold">
              {candidate_details[0].candidate_name}
            </h1>
            <Link
              // to="mailto:muqeet@infintrotech.com"
              to="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              {candidate_details[0].job_applicant}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
         

          <Button
            size="sm"
            className="bg-[#E31B88] hover:bg-[#C41875] text-white flex gap-3"
            onClick={() =>
              globalState.openModal("candidate_send_invite", true)
            }
          >
           Send Invite 
            <FaPaperPlane />
            
          </Button>

          <div className="hidden sm:flex items-center gap-2 ml-2 text-sm text-muted-foreground">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FaChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <span>1/1</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FaChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </header>       
      {candidate_details.map((assessment: CandidateDetailAssessments, index: number) => {
        // console.log(assessment,"assessmentassessment")
        const currentRating = updatedRatings[assessment.candidate_id] || assessment.applicant_rating;
        return (
          <div key={index} className="px-4 md:px-14">         
            <Card className="container m-auto p-5 mt-4">
              <div className="block md:flex justify-between items-center">
                <div className="flex flex-col justify-center">
                  <div className="flex whitespace-nowrap text-sm md:text-lg items-center justify-center gap-3">
                    <h2 className="font-bold text-lg">Assessment : </h2>
                    <span className="">
                      {assessment.assessment_title || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-start items-start gap-2">
                  {renderStars(currentRating)}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="rounded-full border p-2 hover:bg-green-800"
                          onClick={() =>
                            globalState.openModal("interpret_results", true)
                          }
                        >
                          <FaQuestionCircle />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Learn more</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="rounded-full border p-2 hover:bg-green-800">
                          <FaDownload onClick={handleDownloadPDF}/>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download results</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="rounded-full border p-2 hover:bg-green-800"
                          onClick={() => {
                            send_email_to_candidate_test_response_report.call({
                              candidate_id: candidate_details[0]?.candidate_id,
                            });
                          }}
                        >
                          <FaEnvelope />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send results to candidate</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="rounded-full border p-2 hover:bg-green-800"                        
                          onClick={handleRejectApplicant}
                        >
                          <FaUserTimes />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reject</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Toaster position="top-center" reverseOrder={false} />

                </div>
              </div>
            </Card>
            <div className="container mx-auto pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
                <div className="col-span-1">
                  <div className="p-4 border rounded-lg">
                    <div className="mb-2">
                      <h3 className="font-bold text-lg">Invited</h3>
                      <p className="text-gray-300">
                        {formatDate(assessment.invited_on)}
                      </p>
                    </div>

                    <div className="mb-2">
                      <h3 className="font-bold text-lg">Completed</h3>
                      <p className="text-gray-300">
                        {formatDate(assessment.assessment_completed_at || "Not Completed")}
                      </p>
                    </div>

                    <div className="mb-2">
                      <h3 className="font-bold text-lg">
                        Extra time breakdown
                      </h3>
                      <p className="text-gray-300">
                        No extra time was granted to this candidate
                      </p>
                    </div>

                    <div className="mb-2">
                      <h3 className="font-bold text-lg">Source</h3>
                      <p className="text-gray-300">General public link</p>
                    </div>

                    <p className="font-bold text-lg py-5"> Hiring stage </p>

                    <div className="mb-2">
                      <Select>
                        <SelectTrigger className="w-[220px]">
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
                          <SelectItem value="7"> References checked</SelectItem>
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
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <Card className="container ">
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <Badge variant="outline">
                            {candidate_test_response_report.applicant_name}
                          </Badge>
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold">
                            {(
                              candidate_test_response_report.assessment_average ||
                              0
                            ).toFixed(1)}
                            %
                          </h1>
                          <p className="text-sm text-gray-500">Average score</p>
                        </div>
                      </div>
                      <Progress
                        className="mt-4 h-3"
                        value={
                          candidate_test_response_report.assessment_average ||
                          0
                        }
                        max={100}
                      />
                      <p
                        className="py-2 text-blue-600 cursor-pointer"
                        onClick={() =>
                          globalState.openModal("interpret_results", true)
                        }
                      >
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
                            onClick={() =>
                              globalState.openModal(
                                "choose_scoring_method",
                                true
                              )
                            }
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
                      {candidate_test_response_report?.tests?.map(
                        (candidate_test: CandidateTestResponseReport, index: number) => {
                          return (
                            <Accordion key={index} type="single" collapsible>
                              <AccordionItem value={String(index)}>
                                <AccordionTrigger className="flex">
                                  <span className="whitespace-nowrap">
                                    {candidate_test.test_title}
                                  </span>
                                  <div className="flex justify-end items-center w-full space-x-1">
                                    <span>
                                      {" "}
                                      {(candidate_test.accuracy || 0).toFixed(1)}%
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <Progress
                                  className="my-4"
                                  value={candidate_test.accuracy || 0}
                                  max={100}
                                />
                                <AccordionContent>
                                  <div className="block md:flex md:justify-between items-center">
                                    <p className="flex gap-2 items-center">
                                      <AiOutlineBarChart />
                                      {candidate_test.test_level}
                                    </p>

                                    {candidate_test.finished_time === null ? (
                                      "Incomplete Test"
                                    ) : (
                                      <p className="flex gap-2 items-center">
                                        <RxTimer />
                                        Finished in{" "}
                                        {candidate_test.finished_time.split(".")[0]} out
                                        of :{" "}
                                        {candidate_test.total_duration < 60
                                          ? `${candidate_test.total_duration} seconds`
                                          : `${Math.floor(
                                            candidate_test.total_duration / 60
                                            )} min${
                                              candidate_test.total_duration % 60 > 0
                                                ? ` ${
                                                  candidate_test.total_duration % 60
                                                  } sec`
                                                : ""
                                            }`}{" "}
                                      </p>
                                    )}
                                  </div>

                                  <Card className="w-full max-w-2xl my-3">
                                    <CardContent>
                                      <ul className="space-y-6">
                                        <p className="text-sm">
                                          <div className="flex">
                                            {candidate_test.correct_count !== 0 && (
                                              <div
                                                className="bg-green-400   my-4  text-black font-bold text-center"
                                                style={{ width: "317px" }}
                                              >
                                                {candidate_test.correct_count || 0}
                                              </div>
                                            )}
                                            {candidate_test.incorrect_count !== 0 && (
                                              <div
                                                className="bg-red-300  my-4  text-black font-bold text-center"
                                                style={{ width: "317px" }}
                                              >
                                                {candidate_test.incorrect_count || 0}
                                              </div>
                                            )}

                                            {candidate_test.unanswered_questions !==
                                              0 && (
                                              <div
                                                className="bg-gray-300 my-4  text-black font-bold text-center"
                                                style={{ width: "317px" }}
                                              >
                                                {candidate_test?.unanswered_questions ||
                                                  0}
                                              </div>
                                            )}
                                          </div>
                                        </p>
                                      </ul>
                                      <div className="flex justify-start items-center mt-4 space-x-4 text-sm">
                                        <div className="flex items-center">
                                          <div className="w-3 h-3 bg-green-400 mr-2"></div>
                                          <span>Correct</span>
                                        </div>
                                        <div className="flex items-center">
                                          <div className="w-3 h-3 bg-red-300 mr-2"></div>
                                          <span>Incorrect</span>
                                        </div>
                                        <div className="flex items-center">
                                          <div className="w-3 h-3 bg-gray-300 mr-2"></div>
                                          <span>Not answered</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                    <hr />
                                    <CardFooter>
                                      <Button
                                        variant="link"
                                        className="text-pink-500 p-0"
                                        onClick={() =>
                                          globalState.openModal(
                                            "communication_skills_assessment",
                                            true
                                          )
                                        }
                                      >
                                        Learn more
                                      </Button>
                                    </CardFooter>
                                  </Card>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          );
                        }
                      )}
                    </CardHeader>
                  </Card>
                </div>
                <div className="col-span-1">
                  <Card className="w-full max-w-2xl mx-auto ">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-semibold">
                        Anti-cheating monitor
                      </CardTitle>
                      <Link
                        onClick={() =>
                          globalState.openModal("anti_cheating_measures", true)
                        }
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
                          <span className="text-sm font-bold">Desktop</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaMapPin className="h-4 w-4" />
                            <span className="text-sm">Location</span>
                          </div>
                          <span className="text-sm font-bold">
                            Lahore (PB), PK
                          </span>
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
                            className={`${
                              assessment.filled_out_only_once_from_ip_address ===
                              0
                                ? "bg-red-100 text-red-700 hover:bg-red-100"
                                : "bg-green-100 text-green-700 hover:bg-green-100"
                            } cursor-pointer`}
                            onClick={() =>
                              globalState.openModal(
                                "anti_cheating_measures",
                                true
                              )
                            }
                          >
                            {assessment.filled_out_only_once_from_ip_address ===
                            0
                              ? "No"
                              : "Yes"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaVideo className="h-4 w-4" />
                            <span className="text-sm">Webcam enabled?</span>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`${
                              assessment.web_cam_enabled === 0
                                ? "bg-red-100 text-red-700 hover:bg-red-100"
                                : "bg-green-100 text-green-700 hover:bg-green-100"
                            } cursor-pointer`}
                            onClick={() =>
                              globalState.openModal(
                                "anti_cheating_measures",
                                true
                              )
                            }
                          >
                            {assessment.web_cam_enabled === 0 ? "No" : "Yes"}
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
                            className={`${
                              assessment.full_screen_mode_always_active === 0
                                ? "bg-red-100 text-red-700 hover:bg-red-100"
                                : "bg-green-100 text-green-700 hover:bg-green-100"
                            } cursor-pointer`}
                            onClick={() =>
                              globalState.openModal(
                                "anti_cheating_measures",
                                true
                              )
                            }
                          >
                            {assessment.full_screen_mode_always_active === 0
                              ? "No"
                              : "Yes"}
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
                            className={`${
                              assessment.mouse_always_in_assessment_window ===
                              0
                                ? "bg-red-100 text-red-700 hover:bg-red-100"
                                : "bg-green-100 text-green-700 hover:bg-green-100"
                            } cursor-pointer`}
                            onClick={() =>
                              globalState.openModal(
                                "anti_cheating_measures",
                                true
                              )
                            }
                          >
                            {assessment.mouse_always_in_assessment_window === 0
                              ? "No"
                              : "Yes"}
                          </Badge>
                        </div>
                      </div>
                          <>
                          {webcam_snapshot.length > 0 ? (
                            <div className="mt-6 aspect-video w-full rounded-lg bg-muted">
                              <div className="flex h-full items-center justify-center">
                                {webcam_snapshot[sliderValue]?.file_url ? (
                                  <img
                                    src={webcam_snapshot[sliderValue].file_url}
                                    alt="Snapshot"
                                    className="h-[230px] w-[410px] rounded-lg"
                                  />
                                ) : (
                                  <FaLock className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-6 aspect-video w-full rounded-lg bg-muted flex h-full items-center justify-center">
                              <FaLock className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <Slider
                            defaultValue={[0]}
                            max={webcam_snapshot.length - 1}
                            step={1}
                            value={[sliderValue]}
                            onValueChange={(value) => handleSliderChange(value[0])}
                          />
                        </>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="container mx-auto py-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custom questions</CardTitle>
                </CardHeader>
                <hr />
                <Table className="mx-2">
                  <TableHeader>
                    <TableRow className="whitespace-nowrap">
                      <TableHead className="font-bold">Question</TableHead>
                      <TableHead className="font-bold">View Answer</TableHead>
                      <TableHead className="font-bold">
                        Average Rating
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {assessment?.questions?.map(
                      (question: AssessmentCustomQuestion, index: number) => (
                        <TableRow key={index}>
                          {/* Question Column */}

                          <TableCell className="p-4 flex items-center">
                            <div
                              className="p-4 flex items-center"
                              dangerouslySetInnerHTML={{
                                __html: question?.question || "N/A",
                              }}
                            ></div>
                          </TableCell>

                          {/* View Answer Column */}
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() =>
                                globalState.openModal("review_answer", true)
                              }
                            >
                              <Eye className="w-4 h-4" />
                              Read
                            </Button>
                          </TableCell>

                          {/* Rating Column */}
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    // i < question?.rating
                                    i < 3
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
                <hr className="mt-10" />
                <div className="flex flex-col lg:flex-row mt-6 justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                  <CardHeader className="flex-1">
                    <CardTitle>Your rating</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Give your personal overall rating of this candidate based
                      on your impressions and interactions with him or her.
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                
                    {renderStars(
                  currentRating,
                  (rating: number) => handleRatingUpdate(assessment.candidate_id, rating)
                )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Add your private notes here (auto-saved)..."
                        className="min-h-[100px] w-full lg:w-[30rem] resize-none"
                      />
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* card end heree */}
            </div>
          </div>
        );
      })}

      {/* Modals */}

      {/*interpret results Modal */}
      <Dialog
        open={globalState.modals.interpret_results.open}
        onOpenChange={(open) =>
          globalState.openModal("interpret_results", open)
        }
      >
        <DialogContent className="sm:max-w-[725px] h-screen overflow-x-hidden mt-2">
          <DialogHeader>
            <DialogTitle>How to interpret results</DialogTitle>
            <DialogDescription>
              <p className="py-5">
                Scrutin offers two main scoring methods to help you interpret
                the performance of your candidates: Percentage correct and
                Percentile scoring.
              </p>

              <Tabs defaultValue="percentile_answer" className="">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="percentile_answer">
                    Percentage correct answers
                  </TabsTrigger>
                  <TabsTrigger value="percentile_score">
                    Percentile score
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="percentile_answer">
                  <Card>
                    <CardHeader>
                      <CardTitle className="leading-5">
                        <div>
                          {" "}
                          A measure of how well a candidate performed on a test,
                          calculated by taking the number of points scored and
                          dividing it by the total number of points available on
                          the test, then multiplying by 100 to express the
                          result as a percentage. For example, if a candidate
                          answered 5 questions correctly out of 10 questions on
                          a test where each question was worth 1 point, then
                          they scored 5/10 points, and their percentage correct
                          would be 50% because 5/10 x 100 = 50%.
                        </div>
                        <p>
                          Percentage correct is a simple way to understand a
                          person's performance on a test, but it does not take
                          into account the difficulty of the test.
                        </p>
                      </CardTitle>
                      <CardDescription>
                        <hr className="my-3" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p>Average score</p>
                          <p>
                            Represents the mathematical average of the
                            candidate's percentage correct score across
                            individual tests in the assessment, rounded to the
                            nearest whole number. The results of any personality
                            tests are excluded from this average because we do
                            not recommend that these tests be included in
                            ranking candidates to make a hiring decision.
                          </p>
                          <p>
                            In this example the average score of 80% is
                            calculated by averaging the results of four out of
                            five tests in an assessment (excluding the 16 types
                            personality test).
                          </p>
                        </div>
                        <div className="col-span-2">
                          <div className="bg-white text-black rounded-md shadow-md px-4 py-3">
                            <div className="flex justify-between items-center mb-2">
                              <h2 className="text-lg font-bold">
                                Average score
                              </h2>

                              <span className="text-2xl font-bold text-blue-500">
                                80%
                              </span>
                            </div>

                            <div className="grid grid-cols-none gap-4">
                              <div className="flex justify-between bg-gray-100 rounded-md p-3">
                                <p className="font-medium">Critical thinking</p>

                                <span className="text-gray-600">91%</span>
                              </div>

                              <div className="flex justify-between bg-gray-100 rounded-md p-3">
                                <p className="font-medium">
                                  Exploratory data analysis
                                </p>

                                <span className="text-gray-600">53%</span>
                              </div>

                              <div className="flex justify-between bg-gray-100 rounded-md p-3">
                                <p className="font-medium">Verbal reasoning</p>

                                <span className="text-gray-600">93%</span>
                              </div>

                              <div className="flex justify-between bg-gray-100 rounded-md p-3">
                                <p className="font-medium">Culture add</p>

                                <span className="text-gray-600">82%</span>
                              </div>
                            </div>

                            <div className="mt-4 ">
                              <h3 className="font-medium py-2">Personality</h3>

                              <div className="flex justify-between bg-gray-100 rounded-md p-3">
                                <p className="font-medium">16 types</p>

                                <span className="text-gray-600">
                                  <Badge
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-800"
                                  >
                                    eStj
                                  </Badge>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="percentile_score">
                  <Card>
                    <CardHeader>
                      <p className="leading-6">
                        Percentile scoring allows you to easily compare your
                        candidate's performance relative to other candidates by
                        choosing a comparison group. For example, if a
                        candidate’s score is in the 87th percentile, this means
                        that 87% of candidates in the comparison group have
                        scored lower than the candidate. Percentile scoring is
                        helpful for comparing how a candidate performs relative
                        to other candidates in a given comparison group.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-xl">Comparison groups</p>
                      <p className="leading-6">
                        When you select the percentile scoring method, the
                        default comparison group that your candidate is compared
                        to is All candidates who have taken this test (across
                        all jobs, levels and organizations in our database). We
                        also offer a variety of more specific comparison groups
                        that can make the comparison more nuanced, allowing you
                        to compare candidates in our database based on highest
                        educational attainment, business function, or level of
                        seniority.
                      </p>
                      <Card className="flex justify-between items-center">
                        <img
                          className="h-[210px]"
                          src="https://app.testgorilla.com/assets/others/percentile-bell-curve-rebrand.png"
                          alt="test image"
                        />
                        {/* <p>Candidate name scored as well or better than, 68% of candidates in comparison group: All candidates.</p> */}
                      </Card>

                      <p className="leading-6">
                        Please note that Coding tests and Culture add tests are
                        always scored using the Percentage of correct answers
                        scoring method, even if you select Percentile scoring.
                        In other words, the scores on these tests are never
                        relative to other candidates.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* anti cheating measures Modal */}
      <Dialog
        open={globalState.modals.anti_cheating_measures.open}
        onOpenChange={(open) =>
          globalState.openModal("anti_cheating_measures", open)
        }
      >
        <DialogContent className="sm:max-w-[755px] px-10">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Anti-cheating measures
            </DialogTitle>
          </DialogHeader>
          <hr />
          <p className="font-bold"> Device and location</p>
          <p>
            We register the candidate’s type of device used for the assessment,
            as well as the geographic location, based on their IP address.
          </p>

          <p className="font-bold"> Filled out only once from IP address</p>
          <p>
            Using the IP address, we check if candidates fill out the assessment
            only once (with a public link to the assessment, candidates could
            use multiple email addresses to take repeated attempts at the
            assessment).
          </p>

          <p className="font-bold"> Webcam/front camera enabled</p>
          <p>
            When candidates start their assessment, we ask them to activate
            their webcam/camera. This allows us to capture images of your
            candidates every 30 seconds. This way you can see if the same (and
            only one) person has worked on the assessment.
          </p>

          <p className="font-bold"> Full-screen mode always active</p>
          <p>
            For candidates that use a desktop or laptop, we also activate
            full-screen mode to ensure candidates don’t browse the internet to
            look up answers. While we cannot prevent that candidates deactivate
            full-screen mode, we can detect if they did. It indicates a
            potential violation.
          </p>

          <p className="font-bold"> Mouse always in assessment window</p>
          <p>
            We can detect if the mouse has always been on the test window.
            Candidates that have two screens could otherwise still have another
            window open to browse the internet.
          </p>
        </DialogContent>
      </Dialog>
      {/* choose_scoring_method Modal */}
      <Dialog
        open={globalState.modals.choose_scoring_method.open}
        onOpenChange={(open) =>
          globalState.openModal("choose_scoring_method", open)
        }
      >
        <DialogContent className="sm:max-w-[900px] px-4 sm:px-10 overflow-x-hidden h-screen">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Choose a scoring method
            </DialogTitle>
          </DialogHeader>
          <hr />
          <RadioGroup defaultValue="percentage" className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="r1" />
              <Label htmlFor="r1">Percentage of correct answers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentile" id="r2" />
              <Label htmlFor="r2">Percentile</Label>
            </div>
          </RadioGroup>

          <p className="py-2 leading-7 text-sm sm:text-base">
            The percentile scoring method allows you to compare the candidate
            against others in the TestGorilla database who have taken this test
            and are in the chosen comparison group.
          </p>

          <p className="font-bold text-sm sm:text-base">
            Choose a comparison group
          </p>

          <p className="text-sm sm:text-base">
            A comparison group only becomes available for a given test once we
            have sufficient data, i.e., sufficient candidates in our database
            who have taken the test and are in the chosen comparison group.
          </p>

          <p className="font-bold text-sm sm:text-base">All candidates</p>
          <div className="flex justify-between rounded-lg border cursor-pointer p-3 w-full sm:w-56">
            <RadioGroup defaultValue="">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="candidates" id="p1" />
                <Label htmlFor="p1">All candidates</Label>
              </div>
            </RadioGroup>
          </div>

          <hr />

          <p className="font-bold text-sm sm:text-base">Education level</p>
          <p className="text-sm sm:text-base">
            Compare with candidates with a certain level of educational
            attainment.
          </p>

          <RadioGroup
            defaultValue=""
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
              <RadioGroupItem value="bachelor_degree" id="p2" />
              <Label htmlFor="p2">Bachelor's Degree</Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
              <RadioGroupItem value="master_degree" id="p3" />
              <Label htmlFor="p3">Master's Degree or Higher</Label>
            </div>
          </RadioGroup>

          <hr />

          <p className="font-bold text-sm sm:text-base">Business function</p>
          <p className="text-sm sm:text-base">
            Compare with candidates who are in a certain business function.
          </p>

          <RadioGroup
            defaultValue=""
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="administrative" id="s1" />
                <label htmlFor="s1">Administrative</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="copywriting_editing" id="s2" />
                <label htmlFor="s2">Copywriting/Editing</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="it_support" id="s3" />
                <label htmlFor="s3">Customer/IT Support</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="marketing" id="s10" />
                <label htmlFor="s10">Marketing</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="operations" id="s11" />
                <label htmlFor="s11">Operations</label>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="design" id="s4" />
                <label htmlFor="s4">Design</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="engineering" id="s5" />
                <label htmlFor="s5">Engineering</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="finance" id="s6" />
                <label htmlFor="s6">Finance/Accounting</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="qa" id="s12" />
                <label htmlFor="s12">Quality Assurance</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="research_development" id="s13" />
                <label htmlFor="s13">Research & Development</label>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="hr" id="s7" />
                <label htmlFor="s7">Human Resources</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="legal" id="s8" />
                <label htmlFor="s8">Legal</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="management" id="s9" />
                <label htmlFor="s9">Management</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="account_management" id="s14" />
                <label htmlFor="s14">Sales/Account Management</label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
                <RadioGroupItem value="software_development" id="s15" />
                <label htmlFor="s15">Software Development</label>
              </div>
            </div>
          </RadioGroup>

          <hr />

          <p className="font-bold text-sm sm:text-base">Seniority</p>
          <p className="text-sm sm:text-base">
            Compare with candidates with certain number of years of work
            experience.
          </p>

          <RadioGroup
            defaultValue=""
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
              <RadioGroupItem value="junior" id="p4" />
              <Label htmlFor="p4">Junior (up to 3 years of experience)</Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border cursor-pointer p-3">
              <RadioGroupItem value="senior" id="p5" />
              <Label htmlFor="p5">Senior (4 or more years of experience)</Label>
            </div>
          </RadioGroup>
        </DialogContent>
      </Dialog>

      {/* Communication Skills Assessment Modal */}
      <Dialog
        open={globalState.modals.communication_skills_assessment.open}
        onOpenChange={(open) =>
          globalState.openModal("communication_skills_assessment", open)
        }
      >
        <DialogContent className="sm:max-w-[1755px] max-h-svh  overflow-x-hidden px-10">
          <div className="sm:max-w-[1755px] mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex flex-col">
                <Button variant="outline" className="w-max rounded-lg mb-5 p-3">
                  Preview Sample Questions
                </Button>{" "}
                Problem Solving
              </CardTitle>
              <p>
                This Problem Solving test evaluates candidates' ability to
                define problems and analyze data <br /> and textual information
                to make correct decisions. This test helps you identify
                candidates <br />
                who use analytical skills to evaluate and respond to complex
                situations.
              </p>
            </CardHeader>
            <CardContent>
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-around">
                    <div className="flex items-center space-x-4 mb-4">
                      <VscTypeHierarchySuper className="text-2xl text-gray-600" />
                      <div>
                        <h3 className="font-semibold">Type</h3>
                        <p>Cognitive ability</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <FaClock className="text-2xl text-gray-600" />
                      <div>
                        <h3 className="font-semibold">Time</h3>
                        <p>9 mins</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                      <FaLanguage className="text-2xl text-gray-600" />
                      <div>
                        <h3 className="font-semibold">Language</h3>
                        <p>
                          English
                          {/* , German, Danish, Dutch, French, Italian, Japanese, Norwegian, Polish, Portuguese (Brazil), Spanish, Swedish */}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                      <FaChartLine className="text-2xl text-gray-600" />
                      <div>
                        <h3 className="font-semibold">Level</h3>
                        <p>Intermediate</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Covered skills</h3>
                    <ul className="space-y-1">
                      <li className="flex items-center">
                        <MdCheckCircle className="mr-2 text-green-500" />{" "}
                        Creating and adjusting schedules
                      </li>
                      <li className="flex items-center">
                        <MdCheckCircle className="mr-2 text-green-500" />{" "}
                        Interpreting data and applying logic to make decisions
                      </li>
                      <li className="flex items-center">
                        <MdCheckCircle className="mr-2 text-green-500" />{" "}
                        Prioritizing and applying order based on a given set of
                        rules
                      </li>
                      <li className="flex items-center">
                        <MdCheckCircle className="mr-2 text-green-500" />{" "}
                        Analyzing textual and numerical information to draw
                        conclusions
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      This test is relevant for
                    </h3>
                    <p>
                      Any role that involves managing constantly shifting
                      variables with tight deadlines. This may include
                      administrative assistants, project managers, planners, and
                      people working in hospitality or sales.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="mb-4">
                    Effective problem-solving requires a broad skill set that
                    enables individuals, teams, and businesses to advance
                    towards stated objectives. It involves the ability to define
                    a problem, to break it down into manageable parts, to
                    develop approaches to solve the (sub)problem using
                    creativity and analytical thinking, and to execute
                    flawlessly.
                  </p>
                  <p className="mb-4">
                    scenarios and asks them to make the best decision to solve
                    each situation in the most efficient and productive way.
                  </p>
                  <p>
                    The test requires candidates to identify the right answers
                    to the questions in a limited amount of time. Successful
                    candidates can quickly identify the key elements of the
                    problem and work through the problem at speed without making
                    mistakes. This is a great test to include to check
                    candidates' overall analytical skills.
                  </p>

                  <div className="">
                    <p>About the subject-matter expert</p>
                    <div className="flex items-center mt-6 space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt="Laurens H." />
                        <AvatarFallback>LH</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">Laurens H.</h4>
                        <p className="">
                          Laurens has significant professional experience in the
                          private sector as well as politics and has over 19
                          years of experience as a trainer. He has trained on
                          time management strategies for countless groups and
                          individuals from various backgrounds, countries,
                          sectors and roles. He also likes experimenting and
                          implementing novel time management concepts in his
                          daily work. Laurens currently lives, works and
                          volunteers in Brussels and enjoys socializing with
                          family and friends when he's not working.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </DialogContent>
      </Dialog>

      {/* Communication Skills Assessment Modal */}
      <Dialog
        open={globalState.modals.review_answer.open}
        onOpenChange={(open) => globalState.openModal("review_answer", open)}
      >
        <DialogContent className="max-h-svh sm:max-w-[1255px] overflow-x-hidden px-10">
          <p className="text-xl">Review answer</p>
          <hr />
          <div className="container mx-auto p-4">
            <div className="sm:max-w-[1255px]  max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="font-semibold">
                      Tell us about yourself, what attracts you to this
                      opportunity, and why you are a great candidate for this
                      role.
                    </p>
                    <p className="text-sm text-gray-500 italic">
                      Pro tip: it might be helpful to pretend you are writing
                      this to a new friend and just be yourself. We want to get
                      to know you better.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Enter your answer here"
                      className="h-32"
                      defaultValue="I am a good boy"
                    />
                    <div className="flex items-center py-5 justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <MdTimer className="mr-1" />
                        <span>Finished in 00:00:47 out of 00:05:00</span>
                      </div>
                    </div>
                    <div className="flex items-center text-[20px] gap-1">
                      Rate answer:
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`ml-1 ${
                            i < 3 ? "text-yellow-400" : "text-gray-300"
                          } text-[20px]`}
                        />
                      ))}
                    </div>
                    <Textarea placeholder="Comment" className="h-24" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    What to look for in the answer?
                  </h3>
                  <p className="text-sm">
                    In the candidate's answer, look for agreement between their
                    stated motivation and the challenges and opportunities that
                    the role you are seeking to fill provides. Is the candidate
                    motivated in ways that reflect what your organization can
                    offer and the effort needed to get the results you require
                    in this role?
                  </p>
                  <p className="text-sm mt-2">
                    Look for a clear understanding of the requirements and
                    expectations listed in your job post. A strong candidate
                    should
                  </p>
                </div>
              </CardContent>

              <DialogFooter className="">
                <DialogClose asChild>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                    <Button> Confirm</Button>
                  </div>
                </DialogClose>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

       {/* Send invite to candidate Modal */}
       <Dialog
         open={globalState.modals.candidate_send_invite.open}
         onOpenChange={(open) => {
           globalState.openModal("candidate_send_invite", open);
           if (open) {
             setSelectedAssessment(null); 
           }
         }}
      >
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invitation</DialogTitle>
            <hr />
            <DialogDescription>
              Select any Assessment and click on invite button, send it to the
              candidate.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendInvite}>

            <div className="grid gap-4 py-4">
              
              <div className="flex justify-between items-center gap-4">
               
                <Select
                    onValueChange={(value) => setSelectedAssessment(value)}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {assessment_list_query.map((assessment:JobApplicantSelectAssessment) => (
                        <SelectItem 
                        key={assessment.name}
                          value={assessment.name}
                        >
                          {assessment.assessment_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
               
                <Button type="submit">
                Send Invite
              </Button>
              </div>
            </div>

            
          </form>
          
        </DialogContent>

      </Dialog>

    </div>
  );
};

export default CandidatesDetailPage;
