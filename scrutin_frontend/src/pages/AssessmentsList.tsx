import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssessmentActions } from "../components/AssessmentActions";
import { Link } from "react-router-dom";
import { useFrappeGetCall } from "frappe-react-sdk";
import NotFound from "./NotFound";
import { AssessmentList, AssessmentsListProps } from "@/types/Interface";


const AssessmentsList: React.FC<AssessmentsListProps> = ({ search }) => {
  const { data, isLoading, error } = useFrappeGetCall(
    "scrutin.api.assessment_data.assessment_list_page_api"
  );

  const assessments: AssessmentList[] = data?.message || [];

  const filteredAssessments = assessments.filter((assessment) =>
    assessment.assessment_name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <NotFound />;

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
        {filteredAssessments.length > 0 ? (
          filteredAssessments.map((assessment, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <Link to={`/assessments/${assessment?.name}`}>
                  {assessment.assessment_name}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                {assessment.candidate_count || 0}
              </TableCell>
              <TableCell>{assessment.company}</TableCell>
              <TableCell>{assessment.language}</TableCell>
              <TableCell>
                <AssessmentActions assessment={assessment} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No assessments found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default AssessmentsList;
