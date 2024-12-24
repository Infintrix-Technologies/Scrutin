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
import { Card } from "@/components/ui/card";
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
 const classnameforBtn = "text-white bg-gradient-to-r from-teal-500  to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-300/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"

  return (
    <div className="px-32 py-4 min-h-screen  text-gray-800 bg-[#feeef2]">
      <div className="flex justify-between mt-10">
        <h1 className="text-3xl font-bold">Candidate</h1>
        <div className="flex gap-3">
          <Link to="/candidates/hr_report">
            <Button className={classnameforBtn}>HR Admin Report</Button>
          </Link>

          <Link to="/candidates/candidate_comparison">
            <Button className={classnameforBtn}> Candidate Comparison</Button>
          </Link>
          <Button className={classnameforBtn}>
            <FaPlus className="mr-2" />
            Create Candidate
          </Button>
        </div>
      </div>

      <div className="my-3 flex justify-between">
        <div>
          <Input
            placeholder="Search"
            className="w-48 bg-white border-none shadow-lg"
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
            <SelectTrigger className="w-48 bg-white border-none shadow-lg">
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
            <SelectTrigger className="w-48 bg-white border-none shadow-lg">
              <SelectValue  placeholder="Select Test" />
            </SelectTrigger>
            <SelectContent className="bg-white  border-slate-300 shadow-lg text-black  ">
              <SelectGroup className="">
                <SelectItem className="" value="clear">All Tests</SelectItem>
                {test_list_query.map((test: CandidateDetailPageTestFilter) => (
                  <SelectItem className="" key={test.name} value={test.name}>
                    {test.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
<Card className="bg-white border-none shadow-lg rounded-none text-black">
      <Table className="rounded-lg">
        <TableCaption>A list of your candidates.</TableCaption>
        <TableHeader className="py-10 text-black ">
          <TableRow className=" whitespace-nowrap hover:bg-white bg-white  text-black">
            <TableHead style={{padding:"20px 10px"}} className=" text-black font-bold ">Name</TableHead>
            <TableHead className=" text-black py-2 font-bold" >Email</TableHead>
            <TableHead className=" text-black py-2 font-bold" >Assessments</TableHead>
            <TableHead className=" text-black py-2 font-bold" >Invited On</TableHead>
            <TableHead className=" text-black py-2 font-bold" >Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidatesQueryData.map(
            (candidate, index: number) => (
              <TableRow key={index} className="hover:bg-[#feeef2]">
                <TableCell
                  className="cursor-pointer "
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
            <TableCell colSpan={5} className="hover:bg-white bg-white text-black">
              Total candidates: {candidatesQueryData.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      </Card>
    </div>
  );
};
