/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssessmentActions } from "../components/AssessmentActions";
import { Link, useSearchParams } from "react-router-dom";
import { useFrappePostCall } from "frappe-react-sdk";
import { AssessmentListResponse } from "@/types/Interface";
import CreateAssessment from "@/components/CreateAssessment";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AssessmentsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const search = searchParams.get("assessment_name") || "";

  const assessment_list_page_api_query =
    useFrappePostCall<AssessmentListResponse>(
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
          className="w-full sm:w-48 "
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {/* <div className="flex gap-2 ">
          <Button className="bg-slate-200 text-black hover:text-white hover:bg-gray-500">
            Active
          </Button>
          <Button className="text-white bg-gray-500 hover:bg-gray-600">
            Inactive
          </Button>
        </div> */}
      </div>

      <Card className="bg-white  rounded-lg">
        <Table>
          {/* <TableCaption>A list of your job postings.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead style={{ padding: "20px 20px" }} className="font-bold">
                Name
              </TableHead>
              <TableHead className="font-bold text-center">Candidate</TableHead>
              <TableHead className="font-bold">Company</TableHead>
              <TableHead className="font-bold">Language</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessmentsDataList.map((assessment, index: number) => (
              <TableRow key={index} className="">
                <TableCell
                  className="font-medium"
                  style={{ padding: "0 20px" }}
                >
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
          {/* <TableFooter>
            <TableRow>
              <TableCell   colSpan={5}>Total Assessment: {assessmentsDataList.length}</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
        <hr />
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 sm:gap-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground">
              Items per page
            </span>
            <Select defaultValue="10">
              <SelectTrigger className="w-[70px] sm:w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground w-full sm:w-auto">
              Total Assessments: {assessmentsDataList.length}
            </span>
            <span className="text-sm text-muted-foreground w-full sm:w-auto">
              1 - 1 of 1
            </span>

            <div className="block md:flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-start">
              <Button variant="outline" size="icon">
                <FaChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FaChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssessmentsList;
