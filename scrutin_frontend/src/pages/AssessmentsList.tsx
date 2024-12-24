/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
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
import { useFrappePostCall } from "frappe-react-sdk";
import { AssessmentListResponse } from "@/types/Interface";
import CreateAssessment from "@/components/CreateAssessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";

const AssessmentsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("assessment_name") || ""; 

  const assessment_list_page_api_query = useFrappePostCall<AssessmentListResponse>(
    "scrutin.api.assessment_data.assessment_list_page_api"
  );

  const assessmentsData = assessment_list_page_api_query.result;
  const assessmentsDataList = assessmentsData?.message || []; 

  console.log(assessment_list_page_api_query,"assessment_list_page_api_query");

  useEffect(() => {
    assessment_list_page_api_query.call({
      assessment_name: search, 
    });
  }, [search]);


  return (
    <div className="px-3 md:px-32">
      <div className="block md:flex space-y-4 md:space-y-0 md:justify-between mt-10">
        <h1 className="text-3xl font-bold">Assessments</h1>
        <CreateAssessment />
      </div>

      <div className="my-3">
        <div className="block md:flex space-y-4 md:space-y-0 md:justify-between md:items-center">
          <Input
            placeholder="Search"
            className="w-48"
            value={search} 
            onChange={(e) => {
              setSearchParams({ assessment_name: e.target.value });
            }}
          />
          <div className="flex gap-2">
            <Button>Active</Button>
            <Button>Inactive</Button>
          </div>
        </div>
      </div>

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
          {assessmentsDataList.map((assessment, index:number) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssessmentsList;
