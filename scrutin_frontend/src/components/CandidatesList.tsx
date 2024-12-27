/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useFrappeGetCall,
  useFrappeGetDocList,
  useFrappePostCall,
} from "frappe-react-sdk";
import { CandidateActions } from "./CandidateActions";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CandidateDetailPageTestFilter,
  CandidateListResponse,
  JobApplicantSelectAssessment,
} from "../types/Interface";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { buttonClassName } from "./common/ButtonStyle";
// Other imports remain unchanged

export const CandidatesList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");

  const { data: jobApplicants, isLoading: jobApplicantsLoading } =
    useFrappeGetDocList("Job Applicant", {
      fields: ["email_id", "applicant_name"],
      orderBy: {
        field: "creation",
        order: "desc",
      },
      asDict: true,
    });

  const assessment_list_page_api = useFrappeGetCall(
    "scrutin.api.assessment_data.assessment_list_page_api"
  );
  const assessment_list_query = assessment_list_page_api?.data?.message || [];

  const test_list_for_search = useFrappeGetCall(
    "scrutin.api.assessment_data.test_list"
  );
  const test_list_query = test_list_for_search?.data?.message || [];

  const get_candidate_details = useFrappePostCall<CandidateListResponse>(
    "scrutin.api.assessment_data.candidate_list_api"
  );

  const candidatesQueryData = get_candidate_details.result?.message || [];

  const applicantMap = (jobApplicants || []).reduce((map, applicant) => {
    map[applicant.email_id] = applicant.applicant_name;
    return map;
  }, {});

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    get_candidate_details.call(params);
  }, [searchParams]);

  // Debounced Effect for Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchInput) {
        newParams.set("applicant_name", searchInput);
      } else {
        newParams.delete("applicant_name");
      }
      setSearchParams(newParams);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, searchParams, setSearchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const formatDate = (dateString: string) =>
    dayjs(dateString).format("DD-MM-YY hh:mm A");

  if (jobApplicantsLoading) {
    return <div>Loading candidates...</div>;
  }

  return (
    <div className="px-4 sm:px-8 lg:px-32 py-4 min-h-screen text-gray-800">
      <div className=" flex flex-wrap justify-between items-center mt-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Candidate</h1>
        <div className="flex flex-wrap gap-3 py-2">
          <Link to="/candidates/candidate_comparison">
            <Button className="shadow-lg rounded-full">
              Candidate Comparison
            </Button>
          </Link>
          <Button className="shadow-lg rounded-full">
            <FaPlus className="mr-2" />
            Create Candidate
          </Button>
        </div>
      </div>

      <div className="my-3 flex flex-wrap gap-3 justify-between items-center">
        <Input
          placeholder="Search"
          className="w-full sm:w-48 "
          onChange={handleSearchChange}
          value={searchInput}
        />
        <div className="flex flex-wrap gap-3">
          <Select
            onValueChange={(value) =>
              handleFilterChange(
                "assessment_id",
                value === "clear" ? null : value
              )
            }
          >
            <SelectTrigger className="w-full sm:w-48  ">
              <SelectValue placeholder="Select Assessment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="clear">All Assessments</SelectItem>
                {assessment_list_query.map(
                  (assessment: JobApplicantSelectAssessment) => (
                    <SelectItem key={assessment.name} value={assessment.name}>
                      {assessment.assessment_name}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              handleFilterChange("test_id", value === "clear" ? null : value)
            }
          >
            <SelectTrigger className="w-full sm:w-48  ">
              <SelectValue placeholder="Select Test" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="clear">All Tests</SelectItem>
                {test_list_query.map((test: CandidateDetailPageTestFilter) => (
                  <SelectItem key={test.name} value={test.name}>
                    {test.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="  rounded-lg">
        <Table className="rounded-lg">
          {/* <TableCaption>A list of your candidates.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead
                className="text-black font-bold"
                style={{ padding: "20px 20px" }}
              >
                Name
              </TableHead>
              <TableHead className="text-black font-bold">Email</TableHead>
              <TableHead className="text-black font-bold">
                Assessments
              </TableHead>
              <TableHead className="text-black font-bold">Invited On</TableHead>
              <TableHead className="text-black font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidatesQueryData.map((candidate, index: number) => (
              <TableRow key={index}>
                <TableCell
                  style={{ padding: "0 20px" }}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/candidates/${candidate.job_applicant}`)
                  }
                >
                  {applicantMap[candidate.job_applicant] || "N/A"}
                </TableCell>
                <TableCell>{candidate.job_applicant}</TableCell>
                <TableCell>{candidate.Assessments}</TableCell>
                <TableCell>{formatDate(candidate.invited_on)}</TableCell>
                <TableCell>
                  <CandidateActions candidate={candidate} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell className="pl-4" colSpan={5}>Total candidates: {candidatesQueryData.length}</TableCell>
            </TableRow>
          </TableFooter>
          */}
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
              Total candidates: {candidatesQueryData.length}
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
