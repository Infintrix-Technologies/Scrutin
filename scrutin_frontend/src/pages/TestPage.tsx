/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CurrentQuestionOption } from "@/types/Interface";
import {  useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { useGlobalState } from "@/utils/StateProvider";
import Forbidden from "./Forbidden";

const TestPage = () => {
  const { candidate_id } = useParams();
  const { question, selectedOption, setSelectedOption, error, loading,updateCurrentQuestion } = useGlobalState();
  
  useEffect(() => {
    updateCurrentQuestion(candidate_id);
  }, [candidate_id]);

  const handleMultiSelectChange = (value: string) => {
    setSelectedOption((prev) => {
      if (Array.isArray(prev)) {
        return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
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
          <h3 className="text-lg font-semibold m-2">Test Name: {test?.test?.title}</h3>
          <h3 className="text-lg font-semibold m-2">Type: {currentQuestion?.type}</h3>
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
                      <div key={option.value} className="my-2 flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={Array.isArray(selectedOption) && selectedOption.includes(option.value)}
                          onCheckedChange={() => handleMultiSelectChange(option.value)}
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
                    value={Array.isArray(selectedOption) ? selectedOption[0] : selectedOption || ""}
                  >
                    {currentQuestion?.options?.map((option: CurrentQuestionOption) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export default TestPage;
