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
console.log(candidates,"assessment1111111111111");

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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
        <>   
         {console.log(candidate,"candidate")}
            <TableRow key={candidate.email}>
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>{candidate.job_applicant}</TableCell>
              <TableCell>{candidate.assessment}</TableCell>
              <TableCell>{candidate.user}</TableCell>
              <TableCell>{candidate.status}</TableCell>
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
  