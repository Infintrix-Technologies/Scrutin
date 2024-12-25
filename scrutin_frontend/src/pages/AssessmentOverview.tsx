import { useFrappeGetCall, useFrappePostCall } from "frappe-react-sdk";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronRightIcon, EyeIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import {
  Specific_Assessment_Overview_Test,
  StartAssessment_And_Continue_Button,
  TestResponseResult,
} from "@/types/Interface";
import { useGlobalState } from "@/utils/StateProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RxTimer } from "react-icons/rx";
import { useEffect } from "react";

export default function AssessmentOverview() {

  const params = useParams();
  const candidate_id = params?.candidate_id || null;
  const globalState = useGlobalState();

  const { data, isLoading, error } = useFrappeGetCall( "scrutin.api.assessment_data.test_details_for_overview_page",
    { candidate_id: candidate_id }
  );
  const specific_assessment_tests = data?.message || [];
  // console.log(specific_assessment_tests,"specific_assessment_tests")
  const { call } = useFrappePostCall(
    "scrutin.api.candidate_test.complete_assessment"
  );

  useEffect(() => {
    if (specific_assessment_tests?.assessment_completed === true  ) {
      call({
        candidate_id,
      });
    }
  }, [specific_assessment_tests.assessment_completed, candidate_id, call]);

  const assessment_started = useFrappePostCall(
    "scrutin.api.candidate_test.start_assessment"
  );

  const { data: report } = useFrappeGetCall(
    "scrutin.api.test_response_report.get_candidate_test_response_report",
    {
      candidate_id: candidate_id,
    }
  );
  const report_response_query = report?.message;

  const allTestsIncomplete = specific_assessment_tests?.tests?.every(
    (test:StartAssessment_And_Continue_Button) => !test.test_completed
  );
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <NotFound />;

  return (
    <div className="px-4 sm:px-8 lg:px-32 xl:px-64">
      <Card className="w-full">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
            Hello {specific_assessment_tests.applicant_name} Ready to showcase
            your skills?
          </h2>
          <p className="mb-2 text-sm sm:text-base">
            Thank you for applying for this role and welcome to your skill
            assessment administered by TestGorilla.
          </p>
          <p className="mb-6 text-sm sm:text-base">
            Completing it will give you a chance to show off your skills and
            stand out from the crowd! Good luck!
          </p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              This assessment includes the following steps:
            </h3>
            <div className="lg:flex lg:justify-center grid grid-cols-2 md:grid-cols-3 sm:grid-cols-2 gap-6 lg:mt-4">
              {specific_assessment_tests.tests?.map(
                (test: Specific_Assessment_Overview_Test, index: number) => (
                  <div
                    className="flex flex-col items-center text-center text-black space-y-2"
                    key={index}
                  >
                    <div className="w-12 h-12 rounded-full border-2 bg-secondary flex items-center justify-center">

                      {test.answered_questions === test.total_questions ? (
                        <CheckIcon className="w-8 h-8" />
                      ) : (
                        <p className="text-lg font-bold">
                          {test.answered_questions} / {test.total_questions}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-black">{test.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {test.total_questions}
                        {test.total_questions == 1
                          ? " Question "
                          : " Questions "}{" "}
                        •{" "}
                        {test.total_duration < 60
                          ? `${test.total_duration} seconds`
                          : `${Math.floor(test.total_duration / 60)} min${
                              test.total_duration % 60 > 0
                                ? ` ${test.total_duration % 60} sec`
                                : ""
                            }`}
                      </p>
                    </div>
                  </div>
                )
              )}
              {specific_assessment_tests.custom_questions !== 0 && (
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 text-black font-bold rounded-full cursor-pointer bg-primary flex items-center justify-center">
                    {/* <CheckIcon className="w-12 h-12 text-primary-foreground" /> */}
                    {specific_assessment_tests.custom_questions}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {specific_assessment_tests.custom_questions === 1
                        ? "Custom Question"
                        : "Custom Questions"}{" "}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {specific_assessment_tests.custom_questions}
                      {specific_assessment_tests.custom_questions == 1
                        ? " Question "
                        : " Questions "}{" "}
                      • {" 0 min"}
                    </p>
                  </div>
                </div>
              )}
              <div
                className="flex flex-col items-center text-center space-y-2"
                //when assessment is completed then the results modal is open otherwise not
                onClick={() => globalState.openModal("test_resutls", specific_assessment_tests.assessment_completed == true)} //open
              >
                <div className="w-12 border-2  h-12 rounded-full cursor-pointer bg-secondary flex items-center justify-center">
                  <EyeIcon className="w-8 h-8 text-secondary-foreground" />
                </div>

                <div>
                  <p className="font-semibold cursor-pointer">View results</p>
                  {/* <p className="text-sm text-muted-foreground">Custom questions</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div className="w-full">
              <h3 className="font-semibold mb-2">
                Learn how to navigate your assessment:
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  We recommend{" "}
                  <strong>completing the assessment in one go</strong> but you
                  can <strong>pause or take breaks between tests</strong> if
                  needed.
                </li>
                <li>
                  The <strong>assessment is timed</strong>. A timer is shown per
                  test and/or per question.
                </li>
                <li>
                  You can use pen, paper, and calculator during the assessment
                  but avoid using AI and other tools.
                </li>
              </ul>
            </div>
            <div className="w-full">
              <h3 className="font-semibold mb-2">
                Technical requirements for your assessment:
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Have a <strong>camera and microphone</strong> as you may be
                  required to answer questions in a video format.
                </li>
                <li>
                  Enable webcam and speakers/headphones for identity
                  verification and test integrity.
                </li>
                <li>
                  <strong>Snapshots will be taken</strong> of you periodically
                  during the assessment to ensure fairness for everyone.
                </li>
                <li>
                  Ensure you have a{" "}
                  <strong>reliable internet connection</strong> to avoid any
                  disruptions during your assessment.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            {!specific_assessment_tests.assessment_completed && (
              <Link to={`/candidacy/${candidate_id}/setup`}>
                <Button
                  className="text-end flex items-center"
                  onClick={() => {
                    assessment_started.call({
                      candidate_id: candidate_id,
                    });
                  }}
                >
                          {allTestsIncomplete ? "Start Assessment" : "Continue Assessment"}

                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* test_resutls Modal */}
      <Dialog
        open={globalState.modals.test_resutls.open}
        onOpenChange={(open) => globalState.openModal("test_resutls", open)}
      >
        <DialogContent className="bg-white sm:max-w-[725px] h-screen overflow-x-hidden mt-2">
          <DialogHeader>
            <DialogTitle>Candidate Test Response Result </DialogTitle>
            <DialogDescription>
              <Card className="max-w-4xl mx-auto p-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Applicant Information</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback>
                        {report_response_query?.applicant_name
                          .split(" ")
                          .map((n: number[]) => n[0])
                          .join("") || "Name"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {report_response_query?.applicant_name}
                      </h2>
                      <p className="text-gray-500">
                        {report_response_query?.applicant_email}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge variant={"secondary"}>
                          {report_response_query?.assessment_name}
                        </Badge>
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
                            report_response_query?.assessment_average || 0
                          ).toFixed(1)}
                          %
                        </h1>
                        <p className="text-sm text-gray-500">out of 100 % </p>
                      </div>
                    </div>

                    <Progress
                      value={report_response_query?.assessment_average}
                      className="mt-3 w-full"
                    />
                  </div>
                </Card>

                {report_response_query?.tests?.map(
                  (test: TestResponseResult, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>
                          Test {index + 1}: {test.test_title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Badge>{test.test_level}</Badge>
                          {test.finished_time === null ? (
                            "Incomplete Test"
                          ) : (
                            <p className="flex gap-2 items-center">
                              <RxTimer />
                              Finished in {test.finished_time.split(".")[0]} out
                              of :{" "}
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
                            <p className="text-sm text-gray-500">
                              Total Questions
                            </p>
                            <p className="text-lg font-semibold">
                              {test.total_questions}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Correct Answers
                            </p>
                            <p className="text-lg font-semibold">
                              {test.correct_count}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Incorrect Answers
                            </p>
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
              </Card>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
