import { useLocation, useNavigate, useParams } from "react-router-dom";
import TestProgress from "./TestProgress";
import { Button } from "./ui/button";
import { useGlobalState } from "@/utils/StateProvider";
import { useFrappePostCall } from "frappe-react-sdk";
import { toast, Toaster } from "react-hot-toast";

const CandidacyNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { candidate_id } = useParams();
  const { selectedOption, setSelectedOption, updateCurrentQuestion,question } = useGlobalState();
  const { call } = useFrappePostCall("scrutin.api.candidate_test.add_scrutin_question_response");
  const { call: mark_test_completed } = useFrappePostCall("scrutin.api.candidate_test.mark_test_completed");

  const handleNext = async () => {
    if (!selectedOption || (Array.isArray(selectedOption) && selectedOption.length === 0)) {
      toast.error("Select an option before submitting.");
      return;
    }

    try {
      const sortedAnswer = Array.isArray(selectedOption)
        ? JSON.stringify(selectedOption?.map(Number).sort((a, b) => a - b))
        : selectedOption;

      await call({
        candidate_id,
        question_id: question?.message?.test?.current_question?.name,
        answer: sortedAnswer,
      });

      if (question?.message?.test?.last_test_question) {
        mark_test_completed({
          candidate_id,
          test_id: question.message.test.test.test_id,
        });
        navigate(`/candidacy/${candidate_id}/overview`);
      } else {
        updateCurrentQuestion(candidate_id); 
      }

      setSelectedOption(null); 
    } catch (error) {
      console.log(error, "error");
      // toast.error("There was an issue submitting your response. Please try again.");
    }
  };

  return (
    <div className="w-full py-2 flex justify-around items-center">
      <div className="text-xl">Infintrix Technologies</div>
      {location?.pathname?.includes("/test") && (
        <>
          <TestProgress />
          <Button onClick={handleNext}>Next</Button>
        </>
      )}
    <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};



export default CandidacyNavbar;

