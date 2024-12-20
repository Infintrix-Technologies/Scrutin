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
import { AssessmentsListProps, CandidateListDetail } from "../types/Interface";
import dayjs from "dayjs";

export const CandidatesList: React.FC<AssessmentsListProps> = ({ search }) => {
  const navigate = useNavigate();

  const { data: candidatesQuery, isLoading: candidatesLoading } =
    useFrappeGetCall(
      "scrutin.api.assessment_data.candidate_list_api"
    );
  const candidatesQueryData = candidatesQuery?.message || [];

  const { data: jobApplicants, isLoading: jobApplicantsLoading } =
    useFrappeGetDocList("Job Applicant", {
      fields: ["email_id", "applicant_name"],
      orderBy: {
        field: "creation",
        order: "desc",
      },
      asDict: true,
    });

  const applicantMap = (jobApplicants || []).reduce((map, applicant) => {
    map[applicant.email_id] = applicant.applicant_name;
    return map;
  }, {});

  const handleNavigate = (candidateEmail: string) => {
    navigate(`/candidates/${candidateEmail}`);
  };

  const formatDate = (dateString: string) =>
    dayjs(dateString).format("DD-MM-YY hh:mm A");

  const filteredCandidates = candidatesQueryData.filter((candidate:CandidateListDetail) =>
    `${candidate.assessment_name} ${candidate.job_applicant}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (candidatesLoading || jobApplicantsLoading) {
    return <div>Loading candidates...</div>;
  }

  return (
    <Table>
      <TableCaption>A list of your candidates.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Assessments</TableHead>
          <TableHead>Invited On</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate: CandidateListDetail, index: number) => (
            <TableRow key={index}>
              <TableCell
                className="cursor-pointer"
                onClick={() => handleNavigate(candidate.job_applicant)}
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
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No candidates found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>
            Total candidates: {candidatesQueryData.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
