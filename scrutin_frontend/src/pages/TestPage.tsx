import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFrappeGetCall } from "frappe-react-sdk";
import { Option } from "@/components/Interfaces/Interface";
import { useParams, useSearchParams } from "react-router-dom";

const TestPage = () => {
  const { candidate_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const questionIndex = parseInt(searchParams.get("question") || "1", 10) - 1; 

  const { data } = useFrappeGetCall(
    "scrutin.api.assessment_data.get_assessment_test_and_question_with_options_with_candidate_id",
    { candidate_id }
  );

  const tests = data?.message?.tests || [];
  const currentQuestion = tests[questionIndex]?.questions[0];
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleNavigation = (direction: "next" | "back") => {
    let newIndex = questionIndex;

    // Calculate the next or previous index
    if (direction === "next" && newIndex < tests?.length - 1) {
      newIndex += 1;
    } else if (direction === "back" && newIndex > 0) {
      newIndex -= 1;
    }

    // Update search params with the new question index (1-based)
    setSearchParams({ question: `${newIndex + 1}` }); // Note: Adding 1 to convert back to 1-based index
  };

  if (!tests.length) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center h-screen">
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
                  Question {questionIndex + 1} {/* Display the 1-based question index */}
                </h3>
                <div
                  className="ql-editor read-mode [&_ol]:list-decimal [&_ul]:list-disc [&_li]:mb-2 [&_li]:ml-4"
                  dangerouslySetInnerHTML={{ __html: currentQuestion?.question_text }}
                ></div>
              </div>
              <div className="flex-1 py-5 px-10 space-y-3">
                <h3 className="text-lg font-semibold mb-2">Select Answer</h3>
                <RadioGroup className="space-y-2" name={`question-${questionIndex}`}>
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
              <Button onClick={() => handleNavigation("back")} disabled={questionIndex === 0}>
                Back
              </Button>
              <Button
                onClick={() => handleNavigation("next")}
                disabled={questionIndex === tests.length - 1}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestPage;
