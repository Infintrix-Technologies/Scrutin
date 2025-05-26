import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFrappeGetCall } from "frappe-react-sdk";
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RxTimer } from "react-icons/rx";
import NotFound from "./NotFound";
import { HrAdminReportResponse } from "@/types/Interface";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const HrAdminReports = () => {
  const { data: hrAdminReport, error, isLoading } = useFrappeGetCall<HrAdminReportResponse>(
    "scrutin.api.hr_admin_report.hr_admin_report"
  );
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleCheckboxChange = (candidateId: string) => {
    setSelectedCandidates((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      } else {
        return prev.length < 2 ? [...prev, candidateId] : prev;
      }
    });
  };

  const handleCompareClick = () => {
    if (selectedCandidates.length === 2) {
      navigate(`/candidates/comparison/${selectedCandidates[0]}/${selectedCandidates[1]}`);
    } else {
      toast.error("Please select exactly 2 candidates to compare.");
      // alert("Please select exactly 2 candidates to compare.");
    }
  };

  if (isLoading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <NotFound />;

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-22 lg:px-40 py-6 md:py-10 min-h-screen">
        <div className="flex justify-between items-center pb-3">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">HR Admin Reports</h1>
          <Button onClick={handleCompareClick}>Compare Two Candidates</Button>
        </div>
        <div className="space-y-6">
          {hrAdminReport?.message.map((report, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl gap-2 text-gray-800">
                  <input
                    type="checkbox"
                    className="text-black w-5 h-5"
                    checked={selectedCandidates.includes(report.candidate_id)}
                    onChange={() => handleCheckboxChange(report.candidate_id)}
                  />
                  {report.applicant_name}
                </CardTitle>
                <div className="font-normal md:font-medium text-black">
                  <p>Email: {report.applicant_email}</p>
                  <p>Assessment: {report.assessment_name}</p>
                  <p>Assessment Average: {report.assessment_average.toFixed(2)}%</p>
                </div>
                <hr className="border-gray-200" />
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="font-bold text-base">
                      <TableRow className="whitespace-nowrap">
                        <TableHead className="text-black">Test Title</TableHead>
                        <TableHead className="text-black">Level</TableHead>
                        <TableHead className="text-center text-black">Total Questions</TableHead>
                        <TableHead className="text-center text-black">Correct</TableHead>
                        <TableHead className="text-center text-black">Incorrect</TableHead>
                        <TableHead className="text-center text-black">Accuracy (%)</TableHead>
                        <TableHead className="text-start text-black">Duration (s)</TableHead>
                        <TableHead className="text-start text-black">Finished Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.tests.map((test, index: number) => (
                        <TableRow key={index} className="whitespace-nowrap">
                          <TableCell className="text-black">{test.test_title}</TableCell>
                          <TableCell className="text-black">{test.test_level}</TableCell>
                          <TableCell className="text-center text-black">{test.total_questions}</TableCell>
                          <TableCell className="text-center text-black">{test.correct_count}</TableCell>
                          <TableCell className="text-center text-black">{test.incorrect_count}</TableCell>
                          <TableCell className="text-center text-black">{test.accuracy.toFixed(2)} %</TableCell>
                          <TableCell className="text-center flex items-center gap-1 text-black">
                            <Clock className="h-4 w-4 text-gray-600" />
                            {test.total_duration < 60
                              ? test.total_duration > 0
                                ? `${test.total_duration} seconds`
                                : ""
                              : `${Math.floor(test.total_duration / 60)} min${
                                  test.total_duration % 60 > 0 ? ` ${test.total_duration % 60} sec` : ""
                                }`}
                          </TableCell>
                          <TableCell className="text-black">
                            {test.finished_time === null ? (
                              "Incomplete Test"
                            ) : (
                              <p className="flex gap-2 items-center">
                                <RxTimer className="text-gray-600" />
                                Finished in {test.finished_time.split(".")[0]}
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default HrAdminReports;