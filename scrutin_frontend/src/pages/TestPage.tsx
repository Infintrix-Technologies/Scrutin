import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFrappeGetCall } from "frappe-react-sdk";
import { Option } from "@/components/Interfaces/Interface";
import { useParams, useSearchParams } from "react-router-dom";

const TestPage = () => {

  const params = useParams();
  const candidate_id = params?.candidate_id || null;

  const get_assessment_test_and_question_with_options = useFrappeGetCall(
    "scrutin.api.assessment_data.get_assessment_test_and_question_with_options",
    { assessment_name: candidate_id }
  );
  const assessment_test_and_question_with_options =
    get_assessment_test_and_question_with_options?.data?.message?.tests || [];

  const [searchParams, setSearchParams] = useSearchParams();

  const questionParam = parseInt(searchParams.get("question") as string, 10) - 1 || 0;
 

  const handleNext = () => {
    setSearchParams({ question: `${questionParam + 2}` });
  };

  const handleBack = () => {
    setSearchParams({ question: `${questionParam }` });
  };
  
  // const handleNext = () => {
  //   const currentTest = assessment_test_and_question_with_options[questionParam];
  //   const testId = currentTest?.test || ""; 
  //   setSearchParams({ 
  //     "": testId, 
  //     question: `${questionParam + 2}`
  //   });
  // };

  // const handleBack = () => {
  //   const currentTest = assessment_test_and_question_with_options[questionParam - 1];
  //   const testId = currentTest?.test || ""; 
  //   setSearchParams({ 
  //     "": testId,
  //     question: `${questionParam}`,
  //   });
  // };

  // Return early if no data is available
  if (assessment_test_and_question_with_options.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion =
    assessment_test_and_question_with_options[questionParam]?.questions[0];

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-full md:min-w-[750px] lg:min-w-[800px] mx-auto">
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 my-6">
            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold mb-2">
                Question {questionParam + 1}
              </h3>
              <div
                className="ql-editor read-mode [&_ol]:list-decimal [&_ul]:list-disc [&_li]:mb-2 [&_li]:ml-4"
                // className="ql-editor read-mode"
                dangerouslySetInnerHTML={{__html: currentQuestion?.question_text}}
              ></div>
            </div>

            <div className="flex-1 py-5 px-10 space-y-3">
              <h3 className="text-lg font-semibold mb-2">Select Answer</h3>
              <RadioGroup
                className="space-y-2"
                name={`question-${questionParam}`}
              >
                {currentQuestion?.options?.map((option: Option) => (
                  <div
                    className="flex items-center space-x-2"
                    key={option.value}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="flex justify-between ">
            
            <Button onClick={handleBack} disabled={questionParam === 0}>
              Back
            </Button>
              <Button              
              onClick={handleNext}
              disabled={questionParam === assessment_test_and_question_with_options.length - 1}              
              >Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TestPage