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
import { AssessmentActions } from "../components/AssessmentActions";
import { Link } from "react-router-dom";
  
  export function AssessmentsList() {

    const assessments_query = useAssessmentsListQuery()
    
    const assessments = assessments_query?.data || []
    console.log(assessments,"assessments111");
    
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
            <>
            <TableRow key={assessment?.assessment_name}>
            <Link 
            to={`/assessments/${assessment?.name}`}
            >
              <TableCell className="font-medium">{assessment?.assessment_name}</TableCell>
            </Link>
              <TableCell>{assessment?.company}</TableCell>
              <TableCell>{assessment?.language}</TableCell>
              <TableCell><AssessmentActions assessment={assessment}/></TableCell>
            </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    )
  }
  