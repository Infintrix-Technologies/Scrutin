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
import { useFrappeGetDocList } from "frappe-react-sdk";
import { CandidateActions } from "./CandidateActions";
import { Badge } from "./ui/badge";

  export const CandidatesList = () => {
    const candidates_query =  useFrappeGetDocList(
      'Scrutin Candidate',
      {
        fields: ['*'],
        orderBy: {
          field: 'creation',
          order: 'desc',
        },
        asDict: true,
      },
    );
const candidates = candidates_query?.data || []

const assessment_query =  useFrappeGetDocList(
  'Scrutin Assessment',
  {
    fields: ['name', 'assessment_name'],
    orderBy: {
      field: 'creation',
      order: 'desc',
    },
    asDict: true,
  },
);
const assessments = assessment_query?.data || []
const assessmentMap = assessments.reduce((map, assessment) => {
  map[assessment.name] = assessment.assessment_name;
  return map;
}, {});

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
            {/* <TableHead>User</TableHead> */}
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
        <>   
         {console.log(candidate,"candidate")}
            <TableRow key={candidate.email}>
              {/* <TableCell className="font-medium">{candidate.name}</TableCell> */}
              <TableCell>{applicantMap[candidate.job_applicant] || 'N/A'}</TableCell>
              <TableCell>{candidate.job_applicant}</TableCell>
              {/* <TableCell>{candidate.assessment}</TableCell> */}
              <TableCell>{assessmentMap[candidate.assessment] || 'N/A'}</TableCell>
              {/* <TableCell>{candidate.user}</TableCell> */}
              {/* <TableCell>{candidate.status}</TableCell> */}
              <TableCell>
              <div className="flex items-center gap-2">
                {/* <span className="w-16 text-sm text-muted-foreground">Status</span> */}
                {candidate.status === 'Open' ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    Open
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                    Accepted
                  </Badge>
                )}
              </div>
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
  