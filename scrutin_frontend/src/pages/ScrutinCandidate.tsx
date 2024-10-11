import { CandidateStatus } from "@/components/CandidateStatus";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useFrappeGetDoc } from "frappe-react-sdk";


const SpecificCandidateDetail = () => {
    const specificCandidate = useFrappeGetDoc("Scrutin Candidate", "j8kvgfi36d");
    const candidate = specificCandidate?.data || []
    console.log(candidate)

    return (
        <Table>
          <TableCaption>A list of your candidates.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Assessments</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              <TableRow key={candidate.email}>
                <TableCell className="font-medium">{candidate.name}</TableCell>
                <TableCell>{candidate.job_applicant}</TableCell>
                <TableCell>{candidate.assessment}</TableCell>
                <TableCell>{candidate.user}</TableCell>
                <TableCell><CandidateStatus /></TableCell>
                <TableCell>{candidate.lastActivity}</TableCell>
              </TableRow>
          </TableBody>
        </Table>
      )
    }
  
  export default SpecificCandidateDetail