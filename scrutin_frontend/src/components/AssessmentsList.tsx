import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useAssessmentsListQuery } from "@/hooks/query-hooks";
import { BsThreeDotsVertical } from "react-icons/bs";
  
  export function AssessmentsList() {

    const assessments_query = useAssessmentsListQuery()
    

    const assessments = assessments_query?.data || []
    return (
      <Table>
        <TableCaption>A list of your job postings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-black">Name</TableHead>
            <TableHead className="font-bold text-black">Company</TableHead>
            <TableHead className="font-bold text-black">Language</TableHead>
            <TableHead className="font-bold text-black">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((assessment) => (
            <TableRow key={assessment.name}>
              <TableCell className="font-medium">{assessment.assessment_name}</TableCell>
              <TableCell>{assessment.company}</TableCell>
              <TableCell>{assessment.language}</TableCell>
              <TableCell><BsThreeDotsVertical /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  