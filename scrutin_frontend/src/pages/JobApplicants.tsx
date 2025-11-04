import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFrappeGetDocList, useFrappePostCall } from "frappe-react-sdk";
import { FaPaperPlane } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { JobApplicantActions } from "@/components/JobApplicantActions";
import { JobApplicant, JobApplication } from "@/types/Interface";
import { Card } from "@/components/ui/card";

const JobApplicants = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStar = (index: number) => (
      <FaStar key={`full-${index}`} className="text-yellow-500 text-xl" />
    );
    const halfStar = (index: number) => (
      <FaStarHalfAlt key={`half-${index}`} className="text-yellow-500 text-xl" />
    );
    const emptyStar = (index: number) => (
      <FaRegStar key={`empty-${index}`} className="text-yellow-500 text-xl" />
    );
  
    const convertedRating = Math.round(rating * 10);
    const fullStarsCount = Math.floor(convertedRating / 2);
    const halfStarCount = convertedRating % 2;
    const emptyStarsCount = 5 - (fullStarsCount + halfStarCount);
  
    for (let i = 0; i < fullStarsCount; i++) stars.push(fullStar(i));
    if (halfStarCount === 1) stars.push(halfStar(fullStarsCount));
    for (let i = 0; i < emptyStarsCount; i++) stars.push(emptyStar(fullStarsCount + 1 + i));
  
    return stars;
  };
  

  const send_invite = useFrappePostCall(
    "scrutin.api.candidate.create_candidate"
  );

  const job_applicants_query = useFrappeGetDocList("Job Applicant", {
    fields: ["*"],
    orderBy: { field: "creation", order: "desc" },
    asDict: true,
  });

  const job_applicants = job_applicants_query?.data || [];

  const assessments_query = useFrappeGetDocList("Scrutin Assessment", {
    fields: ["*"],
    orderBy: { field: "creation", order: "desc" },
    asDict: true,
  });

  const assessments = assessments_query?.data || [];

  const job_opening_query = useFrappeGetDocList("Job Opening", {
    fields: ["name", "job_title"],
    orderBy: { field: "creation", order: "desc" },
    asDict: true,
  });

  const job_opening = job_opening_query?.data || [];
  const job_openingMap = job_opening.reduce((map, jobopening) => {
    map[jobopening.name] = jobopening.job_title;
    return map;
  }, {});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      assessment: "",
      job_applicant: "",
    },
  });

  const onSubmit = (data: JobApplication) => {
    send_invite.call(data).then(() => {
      setIsDialogOpen(false);
      reset();
    });
  };

  return (
    <div className="px-4 sm:px-8 lg:px-32 py-4 min-h-screen text-gray-800 ">
      {/* Invite Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invite</DialogTitle>
            <DialogDescription>
              Enter the details for the invite below and send it to the
              candidate.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="job_applicant">Job Applicant</Label>
                <Input
                  disabled
                  id="job_applicant"
                  placeholder="Job Applicant's name"
                  className="col-span-4"
                  {...register("job_applicant", { required: true })}
                />
                {errors.job_applicant && (
                  <span className="col-span-4 text-red-600 text-sm">
                    Job Applicant is required.
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assessment">Assessment</Label>
                <Select
                  onValueChange={(value) => setValue("assessment", value)}
                  {...register("assessment", { required: true })}
                >
                  <SelectTrigger className="w-max">
                    <SelectValue placeholder="Select Assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {assessments.map((assessment) => (
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
                {errors.assessment && (
                  <span className="col-span-4 text-red-600 text-sm">
                    Assessment is required.
                  </span>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {send_invite.loading ? "Inviting..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Job Applicants Table */}
      <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Job Applicants</h1>
      </div>

      <Card className="bg-white rounded-lg  my-6">
        <Table>
          {/* <TableCaption>A list of job applicants.</TableCaption> */}
          <TableHeader>
            <TableRow className="whitespace-nowrap tableeadclass">
              <TableHead className="p-[20px] text-black font-bold" >Applicant Name</TableHead>
              <TableHead className="text-black font-bold">Rating</TableHead>
              <TableHead className="text-black font-bold" >Job Title</TableHead>
              <TableHead className="text-black font-bold">Status</TableHead>
              <TableHead className="text-black font-bold">Send Invite</TableHead>
              <TableHead className="text-black font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {job_applicants?.map((applicant: JobApplicant, index: number) => (
              <TableRow key={index} className="whitespace-nowrap">
                <TableCell className="p-[20px]">{applicant.applicant_name}</TableCell>
                <TableCell className="flex py-6">
                  {renderStars(applicant.applicant_rating)}
                </TableCell>
                <TableCell>
                  {job_openingMap[applicant?.job_title] || "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                  
                    variant="secondary"
                    className={`${
                      applicant.status === "Open" ||
                      applicant.status === "Replied"
                        ? "bg-orange-100 hover:bg-orange-100 text-orange-700"
                        : applicant.status === "Rejected" ||
                          applicant.status === "Hold"
                        ? "bg-red-100 hover:bg-red-100 text-red-700"
                        : "bg-green-100 hover:bg-green-100 text-green-700"
                    }`}
                  >
                    {applicant.status}
                  </Badge>
                </TableCell>
                <TableCell >
                  <Button
                  className="bg-transparent border-none text-black hover:bg-transparent   shadow-none"
                    variant="ghost"
                    onClick={() => {
                      setValue("job_applicant", applicant.name);
                      setIsDialogOpen(true);
                    }}
                  >
                    <FaPaperPlane />

                  </Button>
                </TableCell>
                <TableCell>
                  <JobApplicantActions applicant={applicant} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="pl-[20px]" colSpan={5}>
                Total applicants: {job_applicants?.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </div>
  );
};

export default JobApplicants;
