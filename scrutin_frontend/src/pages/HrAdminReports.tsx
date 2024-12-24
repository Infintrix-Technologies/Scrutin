import { useFrappeGetCall } from "frappe-react-sdk";
import { Clock, User } from "lucide-react";
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

const HrAdminReports = () => {
    const { data: hrAdminReport, error, isLoading } = useFrappeGetCall<HrAdminReportResponse>(
        "scrutin.api.testing_api.hr_admin_report"
      );
  if (isLoading) return <p>Loading...</p>;
  if (error) return <NotFound />;
  
  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        HR Admin Reports
      </h1>
      <div className="space-y-6">
        {hrAdminReport?.message.map((report, index:number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-primary"/>
                {report.applicant_name}
              </CardTitle>
              <div className="font-normal md:font-medium ">
                <p className="">Email: {report.applicant_email}</p>
                <p>Assessment: {report.assessment_name}</p>
                <p>
                  Assessment Average: {report.assessment_average.toFixed(2)}%
                </p>
              </div>
              <hr />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="whitespace-nowrap">
                      <TableHead>Test Title</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead className="text-center">
                        Total Questions
                      </TableHead>
                      <TableHead className="text-center">Correct</TableHead>
                      <TableHead className="text-center">Incorrect</TableHead>
                      <TableHead className="text-center">
                        Accuracy (%)
                      </TableHead>
                      <TableHead className="text-start">Duration (s)</TableHead>
                      <TableHead className="text-start">
                        Finished Time
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.tests.map((test, index:number) => (
                      <TableRow key={index} className="whitespace-nowrap">
                        <TableCell>{test.test_title}</TableCell>
                        <TableCell>{test.test_level}</TableCell>
                        <TableCell className="text-center">
                          {test.total_questions}
                        </TableCell>
                        <TableCell className="text-center">
                          {test.correct_count}
                        </TableCell>
                        <TableCell className="text-center">
                          {test.incorrect_count}
                        </TableCell>
                        <TableCell className="text-center">
                          {test.accuracy.toFixed(2)} %
                        </TableCell>
                        <TableCell className="text-center flex items-center gap-1 ">
                          <Clock className="h-4 w-4" />
                          {test.total_duration < 60
                            ? test.total_duration > 0
                              ? `${test.total_duration} seconds`
                              : ""
                            : `${Math.floor(test.total_duration / 60)} min${
                                test.total_duration % 60 > 0
                                  ? ` ${test.total_duration % 60} sec`
                                  : ""
                              }`}
                        </TableCell>
                        <TableCell>
                          {test.finished_time === null ? (
                            "Incomplete Test"
                          ) : (
                            <p className="flex gap-2 items-center">
                              <RxTimer />
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
  );
};

export default HrAdminReports;
