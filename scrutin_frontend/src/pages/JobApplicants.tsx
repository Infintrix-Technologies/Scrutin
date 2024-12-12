import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
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

const JobApplicants = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const renderStars = (rating: number) => {
    let stars = [];
    const fullStar = <FaStar className="text-yellow-300"/>;
    const halfStar = <FaStarHalfAlt className="text-yellow-300"/>;
    const emptyStar = <FaRegStar className="text-yellow-300"/>;
  
    switch (rating) {
      case 1:
        stars = [fullStar, fullStar, fullStar, fullStar, fullStar];
        break;
      case 0.1:
        stars = [halfStar, emptyStar, emptyStar, emptyStar, emptyStar];
        break;
      case 0.2:
        stars = [fullStar, emptyStar, emptyStar, emptyStar, emptyStar];
        break;
      case 0.3:
        stars = [fullStar, halfStar, emptyStar, emptyStar, emptyStar];
        break;
      case 0.4:
        stars = [fullStar, fullStar, emptyStar, emptyStar, emptyStar];
        break;
      case 0.5:
        stars = [fullStar, fullStar, halfStar, emptyStar, emptyStar];
        break;
      case 0.6:
        stars = [fullStar, fullStar, fullStar, emptyStar, emptyStar];
        break;
      case 0.7:
        stars = [fullStar, fullStar, fullStar, halfStar, emptyStar];
        break;
      case 0.8:
        stars = [fullStar, fullStar, fullStar, fullStar, emptyStar];
        break;
      case 0.9:
        stars = [fullStar, fullStar, fullStar, fullStar, halfStar];
        break;
      default:
        stars = [emptyStar, emptyStar, emptyStar, emptyStar, emptyStar];
    }
  
    return stars;
  };
  
  const send_invite = useFrappePostCall(
    "scrutin.api.candidate.create_candidate"
  );
 
  const job_applicants_query = useFrappeGetDocList("Job Applicant", {
    fields: ["*"],
    orderBy: {
      field: "creation",
      order: "desc",
    },
    asDict: true,
  });
  const job_applicants = job_applicants_query?.data || [];
  console.log(job_applicants,"job_aacapplicantsjob_applicants");

  const assessments_query = useFrappeGetDocList("Scrutin Assessment", {
    fields: ["*"],
    orderBy: {
      field: "creation",
      order: "desc",
    },
    asDict: true,
  });
  const assessments = assessments_query?.data || [];
  // console.log(assessments_query, "assessments_query")

  const job_opening_query =  useFrappeGetDocList(
    'Job Opening',
    {
      fields: ['name', 'job_title'],
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
      asDict: true,
    },
  );
  const job_opening = job_opening_query?.data || []
  // console.log(job_opening_query, "job_opening_query")
  const job_openingMap = job_opening.reduce((map, jobopening) => {
    map[jobopening.name] = jobopening.job_title;
    return map;
  }, {});

  // React Hook Form setup
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

  // Function to handle form submission
  const onSubmit = (data:JobApplication ) => {
    send_invite.call(data).then(()=>{
        setIsDialogOpen(false); 
        reset(); 
    })
  };

  return (
    <div className="px-8 md:px-32">
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
              {/* Job Applicant Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="job_applicant">Job Applicant</Label>
                <br />
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

              {/* Assessment Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assessment">Assessment</Label>
                <br />

                <Select
                
                  onValueChange={(value) => {
                    setValue("assessment", value);
                  }}
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
                {send_invite.loading ? "Inviting.." : "Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Job Applicants Table */}
      <div className="flex justify-between mt-10">
        <h1 className="text-3xl font-bold">Job Applicants</h1>
      </div>

      <div className="my-3 flex justify-between"></div>

      <Table>
        <TableCaption>A list of job applicants.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Send Invite</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {job_applicants?.map((applicant:JobApplicant, index:number) => (            
            <TableRow key={index} >   {/*key={applicant.name}   */}
              <TableCell>{applicant.applicant_name}</TableCell>
              <TableCell className="flex py-6">{renderStars(applicant.applicant_rating)}</TableCell>
              <TableCell>{job_openingMap[applicant?.job_title] || 'N/A'}</TableCell>
              <TableCell>
              <div className="flex items-center gap-2">
                {/* <span className="w-16 text-sm text-muted-foreground">Status</span> */}
                {applicant?.status === 'Open' || applicant?.status === 'Replied' ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    {/* Open */}
                    {applicant.status === 'Open' ? "Open": "Replied"}
                  </Badge>
                ): applicant?.status === 'Rejected' || applicant?.status === 'Hold' ?(
                  <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
                    {applicant.status === 'Rejected' ? "Rejected": "Hold"}
                  </Badge>
                ): (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                    Accepted
                  </Badge>
                )}
              </div>
            </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setValue("job_applicant", applicant.name);
                    setIsDialogOpen(true);
                  }}
                >
                  <FaPaperPlane />
                </Button>
              </TableCell>
              <TableCell><JobApplicantActions applicant={applicant}/></TableCell>
            </TableRow>
            
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              Total applicants: {job_applicants?.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default JobApplicants;
