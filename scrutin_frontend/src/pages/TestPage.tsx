import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { useFrappeGetCall, useFrappePostCall } from "frappe-react-sdk";
import { Option } from "@/components/Interfaces/Interface";
import { useParams } from "react-router-dom";

const TestPage = () => {
  const { candidate_id } = useParams();
  const [triggerReload, setTriggerReload] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { data, isLoading, error } = useFrappeGetCall(
    "scrutin.api.candidate_test.get_current_question",
    { candidate_id },
    [triggerReload]
  );

  const { call } = useFrappePostCall(
    "scrutin.api.candidate_test.add_scrutin_question_response"
  );

  const handleSubmit = async () => {
    if (!selectedOption) {
      toast.error("Select an option before submit.");
      return;
    }

    try {
      await call({
        candidate_id,
        question_id: data?.message?.test?.current_question?.name,
        answer: selectedOption,
      });
      // reset selection when page is reload or reFresh
      setSelectedOption(null); 
      // when reload the window update the question
      setTriggerReload((prev) => !prev); 
    } catch (error) {
      console.error("Error in post call:", error);
      toast.error("There was an issue submitting your response. Please try again.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading test data.</p>;

  const test = data?.message?.test;
  const currentQuestion = test?.current_question;

  return (
    <div className="flex justify-center items-center h-auto">   
      <Toaster position="top-center" reverseOrder={false} />
      
      <Card className="w-full max-w-full md:min-w-[750px] lg:min-w-[800px] mx-auto">
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 my-6">
            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold mb-2">
                Test Name: {test?.test?.title}
              </h3>
              <div
                className="ql-editor read-mode [&_ol]:list-decimal [&_ul]:list-disc [&_li]:mb-2 [&_li]:ml-4"
                dangerouslySetInnerHTML={{
                  __html: `Question: ${currentQuestion?.text}`,
                }}
              ></div>
            </div>
            <div className="flex-1 py-5 px-10 space-y-3">
              <h3 className="text-lg font-semibold mb-2">Select Answer</h3>
              <RadioGroup
                className="space-y-2"
                name={`question-${currentQuestion?.name}`}
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
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage;
