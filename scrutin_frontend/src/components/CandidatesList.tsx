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
import { useFrappeGetCall, useFrappeGetDocList } from "frappe-react-sdk";
import { CandidateActions } from "./CandidateActions";
import { useNavigate } from "react-router-dom";
import { CandidateListDetail } from "../types/Interface";
import dayjs from "dayjs";

export const CandidatesList = () => {
  const navigate = useNavigate();

  const candidates_query = useFrappeGetCall(
    "scrutin.api.assessment_data.get_applicant_name_assessment_name_for_candidate"
  );
  const candidates_query_data = candidates_query?.data?.message || [];
  console.log(candidates_query_data, "get_candidate_details");

  const job_applicant_query = useFrappeGetDocList("Job Applicant", {
    fields: ["email_id", "applicant_name"],
    orderBy: {
      field: "creation",
      order: "desc",
    },
    asDict: true,
  });

  const applicants = job_applicant_query?.data || [];
  console.log(applicants, "applicants");

  const applicantMap = applicants.reduce((map, applicant) => {
    map[applicant.email_id] = applicant.applicant_name;
    return map;
  }, {});


  const handleNavigate = (candidateEmail: string) => {
    console.log("Navigate to candidate details page");
    navigate(`/candidates/${candidateEmail}`);
  };
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD-MM-YY hh:mm A");
  };

  return (
    <Table>
      <TableCaption>A list of your candidates.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Assessments</TableHead>
          <TableHead>invited_on</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates_query_data?.map((candidate: CandidateListDetail, index:number) => (          
            <TableRow key={index}>
              <TableCell
                className="cursor-pointer"
                onClick={() => {
                  handleNavigate(candidate.job_applicant);
                }}
              >
                {applicantMap[candidate.job_applicant] || "N/A"}
              </TableCell>
              <TableCell>{candidate.job_applicant}</TableCell>
              <TableCell>{candidate.Assessments}</TableCell>

              <TableCell>{formatDate(candidate.invited_on)}</TableCell>
              <TableCell>
                <CandidateActions candidate={candidate} />
              </TableCell>
            </TableRow>          
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>
            Total candidates: {candidates_query_data.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
