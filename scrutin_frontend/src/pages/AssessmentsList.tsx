/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
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
import { Link, useSearchParams } from "react-router-dom";
import { useFrappePostCall } from "frappe-react-sdk";
import { AssessmentListResponse } from "@/types/Interface";
import CreateAssessment from "@/components/CreateAssessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AssessmentsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(""); 
  const search = searchParams.get("assessment_name") || ""; 

  const assessment_list_page_api_query = useFrappePostCall<AssessmentListResponse>(
    "scrutin.api.assessment_data.assessment_list_page_api"
  );

  const assessmentsData = assessment_list_page_api_query.result;
  const assessmentsDataList = assessmentsData?.message || [];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchInput) {
        newParams.set("assessment_name", searchInput);
      } else {
        newParams.delete("assessment_name");
      }
      setSearchParams(newParams);
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, searchParams, setSearchParams]);

  useEffect(() => {
    assessment_list_page_api_query.call({
      assessment_name: search,
    });
  }, [search]);

  return (
    <div className="px-4 sm:px-8 lg:px-32 py-4 min-h-screen text-gray-800 ">
      <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Assessments</h1>
        <CreateAssessment />
      </div>

      <div className="my-3 flex flex-wrap gap-3 justify-between items-center">
        <Input
          placeholder="Search"
          className="w-full sm:w-48 bg-white border-none shadow-lg"
          value={searchInput} 
          onChange={(e) => setSearchInput(e.target.value)} 
        />
        <div className="flex gap-2">
          <Button className="text-white bg-teal-500 hover:bg-teal-600">
            Active
          </Button>
          <Button className="text-white bg-gray-500 hover:bg-gray-600">
            Inactive
          </Button>
        </div>
      </div>

      <div className="bg-white border-none shadow-lg rounded-lg">
        <Table>
          <TableCaption>A list of your job postings.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead style={{padding:"20px 10px"}} className="font-bold">Name</TableHead>
              <TableHead className="font-bold text-center">Candidate</TableHead>
              <TableHead className="font-bold">Company</TableHead>
              <TableHead className="font-bold">Language</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessmentsDataList.map((assessment, index: number) => (
              <TableRow key={index} className="">
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
    </div>
  );
};

export default AssessmentsList;
