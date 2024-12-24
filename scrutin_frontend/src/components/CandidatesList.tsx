/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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

export const CandidatesList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
  // console.log(get_candidate_details,"candidate_list_api")
  const candidatesQueryData = get_candidate_details.result?.message || [];

  const applicantMap = (jobApplicants || []).reduce((map, applicant) => {
    map[applicant.email_id] = applicant.applicant_name;
    return map;
  }, {});

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    get_candidate_details.call(params);
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set("applicant_name", e.target.value);
    } else {
      newParams.delete("applicant_name");
    }
    setSearchParams(newParams);
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
    <div className="px-32">
      <div className="flex justify-between mt-10">
        <h1 className="text-3xl font-bold">Candidate</h1>
        <div className="flex gap-3">
          <Link to="/candidates/hr_report">
            <Button>HR Admin Report</Button>
          </Link>

          <Link to="/candidates/candidate_comparison">
            <Button>Candidate Comparison</Button>
          </Link>
          <Button>
            <FaPlus className="mr-2" />
            Create Candidate
          </Button>
        </div>
      </div>

      <div className="my-3 flex justify-between">
        <div>
          <Input
            placeholder="Search"
            className="w-48"
            onChange={handleSearchChange}
            value={searchParams.get("applicant_name") || ""}
          />
        </div>
        <div className="flex gap-3">
          <Select
            onValueChange={(value) => {
              handleFilterChange(
                "assessment_id",
                value === "clear" ? null : value
              );
            }}
          >
            <SelectTrigger>
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
            onValueChange={(value) => {
              handleFilterChange("test_id", value === "clear" ? null : value);
            }}
          >
            <SelectTrigger>
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

      <Table>
        <TableCaption>A list of your candidates.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Assessments</TableHead>
            <TableHead>Invited On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidatesQueryData.map(
            (candidate, index: number) => (
              <TableRow key={index}>
                <TableCell
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
            )
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              Total candidates: {candidatesQueryData.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
