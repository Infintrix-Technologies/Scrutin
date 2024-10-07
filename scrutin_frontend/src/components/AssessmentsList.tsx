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
import { AssessmentActions } from "./AssessmentActions";
  
  export function AssessmentsList() {

    const assessments_query = useAssessmentsListQuery()
    

    const assessments = assessments_query?.data || []
    return (
      <Table>
        <TableCaption>A list of your job postings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">Company</TableHead>
            <TableHead className="font-bold">Language</TableHead>
            <TableHead className="font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((assessment) => (
            <TableRow key={assessment.name}>
              <TableCell className="font-medium">{assessment.assessment_name}</TableCell>
              <TableCell>{assessment.company}</TableCell>
              <TableCell>{assessment.language}</TableCell>
              <TableCell><AssessmentActions /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  