/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { useFrappePostCall } from "frappe-react-sdk";
import { CurrentQuestionOption } from "@/types/Interface";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { useGlobalState } from "@/utils/StateProvider";
import Forbidden from "./Forbidden";

const TestPage = () => {
  const { candidate_id } = useParams();
  const navigate = useNavigate(); 

  const { question, updateCurrentQuestion, error, loading } = useGlobalState();
  const [selectedOption, setSelectedOption] = useState <string | string[] | null >(null);
  // console.log(question,"questionquestion")
  const { call } = useFrappePostCall(
    "scrutin.api.candidate_test.add_scrutin_question_response"
  );
  const {call:mark_test_completed} = useFrappePostCall("scrutin.api.candidate_test.mark_test_completed");

  useEffect(() => {
    updateCurrentQuestion(candidate_id);
  }, [candidate_id]);

  const handleSubmit = async () => {
    if (
      !selectedOption ||
      (Array.isArray(selectedOption) && selectedOption.length === 0)
    ) {
      toast.error("Select an option before submitting.");
      return;
    }

    try {
      const sortedAnswer = Array.isArray(selectedOption)
        ? JSON.stringify(selectedOption.map(Number).sort((a, b) => a - b))
        : selectedOption;

      await call({
        candidate_id,
        question_id: question?.message?.test?.current_question?.name,
        answer: sortedAnswer,
      });

      if (question?.message?.test?.last_test_question) {
        mark_test_completed({
          candidate_id,
          test_id: question.message.test.test.test_id
        })
        navigate(`/candidacy/${candidate_id}/overview`);
      }
      // toast.success("Response submitted successfully!");
      setSelectedOption(null);
    } catch (error) {
      console.log(error, "error");
      toast.error(
        "There was an issue submitting your response. Please try again."
      );
    }
  };

  const handleMultiSelectChange = (value: string) => {
    setSelectedOption((prev) => {
      if (Array.isArray(prev)) {
        return prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
      }
      return [value];
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error?.httpStatus === 403) return <Forbidden />;
  if (error?.httpStatus === 404) return <NotFound />;
 

  const test = question?.message?.test;
  const currentQuestion = test?.current_question;

  const isMultiChoice = currentQuestion?.type === "Multi Choice";

  return (
    <div className="flex justify-center items-center h-auto">
      <div className="flex flex-col px-3">
        <div className="block md:flex md:justify-between">
          <h3 className="text-lg font-semibold m-2">
            Test Name: {test?.test?.title}
          </h3>
          <h3 className="text-lg font-semibold m-2">
            Type: {currentQuestion?.type}
          </h3>
        </div>
        <Card className="w-full max-w-full md:min-w-[750px] lg:min-w-[800px] mx-auto">
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 my-6">
              <div className="flex-1 p-4">
                <div
                  className="ql-editor read-mode [&_ol]:list-decimal [&_ul]:list-disc [&_li]:mb-2 [&_li]:ml-4"
                  dangerouslySetInnerHTML={{
                    __html: `Question: ${currentQuestion?.text}`,
                  }}
                ></div>
              </div>
              <div className="flex-1 py-5 px-10 space-y-3">
                <h3 className="text-lg font-semibold mb-2">Select Answer</h3>
                {isMultiChoice ? (
                  <div>
                    {currentQuestion.options.map((option: CurrentQuestionOption) => (
                      <div
                        key={option.value}
                        className="my-2 flex items-center space-x-2"
                      >
                        <Checkbox
                          id={option.value}
                          checked={
                            Array.isArray(selectedOption) &&
                            selectedOption.includes(option.value)
                          }
                          onCheckedChange={() =>
                            handleMultiSelectChange(option.value)
                          }
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <RadioGroup
                    className="space-y-2"
                    name={`question-${currentQuestion?.name}`}
                    onValueChange={(value) => setSelectedOption(value)}
                    value={
                      Array.isArray(selectedOption)
                        ? selectedOption[0]
                        : selectedOption || ""
                    }
                  >
                    {currentQuestion?.options?.map((option: CurrentQuestionOption) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default TestPage;
