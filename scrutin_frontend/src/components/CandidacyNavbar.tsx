import { useLocation, useNavigate, useParams } from "react-router-dom";
import TestProgress from "./TestProgress";
import { useGlobalState } from "@/utils/StateProvider";
import { useFrappePostCall } from "frappe-react-sdk";
import { toast, Toaster } from "react-hot-toast";
import { RainbowButton } from "./ui/rainbow-button";

const CandidacyNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { candidate_id } = useParams();
  const { selectedOption, setSelectedOption, updateCurrentQuestion, question } = useGlobalState();
  const add_question_response = useFrappePostCall("scrutin.api.candidate_test.add_scrutin_question_response");
  const mark_test_completed  = useFrappePostCall("scrutin.api.candidate_test.mark_test_completed");

  const test_id = question?.message.test.test.test_id
  const quest_id = question?.message.test.current_question.name

  const handleNext = async () => {
    if (!selectedOption || (Array.isArray(selectedOption) && selectedOption.length === 0)) {
      toast.error("Select an option before submitting.");
      return;
    }

    try {
      const sortedAnswer = Array.isArray(selectedOption)
        ? JSON.stringify(selectedOption?.map(Number).sort((a, b) => a - b))
        : selectedOption;

      await add_question_response.call({
        candidate_id,
        question_id: quest_id,
        answer: sortedAnswer,
      });

      if (question.message.test.last_test_question) {
        mark_test_completed.call({
          candidate_id,
          test_id: test_id,
        });
        navigate(`/candidacy/${candidate_id}/overview`);
      } else {
        updateCurrentQuestion(candidate_id); 
      }

      setSelectedOption(null); 
    } catch (error) {
      console.error(error, "error");
    }
  };

  return (
    <div className="w-full py-2 flex justify-around items-center border-b-4">
      <div className="text-xl font-bold">Infintrix Technologies</div>
      {location?.pathname?.includes("/test") && (
        <>
          <TestProgress />
          <RainbowButton onClick={handleNext}>Next</RainbowButton>
          
        </>
      )}
    <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};



export default CandidacyNavbar;

