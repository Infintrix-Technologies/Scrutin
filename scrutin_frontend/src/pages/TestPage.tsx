import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFrappeGetCall, useFrappePostCall } from "frappe-react-sdk";
import { Option } from "@/components/Interfaces/Interface";
import { useParams } from "react-router-dom";

const TestPage = () => {
  const { candidate_id } = useParams();
  const [triggerReload, setTriggerReload] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { data, isLoading, error } = useFrappeGetCall(
    "scrutin.api.candidate_test.get_question_with_navigation",
    {
      candidate_id,
      current_test_index: currentTestIndex,
      current_question_index: currentQuestionIndex,
    },
    [currentTestIndex, currentQuestionIndex, triggerReload]
  );

  const { call } = useFrappePostCall("scrutin.api.candidate_test.get_question_with_answer_and_post_in_responses");

  const handleNavigation = (direction: "next" | "back") => {
    const totalTests =  3;
    const questionsPerTest = 2;

    if (direction === "next") {
      if (currentQuestionIndex < questionsPerTest - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else if (currentTestIndex < totalTests - 1) {
        setCurrentTestIndex((prevIndex) => prevIndex + 1);
        setCurrentQuestionIndex(0);
      }
    } else if (direction === "back") {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      } else if (currentTestIndex > 0) {
        setCurrentTestIndex((prevIndex) => prevIndex - 1);
        setCurrentQuestionIndex(questionsPerTest - 1);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert("Please select an option before submitting.");
      return;
    }

    try {
      await call({
        candidate_id,
        current_test_index: currentTestIndex,
        current_question_index: currentQuestionIndex,
        selected_option: selectedOption,
      });

      setSelectedOption(null);
      handleNavigation("next"); 
      setTriggerReload((prev) => !prev); 
    } catch (error) {
      console.error("Error in post call:", error);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading test data.</p>;

  const test = data?.message?.test;
  const currentQuestion = test?.current_question;

  return (
    <div className="flex justify-center items-center h-auto">
      {countdown > 0 ? (
        <div className="text-center">
          <h1 className="text-5xl font-bold">{countdown}</h1>
          <p className="text-lg mt-4">Get ready...</p>
        </div>
      ) : (
        <Card className="w-full max-w-full md:min-w-[750px] lg:min-w-[800px] mx-auto">
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 my-6">
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold mb-2">
                  Test: {currentTestIndex + 1} - {test?.title}
                </h3>
                <h3 className="text-lg font-semibold mb-2">
                  Question: {currentQuestionIndex + 1}
                </h3>
                <div
                  className="ql-editor read-mode [&_ol]:list-decimal [&_ul]:list-disc [&_li]:mb-2 [&_li]:ml-4"
                  dangerouslySetInnerHTML={{ __html: currentQuestion?.question_text }}
                ></div>
              </div>
              <div className="flex-1 py-5 px-10 space-y-3">
                <h3 className="text-lg font-semibold mb-2">Select Answer</h3>
                <RadioGroup
                  className="space-y-2"
                  name={`question-${currentQuestion?.question}`}
                  onValueChange={(value) => setSelectedOption(value)}
                  value={selectedOption || ""}
                >
                  {currentQuestion?.options?.map((option: Option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                disabled={currentTestIndex === 0 && currentQuestionIndex === 0}
                onClick={() => handleNavigation("back")}
              >
                Back
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestPage;
