import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";

const JobApplicants = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const assessments_query = useFrappeGetDocList("Scrutin Assessment", {
    fields: ["*"],
    orderBy: {
      field: "creation",
      order: "desc",
    },
    asDict: true,
  });

  const job_applicants = job_applicants_query?.data || [];
  const assessments = assessments_query?.data || [];

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
  const onSubmit = (data: { assessment: string; job_applicant: string }) => {
    send_invite.call(data).then(()=>{
        setIsDialogOpen(false); // Close the dialog after form submission
        reset(); // Reset the form fields
    })
  };

  return (
    <div className="px-32">
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
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {job_applicants.map((applicant) => (
            <TableRow key={applicant.name}>
              <TableCell>{applicant.applicant_name}</TableCell>
              <TableCell>{applicant.applicant_rating}</TableCell>
              <TableCell>{applicant.job_title}</TableCell>
              <TableCell>{applicant.status}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              Total applicants: {job_applicants.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default JobApplicants;
