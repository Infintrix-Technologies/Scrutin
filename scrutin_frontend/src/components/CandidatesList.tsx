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
  
  // const candidates = [
  //   {
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //     assessments: 5,
  //     lastActivity: "2024-10-01",
  //   },
  //   {
  //     name: "Jane Smith",
  //     email: "jane.smith@example.com",
  //     assessments: 3,
  //     lastActivity: "2024-09-30",
  //   },
  //   {
  //     name: "Alice Johnson",
  //     email: "alice.johnson@example.com",
  //     assessments: 8,
  //     lastActivity: "2024-09-28",
  //   },
  //   // Add more data as needed
  // ]
  
  export function CandidatesList() {

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
          {candidates.map((candidate) => (
            <TableRow key={candidate.email}>
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>{candidate.job_applicant}</TableCell>
              <TableCell>{candidate.assessment}</TableCell>
              <TableCell>{candidate.user}</TableCell>
              <TableCell>{candidate.status}</TableCell>
              <TableCell>{candidate.lastActivity}</TableCell>
            </TableRow>
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
  