import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { AssessmentActions } from "../components/AssessmentActions";
import { Link } from "react-router-dom";
import { useFrappeGetCall } from "frappe-react-sdk";
import NotFound from "./NotFound";
import { AssessmentList } from "@/types/Interface";
  
    const AssessmentsList = () => {
      const {data,isLoading,error} = useFrappeGetCall("scrutin.api.assessment_data.assessment_list_page_api")
    
    const assessments = data?.message || []
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <NotFound/>;

    return (
      <Table>
        <TableCaption>A list of your job postings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold text-center">Candidate</TableHead>           
            <TableHead className="font-bold">Company</TableHead>
            <TableHead className="font-bold">Language</TableHead>
            <TableHead className="font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments?.map((assessment:AssessmentList) => (
            <>
            <TableRow key={assessment?.assessment_name}>
            <Link 
            to={`/assessments/${assessment?.name}`}
            >
              <TableCell className="font-medium">{assessment?.assessment_name}</TableCell>
            </Link>
            <TableCell className="text-center">{assessment?.candidate_count}</TableCell>
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
  export default AssessmentsList;
  