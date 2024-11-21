import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useFrappeGetCall, useFrappeGetDocList } from "frappe-react-sdk";
import { CandidateActions } from "./CandidateActions";
// import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { CandidateList } from "./Interfaces/Interface";

  export const CandidatesList = () => {
 
    const candidates_query = useFrappeGetCall("scrutin.api.assessment_data.get_applicant_name_assessment_name_for_candidate")
    const candidates = candidates_query?.data?.message || []
    console.log(candidates, "get_candidate_details");

    const applicant_query =  useFrappeGetDocList(
      'Job Applicant',
      {
        fields: ['email_id', 'applicant_name'],
        orderBy: {
          field: 'creation',
          order: 'desc',
        },
        asDict: true,
      },
    );

const navigate = useNavigate()

const handleNavigate = (candidateEmail: string) => {
  
  console.log('Navigate to candidate details page');
  navigate(`/candidates/${candidateEmail}`)

}

const applicants = applicant_query?.data || []
const applicantMap = applicants.reduce((map, applicant) => {
  map[applicant.email_id] = applicant.applicant_name;
  return map;
}, {});

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
          {candidates.map((candidate:CandidateList) => (
        <>   
            <TableRow key={candidate.email}>
              <TableCell className="cursor-pointer" onClick={() => {handleNavigate(candidate.job_applicant)}}>{applicantMap[candidate.job_applicant] || 'N/A'}</TableCell>
              <TableCell>{candidate.job_applicant}</TableCell>
              <TableCell>{candidate?.Assessments}</TableCell>
              <TableCell>
              {candidate?.invited_on}
              {/* <div className="flex items-center gap-2">
                {candidate.status === 'Open' ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    Open
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                    Accepted
                  </Badge>
                )}
              </div> */}
            </TableCell>
              <TableCell><CandidateActions candidate={candidate}/></TableCell>
            </TableRow>
            </>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total candidates: {candidates.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
  