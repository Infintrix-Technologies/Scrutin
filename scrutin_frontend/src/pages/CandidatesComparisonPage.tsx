import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { Badge } from "@/components/ui/badge";

import { RxTimer } from "react-icons/rx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFrappeGetCall } from "frappe-react-sdk";
import { TestResponseResult } from "@/types/Interface";

const CandidatesComparisonPage = () => {
  const comparison_two_candidates_test_response_report = useFrappeGetCall(
    "scrutin.api.candidate_response_comparison.comparison_two_candidates_test_response_report",
    {
      candidate_id_1: "k34vmhmg2c",
      candidate_id_2: "g4ckk5b9ml",
    }
  );
  const comparison_two_candidates_test =
    comparison_two_candidates_test_response_report?.data?.message;
  // console.log(comparison_two_candidates_test, "comparison_two_candidates_test");

  return (
    <div className="mx-3 lg:mx-28">
      <h1 className="text-xl py-2 font-bold">
        Two Candidates Test Response Report Comparison Page
      </h1>
      <div className="block lg:flex ">
        <div className="w-full p-6  space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate 1 # Information</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback>
                  {comparison_two_candidates_test?.candidate_1?.applicant_name
                    ?.split(" ")
                    ?.map((n: number[]) => n[0])
                    ?.join("") || "Name"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {comparison_two_candidates_test?.candidate_1?.applicant_name}
                </h2>
              </div>
            </CardContent>
            <div className="space-y-4 m-4 ">
              <div className="flex justify-between">
                <div>
                  <Badge variant={"secondary"}>Assessment Average</Badge>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {(
                      comparison_two_candidates_test?.candidate_1
                        ?.assessment_average || 0
                    ).toFixed(1)}
                    %
                  </h1>
                  <p className="text-sm text-gray-500">out of 100 % </p>
                </div>
              </div>

              <Progress
                value={
                  comparison_two_candidates_test?.candidate_1
                    ?.assessment_average
                }
                className="mt-3 w-full"
              />
            </div>
          </Card>

          {comparison_two_candidates_test?.candidate_1?.tests?.map(
            (test: TestResponseResult, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    Test {index + 1}: {test.test_title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-end items-center">
                    {/* <Badge>{test.test_level}</Badge> */}
                    {test.finished_time === null ? (
                      "Incomplete Test"
                    ) : (
                      <p className="flex gap-2 items-center">
                        <RxTimer />
                        Finished in {test?.finished_time?.split(".")[0] ||
                          0}{" "}
                        out of :{" "}
                        {test.total_duration < 60
                          ? `${test.total_duration} seconds`
                          : `${Math.floor(test.total_duration / 60)} min${
                              test.total_duration % 60 > 0
                                ? ` ${test.total_duration % 60} sec`
                                : ""
                            }`}{" "}
                      </p>
                    )}
                  </div>
                  <Progress value={test.accuracy} className="w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Accuracy</p>
                      <p className="text-lg font-semibold">
                        {test.accuracy.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Questions</p>
                      <p className="text-lg font-semibold">
                        {test.total_questions}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Correct Answers</p>
                      <p className="text-lg font-semibold">
                        {test.correct_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Incorrect Answers</p>
                      <p className="text-lg font-semibold">
                        {test.incorrect_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Unanswered Questions
                      </p>
                      <p className="text-lg font-semibold">
                        {test.unanswered_questions}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Answered Questions
                      </p>
                      <p className="text-lg font-semibold">
                        {test.answered_questions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
        <div className="w-full p-6  space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback>
                  {comparison_two_candidates_test?.candidate_2?.applicant_name
                    .split(" ")
                    .map((n: number[]) => n[0])
                    .join("") || "Name"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {comparison_two_candidates_test?.candidate_2?.applicant_name}
                </h2>
                <p className="text-gray-500">
                  {comparison_two_candidates_test?.candidate_2?.applicant_email}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  {/* <Badge variant={"secondary"}>
                          {comparison_two_candidates_test?.candidate_2?.assessment_name}
                        </Badge> */}
                  {/* <FaDownload className="cursor-pointer" 
                          onClick={generatePDF}
                          /> */}
                </div>
              </div>
            </CardContent>
            <div className="space-y-4 m-4 ">
              <div className="flex justify-between">
                <div>
                  <Badge variant={"secondary"}>Assessment Average</Badge>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {(
                      comparison_two_candidates_test?.candidate_2
                        ?.assessment_average || 0
                    ).toFixed(1)}
                    %
                  </h1>
                  <p className="text-sm text-gray-500">out of 100 % </p>
                </div>
              </div>

              <Progress
                value={
                  comparison_two_candidates_test?.candidate_2
                    ?.assessment_average
                }
                className="mt-3 w-full"
              />
            </div>
          </Card>

          {comparison_two_candidates_test?.candidate_2?.tests?.map(
            (test: TestResponseResult, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    Test {index + 1}: {test.test_title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-end items-center">
                    {/* <Badge>{test.test_level}</Badge> */}
                    {test.finished_time === null ? (
                      "Incomplete Test"
                    ) : (
                      <p className="flex gap-2 items-center">
                        <RxTimer />
                        Finished in {test?.finished_time?.split(".")[0] ||
                          0}{" "}
                        out of :{" "}
                        {test.total_duration < 60
                          ? `${test.total_duration} seconds`
                          : `${Math.floor(test.total_duration / 60)} min${
                              test.total_duration % 60 > 0
                                ? ` ${test.total_duration % 60} sec`
                                : ""
                            }`}{" "}
                      </p>
                    )}
                  </div>
                  <Progress value={test.accuracy} className="w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Accuracy</p>
                      <p className="text-lg font-semibold">
                        {test.accuracy.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Questions</p>
                      <p className="text-lg font-semibold">
                        {test.total_questions}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Correct Answers</p>
                      <p className="text-lg font-semibold">
                        {test.correct_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Incorrect Answers</p>
                      <p className="text-lg font-semibold">
                        {test.incorrect_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Unanswered Questions
                      </p>
                      <p className="text-lg font-semibold">
                        {test.unanswered_questions}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Answered Questions
                      </p>
                      <p className="text-lg font-semibold">
                        {test.answered_questions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatesComparisonPage;
